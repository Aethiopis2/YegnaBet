import {
  Camera,
  User,
} from "lucide-react";

interface AvatarPickerProps {
  name: string;
  imageUrl?: string;

  onChange?: (
    file: File
  ) => void;
}

export function AvatarPicker({
  name,
  imageUrl,
  onChange,
}: AvatarPickerProps) {
  return (
    <div className="flex items-center gap-4">
      <label
        className="
          group
          relative
          block
          size-20
          cursor-pointer
        "
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="
              size-full
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              grid
              size-full
              place-items-center
              rounded-full
              bg-yegna-100
              text-yegna-700

              dark:bg-yegna-900/30
              dark:text-yegna-300
            "
          >
            <User className="size-8" />
          </div>
        )}

        <div
          className="
            absolute
            bottom-0
            right-0
            grid
            size-7
            place-items-center
            rounded-full
            border-2
            border-white
            bg-yegna-700
            text-white
            shadow-md

            dark:border-[#151515]
          "
        >
          <Camera className="size-3.5" />
        </div>

        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              onChange?.(file);
            }
          }}
        />
      </label>

      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {name}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          Tap your photo to change it
        </p>
      </div>
    </div>
  );
}