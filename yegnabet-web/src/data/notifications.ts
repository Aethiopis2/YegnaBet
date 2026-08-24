import type { Notification } from "../components/types/notification";

export const notifications: Notification[] = [
  {
    id: 1,
    type: "verified",
    title: "Request verified",
    message:
      "Your request for a family house has been verified.",
    createdAt: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "listing",
    title: "New listing",
    message:
      "A new property matching your preferences was added.",
    createdAt: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "saved",
    title: "Price update",
    message:
      "A property in your saved list has changed price.",
    createdAt: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "message",
    title: "New message",
    message:
      "Hana Tesfaye sent you a message.",
    createdAt: "Yesterday",
    read: true,
  },
];