"use client";
import IconLoading from "@/components/icon/IconLoading";
import { useStyling } from "@/context/ContextStyling";
import { cn } from "@/libs/utils.client";

const PricingPlanCard = ({
  item,
  isBestOffer = false,
  onClick,
  isLoading = false,
  disabled = false,
  className = "",
  variant = "featured", // "featured" | "simple"
}) => {
  const { styling } = useStyling();
  const { price, period, label, benefits } = item;

  const isFeatured = variant === "featured";

  return (
    <div
      className={cn(
        "relative transition-all text-left",
        isFeatured && styling.pricing.card_featured,
        !isFeatured && styling.pricing.card_simple,
        onClick &&
          !disabled &&
          isFeatured &&
          styling.pricing.card_featured_interactive,
        onClick &&
          !disabled &&
          !isFeatured &&
          styling.pricing.card_simple_interactive,
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      {isBestOffer && <div className={styling.pricing.label}>Best Offer</div>}

      <div className={styling.flex.between}>
        <div>
          <div className="flex items-baseline">
            <div
              className={cn(
                "text-3xl font-black",
                isFeatured && "text-primary",
              )}
            >
              {price}
            </div>
            {period && (
              <div className="text-sm font-medium opacity-60 ml-1">
                {period}
              </div>
            )}
          </div>
          <div
            className={cn(
              "text-xs font-bold",
              isFeatured ? "text-primary" : "opacity-60",
            )}
          >
            {label}
          </div>
        </div>

        <div className={`${styling.flex.col} items-end justify-center`}>
          {isLoading ? (
            <div className="h-6 w-6 relative">
              <IconLoading />
            </div>
          ) : (
            <div className="text-sm font-medium text-right opacity-80">
              {benefits}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingPlanCard;
