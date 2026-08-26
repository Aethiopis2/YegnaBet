import {
  Bell,
  CheckCheck,
  Inbox,
  MessageCircle,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppShell } from "../../components/layout/AppShell";
import { PageContainer } from "../../components/layout/PageContainer";

import { CommunicationTabs, } from "../../components/communication/CommunicationTabs";

import {
  MessageItem,
} from "../../components/communication/MessageItem";

import {
  NotificationItem,
} from "../../components/communication/NotificationItem";

import {
  InboxEmptyState,
} from "../../components/communication/InboxEmptyState";

import type {
  CommunicationTab,
} from "../../types/communication";

import {
  demoConversations,
  demoNotifications,
} from "../../data/communication";

export function InboxPage() {
  const navigate = useNavigate();

  const [active, setActive] =
    useState<CommunicationTab>("all");

  const [notifications, setNotifications] =
    useState(demoNotifications);

  const unreadMessages =
    demoConversations.reduce(
      (total, conversation) =>
        total + conversation.unreadCount,
      0
    );

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  const markAllRead = () => {
    setNotifications((items) =>
      items.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const showMessages =
    active === "all" ||
    active === "messages";

  const showNotifications =
    active === "all" ||
    active === "notifications";

  return (
    <AppShell>
      <PageContainer>
        <main className="mx-auto max-w-2xl px-1 py-6">
          <header className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Inbox
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                  Messages and notifications
                  from Yegna Bet.
                </p>
              </div>

              {unreadNotifications >
                0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-gray-400
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                    dark:hover:bg-white/[0.05]
                    dark:hover:text-gray-200
                  "
                >
                  <CheckCheck className="size-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </header>

          <CommunicationTabs
            active={active}
            onChange={setActive}
            unreadMessages={
              unreadMessages
            }
            unreadNotifications={
              unreadNotifications
            }
          />

          <div className="mt-5 space-y-6">
            {/* MESSAGES */}

            {showMessages && (
              <section>
                {active === "all" && (
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <MessageCircle className="size-4 text-yegna-700" />

                    <h2 className="text-xs font-bold text-gray-900 dark:text-white">
                      Messages
                    </h2>
                  </div>
                )}

                {demoConversations.length >
                0 ? (
                  <div className="rounded-3xl border border-black/[0.05] bg-white p-1 dark:border-white/[0.06] dark:bg-white/[0.035]">
                    {demoConversations.map(
                      (conversation) => (
                        <MessageItem
                          key={
                            conversation.id
                          }
                          conversation={
                            conversation
                          }
                          onClick={() =>
                            navigate(
                              `/inbox/conversation/${conversation.id}`
                            )
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <InboxEmptyState
                    icon={MessageCircle}
                    title="No messages"
                    description="Messages from your broker and service providers will appear here."
                  />
                )}
              </section>
            )}

            {/* NOTIFICATIONS */}

            {showNotifications && (
              <section>
                {active === "all" && (
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <Bell className="size-4 text-yegna-700" />

                    <h2 className="text-xs font-bold text-gray-900 dark:text-white">
                      Notifications
                    </h2>
                  </div>
                )}

                {notifications.length >
                0 ? (
                  <div className="rounded-3xl border border-black/[0.05] bg-white p-1 dark:border-white/[0.06] dark:bg-white/[0.035]">
                    {notifications.map(
                      (notification) => (
                        <NotificationItem
                          key={
                            notification.id
                          }
                          notification={
                            notification
                          }
                          onClick={() =>
                            setNotifications(
                              (items) =>
                                items.map(
                                  (
                                    item
                                  ) =>
                                    item.id ===
                                    notification.id
                                      ? {
                                          ...item,
                                          read: true,
                                        }
                                      : item
                                )
                            )
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <InboxEmptyState
                    icon={Bell}
                    title="You're all caught up"
                    description="Important updates from Yegna Bet will appear here."
                  />
                )}
              </section>
            )}

            {active !== "all" &&
              ((active === "messages" &&
                demoConversations.length ===
                  0) ||
                (active ===
                  "notifications" &&
                  notifications.length ===
                    0)) && (
                <div />
              )}
          </div>
        </main>
      </PageContainer>
    </AppShell>
  );
}