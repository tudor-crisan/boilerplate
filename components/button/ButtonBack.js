import Button from "@/components/button/Button";
import SvgBack from "@/components/svg/SvgBack";

export default function ButtonBack({ url = "/", className = "", disabled = false }) {
  return (
    <Button
      href={url}
      disabled={disabled}
      className={className}
      startIcon={<SvgBack />}
      variant="btn" // Default plain btn class not primary
    >
      Back
    </Button>
  )
}