import { useEffect, useState } from "react";

import { QuickActionButton } from "./QuickActionButton";
import { QuickActionMenu } from "./QuickActionMenu";

export function QuickActionSheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [open]);

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        z-50
        sm:bottom-7
        sm:right-7
      "
    >
      <QuickActionMenu open={open} />

      <QuickActionButton
        open={open}
        onClick={() =>
          setOpen((value) => !value)
        }
      />
    </div>
  );
}