import { useEffect } from "react";
import "./App.css";
import { useBroadcastWebSocket } from "./hooks/useBroadcastWebSocket";

const SERVER_URL = `https://marinm.net/broadcast?channel=presence`;

function App() {
  const ws = useBroadcastWebSocket<object, object>();

  useEffect(() => {
    ws.open(SERVER_URL);
    ws.onMessage((message) => console.log("message", message));
  }, [ws]);

  return <>{ws.readyState === WebSocket.OPEN ? "Connected" : ""}</>;
}

export default App;
