"use client";
import Button from "@/components/button/Button";
import SvgUser from "@/components/svg/SvgUser";
import useApiRequest from "@/hooks/useApiRequest";
import { clientApi } from "@/libs/api";
import { defaultSetting as settings } from "@/libs/defaults";

const RETURN_URL_REDIRECT = settings.paths.dashboard.source;

const ButtonPortal = ({ className = "", variant = "btn-primary", children = "Billing", ...props }) => {
  const { loading, request } = useApiRequest();

  const handleBilling = async () => {
    await request(
      () => clientApi.post(settings.paths.api.billingCreatePortal, {
        returnUrl: window.location.origin + RETURN_URL_REDIRECT,
      }),
      {
        keepLoadingOnSuccess: true,
        onSuccess: (message, data) => {
          const portalUrl = data?.url;
          if (portalUrl) {
            window.location.href = portalUrl;
          }
        }
      }
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
