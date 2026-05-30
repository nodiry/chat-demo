import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { HowItWorks } from "@/components/HowItWorks";
import { I18nProvider, useI18n, type Lang } from "@/context/i18n";
import { SocketProvider, useSocketContext } from "@/context/socket";
import {
  Circle,
  ExternalLink,
  GitBranch,
  Info,
  LogOut,
  MessageCircleMore,
  Send,
  Timer,
  User,
  UserX,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Language selector (shared) ───────────────────────────────────────────────

const LANGS: Array<{ code: Lang; label: string }> = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "EN" },
  { code: "ru", label: "РУС" },
  { code: "uz", label: "UZ" },
];

function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex gap-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={cn(
            "rounded-full border text-[10px] font-semibold transition-all leading-none",
            compact ? "px-1.5 py-0.5" : "px-2 py-1",
            lang === code
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

type View = "login" | "chat";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="chat-theme">
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [view, setView] = useState<View>(() =>
    localStorage.getItem("name") && localStorage.getItem("peer") ? "chat" : "login"
  );

  const handleLogin = (name: string, peer: string) => {
    localStorage.setItem("name", name.trim());
    localStorage.setItem("peer", peer.trim());
    setView("chat");
  };

  const handleLeave = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("peer");
    setView("login");
  };

  return (
    <AnimatePresence mode="wait">
      {view === "login" ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoginView onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          className="h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SocketProvider>
            <ChatView onLeave={handleLeave} />
          </SocketProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────

function LoginView({ onLogin }: { onLogin: (name: string, peer: string) => void }) {
  const [name, setName] = useState("");
  const [peer, setPeer] = useState("");
  const [showHIW, setShowHIW] = useState(false);
  const { t } = useI18n();

  const submit = () => {
    if (name.trim() && peer.trim()) onLogin(name, peer);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 gap-4">
        {/* Language + Theme row */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ModeToggle />
        </div>

        <Card className="w-full max-w-sm shadow-2xl">
          <CardHeader className="flex flex-col items-center text-center gap-2 pb-2">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Chat Demo"
              className="h-11 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <CardTitle className="text-xl">{t.appName}</CardTitle>
            <CardDescription className="text-xs">{t.appDesc}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-2">
            <Input
              placeholder={t.yourName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
            />
            <Input
              placeholder={t.chattingWith}
              value={peer}
              onChange={(e) => setPeer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <Button
              className="w-full"
              onClick={submit}
              disabled={!name.trim() || !peer.trim()}
            >
              {t.startChatting}
            </Button>

            {/* How it works + links row */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setShowHIW(true)}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="w-3 h-3" />
                {t.howItWorks}
              </button>
              <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                <a
                  href="https://github.com/glasscubeio/chat-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <GitBranch className="w-3 h-3" />
                  {t.viewOnGithub}
                </a>
                <span className="opacity-30">·</span>
                <a
                  href="https://glasscube.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.visitSite}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it works modal */}
      <AnimatePresence>
        {showHIW && <HowItWorks onClose={() => setShowHIW(false)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Peer-left modal ──────────────────────────────────────────────────────────

function PeerLeftModal({
  onWait,
  onLeave,
}: {
  onWait: () => void;
  onLeave: () => void;
}) {
  const { t } = useI18n();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[6px]" onClick={onWait} />
      <motion.div
        className="relative z-10 w-full max-w-xs overflow-hidden rounded-2xl border border-white/20 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
      >
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="p-3 rounded-full bg-destructive/10">
            <UserX className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.peerLeftTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{t.peerLeftDesc}</p>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1 h-8 text-xs" onClick={onWait}>
              {t.waitForPeer}
            </Button>
            <Button variant="destructive" className="flex-1 h-8 text-xs" onClick={onLeave}>
              {t.leave}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Chat ──────────────────────────────────────────────────────────────────

function ChatView({ onLeave }: { onLeave: () => void }) {
  const {
    connected,
    peerOnline,
    peerJustLeft,
    acknowledgePeerLeft,
    messages,
    ping,
    renderTime,
    sendMessage,
  } = useSocketContext();
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [showHIW, setShowHIW] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const name = localStorage.getItem("name") ?? "";
  const peer = localStorage.getItem("peer") ?? "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const pingColor =
    ping === null ? "text-muted-foreground"
      : ping < 50 ? "text-green-500"
      : ping < 150 ? "text-yellow-500"
      : "text-red-500";

  const renderColor =
    renderTime === null ? "text-muted-foreground"
      : renderTime < 16 ? "text-green-500"
      : renderTime < 50 ? "text-yellow-500"
      : "text-red-500";

  return (
    <>
      <div className="flex h-screen">
        {/* ── Sidebar ── */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Chat Demo"
                className="h-5 object-contain"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = "w-5 h-5";
                  el.parentNode?.insertBefore(fallback, el);
                }}
              />
              <span className="font-semibold text-sm">Chat Demo</span>
              <div
                className={cn(
                  "ml-auto w-2 h-2 rounded-full transition-colors",
                  connected ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>
            <p className="text-xs text-sidebar-foreground/60">
              {connected ? t.connected : t.disconnected}
            </p>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{t.youLabel}</SidebarGroupLabel>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <User className="w-4 h-4 text-sidebar-foreground/60" />
                <span className="text-sm font-medium truncate">{name}</span>
              </div>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>{t.peerLabel}</SidebarGroupLabel>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <User className="w-4 h-4 text-sidebar-foreground/60" />
                <span className="text-sm font-medium truncate">{peer}</span>
                <Circle
                  className={cn(
                    "ml-auto w-2 h-2 shrink-0 fill-current transition-colors",
                    peerOnline ? "text-green-500" : "text-muted-foreground/40"
                  )}
                />
              </div>
              <p className="px-2 text-xs text-sidebar-foreground/50">
                {peerOnline ? t.online : t.offline}
              </p>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>{t.speedLabel}</SidebarGroupLabel>
              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/60">
                    <Wifi className="w-3.5 h-3.5" />
                    {t.socketPing}
                  </div>
                  <span className={cn("text-xs font-mono font-semibold tabular-nums", pingColor)}>
                    {ping !== null ? `${ping}ms` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/60">
                    <Timer className="w-3.5 h-3.5" />
                    {t.renderTime}
                  </div>
                  <span className={cn("text-xs font-mono font-semibold tabular-nums", renderColor)}>
                    {renderTime !== null ? `${renderTime}ms` : "—"}
                  </span>
                </div>
              </div>
            </SidebarGroup>

            <SidebarSeparator />

            {/* How it works button */}
            <SidebarGroup>
              <button
                onClick={() => setShowHIW(true)}
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-md hover:bg-sidebar-accent transition-colors w-full"
              >
                <Info className="w-3.5 h-3.5" />
                {t.howItWorks}
              </button>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="flex items-center justify-between mb-1">
              <LanguageSelector compact />
              <ModeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-sidebar-foreground/40">
                <a
                  href="https://github.com/glasscubeio/chat-demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sidebar-foreground/70 flex items-center gap-0.5 transition-colors"
                >
                  <GitBranch className="w-3 h-3" />
                  Source
                </a>
                <span>·</span>
                <a
                  href="https://glasscube.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sidebar-foreground/70 transition-colors"
                >
                  glasscube.uz
                </a>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLeave}
                className="gap-1.5 h-7 text-xs text-muted-foreground hover:text-destructive px-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.leave}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* ── Chat Area ── */}
        <div className="flex flex-1 flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b bg-background/95 backdrop-blur-sm shrink-0">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-sm leading-none">{peer}</p>
              <p
                className={cn(
                  "text-xs mt-0.5 transition-colors",
                  peerOnline ? "text-green-500" : "text-muted-foreground"
                )}
              >
                {peerOnline ? t.online : t.offline}
              </p>
            </div>
            {!connected && (
              <div className="ml-auto flex items-center gap-1.5 text-xs text-destructive">
                <WifiOff className="w-3.5 h-3.5" />
                {t.reconnecting}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground select-none">
                <MessageCircleMore className="w-10 h-10 opacity-20" />
                <p className="text-sm">{t.noMessages}</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender === name;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-0.5 max-w-[70%]",
                    isMe ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-3 py-2 rounded-2xl text-sm leading-relaxed break-words",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {formatTime(msg.date)}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 px-6 py-4 border-t bg-background shrink-0">
            <Input
              placeholder={t.messagePH.replace("{peer}", peer)}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!connected}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!connected || !text.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Peer-left modal */}
      <AnimatePresence>
        {peerJustLeft && (
          <PeerLeftModal
            key="peer-left"
            onWait={acknowledgePeerLeft}
            onLeave={onLeave}
          />
        )}
      </AnimatePresence>

      {/* How it works modal */}
      <AnimatePresence>
        {showHIW && <HowItWorks key="hiw" onClose={() => setShowHIW(false)} />}
      </AnimatePresence>
    </>
  );
}
