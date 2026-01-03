"use client";
import { clientApi } from "@/libs/api";
import Button from "@/components/button/Button";
import useApiRequest from "@/hooks/useApiRequest";
import SvgPay from "@/components/svg/SvgPay";
import { defaultSetting as settings } from "@/libs/defaults";

const SUCCESS_URL_REDIRECT = settings.paths.billingSuccess.source;
const CANCEL_URL_REDIRECT = settings.paths.dashboard.source;

const ButtonCheckout = ({ className = "", variant = "btn-primary", children = "Subscribe", ...props }) => {
  const { loading, request } = useApiRequest();

  const handleSubscribe = async () => {
    await request(
      () => clientApi.post(settings.paths.api.billingCreateCheckout, {
        successUrl: window.location.origin + SUCCESS_URL_REDIRECT,
        cancelUrl: window.location.origin + CANCEL_URL_REDIRECT,
      }),
      {
        keepLoadingOnSuccess: true,
        onSuccess: (message, data) => {
          const checkoutUrl = data?.url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
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
      onClick={handleSubscribe}
      startIcon={<SvgPay />}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonCheckout;
