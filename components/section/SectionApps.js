"use client";
import { useStyling } from "@/context/ContextStyling";
import Grid from "@/components/common/Grid";
import { getAppDetails } from "@/lists/apps";
import Image from "next/image";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import { cn } from "@/libs/utils.client";
import Button from "@/components/button/Button";

// Define the apps to display in this section
const availableApps = ['loyalboards'];

const SectionAppsContent = () => {
  availableApps.map((app) => {
    const { title, description, favicon, website, appName } = getAppDetails(app);

    return (
      <div key={app} className={`card w-full max-w-sm ${styling.components.card}`}>
        <div className={`card-body ${styling.general.box} space-y-6`}>
          <div className={`flex items-center gap-2 font-extrabold`}>
            {favicon && (
              <Image
                src={favicon}
                alt={`${appName} logo`}
                width={32}
                height={32}
                className={`${styling.components.element} object-contain`} // Safety for images
              />
            )}
            <Title>{appName}</Title>
          </div>

          <div className="space-y-1">
            <Title>{title}</Title>
            <Paragraph>{description}</Paragraph>
          </div>

          {website && (
            <Button href={website}>
              View App
            </Button>
          )}
        </div>
      </div>
    );
  });
}

export default function SectionApps() {
  const { styling } = useStyling();

  return (
    <section id="apps" className={cn(`${styling.general.container} ${styling.general.box} bg-base-100`, styling.SectionApps.padding)}>
      {availableApps.length === 1 ? (
        <div className={styling.flex.center}>
          <SectionAppsContent />
        </div>
      ) : (
        <Grid>
          <SectionAppsContent />
        </Grid>
      )}
    </section>
  );
}
