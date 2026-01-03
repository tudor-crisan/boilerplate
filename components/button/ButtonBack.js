import Button from "@/components/button/Button";
import SvgBack from "@/components/svg/SvgBack";
import { defaultSetting as settings } from "@/libs/defaults";

export default function ButtonBack({ url = settings.paths.home.source, className = "", disabled = false }) {
  return (
    <Button
      href={url}
      disabled={disabled}
      className={className}
      startIcon={<SvgBack />}
      variant="btn"
    >
      Back
    </Button>
  )
}