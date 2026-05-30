# Chat Demo — Backend

Bun runtime · Bun native HTTP · Socket.io · In-memory storage

## Architecture

```
httpServer (node:http)
    └── Socket.io (path: /ws/chat)
            ├── init        ← user joins, loads history
            ├── message     ← send a message
            ├── latency_ping / latency_pong  ← RTT measurement
            └── disconnect  ← cleanup + wipe conversation when both leave
```

All state is held in three in-memory Maps:

| Map | Key | Value |
|-----|-----|-------|
| `users` | username | socket ID |
| `socketToUser` | socket ID | username |
| `conversations` | `"alice:bob"` (sorted) | `Message[]` |

When both users in a conversation disconnect, the messages are deleted automatically.

---

## Socket.io Integration Guide

### 1. Connect

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3005", { path: "/ws/chat" });
```

### 2. Identify yourself (`init`)

Emit immediately after connecting. The server sends back message history and notifies
your peer that you are online.

```js
socket.on("connect", () => {
  socket.emit("init", { sender: "alice", receiver: "bob" });
});
```

**Server response events after `init`:**

| Event | Payload | Meaning |
|-------|---------|---------|
| `previousMessages` | `Message[]` | Full history for this conversation |
| `online` | `true` | Your peer is currently connected |

### 3. Send a message

```js
socket.emit("message", {
  sender: "alice",
  receiver: "bob",
  text: "Hello!",
});
```

**Server emits back to both sender and receiver (if online):**

```ts
type Message = {
  id: string;       // unique ID
  sender: string;
  receiver: string;
  text: string;
  date: string;     // ISO 8601
};
```

| Event | Payload | Sent to |
|-------|---------|---------|
| `message` | `Message` | Sender |
| `message` | `Message` | Receiver (if connected) |

### 4. Peer status changes

| Event | Payload | Meaning |
|-------|---------|---------|
| `online` | `true` | Peer just connected |
| `online` | `false` | Peer disconnected |

### 5. Measure latency

```js
const t = performance.now();
socket.emit("latency_ping");
socket.once("latency_pong", () => {
  const rtt = Math.round(performance.now() - t);
  console.log(`Ping: ${rtt}ms`);
});
```

### 6. Disconnect

Socket.io handles cleanup automatically on `disconnect`. When **both** users in a
conversation have left, all messages for that conversation are wiped from memory.

---

## Running

```bash
# development (hot-reload)
bun run dev

# production
bun run start
```

Server listens on **port 3005**.

---

## Extending

- **Persistence** — swap the in-memory Maps for a database (Redis, SQLite, Postgres).
- **Rooms** — use socket.io rooms instead of direct socket ID lookup.
- **Auth** — validate a JWT on the `init` event before registering the user.
- **File uploads** — stream binary data via socket.io's `Buffer` support.
