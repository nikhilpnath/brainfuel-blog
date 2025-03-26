import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import axios, { AxiosRequestConfig } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { TAxiosError, TMutationSuccessData } from "../types/types";

type TMutationParams<V> = {
  url: string;
  method: "post" | "patch" | "delete";
  toastData?: string;
  options: UseMutationOptions<TMutationSuccessData, TAxiosError, V>;
};

//V for varibales - Generic
export default function useUseMutationHook<V>({
  url,
  method,
  toastData,
  options,
}: TMutationParams<V>) {
  const { getToken } = useAuth();

  return useMutation<TMutationSuccessData, TAxiosError, V>({
    ...options,

    mutationFn: async (variables) => {
      const token = await getToken();
      const config: AxiosRequestConfig = {
        method,
        url: `${import.meta.env.VITE_SERVER_URL}/api/${url}`,
        data: method !== "delete" ? variables : undefined,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios(config);

      return response.data;
    },

    // We pass these 3 parameters because `onSuccess` and `onError` expect them.
    onSuccess: (res, variables, context) => {
      options?.onSuccess?.(res, variables, context); // Call user-defined onSuccess if provided
      if (res?.message) toast.success(toastData ?? res.message);
    },

    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context); // Call user-defined onError if provided
      toast.error(error.response?.data.message);
    },
  });
}
