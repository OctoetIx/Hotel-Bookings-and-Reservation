import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function useRevenueRealtime(from: string, to: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/revenue/stream`
    );

    eventSource.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey: ["revenue", from, to],
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [from, to, queryClient]);
}
