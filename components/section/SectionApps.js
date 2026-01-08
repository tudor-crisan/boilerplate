"use client";
import apps from "@/lists/apps";
import copywritings from "@/lists/copywritings";
import { useStyling } from "@/context/ContextStyling";

const availableApps = ['loyalboards'];
const filteredApps = {};

for (const app in apps) {
  if (!availableApps.includes(app)) {
    continue;
  }

  filteredApps[app] = apps[app];
}

export default function SectionApps() {
  const { styling } = useStyling();
  return (
    <section id="apps" className={`${styling.general.container} ${styling.general.box} bg-base-100`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {Object.keys(filteredApps).map((appName) => {
          const appConfig = filteredApps[appName];
          const copyKey =
            typeof appConfig.copywriting === "string"
              ? appConfig.copywriting
              : appConfig.copywriting.override || appConfig.copywriting.default;

          const copyData = copywritings[copyKey];
          if (!copyData) return null;

          const title = copyData.SectionHero?.headline || appName;
          const description = copyData.SectionHero?.paragraph || "";

          return (
            <div key={appName} className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="card-title capitalize">{appName}</h3>
                </div>
                {title && <p className="font-semibold text-sm mb-2 opacity-80">{title}</p>}
                <p className="text-sm opacity-70 mb-4 line-clamp-3">{description}</p>
                <div className="card-actions justify-end mt-auto">
                  <button className="btn btn-sm btn-outline">View App</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
