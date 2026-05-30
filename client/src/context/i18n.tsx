import { createContext, useContext, useState } from "react";

export type Lang = "ko" | "en" | "ru" | "uz";

export type Translations = {
  appName: string;
  appDesc: string;
  yourName: string;
  chattingWith: string;
  startChatting: string;
  howItWorks: string;
  viewOnGithub: string;
  visitSite: string;
  connected: string;
  disconnected: string;
  youLabel: string;
  peerLabel: string;
  online: string;
  offline: string;
  speedLabel: string;
  socketPing: string;
  renderTime: string;
  leave: string;
  noMessages: string;
  reconnecting: string;
  messagePH: string;
  peerLeftTitle: string;
  peerLeftDesc: string;
  waitForPeer: string;
  close: string;
  hiwTitle: string;
  hiwClientA: string;
  hiwServer: string;
  hiwClientB: string;
  hiwSteps: Array<{ label: string; desc: string }>;
};

const T: Record<Lang, Translations> = {
  ko: {
    appName: "소켓 채팅 데모",
    appDesc: "Socket.io + Bun · 실시간 데모",
    yourName: "내 이름",
    chattingWith: "상대방 이름...",
    startChatting: "채팅 시작하기 →",
    howItWorks: "작동 원리",
    viewOnGithub: "GitHub",
    visitSite: "glasscube.uz",
    connected: "연결됨",
    disconnected: "연결 끊김",
    youLabel: "나",
    peerLabel: "상대방",
    online: "온라인",
    offline: "오프라인",
    speedLabel: "속도",
    socketPing: "소켓 핑",
    renderTime: "렌더 시간",
    leave: "나가기",
    noMessages: "메시지가 없습니다. 인사해보세요!",
    reconnecting: "재연결 중...",
    messagePH: "{peer}에게 메시지...",
    peerLeftTitle: "상대방이 나갔습니다",
    peerLeftDesc: "상대방이 채팅을 떠났습니다. 계속 기다리시겠습니까?",
    waitForPeer: "기다리기",
    close: "닫기",
    hiwTitle: "작동 원리",
    hiwClientA: "클라이언트 A",
    hiwServer: "Bun 서버",
    hiwClientB: "클라이언트 B",
    hiwSteps: [
      {
        label: "연결 및 등록",
        desc: "클라이언트가 Socket.io로 연결하고 init 이벤트로 sender/receiver를 서버에 등록합니다.",
      },
      {
        label: "기록 로드",
        desc: "서버가 인메모리 Map에서 대화 기록을 가져와 previousMessages로 전송합니다.",
      },
      {
        label: "상대방 참여",
        desc: "상대방이 연결되면 서버가 양쪽에 online: true 이벤트를 전송합니다.",
      },
      {
        label: "실시간 메시지",
        desc: "메시지는 서버를 경유하여 sender와 receiver 양쪽으로 즉시 전달됩니다.",
      },
      {
        label: "자동 정리",
        desc: "두 사용자 모두 연결이 끊기면 대화 내용이 메모리에서 자동으로 삭제됩니다.",
      },
    ],
  },
  en: {
    appName: "Socket Chat Demo",
    appDesc: "Socket.io + Bun · Real-time demo",
    yourName: "Your name",
    chattingWith: "Chatting with...",
    startChatting: "Start Chatting →",
    howItWorks: "How it works",
    viewOnGithub: "GitHub",
    visitSite: "glasscube.uz",
    connected: "Connected",
    disconnected: "Disconnected",
    youLabel: "You",
    peerLabel: "Peer",
    online: "Online",
    offline: "Offline",
    speedLabel: "Speed",
    socketPing: "Socket ping",
    renderTime: "Render time",
    leave: "Leave",
    noMessages: "No messages yet. Say hi!",
    reconnecting: "Reconnecting...",
    messagePH: "Message {peer}...",
    peerLeftTitle: "Peer left the chat",
    peerLeftDesc:
      "Your chat partner has disconnected. Would you like to wait for them?",
    waitForPeer: "Wait for peer",
    close: "Close",
    hiwTitle: "How it works",
    hiwClientA: "Client A",
    hiwServer: "Bun Server",
    hiwClientB: "Client B",
    hiwSteps: [
      {
        label: "Connect & Register",
        desc: "Client connects via Socket.io and sends the init event with sender/receiver names to register on the server.",
      },
      {
        label: "Load History",
        desc: "Server fetches conversation history from in-memory Maps and sends previousMessages back to the client.",
      },
      {
        label: "Peer Joins",
        desc: "When the other user connects, server broadcasts online: true to both clients in real time.",
      },
      {
        label: "Real-time Messages",
        desc: "Messages are relayed through the server to both sender and receiver instantly via WebSocket.",
      },
      {
        label: "Auto Cleanup",
        desc: "When both users disconnect, all conversation messages are wiped from memory automatically.",
      },
    ],
  },
  ru: {
    appName: "Socket Чат Демо",
    appDesc: "Socket.io + Bun · Демо реального времени",
    yourName: "Ваше имя",
    chattingWith: "Имя собеседника...",
    startChatting: "Начать чат →",
    howItWorks: "Как это работает",
    viewOnGithub: "GitHub",
    visitSite: "glasscube.uz",
    connected: "Подключено",
    disconnected: "Отключено",
    youLabel: "Вы",
    peerLabel: "Собеседник",
    online: "Онлайн",
    offline: "Оффлайн",
    speedLabel: "Скорость",
    socketPing: "Пинг сокета",
    renderTime: "Время рендера",
    leave: "Выйти",
    noMessages: "Нет сообщений. Поздоровайтесь!",
    reconnecting: "Переподключение...",
    messagePH: "Сообщение для {peer}...",
    peerLeftTitle: "Собеседник вышел",
    peerLeftDesc:
      "Ваш собеседник отключился. Хотите подождать его возвращения?",
    waitForPeer: "Подождать",
    close: "Закрыть",
    hiwTitle: "Как это работает",
    hiwClientA: "Клиент A",
    hiwServer: "Bun Сервер",
    hiwClientB: "Клиент B",
    hiwSteps: [
      {
        label: "Подключение",
        desc: "Клиент подключается через Socket.io и регистрирует sender/receiver через событие init.",
      },
      {
        label: "Загрузка истории",
        desc: "Сервер извлекает историю из памяти и отправляет её через событие previousMessages.",
      },
      {
        label: "Собеседник входит",
        desc: "Когда второй пользователь подключается, сервер рассылает online: true обоим клиентам.",
      },
      {
        label: "Обмен сообщениями",
        desc: "Сообщения проходят через сервер и мгновенно доставляются обоим участникам через WebSocket.",
      },
      {
        label: "Автоочистка",
        desc: "Когда оба пользователя отключаются, все сообщения удаляются из памяти автоматически.",
      },
    ],
  },
  uz: {
    appName: "Socket Chat Demo",
    appDesc: "Socket.io + Bun · Real-time demo",
    yourName: "Ismingiz",
    chattingWith: "Suhbatdosh ismi...",
    startChatting: "Chatni boshlash →",
    howItWorks: "Qanday ishlaydi",
    viewOnGithub: "GitHub",
    visitSite: "glasscube.uz",
    connected: "Ulangan",
    disconnected: "Uzilgan",
    youLabel: "Siz",
    peerLabel: "Suhbatdosh",
    online: "Onlayn",
    offline: "Oflayn",
    speedLabel: "Tezlik",
    socketPing: "Socket ping",
    renderTime: "Render vaqti",
    leave: "Chiqish",
    noMessages: "Hali xabar yo'q. Salom deng!",
    reconnecting: "Qayta ulanmoqda...",
    messagePH: "{peer}ga xabar...",
    peerLeftTitle: "Suhbatdosh chiqib ketdi",
    peerLeftDesc: "Suhbatdoshingiz chatni tark etdi. Uni kutishni xohlaysizmi?",
    waitForPeer: "Kutish",
    close: "Yopish",
    hiwTitle: "Qanday ishlaydi",
    hiwClientA: "Mijoz A",
    hiwServer: "Bun Server",
    hiwClientB: "Mijoz B",
    hiwSteps: [
      {
        label: "Ulanish va ro'yxat",
        desc: "Mijoz Socket.io orqali ulanadi va init hodisasi bilan sender/receiver ni serverga ro'yxatdan o'tkazadi.",
      },
      {
        label: "Tarix yuklash",
        desc: "Server xotiradan suhbat tarixini o'qib previousMessages hodisasi orqali yuboradi.",
      },
      {
        label: "Suhbatdosh qo'shilishi",
        desc: "Ikkinchi foydalanuvchi ulanganda server ikkala mijozga online: true hodisasini yuboradi.",
      },
      {
        label: "Real-time xabarlar",
        desc: "Xabarlar server orqali ikki tomonga ham darhol WebSocket orqali yetkaziladi.",
      },
      {
        label: "Avtomatik tozalash",
        desc: "Ikkala foydalanuvchi ham uzilsa, barcha suhbat xabarlari xotiradan avtomatik o'chiriladi.",
      },
    ],
  },
};

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: Translations };
const I18nContext = createContext<I18nCtx | null>(null);
const LANG_KEY = "chat-lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const s = localStorage.getItem(LANG_KEY) as Lang | null;
    return s && s in T ? s : "ko";
  });

  const setLang = (l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}
