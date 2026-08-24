export type NotificationType = | "verified" | "request" | "saved" | "listing" | "message";

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}