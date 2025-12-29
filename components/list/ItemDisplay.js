"use client";
import { useStyling } from "@/context/ContextStyling";

const SingleItem = ({ item, styling }) => {
  return (
    <li className={`bg-base-100 p-6 flex justify-between items-start ${styling.shadows[1]} ${styling.roundness[1]} ${styling.borders[0]}`}>
      <div>
        <div className="font-bold mb-1 text-lg">{item.title}</div>
        <div className="opacity-80 leading-relaxed max-h-32 overflow-y-auto">
          {item.description}
        </div>
      </div>
    </li>
  );
};

export default function ItemDisplay({ items }) {
  const { styling } = useStyling();

  return (
    <ul className="space-y-4 grow">
      {items && items.map((item) => (
        <SingleItem
          key={item._id}
          item={item}
          styling={styling}
        />
      ))}
    </ul>
  );
}
