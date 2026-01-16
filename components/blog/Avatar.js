import Link from "next/link";
import Image from "next/image";
import { defaultSetting as config } from "@/libs/defaults";

// This is the author avatar that appears in the article page and in <CardArticle /> component
const Avatar = ({ article }) => {
  return (
    <div
      title={`Posts by ${config.business.name}`}
      className="inline-flex items-center gap-2 group"
    >
      <span itemProp="author">
        <Image
          src={config.business.logo}
          alt={`Logo of ${config.business.name}`}
          className="w-7 h-7 rounded-full object-cover object-center"
          width={28}
          height={28}
        />
      </span>
      <span className="group-hover:underline">{config.business.name}</span>
    </div>
  );
};

export default Avatar;


