interface ProfileSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ProfileSection({
  title,
  description,
  children,
  action,
}: ProfileSectionProps) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-black/[0.05]
        bg-white
        p-4
        shadow-sm

        dark:border-white/[0.06]
        dark:bg-white/[0.035]
      "
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-[10px] leading-4 text-gray-400">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}