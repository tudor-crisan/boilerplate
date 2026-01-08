"use client";
import { useState } from "react";
import { clientApi } from "@/libs/api";
import Button from "@/components/button/Button";
import useApiRequest from "@/hooks/useApiRequest";
import SvgPay from "@/components/svg/SvgPay";
import { defaultSetting as settings } from "@/libs/defaults";
import { useCopywriting } from "@/context/ContextCopywriting";
import Modal from "@/components/common/Modal";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";

const SUCCESS_URL_REDIRECT = settings.paths.billingSuccess.source;
const CANCEL_URL_REDIRECT = settings.paths.dashboard.source;

const ButtonCheckout = ({ className = "", variant = "btn-primary", children = "Subscribe", ...props }) => {
  const { loading, request } = useApiRequest();
  const { copywriting } = useCopywriting();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = async (type = "monthly") => {
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
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className="relative border-2 border-base-200 rounded-2xl p-4 hover:border-primary cursor-pointer transition-all hover:bg-base-200/50 group"
              onClick={() => handleSubscribe(key)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Title>{plan.label}</Title>
                  <Paragraph>{plan.benefits}</Paragraph>
                </div>
                <div className="text-right">
                  <div className="font-black text-2xl">{plan.price}<span className="text-sm font-medium opacity-60 ml-0.5">{plan.period}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ButtonCheckout;
