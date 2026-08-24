import { perferences } from "../../data/preferences";

import { PreferenceCard } from "./PreferenceCard";

export function PreferenceSection() {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {perferences.map((preference) => (
          <PreferenceCard
            key={preference.id}
            title={preference.title}
            description={preference.description}
            icon={preference.icon}
            route={preference.route}
          />
        ))}
      </div>
    </section>
  );
}