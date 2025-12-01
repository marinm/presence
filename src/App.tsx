import { useEffect, useCallback, useState } from "react";
import "./App.css";
import { useBroadcastWebSocket } from "./hooks/useBroadcastWebSocket";
import { env } from "./env";

const SERVER_URL = `${env.VITE_SERVER_PATH}?channel=${env.VITE_CHANNEL}`;

type ServerMessage = {
  connectionId: string;
  from: "server";
  data: {
    present?: string[];
  };
};

function App() {
  const [myId, setMyId] = useState<string>("");
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const ws = useBroadcastWebSocket<object, ServerMessage>();

  const onMessage = useCallback((message: ServerMessage) => {
    setMyId(message.connectionId);
    if (message.from === "server") {
      if (message.data.present) {
        setPresentIds(message.data.present);
      }
    }
  }, []);

  useEffect(() => ws.onMessage(onMessage), [ws, onMessage]);

  useEffect(() => ws.open(SERVER_URL), [ws]);

  function onBubbleClick(id: string) {
    console.log(`${myId} clicked on ${id}`);
  }

  return (
    <>
      <div className="bubble-list">
        {presentIds.map((id) => (
          <div
            key={id}
            className={`bubble ${id === myId ? "self" : ""}`}
            onClick={() => onBubbleClick(id)}
          ></div>
        ))}
      </div>
    </>
  );
}

export default App;
