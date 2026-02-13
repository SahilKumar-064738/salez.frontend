import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Contact, Message } from "@shared/schema";
import { useMarkConversationRead, useMessages, useSendMessage } from "@/hooks/use-inbox";
import { useContacts } from "@/hooks/use-contacts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StageBadge, StagePill } from "@/components/StageBadge";
import { cn } from "@/lib/utils";

import {
  CheckCheck,
  CornerDownLeft,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

function fmtTime(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function preview(text?: string | null) {
  if (!text) return "—";
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > 64 ? t.slice(0, 64) + "…" : t;
}

function bubbleClass(direction: string) {
  const outbound = direction === "outbound";
  return outbound
    ? "ml-auto bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20"
    : "mr-auto bg-card border border-card-border text-foreground shadow-sm";
}

export default function InboxPage() {
  const { toast } = useToast();

  const [search, setSearch] = React.useState("");
  const debounced = useDebounced(search, 250);

  // For left list
  const convQ = useContacts({ search: debounced });

  // For contact lookup map
  const contactsQ = useContacts({ search: "" });

  // IMPORTANT:
  // activeId is the CONTACT ID (not conversation id)
  const [activeId, setActiveId] = React.useState<number | null>(null);

  const messagesQ = useMessages(activeId ?? undefined);
  const sendM = useSendMessage();
  const markReadM = useMarkConversationRead();

  const conversations = Array.isArray(convQ.data) ? convQ.data : [];

  const [draft, setDraft] = React.useState("");
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const contactsById = React.useMemo(() => {
    const map = new Map<number, Contact>();
    (contactsQ.data || []).forEach((c) => map.set((c as any).id, c as any));
    return map;
  }, [contactsQ.data]);

  // Active contact (by activeId)
  const activeContact = React.useMemo(() => {
    if (!activeId) return null;
    return contactsById.get(activeId) || null;
  }, [activeId, contactsById]);

  const messages = (messagesQ.data || []) as unknown as any[];

  React.useEffect(() => {
    if (!activeId && conversations.length) {
      setActiveId((conversations[0] as any).id);
    }
  }, [activeId, conversations]);

  React.useEffect(() => {
    // This is a stub right now, but safe
    if (!activeId) return;
    markReadM.mutate(activeId, {
      onError: (e: any) =>
        toast({
          title: "Couldn’t mark read",
          description: String(e.message || e),
          variant: "destructive",
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, sendM.isPending]);

  const onSend = async () => {
    if (!activeId) return;
    const body = draft.trim();
    if (!body) return;

    setDraft("");

    sendM.mutate(
      { conversationId: activeId, body },
      {
        onError: (e: any) => {
          toast({
            title: "Send failed",
            description: String(e.message || e),
            variant: "destructive",
          });
          setDraft(body);
        },
      },
    );
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4 fade-in" data-testid="page-inbox">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
        {/* Conversation list */}
        <Card className="surface-glass rounded-2xl overflow-hidden">
          <div className="sticky top-0 z-10 bg-card/65 backdrop-blur border-b border-card-border">
            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h1 className="text-lg">Inbox</h1>
                  <p className="text-xs text-muted-foreground">WhatsApp-like, zero clutter.</p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span data-testid="inbox-conversations-count">{conversations.length}</span>
                </div>
              </div>

              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="pl-9 rounded-xl bg-background/60 border-card-border focus-ring"
                  data-testid="inbox-search"
                />
              </div>
            </div>
          </div>

          <div className="p-2">
            {convQ.isLoading ? (
              <div className="p-4 text-sm text-muted-foreground" data-testid="inbox-loading">
                <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                Loading inbox…
              </div>
            ) : convQ.isError ? (
              <div className="p-4 text-sm text-destructive" data-testid="inbox-error">
                Failed to load. ({String((convQ.error as any)?.message || convQ.error)})
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground" data-testid="inbox-empty">
                No conversations yet.
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-220px)] lg:h-[calc(100vh-190px)]">
                <div className="space-y-1 pb-2">
                  {conversations.map((c: any) => {
                    const isActive = activeId === c.id;

                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className={cn(
                          "w-full text-left rounded-xl px-3 py-2.5 border transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary/14 to-accent/8 border-primary/20 shadow-sm"
                            : "bg-card/50 hover:bg-card/70 border-card-border hover:shadow-sm",
                        )}
                        data-testid={`conversation-item-${c.id}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="truncate font-semibold">{c.name ?? "Unnamed"}</div>
                              {c.stage ? <StageBadge stage={c.stage as any} /> : null}
                            </div>

                            <div className="mt-1 text-xs text-muted-foreground truncate">
                              {preview((c as any).lastMessagePreview || "")}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <div className="text-[11px] text-muted-foreground">
                              {fmtTime((c as any).lastMessageAt)}
                            </div>

                            <CheckCheck className="h-3.5 w-3.5 text-muted-foreground/60" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </Card>

        {/* Chat */}
        <Card className="surface-glass rounded-2xl overflow-hidden">
          {!activeId ? (
            <div className="grid place-items-center h-[70vh] text-center p-8" data-testid="chat-empty">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 ring-1 ring-border">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-xl">Select a conversation</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your chat will appear here with a smooth, WhatsApp-style layout.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-72px)]">
              {/* header */}
              <div className="sticky top-0 z-10 border-b border-card-border bg-card/60 backdrop-blur">
                <div className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate font-semibold" data-testid="chat-contact-name">
                        {activeContact?.name ?? "Unknown Contact"}
                      </div>
                      {activeContact?.stage ? <StagePill stage={activeContact.stage as any} /> : null}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground" data-testid="chat-contact-meta">
                      {activeContact?.phone ? `Phone: ${activeContact.phone}` : "—"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!activeContact?.id) return;
                        navigator.clipboard.writeText(activeContact.phone || "");
                        toast({ title: "Copied", description: "Phone number copied to clipboard." });
                      }}
                      className="rounded-xl"
                      data-testid="chat-copy-phone"
                    >
                      Copy phone
                    </Button>
                  </div>
                </div>
              </div>

              {/* messages */}
              <div className="flex-1 min-h-0">
                {messagesQ.isLoading ? (
                  <div className="p-6 text-sm text-muted-foreground" data-testid="chat-loading">
                    <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                    Loading messages…
                  </div>
                ) : messagesQ.isError ? (
                  <div className="p-6 text-sm text-destructive" data-testid="chat-error">
                    Failed to load messages. ({String((messagesQ.error as any)?.message || messagesQ.error)})
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div ref={listRef} className="px-4 py-6 space-y-3" data-testid="chat-messages">
                      <AnimatePresence initial={false}>
                        {messages.map((m: any) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className={cn(
                              "max-w-[88%] sm:max-w-[72%] rounded-2xl px-4 py-3",
                              bubbleClass(m.direction),
                            )}
                            data-testid={`message-${m.id}`}
                          >
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            <div
                              className={cn(
                                "mt-2 text-[11px] opacity-80",
                                m.direction === "outbound"
                                  ? "text-primary-foreground/80"
                                  : "text-muted-foreground",
                              )}
                            >
                              {fmtTime(m.createdAt)}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div className="h-2" />
                    </div>
                  </ScrollArea>
                )}
              </div>

              <Separator />

              {/* input */}
              <div className="sticky bottom-0 bg-card/70 backdrop-blur border-t border-card-border">
                <div className="p-3 sm:p-4 flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Write a message…"
                      className="w-full min-h-[46px] max-h-[140px] resize-none rounded-2xl border border-card-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-ring/15 focus:border-ring transition-all duration-200"
                      data-testid="chat-input"
                    />
                    <div className="mt-1.5 text-[11px] text-muted-foreground">
                      Enter to send • Shift+Enter for newline
                    </div>
                  </div>

                  <Button
                    onClick={onSend}
                    disabled={sendM.isPending || !draft.trim()}
                    className="rounded-2xl px-5 py-6 shadow-md shadow-primary/20 bg-gradient-to-br from-primary to-primary/85 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    data-testid="chat-send"
                  >
                    {sendM.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CornerDownLeft className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                <div className="px-4 pb-3 text-[11px] text-muted-foreground">
                  Data source: <span className="font-mono">/api/messages</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
