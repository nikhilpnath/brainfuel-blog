import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

type TFetchData = {
  queryKey: (string | undefined)[];
  url: string;
  enabled?: boolean;
  retry?: boolean;
  tokenRequired?: boolean;
  stale?: number | "infinity";
};

export default function useUseQueryHook<T>({
  queryKey,
  url,
  enabled = true,
  retry = true,
  tokenRequired = false,
  stale = 0,
}: TFetchData) {
  const { getToken } = useAuth();

  const fetchData = async () => {
    let headers = {};

    if (tokenRequired) {
      const token = await getToken();
      headers = { Authorization: `Bearer ${token}` };
    }
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/${url}`,
      {
        headers,
      }
    );
    return res.data;
  };

  return useQuery<T>({
    queryKey,
    queryFn: fetchData,
    enabled,
    retry,
    staleTime: stale === "infinity" ? Infinity : stale,
  });
}
