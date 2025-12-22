"use client";

import axios from "axios";
import Button from "@/components/button/Button";
import useApiRequest from "@/hooks/useApiRequest";

const ButtonCheckout = ({ className = "", variant = "btn-primary", children = "Subscribe", ...props }) => {
  const { loading, request } = useApiRequest();

  const handleSubscribe = async () => {
    await request(
      () => axios.post("/api/billing/create-checkout", {
        successUrl: window.location.href + "/success",
        cancelUrl: window.location.href,
      }),
      {
        onSuccess: (message, data) => {
          const checkoutUrl = data?.url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          }
        },
      }
    );
  };

  return (
    <Button
      className={className}
      variant={variant}
      isLoading={loading}
      onClick={handleSubscribe}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonCheckout;
