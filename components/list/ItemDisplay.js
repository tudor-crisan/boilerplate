"use client";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";

const SingleItem = ({ item, styling }) => {
  return (
    <li className={`${styling.roundness[1]} ${styling.borders[0]} ${styling.shadows[0]} bg-base-100 p-6 flex justify-between items-start`}>
      <div>
        <Title>{item.title}</Title>
        <Paragraph className="max-h-32">
          {item.description}
        </Paragraph>
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
