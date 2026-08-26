export type CommunicationTab =
  | "all"
  | "messages"
  | "notifications";

export type NotificationType =
  | "verification"
  | "request"
  | "match"
  | "listing"
  | "system";

export type MessageStatus =
  | "sent"
  | "delivered"
  | "read";

export interface Notification {
  id: string;

  type: NotificationType;

  title: string;

  message: string;

  createdAt: string;

  read: boolean;

  actionUrl?: string;
}

export interface Message {
  id: string;

  conversationId: string;

  senderId: string;

  senderName: string;

  senderAvatar?: string;

  text: string;

  createdAt: string;

  status?: MessageStatus;

  read: boolean;
}

export interface Conversation {
  id: string;

  participantId: string;

  participantName: string;

  participantAvatar?: string;

  lastMessage: string;

  lastMessageAt: string;

  unreadCount: number;

  messages: Message[];
}

export interface InboxItem {
  id: string;

  kind: "message" | "notification";

  createdAt: string;

  read: boolean;

  message?: Message;

  notification?: Notification;
}