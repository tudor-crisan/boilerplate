"use client";
import { useAuth } from "@/modules/auth/context/ContextAuth";
import Button from "@/modules/general/components/button/Button";
import Paragraph from "@/modules/general/components/common/Paragraph";
import Title from "@/modules/general/components/common/Title";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

export default function PagesAuth({
  icon,
  title,
  description,
  children,
  maxWidth = "max-w-md",
}) {
  const { styling } = useStyling();
  const { isLoggedIn } = useAuth();

  return (
    <div
      className={`min-h-screen ${styling.flex.center} bg-base-200 ${styling.general.box}`}
    >
      <div className={`card w-full ${maxWidth} ${styling.components.card}`}>
        <div
          className={`card-body items-center text-center ${styling.general.box}`}
        >
          {!isLoggedIn && icon && (
            <div className="mb-4 flex justify-center w-full">{icon}</div>
          )}

          <Title>{isLoggedIn ? "You are logged in" : title}</Title>

          <Paragraph className="mb-6">
            {isLoggedIn
              ? "You are currently logged in. Go to your dashboard to manage your account."
              : description}
          </Paragraph>

          <div className={`card-actions w-full ${styling.flex.col}`}>
            {isLoggedIn ? (
              <Button href={settings.paths.dashboard.source} className="w-full">
                Go to dashboard
              </Button>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
