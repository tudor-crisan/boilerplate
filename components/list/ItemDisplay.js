"use client";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";

const SingleItem = ({ item, styling, itemAction }) => {
  return (
    <li className={`${styling.roundness[1]} ${styling.borders[0]} ${styling.shadows[0]} bg-base-100 p-6 flex justify-between items-start`}>
      <div className="space-y-1">
        <Title>{item.title}</Title>
        <Paragraph className="max-h-32">
          {item.description}
        </Paragraph>
      </div>
      {(itemAction || item.action) && (
        <div className="ml-6">
          {typeof itemAction === "function" ? itemAction(item) : item.action}
        </div>
      )}
    </li>
  );
};

export default function ItemDisplay({ items, itemAction }) {
  const { styling } = useStyling();

  return (
    <ul className="space-y-4 grow">
      {items && items.map((item) => (
        <SingleItem
          key={item._id}
          item={item}
          styling={styling}
          itemAction={itemAction}
        />
      ))}
    </ul>
  );
}
