"use client";
import { useState } from "react";
import { clientApi } from "@/libs/api";
import Button from "@/components/button/Button";
import useApiRequest from "@/hooks/useApiRequest";
import SvgPay from "@/components/svg/SvgPay";
import { defaultSetting as settings } from "@/libs/defaults";
import { useCopywriting } from "@/context/ContextCopywriting";
import Modal from "@/components/common/Modal";
import PricingPlanCard from "@/components/pricing/PricingPlanCard";
import Divider from "@/components/common/Divider";

const SUCCESS_URL_REDIRECT = settings.paths.billingSuccess.source;
const CANCEL_URL_REDIRECT = settings.paths.dashboard.source;

const ButtonCheckout = ({ className = "", variant = "btn-primary", children = "Subscribe", ...props }) => {
  const { loading, request } = useApiRequest();
  const { copywriting } = useCopywriting();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = async (type = "monthly") => {
    setSelectedPlan(type);
    await request(
      () => clientApi.post(settings.paths.api.billingCreateCheckout, {
        successUrl: window.location.origin + SUCCESS_URL_REDIRECT,
        cancelUrl: window.location.origin + CANCEL_URL_REDIRECT,
        type,
      }),
      {
        keepLoadingOnSuccess: true,
        onSuccess: (message, data) => {
          const checkoutUrl = data?.url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          }
        },
        onError: () => {
          setSelectedPlan(null);
        }
      }
    );
  };

  const plans = copywriting.SectionPricing.formattedPlans || {};

  return (
    <>
      <Button
        className={className}
        variant={variant}
        isLoading={loading}
        onClick={() => setIsModalOpen(true)}
        startIcon={<SvgPay />}
        {...props}
      >
        {copywriting.SectionPricing.button?.label || "Payment"}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Choose your plan"
        boxClassName="max-w-md"
      >
        <div className="flex flex-col gap-3">
          {plans.monthly && (
            <PricingPlanCard
              item={plans.monthly}
              variant="simple"
              onClick={() => handleSubscribe("monthly")}
              isLoading={loading && selectedPlan === "monthly"}
              disabled={loading}
            />
          )}

          <Divider />

          {plans.lifetime && (
            <PricingPlanCard
              item={plans.lifetime}
              isBestOffer={true} // Explicitly set for lifetime as per requirements
              variant="featured"
              onClick={() => handleSubscribe("lifetime")}
              isLoading={loading && selectedPlan === "lifetime"}
              disabled={loading}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ButtonCheckout;
