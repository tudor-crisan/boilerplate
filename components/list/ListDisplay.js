import Link from "next/link";
import { defaultStyling as styling } from "@/libs/defaults";

export default function ListDisplay({ list, type = "Board", link = null }) {
  const itemClass = `${styling.roundness[1]} ${styling.borders[0]} block bg-base-100 p-6`;
  const linkClass = 'hover:bg-neutral hover:text-neutral-content duration-200';
  const pluralize = list.length > 1 ? 's' : '';
  return (
    <div>
      <h1 className="font-extrabold text-xl mb-4">
        {list.length} {type}{pluralize}
      </h1>
      <ul className="space-y-4">
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