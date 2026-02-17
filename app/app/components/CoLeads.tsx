import Image from "next/image";
import type { CoLead } from "../data";

type CoLeadsProps = {
  coLeads: CoLead[];
};

export function CoLeads({ coLeads }: CoLeadsProps) {
  return (
    <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {coLeads.map((person) => (
        <li key={person.name} className="rounded p-3">
          <p className="font-semibold text-gray-900">{person.name}</p>
          <Image
            src={person.picture}
            alt={person.name}
            className="mt-2 h-16 w-16 rounded-full object-cover"
            width={64}
            height={64}
            unoptimized
          />
          <p className="text-sm text-gray-600">{person.role}</p>
        </li>
      ))}
    </ul>
  );
}
