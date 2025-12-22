import Link from "next/link";
import { defaultStyling as styling } from "@/libs/defaults";
import GeneralTitle from "../general/GeneralTitle";
import { pluralize } from "@/libs/utils.client";

export default function ListDisplay({ list, type = "Board", link = null }) {
  const itemClass = `${styling.roundness[1]} ${styling.borders[0]} block bg-base-100 p-6`;
  const linkClass = 'hover:bg-neutral hover:text-neutral-content duration-200';

  return (
    <div>
      <GeneralTitle>
        {list.length} {pluralize(type, list.length)}
      </GeneralTitle>
      <ul className="space-y-4 mt-4">
        {list.map(item => (
          <li key={item._id}>
            {link ? (
              <Link
                href={link(item)}
                className={`${itemClass} ${linkClass}`}
              >
                {item.name}
              </Link>
            ) : (
              <div className={itemClass}>
                {item.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}