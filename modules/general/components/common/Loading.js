import Paragraph from "@/modules/general/components/common/Paragraph";
import IconLoading from "@/modules/general/components/icon/IconLoading";

const Loading = ({ text = "Loading ...", className = "" }) => {
  return (
    <Paragraph className={`text-sm ${className}`}>
      <IconLoading /> <span className="ml-1">{text}</span>
    </Paragraph>
  );
};

export default Loading;
