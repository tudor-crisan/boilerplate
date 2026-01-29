"use client";
import Button from "@/modules/general/components/button/Button";
import SvgVote from "@/modules/general/components/svg/SvgVote";
import { useStyling } from "@/modules/general/context/ContextStyling";

const ButtonVote = ({
  count,
  hasVoted,
  isLoading,
  onClick,
  className = "",
  disabled = false,
  ...props
}) => {
  const { styling } = useStyling();

  return (
    <Button
      variant={hasVoted ? "btn-primary" : "btn-ghost"}
      className={`${styling.components.element} group text-lg gap-2 ${
        hasVoted
          ? "border-transparent"
          : "bg-base-100 text-base-content border-base-200 hover:border-base-content/25"
      } ${className}`}
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled}
      startIcon={<SvgVote />}
      {...props}
    >
      <span className="text-sm font-medium">{count}</span>
    </Button>
  );
};

export default ButtonVote;
