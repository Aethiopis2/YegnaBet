import { useEffect, useState } from "react";

interface CustomerInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    phone: string;
  }) => void;
}

export function CustomerInfoDialog({
  open,
  onClose,
  onSubmit,
}: CustomerInfoDialogProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!open) {
      setFullName("");
      setPhone("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = () => {
    if (!fullName.trim() || !phone.trim()) {
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl
          bg-white
          p-6
          shadow-2xl
          dark:bg-[#171a18]
        "
      >
        <div className="mb-5">
          <h2
            className="
              text-xl
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Request a Viewing
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Just your name and phone number so our broker can
            contact you.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Full name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Your full name"
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-500/20
                dark:border-gray-700
                dark:bg-[#0d0f0e]
                dark:text-white
                dark:placeholder:text-gray-500
              "
            />
          </div>

          <div>
            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Phone number
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="09xxxxxxxx"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-500/20
                dark:border-gray-700
                dark:bg-[#0d0f0e]
                dark:text-white
                dark:placeholder:text-gray-500
              "
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
              dark:border-gray-700
              dark:text-gray-300
              dark:hover:bg-gray-800
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !fullName.trim() ||
              !phone.trim()
            }
            className="
              flex-1
              rounded-xl
              bg-orange-500
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-orange-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}