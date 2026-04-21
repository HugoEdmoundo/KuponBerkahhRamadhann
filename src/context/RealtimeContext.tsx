import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createWebSocket } from "@/lib/api";

interface RealtimeContextValue {
  lastMessage: unknown;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  lastMessage: null,
  isConnected: false,
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<{ close: () => void } | null>(null);

  useEffect(() => {
    wsRef.current = createWebSocket((data) => {
      setIsConnected(true);
      setLastMessage(data);
    });

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ lastMessage, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
