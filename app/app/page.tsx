import { getHomePageData } from "./data";
import { CoLeads } from "./components/CoLeads";
import { Team } from "./components/TeamChart";

export default async function Home() {
  const homePageData = await getHomePageData();

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl border-4 border-blue-800 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight">{homePageData.title}</h1>
          <p className="mt-2 text-xl font-semibold">{homePageData.subtitle}</p>
        </header>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left column */}
          <section>
            <p className="text-base leading-7 text-gray-800">{homePageData.intro}</p>

            <h2 className="mt-8 text-2xl font-extrabold text-red-700">
              {homePageData.benefitsHeading}
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-800">
              {homePageData.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </section>

          {/* Right column */}
          <aside className="space-y-8">
            {/* Co-leads */}
            <section>
              <h2 className="text-2xl font-extrabold">Co-leads</h2>
              <CoLeads coLeads={homePageData.coLeads} />
            </section>

            {/* Team donut */}
            <section>
              <h2 className="text-2xl font-extrabold">Team</h2>
              <Team team={homePageData.team} />
            </section>

            {/* Stories */}
            <section>
              <h2 className="text-2xl font-extrabold text-red-700">
                {homePageData.storiesHeading}
              </h2>
              {/* Story list goes here */}
            </section>

            {/* CTA */}
            <section>
              <h2 className="text-2xl font-extrabold text-red-700">{homePageData.ctaHeading}</h2>
              <a className="mt-2 inline-block text-blue-700 underline" href={homePageData.ctaHref}>
                {homePageData.ctaText}
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
