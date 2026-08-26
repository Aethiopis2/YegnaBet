import {
  Check,
  CheckCheck,
} from "lucide-react";

import type {
  Conversation,
} from "../../types/communication";

interface MessageItemProps {
  conversation: Conversation;

  onClick?: (
    conversation: Conversation
  ) => void;
}

export function MessageItem({
  conversation,
  onClick,
}: MessageItemProps) {
  return (
    <button
      type="button"
      onClick={() =>
        onClick?.(conversation)
      }
      className="
        flex
        w-full
        gap-3
        rounded-2xl
        p-3
        text-left
        transition-all
        duration-200
        hover:bg-gray-50
        dark:hover:bg-white/[0.035]
      "
    >
      <div className="relative shrink-0">
        {conversation.participantAvatar ? (
          <img
            src={conversation.participantAvatar}
            alt=""
            className="
              size-11
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              grid
              size-11
              place-items-center
              rounded-full
              bg-yegna-100
              text-sm
              font-bold
              text-yegna-700
              dark:bg-yegna-900/30
              dark:text-yegna-300
            "
          >
            {conversation.participantName
              .charAt(0)
              .toUpperCase()}
          </div>
        )}

        {conversation.unreadCount > 0 && (
          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              size-2.5
              rounded-full
              border-2
              border-white
              bg-yegna-700
              dark:border-[#111]
            "
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {conversation.participantName}
          </p>

          <time className="shrink-0 text-[9px] text-gray-400">
            {formatTime(
              conversation.lastMessageAt
            )}
          </time>
        </div>

        <div className="mt-1 flex items-center gap-1">
          {conversation.messages.at(-1)
            ?.senderId === "me" &&
            (conversation.messages.at(-1)
              ?.status === "read" ? (
              <CheckCheck className="size-3 text-yegna-700" />
            ) : (
              <Check className="size-3 text-gray-400" />
            ))}

          <p
            className={`
              line-clamp-1
              flex-1
              text-xs
              ${
                conversation.unreadCount
                  ? "font-semibold text-gray-700 dark:text-gray-200"
                  : "text-gray-400"
              }
            `}
          >
            {conversation.lastMessage}
          </p>
        </div>
      </div>

      {conversation.unreadCount > 0 && (
        <div className="grid size-5 shrink-0 place-items-center rounded-full bg-yegna-700 text-[8px] font-bold text-white">
          {conversation.unreadCount}
        </div>
      )}
    </button>
  );
}

function formatTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}