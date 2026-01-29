"use client";
import Button from "@/modules/general/components/button/Button";
import SvgUser from "@/modules/general/components/svg/SvgUser";
import useApiRequest from "@/modules/general/hooks/useApiRequest";
import { clientApi } from "@/modules/general/libs/api";
import { defaultSetting as settings } from "@/modules/general/libs/defaults";

const RETURN_URL_REDIRECT = settings.paths.dashboard?.source;

const ButtonPortal = ({
  className = "",
  variant = "btn-primary",
  children = "Billing",
  ...props
}) => {
  const { loading, request } = useApiRequest();

  const handleBilling = async () => {
    await request(
      () =>
        clientApi.post(settings.paths.api.billingCreatePortal, {
          returnUrl: window.location.origin + RETURN_URL_REDIRECT,
        }),
      {
        keepLoadingOnSuccess: true,
        onSuccess: (message, data) => {
          const portalUrl = data?.url;
          if (portalUrl) {
            window.location.href = portalUrl;
          }
        },
      },
    );
  };

  return (
    <Button
      className={className}
      variant={variant}
      isLoading={loading}
      onClick={handleBilling}
      startIcon={<SvgUser />}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonPortal;
