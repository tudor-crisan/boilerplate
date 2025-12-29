"use client";
import Link from "next/link";
import { defaultStyling as styling } from "@/libs/defaults";
import Title from "@/components/common/Title";
import { pluralize } from "@/libs/utils.client";
import SvgView from "@/components/svg/SvgView";
import { useState } from "react";
import IconLoading from "@/components/icon/IconLoading";

function ListItem({ item, hasLink, isLoading }) {
  return hasLink ? (
    <div className="flex justify-between items-center">
      {item.name}
      {isLoading ? <IconLoading /> : <SvgView size="size-4 sm:size-5" />}
    </div>
  ) : (
    <div>{item.name}</div>
  );
}
export default function ListDisplay({ list, type = "Board" }) {
  const [loadingItem, setLoadingItem] = useState(null);
  const itemClass = `${styling.roundness[1]} ${styling.borders[0]} block bg-base-100 p-4 sm:p-6`;
  const linkClass = 'hover:bg-neutral hover:text-neutral-content duration-200';

  return (
    <div>
      <Title className="mb-4">
        {list.length} {pluralize(type, list.length)}
      </Title>
      <ul className="space-y-4">
        {list.map(item => {
          const isLoading = loadingItem === item._id;
          const href = item.href;

          return (
            <li key={item._id}>
              {href ? (
                isLoading ? (
                  <div className={`${itemClass} opacity-50 cursor-wait`}>
                    <ListItem item={item} hasLink={true} isLoading={true} />
                  </div>
                ) : (
                  <Link
                    href={href}
                    className={`${itemClass} ${linkClass}`}
                    onClick={() => setLoadingItem(item._id)}
                  >
                    <ListItem item={item} hasLink={true} isLoading={false} />
                  </Link>
                )
              ) : (
                <ListItem item={item} hasLink={false} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  )
}