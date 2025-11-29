import { useCallback, useEffect, useRef, useState } from "react";

// Some of the benefits of this WebSocket wrapper:
//   - null-safe: the wrapper is never null
//   - lazy: can create without connecting
//   - type-safe: send() enforces valid Message type
//   - validation: the message listener always receives a valid message
//   - order safety: each method checks current state before running

type EventListener = (() => void) | ((data: object) => void);

export type BroadcastWebSocket = {
  isOnline: boolean;
  readyState: null | number;
  error: boolean;
  open: (url: string) => void;
  send: (data: object) => void;
  close: () => void;
  listen: (callback: EventListener) => void;
};

type Options = {
  valid: (data: object) => boolean;
};

export function useBroadcastWebSocket(options: Options): BroadcastWebSocket {
  const websocketRef = useRef<null | WebSocket>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const [isOnline, setIsOnline] = useState<boolean>(window.navigator.onLine);
  const [error, setError] = useState<boolean>(false);
  const onMessageRef = useRef<EventListener>(() => {});

  function reasonError(method: string, reason: string) {
    console.log(`ignoring ${method}() because ${reason}`);
  }

  const open = useCallback(
    (url: string) => {
      console.log(options);

      if (websocketRef.current !== null) {
        reasonError("open", "already open");
        return;
      }
      websocketRef.current = new WebSocket(url);

      const websocket = websocketRef.current;

      websocket.onopen = () => {
        setReadyState(websocket.readyState);
        setError(false);
      };

      websocket.onmessage = (event) => {
        onMessageRef.current(event.data);
      };

      websocket.onclose = () => {
        setReadyState(websocket.readyState);
        websocketRef.current = null;
      };

      websocket.onerror = (err) => {
        console.error(err);
        setError(true);
      };
    },
    [options],
  );

  const send = useCallback((message: object) => {
    if (websocketRef.current === null) {
      if (websocketRef.current === null) {
        reasonError("send", "closed");
        return;
      }
      return;
    }

    if (websocketRef.current.readyState != WebSocket.OPEN) {
      return;
    }
    websocketRef.current.send(JSON.stringify(message));
  }, []);

  const close = useCallback(() => {
    if (websocketRef.current === null) {
      reasonError("close", "already closed");
      return;
    }

    if (
      websocketRef.current.readyState === WebSocket.CLOSING ||
      websocketRef.current.readyState === WebSocket.CLOSED
    ) {
      reasonError("close", "already closed");
      return;
    }

    if (websocketRef.current.readyState === WebSocket.CONNECTING) {
      reasonError("close", "connecting in progress");
      return;
    }

    if (websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.close();
      return;
    }

    reasonError("close", "uncaught readyState");
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      close();
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [close]);

  function listen(callback: EventListener) {
    onMessageRef.current = callback;
  }

  return {
    isOnline,
    readyState,
    error,
    open,
    send,
    close,
    listen,
  };
}
