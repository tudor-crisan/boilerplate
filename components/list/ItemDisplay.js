"use client";
import { useStyling } from "@/context/ContextStyling";
import Title from "@/components/common/Title";
import Paragraph from "@/components/common/Paragraph";
import { motion, AnimatePresence } from "framer-motion";

const SingleItem = ({ item, styling, itemAction }) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className={`${styling.components.card} ${styling.general.box} flex justify-between items-start`}
    >
      <div className="space-y-1 min-w-0">
        <Title className="wrap-break-word">{item.title}</Title>
        <Paragraph className="max-h-32 wrap-break-word">
          {item.description}
        </Paragraph>
      </div>
      {(itemAction || item.action) && (
        <div className="ml-6">
          {typeof itemAction === "function" ? itemAction(item) : item.action}
        </div>
      )}
    </motion.li>
  );
};

export default function ItemDisplay({ items, itemAction }) {
  const { styling } = useStyling();

  return (
    <ul className="space-y-4 grow">
      <AnimatePresence mode="popLayout">
        {items && items.map((item) => (
          <SingleItem
            key={item._id}
            item={item}
            styling={styling}
            itemAction={itemAction}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
