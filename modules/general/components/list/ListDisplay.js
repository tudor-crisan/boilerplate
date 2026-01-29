"use client";
import Title from "@/modules/general/components/common/Title";
import IconLoading from "@/modules/general/components/icon/IconLoading";
import SvgView from "@/modules/general/components/svg/SvgView";
import { useStyling } from "@/modules/general/context/ContextStyling";
import { pluralize } from "@/modules/general/libs/utils.client";
import { useState } from "react";
import Link from "next/link";

function ListItem({ item, hasLink, isLoading, styling }) {
  return hasLink ? (
    <div className={styling.flex.between}>
      <span className="truncate pr-2 text-sm sm:text-base font-medium">
        {item.name}
      </span>
      {isLoading ? (
        <IconLoading />
      ) : (
        <SvgView size="size-4 sm:size-5 shrink-0" />
      )}
    </div>
  ) : (
    <div>{item.name}</div>
  );
}
export default function ListDisplay({ list, type = "Board", children }) {
  const { styling } = useStyling();
  const [loadingItem, setLoadingItem] = useState(null);
  const itemClass = `${styling.components.card} block ${styling.general.box}`;
  const linkClass = "hover:bg-neutral hover:text-neutral-content duration-200";

  return (
    <div>
      <Title className="mb-4">
        {list.length} {pluralize(type, list.length)}
      </Title>
      {children}
      <ul className="space-y-4">
        {list.map((item) => {
          const isLoading = loadingItem === item._id;
          const href = item.href;

          return (
            <li key={item._id}>
              {href ? (
                isLoading ? (
                  <div className={`${itemClass} opacity-50 cursor-wait`}>
                    <ListItem
                      item={item}
                      hasLink={true}
                      isLoading={true}
                      styling={styling}
                    />
                  </div>
                ) : (
                  <Link
                    href={href}
                    className={`${itemClass} ${linkClass}`}
                    onClick={() => setLoadingItem(item._id)}
                  >
                    <ListItem
                      item={item}
                      hasLink={true}
                      isLoading={false}
                      styling={styling}
                    />
                  </Link>
                )
              ) : (
                <ListItem item={item} hasLink={false} styling={styling} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
