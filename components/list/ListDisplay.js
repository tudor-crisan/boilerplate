import Link from "next/link";
import { defaultStyling as styling } from "@/libs/defaults";
import GeneralTitle from "../general/GeneralTitle";
import { pluralize } from "@/libs/utils.client";
import SvgView from "../svg/SvgView";

function ListItem({ item, hasLink }) {
  return hasLink ? (
    <div className="flex justify-between items-center">
      {item.name}
      <SvgView size="size-4 sm:size-5" />
    </div>
  ) : (
    <div>{item.name}</div>
  );
}
export default function ListDisplay({ list, type = "Board", link = null }) {
  const itemClass = `${styling.roundness[1]} ${styling.borders[0]} block bg-base-100 p-4 sm:p-6`;
  const linkClass = 'hover:bg-neutral hover:text-neutral-content duration-200';

  return (
    <div>
      <GeneralTitle className="mb-4">
        {list.length} {pluralize(type, list.length)}
      </GeneralTitle>
      <ul className="space-y-4">
        {list.map(item => (
          <li key={item._id}>
            {link ? (
              <Link
                href={link(item)}
                className={`${itemClass} ${linkClass}`}
              >
                <ListItem item={item} hasLink={!!link} />
              </Link>
            ) : (
              <ListItem item={item} hasLink={!!link} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}