"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "./api";

const SOCKET_URL = (() => {
  if (typeof window === "undefined") return "http://localhost:5000";
  return window.location.origin;
})();

let socket: Socket | null = null;

export function useSocket(onPaymentSuccess?: (data: { campaignId: string; status: string }) => void) {
  const callbackRef = useRef(onPaymentSuccess);
  callbackRef.current = onPaymentSuccess;

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        console.log("[Socket] Connected");
      });

      socket.on("disconnect", () => {
        console.log("[Socket] Disconnected");
      });
    }

    const handlePayment = (data: { campaignId: string; status: string }) => {
      console.log("[Socket] Payment success:", data);
      callbackRef.current?.(data);
    };

    socket.on("payment-success", handlePayment);

    return () => {
      socket?.off("payment-success", handlePayment);
    };
  }, []);

  return socket;
}
