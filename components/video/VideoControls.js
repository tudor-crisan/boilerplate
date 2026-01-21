"use client";

import Button from "@/components/button/Button";

export default function VideoControls({ onNext, onPrev, hasNext, hasPrev }) {
  return (
    <div className="absolute bottom-8 right-8 flex gap-2">
      <Button
        onClick={onPrev}
        disabled={!hasPrev}
        variant="btn-ghost bg-black/20 hover:bg-black/30 backdrop-blur-md text-white rounded"
      >
        Prev
      </Button>
      <Button
        onClick={onNext}
        disabled={!hasNext}
        variant="btn-ghost bg-black/20 hover:bg-black/30 backdrop-blur-md text-white rounded"
      >
        Next
      </Button>
    </div>
  );
}
