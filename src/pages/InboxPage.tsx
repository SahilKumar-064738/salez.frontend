import * as React from "react";
import { useConversations, useMessages, useSendMessage, useMarkConversationRead } from "@/hooks/use-inbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Phone,
  MoreVertical,
  Smile,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InboxItem } from "@/services/messagesService";

// ── Helpers ──────────────────────────────────────────────────────────────────

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

function fmtTime(d: string | null | undefined) {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

function avatarColor(name: string) {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500",
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sz =
    size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-11 w-11 text-sm" : "h-10 w-10 text-xs";
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white shrink-0",
        sz,
        avatarColor(name)
      )}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Conversation List Panel ───────────────────────────────────────────────────

interface ConversationListProps {
  conversations: InboxItem[];
  isLoading: boolean;
  activeId: number | null;
  search: string;
  onSearch: (v: string) => void;
  onSelect: (id: number) => void;
}

function ConversationList({
  conversations,
  isLoading,
  activeId,
  search,
  onSearch,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="font-bold text-base mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 h-8 text-sm rounded-lg"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect WhatsApp to see real messages.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {conversations.map((conv) => {
              const active = conv.contactId === activeId;
              return (
                <button
                  key={conv.contactId}
                  onClick={() => onSelect(conv.contactId)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
                    active ? "bg-primary/8 dark:bg-primary/15" : "hover:bg-muted/50"
                  )}
                >
                  <Avatar name={conv.contactName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm truncate",
                          conv.unreadCount > 0 ? "font-bold" : "font-semibold"
                        )}
                      >
                        {conv.contactName}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                        {fmtTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p
                        className={cn(
                          "text-xs truncate max-w-[170px]",
                          conv.unreadCount > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {conv.lastDirection === "outbound" && (
                          <span className="text-muted-foreground">You: </span>
                        )}
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="h-4 min-w-4 px-1 text-[10px] rounded-full bg-primary text-primary-foreground ml-2 shrink-0">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ── Chat Window Panel ─────────────────────────────────────────────────────────

interface ChatWindowProps {
  activeConv: InboxItem;
  messages: any[];
  messagesLoading: boolean;
  draft: string;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
}

function ChatWindow({
  activeConv,
  messages,
  messagesLoading,
  draft,
  isSending,
  messagesEndRef,
  onDraftChange,
  onSend,
  onBack,
}: ChatWindowProps) {
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {/* Back arrow — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 shrink-0 -ml-1"
            onClick={onBack}
            aria-label="Back to contacts"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar name={activeConv.contactName} size="lg" />
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">{activeConv.contactName}</div>
            <div className="text-xs text-muted-foreground">{activeConv.contactPhone}</div>
          </div>
          {activeConv.contactStage && (
            <Badge variant="outline" className="text-[10px] capitalize shrink-0">
              {activeConv.contactStage}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messagesLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...messages].reverse().map((msg: any, idx: number) => {
              const isOut = msg.direction === "outbound";
              return (
                <div
                  key={msg.id ?? idx}
                  className={cn("flex", isOut ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] sm:max-w-[68%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      isOut
                        ? "bg-green-600 text-white rounded-br-md"
                        : "bg-card border border-border text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={cn(
                        "flex items-center gap-1 mt-1 text-[10px]",
                        isOut ? "justify-end text-white/70" : "text-muted-foreground"
                      )}
                    >
                      <span>{fmtTime(msg.sentAt)}</span>
                      {isOut &&
                        (msg.status === "read" ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <div className="flex items-end gap-2 bg-muted/50 rounded-2xl px-3 py-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm outline-none py-1 max-h-32 placeholder:text-muted-foreground"
            style={{ fieldSizing: "content" } as any}
          />
          <Button
            size="icon"
            className="h-8 w-8 rounded-full shrink-0 bg-green-600 hover:bg-green-700"
            onClick={onSend}
            disabled={!draft.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounced(search);

  const [activeId, setActiveId] = React.useState<number | null>(null);
  // Mobile: "list" shows contacts panel, "chat" shows message panel
  const [mobileView, setMobileView] = React.useState<"list" | "chat">("list");

  const [draft, setDraft] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const convQ = useConversations(debouncedSearch);
  const messagesQ = useMessages(activeId ?? undefined);
  const sendM = useSendMessage();
  const markReadM = useMarkConversationRead();

  const conversations: InboxItem[] = (convQ.data || []) as unknown as InboxItem[];
  const messages = (messagesQ.data || []) as any[];
  const activeConv = conversations.find((c) => c.contactId === activeId);

  // Auto-select first conversation on desktop
  React.useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].contactId);
    }
  }, [conversations.length]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Mark as read on switch
  React.useEffect(() => {
    if (!activeId) return;
    markReadM.mutate(activeId, { onError: () => {} });
  }, [activeId]);

  const handleSelect = (id: number) => {
    setActiveId(id);
    setMobileView("chat"); // switch to chat panel on mobile
  };

  const handleBack = () => {
    setMobileView("list"); // return to contacts list on mobile
  };

  const onSend = async () => {
    if (!activeId || !draft.trim()) return;
    const body = draft.trim();
    setDraft("");
    sendM.mutate(
      { contactId: activeId, body },
      {
        onError: (e: any) => {
          toast({
            title: "Send failed",
            description: String(e.message || e),
            variant: "destructive",
          });
          setDraft(body);
        },
      }
    );
  };

  return (
    <div className="h-[calc(100dvh-56px)] flex flex-col overflow-hidden" data-testid="page-inbox">
      <div className="flex flex-1 overflow-hidden">

        {/*
          ── LEFT PANEL: Contacts / Conversations ──
          Desktop (md+): always visible, fixed 320px width
          Mobile (<md): full width, shown only when mobileView === "list"
        */}
        <div
          className={cn(
            "flex-col border-r border-border bg-card",
            // Desktop: always show
            "md:flex md:w-[320px] md:shrink-0",
            // Mobile: full width, toggle visibility
            mobileView === "list" ? "flex w-full" : "hidden"
          )}
        >
          <ConversationList
            conversations={conversations}
            isLoading={convQ.isLoading}
            activeId={activeId}
            search={search}
            onSearch={setSearch}
            onSelect={handleSelect}
          />
        </div>

        {/*
          ── RIGHT PANEL: Chat Window ──
          Desktop (md+): always visible, fills remaining space
          Mobile (<md): full width, shown only when mobileView === "chat"
        */}
        <div
          className={cn(
            "flex-col bg-muted/20 min-w-0",
            // Desktop: always show
            "md:flex md:flex-1",
            // Mobile: full width, toggle visibility
            mobileView === "chat" ? "flex w-full" : "hidden"
          )}
        >
          {activeConv ? (
            <ChatWindow
              activeConv={activeConv}
              messages={messages}
              messagesLoading={messagesQ.isLoading}
              draft={draft}
              isSending={sendM.isPending}
              messagesEndRef={messagesEndRef}
              onDraftChange={setDraft}
              onSend={onSend}
              onBack={handleBack}
            />
          ) : (
            <div className="relative flex flex-col items-center justify-center flex-1 gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="h-9 w-9 text-muted-foreground/40" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-muted-foreground">Select a conversation</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Choose from your contacts on the left
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
