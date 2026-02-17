export type CoLead = {
  name: string;
  picture: string;
  role: string;
};

export type TeamMemberGroup = {
  label: string;
  value: number;
  color?: string;
};

export type HomePageData = {
  title: string;
  subtitle: string;
  intro: string;
  benefitsHeading: string;
  benefits: string[];
  storiesHeading: string;
  ctaHeading: string;
  ctaText: string;
  ctaHref: string;
  coLeads: CoLead[];
  team: TeamMemberGroup[];
};

export type FolderDataMap = Record<string, unknown>;

function isEntry(entry: [string, unknown] | null): entry is [string, unknown] {
  return entry !== null;
}

function getFolderNameFromPath(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, "");
  if (!clean) {
    return null;
  }
  const parts = clean.split("/").filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

function extractFolderUrls(indexHtml: string, baseUrl: string): URL[] {
  const links: URL[] = [];
  const seen = new Set<string>();
  const hrefRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const base = new URL(baseUrl);

  for (const match of indexHtml.matchAll(hrefRegex)) {
    const href = match[1];
    if (!href || href === "../" || href === "./" || href === "/") {
      continue;
    }

    let resolved: URL;
    try {
      resolved = new URL(href, base);
    } catch {
      continue;
    }

    if (!resolved.pathname.endsWith("/")) {
      continue;
    }
    if (resolved.origin !== base.origin) {
      continue;
    }
    if (!resolved.pathname.startsWith(base.pathname)) {
      continue;
    }

    const folderName = getFolderNameFromPath(resolved.pathname);
    if (!folderName) {
      continue;
    }

    const key = resolved.toString();
    if (!seen.has(key)) {
      seen.add(key);
      links.push(resolved);
    }
  }

  return links;
}

export async function getFolderData(): Promise<FolderDataMap> {
  const dataUrl = process.env.DATA_URL;
  if (!dataUrl) {
    throw new Error("DATA_URL is not set.");
  }

  const normalizedBaseUrl = dataUrl.endsWith("/") ? dataUrl : `${dataUrl}/`;
  try {
    const indexResponse = await fetch(normalizedBaseUrl, { cache: "no-store" });
    if (!indexResponse.ok) {
      throw new Error(`Failed to fetch DATA_URL index: ${indexResponse.status}`);
    }

    const indexHtml = await indexResponse.text();
    const folderUrls = extractFolderUrls(indexHtml, normalizedBaseUrl);
    const entries = await Promise.all(
      folderUrls.map(async (folderUrl): Promise<[string, unknown] | null> => {
        const folderName = getFolderNameFromPath(folderUrl.pathname);
        if (!folderName) {
          return null;
        }

        const dataJsonUrl = new URL("data.json", folderUrl);
        const response = await fetch(dataJsonUrl, { cache: "no-store" });
        if (!response.ok) {
          return null;
        }

        const parsed = (await response.json()) as unknown;
        return [folderName, parsed];
      }),
    );

    const folderData = Object.fromEntries(entries.filter(isEntry));
    if (Object.keys(folderData).length === 0) {
      throw new Error("No folder data.json files found under DATA_URL.");
    }
    return folderData;
  } catch {
    throw new Error("Failed to load folder data from DATA_URL.");
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  const folderData = await getFolderData();
  const transectData = folderData.transect;
  const webData = folderData.web;

  const transectObject =
    transectData && typeof transectData === "object"
      ? (transectData as Partial<HomePageData>)
      : undefined;
  const webObject =
    webData && typeof webData === "object" ? (webData as Partial<HomePageData>) : undefined;

  const merged = {
    ...(webObject ?? {}),
    ...(transectObject ?? {}),
  } as Partial<HomePageData>;

  if (Object.keys(merged).length === 0) {
    throw new Error("Missing both 'transect' and 'web' data from DATA_URL.");
  }

  if (!Array.isArray(merged.coLeads)) {
    merged.coLeads = [];
  }
  if (!Array.isArray(merged.team)) {
    merged.team = [];
  }

  return merged as HomePageData;
}
