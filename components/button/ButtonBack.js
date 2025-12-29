import Button from "@/components/button/Button";
import SvgBack from "@/components/svg/SvgBack";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ButtonBack({ url = "/", className = "", disabled = false }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      isLoading={loading}
      disabled={disabled}
      className={className}
      startIcon={<SvgBack />}
      variant="btn" // Default plain btn class not primary
      onClick={() => {
        setLoading(true);
        router.push(url);
      }}
    >
      Back
    </Button>
  )
}