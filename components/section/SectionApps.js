"use client";
import { useStyling } from "@/context/ContextStyling";
import Grid from "@/components/common/Grid";
import { getAppDetails } from "@/libs/apps";
import Image from "next/image";
import Paragraph from "@/components/common/Paragraph";
import Title from "@/components/common/Title";
import { cn } from "@/libs/utils.client";
import Button from "@/components/button/Button";
import { defaultSetting as settings } from "@/libs/defaults";
import Flex from "@/components/common/Flex";

const SectionAppsContent = () => {
  const { styling } = useStyling();

  return settings.availableApps.map((app) => {
    const details = getAppDetails(app);
    if (!details) return null;
    const { title, description, favicon, website, appName } = details;

    return (
      <div key={app} className={cn("card w-full max-w-sm", styling.components.card)}>
        <div className={cn("card-body space-y-6", styling.general.box)}>
          {(favicon || appName) && (
            <div className="flex items-center gap-2 font-extrabold">
              {favicon && (
                <Image
                  src={favicon}
                  alt={`${appName} logo`}
                  className={cn("object-contain", styling.components.element)}
                  width={32}
                  height={32}
                />
              )}
              <Title>{appName}</Title>
            </div>
          )}

          {(title || description) && (
            <div className="space-y-1">
              {title && <Title>{title}</Title>}
              {description && <Paragraph>{description}</Paragraph>}
            </div>
          )}

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
    <section id="apps" className={cn(`${styling.general.container} ${styling.general.box} bg-base-100`, styling.SectionApps?.padding)}>
      {settings.availableApps.length === 1 ? (
        <Flex>
          <SectionAppsContent />
        </Flex>
      ) : (
        <Grid>
          <SectionAppsContent />
        </Grid>
      )}
    </section>
  );
}
