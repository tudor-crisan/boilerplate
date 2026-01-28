import Image from "next/image";
import { motion } from "framer-motion";

export default function SlideTransition({ isVertical, styling, slide }) {
  return (
    <div
      className={`relative w-full ${isVertical ? "h-[50vh] mt-12" : "h-[40vh] max-w-4xl mt-24"} flex items-center justify-center`}
    >
      <motion.div
        className={`absolute inset-0 z-10 origin-bottom-left overflow-hidden border border-white/10 w-3/4 h-3/4 top-0 left-0 ${styling.components.image} ${styling.components.card}`}
        initial={{ x: "-50%", opacity: 0, rotate: -8 }}
        animate={{
          x: isVertical ? "0%" : "-15%",
          y: "25%",
          opacity: 1,
          rotate: -8,
        }}
        transition={{ duration: 1, type: "spring" }}
      >
        <Image
          src={slide.images[0]}
          alt="Display 1"
          fill
          className="object-cover object-top"
        />
      </motion.div>

      <motion.div
        className={`absolute inset-0 z-20 origin-bottom-right overflow-hidden border border-white/10 w-3/4 h-3/4 bottom-0 right-0 ${styling.components.image} ${styling.components.card}`}
        initial={{ x: "50%", opacity: 0, rotate: 8 }}
        animate={{
          x: isVertical ? "0%" : "15%",
          y: "5%",
          opacity: 1,
          rotate: 8,
        }}
        transition={{ duration: 1, delay: 0.4, type: "spring" }}
      >
        <Image
          src={slide.images[1]}
          alt="Display 2"
          fill
          className="object-cover object-top"
        />
      </motion.div>
    </div>
  );
}
