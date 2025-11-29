import { useEffect } from "react";
import "./App.css";
import { useBroadcastWebSocket } from "./hooks/useBroadcastWebSocket";

const SERVER_URL = `https://marinm.net/broadcast?channel=presence`;

function App() {
  const ws = useBroadcastWebSocket({ valid: (message) => !!message });

  useEffect(() => {
    ws.open(SERVER_URL);
  }, [ws]);

  return <>{ws.isOnline ? "Online" : "Offline"}</>;
}

export default App;
