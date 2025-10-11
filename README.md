# 💬 Messenger — Full-Stack Real-Time Chat App

> A fast and clean real-time messenger built with **Bun**, **Express + Socket.io**, **MongoDB + Memcached**, and a **Vite + React + ShadCN** frontend.

---

## 🚀 Quick Start

### 1️⃣ Clone & Setup
Make sure you’ve got **Bun**, **MongoDB**, and **Memcached** running locally.

```bash
# clone your project
git clone <https://github.com/nodiry/chat-demo.git > 
cd chat-demo
````
Project structure:

```
messenger/
  ├── server/   # Express + Socket.io backend
  └── client/   # React (Vite) frontend with ShadCN UI
```

---

### 2️⃣ Run Everything at Once

Inside the root directory (where this README is), you’ll find a script called **`run.sh`**.
It installs dependencies for both client and server, and runs them together.

```bash
chmod +x run.sh   # make it executable
./run.sh          # launch both backend and frontend
```

This script will:

* 🔧 `bun install` dependencies in both `/server` and `/client`
* ⚙️ start both with `bun run dev`
* 🧩 keep both processes alive and show their logs

---

## 🌐 Access the App

Once both are running:

👉 **Frontend:** [http://localhost:5173](http://localhost:5173)
👉 **Backend (Socket.io + API):** [http://localhost:3005](http://localhost:3005)

---

## 🧠 How to Use

1. Open **[http://localhost:5173](http://localhost:5173)** in your browser.
2. Enter your **username** and your **receiver’s name**.
3. Open another browser tab or different account and swap the names.
4. You’ll be greeted with the chat interface — messages will sync in real time! ⚡
5. Notifications will appear regardless of the page you’re on, thanks to the global notification context wrapper. 🧩

---

## ⚙️ Tech Stack

| Layer       | Tech                         | Description                                              |
| ----------- | ---------------------------- | -------------------------------------------------------- |
| 🧠 Backend  | **Express + Socket.io**      | Real-time communication and API server                   |
| 💾 Database | **MongoDB**                  | Message and user data storage                            |
| ⚡ Cache     | **Memcached**                | Fast caching layer for user sessions or frequent lookups |
| 🧩 Frontend | **Vite + React + ShadCN/UI** | Fast modern frontend with clean components               |
| 🚀 Runtime  | **Bun**                      | Super-fast JS runtime replacing Node.js                  |
| 🖥️ Host    | Your own VPS (Ubuntu/Debian) | Self-maintained for full control                         |

---

## 🧰 Default Config

| Component       | Host      | Port                |
| --------------- | --------- | ------------------- |
| Server          | localhost | **3005**            |
| MongoDB         | localhost | **27017** (default) |
| Memcached       | localhost | **11211**           |
| Frontend (Vite) | localhost | **5173**            |

---

## 🧹 Common Commands

| Action                | Command                          |
| --------------------- | -------------------------------- |
| Install deps manually | `bun install` inside each folder |
| Run backend only      | `cd server && bun run dev`       |
| Run frontend only     | `cd client && bun run dev`       |
| Stop all              | `CTRL + C`                       |

---

## 🧩 File Tree Overview

```
messenger/
│
├── server/
│   ├── src/
│   │   ├── index.ts          # Express + Socket.io entry
│   │   ├── db/               # Mongo connection + Memcached logic
│   │   ├── routes/           # API endpoints
│   │   └── utils/            # Helpers, validation, etc.
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── App.tsx           # Wrapped in Notification Context
│   │   ├── components/       # ShadCN UI parts
│   │   └── pages/            # Chat UI & forms
│   └── package.json
│
└── run.sh                    # Runs everything automatically
```

---

## 🧨 Troubleshooting

| Problem               | Fix                                                                      |       |
| --------------------- | ------------------------------------------------------------------------ | ----- |
| Mongo not connecting  | Make sure MongoDB is running: `sudo systemctl start mongod`              |       |
| Memcached not running | `sudo systemctl start memcached`                                         |       |
| Port already in use   | Kill the process using it: `sudo lsof -i :3005` then `kill -9 <pid>`     |       |
| Bun not found         | Install it: `curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash` |

---

## 🧑‍💻 Contribute or Extend

You can easily extend this:

* Add file uploads through Socket.io streams
* Integrate message history pagination
* Implement authentication with JWT or sessions
* Add online/offline status indicators

---

## 🎉 Done!

Once everything’s running, open multiple browsers and start chatting!
Enjoy your fast, lightweight, **real-time Bun-powered messenger** 🧡

---

> ⚡ *“Fast servers, clean UI, zero nonsense — just chat.”*

```

---

