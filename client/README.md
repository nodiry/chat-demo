# Chat Demo — Frontend

React 19 · Vite · TypeScript · Tailwind CSS v4 · shadcn/ui

Single-page app (no routing). Two views: **Login** and **Chat**.

---

## App Structure

```
src/
├── App.tsx              # Root — manages login/chat views + ThemeProvider
├── main.tsx             # React entry, StrictMode only
├── index.css            # Tailwind v4 + shadcn CSS variables (sidebar, card, etc.)
├── context/
│   └── socket.tsx       # SocketProvider + useSocketContext hook
├── components/
│   ├── theme-provider.tsx
│   ├── mode-toggle.tsx
│   └── ui/
│       ├── sidebar.tsx  # shadcn-style sidebar primitives
│       ├── button.tsx
│       ├── input.tsx
│       └── card.tsx
└── lib/
    └── utils.ts         # cn() helper
```

---

## Views

### Login

A centered card — enter your name and your peer's name, press **Start Chatting**.
Names are persisted to `localStorage`. On page refresh you land back in the chat view.

### Chat

Sidebar + main chat area layout.

#### Sidebar

| Section | Content |
|---------|---------|
| **Header** | App name + live connection dot (green = connected) |
| **You** | Your username |
| **Peer** | Peer's name + live online indicator |
| **Speed** | Socket ping (ms) + render time (ms) |
| **Footer** | Theme toggle + Leave button |

**Speed indicators are color-coded:**
- Green — excellent (ping < 50 ms, render < 16 ms)
- Yellow — acceptable (ping < 150 ms, render < 50 ms)
- Red — slow

#### Chat area

- **Header** — peer name and online/offline status
- **Messages** — right-aligned bubbles for your messages, left-aligned for received
- **Input** — disabled while disconnected; Enter key or Send button submits

---

## Socket Context (`useSocketContext`)

```ts
const {
  connected,    // boolean — socket connection state
  peerOnline,   // boolean — peer currently connected
  messages,     // Message[] — full conversation history
  ping,         // number | null — socket RTT in ms (updated every 5 s)
  renderTime,   // number | null — last message render time in ms
  sendMessage,  // (text: string) => void
} = useSocketContext();
```

### How ping is measured

```
client                  server
  |-- latency_ping -->    |
  |<-- latency_pong ---   |
RTT = performance.now() difference
```

Fires on connect and repeats every **5 seconds**.

### How render time is measured

A `useLayoutEffect` in the provider runs after every `messages` state change.
When a new message arrives the socket handler records `performance.now()` into a ref
before calling `setMessages`. The layout effect calculates the delta after React has
committed the DOM update — this is the true end-to-end render time from socket event
to painted UI.

---

## Sidebar Components (`ui/sidebar.tsx`)

Built on shadcn's sidebar CSS variables (already in `index.css`).

```tsx
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
```

Usage:

```tsx
<Sidebar>
  <SidebarHeader>…</SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Section</SidebarGroupLabel>
      {/* items */}
    </SidebarGroup>
    <SidebarSeparator />
  </SidebarContent>
  <SidebarFooter>…</SidebarFooter>
</Sidebar>
```

All components accept standard HTML `div`/`aside` props and a `className` override.

---

## Theme

Provided by `ThemeProvider` (wraps the whole app). Toggle with `ModeToggle`, which
switches between `light` and `dark` without a page reload. Preference is stored in
`localStorage` under the key `chat-theme`.

---

## Running

```bash
bun run dev       # Vite dev server → http://localhost:5173
bun run build     # TypeScript check + production build
bun run preview   # Preview the production build
```
