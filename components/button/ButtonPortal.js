"use client";
import axios from "axios";
import Button from "@/components/button/Button";
import useApiRequest from "@/hooks/useApiRequest";
import SvgUser from "@/components/svg/SvgUser";

const RETURN_URL_REDIRECT = "/dashboard";

const ButtonPortal = ({ className = "", variant = "btn-primary", children = "Billing", ...props }) => {
  const { loading, request } = useApiRequest();

  const handleBilling = async () => {
    await request(
      () => axios.post("/api/billing/create-portal", {
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
