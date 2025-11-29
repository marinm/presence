import { useEffect, useCallback, useState } from "react";
import "./App.css";
import { useBroadcastWebSocket } from "./hooks/useBroadcastWebSocket";

const SERVER_URL = `https://marinm.net/broadcast?channel=presence`;

type ServerMessage = {
  from: "server";
  data: {
    connectionId: string;
  };
};

function App() {
  const [myId, setMyId] = useState<string>("");
  const ws = useBroadcastWebSocket<object, ServerMessage>();

  const onMessage = useCallback((message: ServerMessage) => {
    console.log("ServerMessage", message, message.data.connectionId);
    if (message.from === "server") {
      setMyId(message.data.connectionId);
    }
  }, []);

  useEffect(() => ws.onMessage(onMessage), [ws, onMessage]);

  useEffect(() => ws.open(SERVER_URL), [ws]);

  return (
    <>
      <div>{ws.readyState === WebSocket.OPEN ? "Connected" : ""}</div>
      {myId ? <div>as {myId}</div> : ""}
    </>
  );
}

export default App;
