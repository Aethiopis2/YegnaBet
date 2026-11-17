import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { MessageSquare, ArrowLeft, Send, Plus, Search, X } from "lucide-react";
import { API, BASE_URL_STRING } from "../../types/api";
import { useAuth } from "../../types/auth/authStore";
import type { AuthUser } from "../../types/auth/authTypes";
import IconButton from "../ui/IconButton";
import type { MessageOpenRequest } from "../layout/AppShell";

interface Conversation {
  id: number;
  otherUserId: number;
  otherUserName: string;
  otherUserRole: string;
  otherUserAvatar?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
}

interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  readAt?: string | null;
  isMine: boolean;
}

interface Contact {
  id: number;
  fullName: string;
  role: string;
  avatar?: string | null;
}

interface MessageCenterProps {
  user: AuthUser | null;
  onRequireLogin?: () => void;
  compact?: boolean;
  recipientRequest?: MessageOpenRequest | null;
  onRecipientRequestHandled?: (requestId: number) => void;
}

export function MessageCenter({ user, onRequireLogin, compact = false, recipientRequest, onRecipientRequestHandled }: MessageCenterProps) {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ name: string; content: string; conversationId: number } | null>(null);
  const [pendingOpen, setPendingOpen] = useState(false);
  const selectedRef = useRef<Conversation | null>(null);
  const openRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const loginPromptedRequestRef = useRef<number | null>(null);
  const processingRequestRef = useRef<number | null>(null);

  const headers = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);
  useEffect(() => {
    setOpen(false);
    setConversations([]);
    setSelected(null);
    setMessages([]);
    setContacts([]);
    setToast(null);
  }, [user?.id]);
  useEffect(() => {
    if (pendingOpen && accessToken && user) {
      setOpen(true);
      setPendingOpen(false);
    }
  }, [pendingOpen, accessToken, user]);

  const unreadCount = conversations.reduce((total, item) => total + item.unreadCount, 0);

  const refreshConversations = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await API.get<Conversation[]>("/messages/conversations", { headers: { Authorization: `Bearer ${accessToken}` } });
      setConversations(response.data);
      setSelected(current => current ? response.data.find(x => x.id === current.id) ?? current : current);
    } catch (err) {
      console.error("Unable to load conversations:", err);
    }
  }, [accessToken]);

  const loadMessages = useCallback(async (conversation: Conversation) => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const response = await API.get<ChatMessage[]>(`/messages/conversations/${conversation.id}/messages`, { headers: { Authorization: `Bearer ${accessToken}` } });
      setMessages(response.data);
      await API.post(`/messages/conversations/${conversation.id}/read`, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      await refreshConversations();
    } catch (err) {
      setError("Unable to load this conversation. Please try again.");
      console.error("Unable to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshConversations]);

  const loadContacts = useCallback(async (search = "") => {
    if (!accessToken) return;
    try {
      const response = await API.get<Contact[]>("/messages/contacts", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { search },
      });
      setContacts(response.data);
    } catch (err) {
      setError("Unable to load contacts.");
      console.error("Unable to load message contacts:", err);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !user || !["Customer", "Owner", "Employee"].includes(user.role)) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL_STRING}/hubs/broker`, { accessTokenFactory: () => accessToken })
      .withAutomaticReconnect()
      .build();

    connection.on("MessageReceived", (message: ChatMessage) => {
      if (selectedRef.current?.id === message.conversationId && openRef.current) {
        setMessages(current => current.some(x => x.id === message.id) ? current : [...current, message]);
        void API.post(`/messages/conversations/${message.conversationId}/read`, {}, { headers: { Authorization: `Bearer ${accessToken}` } })
          .then(refreshConversations)
          .catch(console.error);
      } else {
        setToast({ name: message.senderName, content: message.content, conversationId: message.conversationId });
      }
      void refreshConversations();
    });

    connection.on("ConversationChanged", () => void refreshConversations());
    connection.on("MessagesRead", (event: { conversationId: number; readerId: number; readAt: string }) => {
      if (selectedRef.current?.id === event.conversationId && event.readerId !== user.id) {
        setMessages(current => current.map(message => message.isMine ? { ...message, readAt: event.readAt } : message));
      }
      void refreshConversations();
    });

    connection.onreconnected(() => void refreshConversations());
    connection.start()
      .then(() => refreshConversations())
      .catch(err => console.error("Messaging connection failed:", err));

    return () => {
      connection.off("MessageReceived");
      connection.off("ConversationChanged");
      connection.off("MessagesRead");
      if (connection.state !== HubConnectionState.Disconnected) void connection.stop();
    };
  }, [accessToken, user?.id, user?.role, refreshConversations]);

  useEffect(() => {
    if (open) void refreshConversations();
  }, [open, refreshConversations]);

  useEffect(() => {
    if (open && showContacts) void loadContacts(contactSearch);
  }, [open, showContacts, contactSearch, loadContacts]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const toggle = () => {
    if (!user || !accessToken) {
      setPendingOpen(true);
      onRequireLogin?.();
      return;
    }
    setOpen(value => !value);
    setSelected(null);
    setShowContacts(false);
  };

  const selectConversation = (conversation: Conversation) => {
    if (toast?.conversationId === conversation.id) setToast(null);
    setSelected(conversation);
    setShowContacts(false);
    void loadMessages(conversation);
  };

  const startConversation = useCallback(async (contact: Contact) => {
    if (!accessToken) return;
    setError("");
    try {
      const response = await API.post<Conversation>("/messages/conversations", { recipientId: contact.id }, { headers });
      await refreshConversations();
      setSelected(response.data);
      setShowContacts(false);
      await loadMessages(response.data);
    } catch (err) {
      setError("Unable to start a conversation.");
      console.error("Unable to start conversation:", err);
    }
  }, [accessToken, headers, refreshConversations, loadMessages]);

  useEffect(() => {
    if (!recipientRequest) return;

    const { requestId, recipient } = recipientRequest;
    if (!user || !accessToken) {
      if (loginPromptedRequestRef.current !== requestId) {
        loginPromptedRequestRef.current = requestId;
        setPendingOpen(true);
        onRequireLogin?.();
      }
      return;
    }

    if (processingRequestRef.current === requestId) return;
    processingRequestRef.current = requestId;
    setOpen(true);
    setToast(null);
    setShowContacts(false);
    setSelected(null);
    setMessages([]);
    setDraft("");

    void startConversation({
      id: recipient.id,
      fullName: recipient.fullName,
      role: recipient.role,
      avatar: recipient.avatar,
    }).finally(() => {
      loginPromptedRequestRef.current = null;
      processingRequestRef.current = null;
      onRecipientRequestHandled?.(requestId);
    });
  }, [recipientRequest, user?.id, accessToken, startConversation, onRequireLogin, onRecipientRequestHandled]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !draft.trim() || sending || !accessToken) return;
    const content = draft.trim();
    setSending(true);
    setError("");
    try {
      const response = await API.post<ChatMessage>(`/messages/conversations/${selected.id}/messages`, { content }, { headers });
      setMessages(current => [...current, response.data]);
      setDraft("");
      await refreshConversations();
    } catch (err) {
      setError("Message could not be sent. Please try again.");
      console.error("Unable to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (user && !["Customer", "Owner", "Employee"].includes(user.role)) return null;

  const filteredContacts = contacts.filter(contact => contact.fullName.toLowerCase().includes(contactSearch.toLowerCase()));

  return (
    <div ref={rootRef} className="relative">
      <IconButton label="Messages" active={open} onClick={toggle}>
        <MessageSquare className={compact ? "size-4.5" : "size-[21px]"} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid min-w-4.5 h-4.5 place-items-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold leading-none text-white dark:border-[#121914]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </IconButton>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[70] flex h-[min(34rem,calc(100vh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-black/7 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#17201b]">
          {selected ? (
            <>
              <div className="flex items-center gap-2 border-b border-black/5 px-3 py-3 dark:border-white/8">
                <button type="button" onClick={() => { setSelected(null); setMessages([]); }} className="grid size-8 place-items-center rounded-full text-gray-500 hover:bg-black/5 dark:hover:bg-white/8" aria-label="Back to conversations"><ArrowLeft className="size-4" /></button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{selected.otherUserName}</p>
                  <p className="text-[10px] text-gray-400">{selected.otherUserRole}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-gray-400 hover:bg-black/5 dark:hover:bg-white/8" aria-label="Close messages"><X className="size-4" /></button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/70 p-3 dark:bg-black/10">
                {loading ? <p className="py-8 text-center text-xs text-gray-400">Loading messages...</p> : messages.length === 0 ? <p className="py-10 text-center text-xs text-gray-400">Start the conversation.</p> : messages.map(message => (
                  <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${message.isMine ? "rounded-br-md bg-yegna-700 text-white dark:bg-yegna-600" : "rounded-bl-md bg-white text-gray-800 shadow-sm dark:bg-white/8 dark:text-gray-100"}`}>
                      <p className="whitespace-pre-wrap break-words text-xs leading-5">{message.content}</p>
                      <div className={`mt-1 text-right text-[9px] ${message.isMine ? "text-white/65" : "text-gray-400"}`}>{formatTime(message.sentAt)}{message.isMine && message.readAt ? " · Seen" : ""}</div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              {error && <p className="border-t border-red-100 px-4 py-2 text-[10px] text-red-500 dark:border-red-900/30">{error}</p>}
              <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-black/5 p-3 dark:border-white/8">
                <textarea value={draft} onChange={event => setDraft(event.target.value)} rows={1} maxLength={4000} placeholder="Write a message..." className="max-h-24 min-h-10 flex-1 resize-y rounded-xl border border-black/8 bg-gray-50 px-3 py-2.5 text-xs text-gray-800 outline-none focus:border-yegna-500 dark:border-white/10 dark:bg-white/5 dark:text-white" />
                <button type="submit" disabled={!draft.trim() || sending} className="grid size-10 shrink-0 place-items-center rounded-xl bg-yegna-700 text-white transition hover:bg-yegna-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-yegna-600 dark:hover:bg-yegna-500" aria-label="Send message"><Send className="size-4" /></button>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-black/5 px-4 py-3.5 dark:border-white/8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Messages</h3>
                  <p className="mt-0.5 text-xs text-gray-400">{unreadCount} unread</p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => { setShowContacts(value => !value); setError(""); }} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-yegna-700 hover:bg-yegna-50 dark:text-yegna-300 dark:hover:bg-yegna-900/20"><Plus className="size-3.5" /> New</button>
                  <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-gray-400 hover:bg-black/5 dark:hover:bg-white/8" aria-label="Close messages"><X className="size-4" /></button>
                </div>
              </div>
              {showContacts ? (
                <>
                  <div className="relative border-b border-black/5 p-3 dark:border-white/8"><Search className="absolute left-6 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" /><input value={contactSearch} onChange={event => setContactSearch(event.target.value)} placeholder="Find a person..." className="h-9 w-full rounded-xl bg-gray-50 pl-9 pr-3 text-xs outline-none dark:bg-white/5 dark:text-white" /></div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredContacts.map(contact => <button key={contact.id} type="button" onClick={() => void startConversation(contact)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-black/[0.025] dark:hover:bg-white/[0.035]"><AvatarCircle name={contact.fullName} avatar={contact.avatar} /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-gray-800 dark:text-gray-100">{contact.fullName}</span><span className="text-[10px] text-gray-400">{contact.role}</span></span></button>)}
                    {filteredContacts.length === 0 && <p className="py-8 text-center text-xs text-gray-400">No contacts found.</p>}
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {conversations.map(conversation => <button key={conversation.id} type="button" onClick={() => selectConversation(conversation)} className="flex w-full items-center gap-3 border-b border-black/[0.035] px-4 py-3.5 text-left transition hover:bg-black/[0.025] dark:border-white/[0.04] dark:hover:bg-white/[0.035]"><AvatarCircle name={conversation.otherUserName} avatar={conversation.otherUserAvatar} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-gray-800 dark:text-gray-100">{conversation.otherUserName}</span><span className="shrink-0 text-[9px] text-gray-400">{conversation.lastMessageAt ? formatDate(conversation.lastMessageAt) : ""}</span></span><span className="mt-1 block truncate text-[10px] text-gray-500 dark:text-gray-400">{conversation.lastMessage || "No messages yet"}</span></span>{conversation.unreadCount > 0 && <span className="grid min-w-5 h-5 place-items-center rounded-full bg-yegna-600 px-1 text-[9px] font-bold text-white">{conversation.unreadCount}</span>}</button>)}
                  {conversations.length === 0 && <div className="px-6 py-12 text-center"><MessageSquare className="mx-auto size-8 text-gray-300 dark:text-gray-600" /><p className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">No messages yet</p><p className="mt-1 text-[10px] text-gray-400">Start a conversation with your Yegna Bet team.</p></div>}
                </div>
              )}
              {error && <p className="border-t border-red-100 px-4 py-2 text-[10px] text-red-500 dark:border-red-900/30">{error}</p>}
            </>
          )}
        </div>
      )}

      {toast && (!open || selected?.id !== toast.conversationId) && (
        <button type="button" onClick={() => { setOpen(true); setToast(null); const found = conversations.find(x => x.id === toast.conversationId); if (found) selectConversation(found); else void refreshConversations(); }} className="absolute right-0 top-[calc(100%+0.75rem)] z-[80] w-72 rounded-xl border border-black/8 bg-white p-3 text-left shadow-xl dark:border-white/10 dark:bg-[#17201b]"><p className="text-xs font-semibold text-gray-900 dark:text-white">New message from {toast.name}</p><p className="mt-1 line-clamp-2 text-[11px] text-gray-500 dark:text-gray-400">{toast.content}</p></button>
      )}
    </div>
  );
}

function AvatarCircle({ name, avatar }: { name: string; avatar?: string | null }) {
  if (avatar) return <img src={BASE_URL_STRING + avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />;
  return <span className="grid size-10 shrink-0 place-items-center rounded-full bg-yegna-100 text-xs font-bold text-yegna-800 dark:bg-yegna-900/40 dark:text-yegna-200">{name.trim().slice(0, 1).toUpperCase()}</span>;
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString() ? formatTime(value) : date.toLocaleDateString();
}