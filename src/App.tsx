import { useEffect } from "react";
import "./App.css";
import { useBroadcastWebSocket } from "./hooks/useBroadcastWebSocket";

const SERVER_URL = `https://marinm.net/broadcast?channel=presence`;

function App() {
  const ws = useBroadcastWebSocket({ valid: (message) => !!message });

  useEffect(() => {
    ws.open(SERVER_URL);
    ws.listen((event) => {
      if (event.name === "message") {
        console.log("event.message", event.message);
      }
    });
  }, [ws]);

  return <>{ws.readyState}</>;
}

export default App;
