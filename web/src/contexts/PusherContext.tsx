"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Pusher from "pusher-js";
import { getPusherInstance, disconnectPusher } from "@/lib/pusher";
import { useUser } from "@clerk/nextjs";

interface PusherContextType {
  pusher: Pusher | null;
  isConnected: boolean;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export function PusherProvider({ children }: { children: ReactNode }) {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    // Only initialize Pusher if user is authenticated
    if (!user?.id) {
      if (pusher) {
        disconnectPusher();
        setPusher(null);
        setIsConnected(false);
      }
      return;
    }

    // Get access token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.warn("No access token found for Pusher authentication");
      return;
    }

    // Initialize Pusher with bearer token
    const pusherInstance = getPusherInstance(token);
    setPusher(pusherInstance);

    // Set up connection state listeners
    pusherInstance.connection.bind("connected", () => {
      console.log("Pusher connected");
      setIsConnected(true);
    });

    pusherInstance.connection.bind("disconnected", () => {
      console.log("Pusher disconnected");
      setIsConnected(false);
    });

    pusherInstance.connection.bind("error", (error: any) => {
      console.error("Pusher connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      disconnectPusher();
      setIsConnected(false);
    };
  }, [user?.id]);

  const value: PusherContextType = {
    pusher,
    isConnected,
  };

  return (
    <PusherContext.Provider value={value}>{children}</PusherContext.Provider>
  );
}

export function usePusher() {
  const context = useContext(PusherContext);
  if (context === undefined) {
    throw new Error("usePusher must be used within a PusherProvider");
  }
  return context;
}
