import IconLoading from "@/components/icon/IconLoading";
import Paragraph from "@/components/common/Paragraph";

const Loading = ({ text = "Loading ...", className = "" }) => {
  return (
    <Paragraph className={`text-sm ${className}`}>
      <IconLoading /> <span className="ml-1">{text}</span>
    </Paragraph>
  );
};

export default Loading;
