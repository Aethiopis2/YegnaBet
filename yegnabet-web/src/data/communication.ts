import type {
  Conversation,
  Notification,
} from "../types/communication";

const now = Date.now();

export const demoNotifications: Notification[] =
  [
    {
      id: "notification-1",
      type: "verification",
      title: "Your request was verified",
      message:
        "Your property request has been reviewed and verified by Yegna Bet.",
      createdAt: new Date(
        now - 1000 * 60 * 25
      ).toISOString(),
      read: false,
    },

    {
      id: "notification-2",
      type: "match",
      title: "New property match",
      message:
        "We found a house that matches some of your preferences.",
      createdAt: new Date(
        now - 1000 * 60 * 60 * 3
      ).toISOString(),
      read: false,
      actionUrl: "/listing/1",
    },

    {
      id: "notification-3",
      type: "request",
      title: "Request received",
      message:
        "Your request for a 3-bedroom house has been received.",
      createdAt: new Date(
        now - 1000 * 60 * 60 * 8
      ).toISOString(),
      read: true,
    },

    {
      id: "notification-4",
      type: "listing",
      title: "A new listing may interest you",
      message:
        "A new property has appeared in an area you follow.",
      createdAt: new Date(
        now - 1000 * 60 * 60 * 24
      ).toISOString(),
      read: true,
    },
  ];

export const demoConversations: Conversation[] =
  [
    {
      id: "conversation-1",
      participantId: "broker-1",
      participantName:
        "Yegna Bet Broker",
      lastMessage:
        "I found another property that might work for you.",
      lastMessageAt: new Date(
        now - 1000 * 60 * 12
      ).toISOString(),
      unreadCount: 2,
      messages: [
        {
          id: "message-1",
          conversationId:
            "conversation-1",
          senderId: "broker-1",
          senderName:
            "Yegna Bet Broker",
          text:
            "Hello! I found a property that matches your request.",
          createdAt: new Date(
            now - 1000 * 60 * 30
          ).toISOString(),
          status: "delivered",
          read: true,
        },

        {
          id: "message-2",
          conversationId:
            "conversation-1",
          senderId: "me",
          senderName: "You",
          text:
            "Does it have parking?",
          createdAt: new Date(
            now - 1000 * 60 * 20
          ).toISOString(),
          status: "read",
          read: true,
        },

        {
          id: "message-3",
          conversationId:
            "conversation-1",
          senderId: "broker-1",
          senderName:
            "Yegna Bet Broker",
          text:
            "Yes, it has two parking spaces.",
          createdAt: new Date(
            now - 1000 * 60 * 12
          ).toISOString(),
          status: "delivered",
          read: false,
        },
      ],
    },
  ];