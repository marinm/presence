import { useEffect, useCallback, useState } from "react";
import "./App.css";
import { useBroadcastWebSocket } from "./hooks/useBroadcastWebSocket";

const SERVER_URL = `http://localhost:3001/broadcast?channel=presence`;

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

  return (
    <>
      <div>{ws.readyState === WebSocket.OPEN ? "Connected as" : ""}</div>
      {myId ? <div>{myId}</div> : ""}
      <p>Present:</p>
      {presentIds.map((id) => (
        <div>{id}</div>
      ))}
    </>
  );
}

export default App;
