"use client";
import IconLoading from "@/components/icon/IconLoading";
import { cn } from "@/libs/utils.client";
import { useStyling } from "@/context/ContextStyling";

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
        isFeatured && "p-3 rounded-xl border-2 border-primary/20 bg-primary/5",
        !isFeatured && "p-2 rounded-lg border-2 border-transparent hover:bg-base-200/50",
        onClick && !disabled && isFeatured && "cursor-pointer hover:border-primary hover:bg-base-200/50",
        onClick && !disabled && !isFeatured && "cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={!disabled && onClick ? onClick : undefined}
    >
      {isBestOffer && (
        <div className="absolute -top-3 right-4 bg-primary text-primary-content text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Best Offer
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline">
            <div className={cn("text-3xl font-black", isFeatured && "text-primary")}>
              {price}
            </div>
            {period && (
              <div className="text-sm font-medium opacity-60 ml-1">
                {period}
              </div>
            )}
          </div>
          <div className={cn("text-xs font-bold", isFeatured ? "text-primary" : "opacity-60")}>
            {label}
          </div>
        </div>

        <div className="flex flex-col items-end justify-center">
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
