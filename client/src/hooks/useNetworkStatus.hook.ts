import { useEffect, useState } from "react";
import { toast, ToastOptions } from "react-toastify";

export default function useNetworkStatus(showToast: boolean = false) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const customToast = (
    type: "success" | "error" | "info" | "warning",
    message: string,
    options: ToastOptions = {}
  ) => {
    toast.dismiss();
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
    }
  };

  useEffect(() => {

    const handleOnline = () => {
      setIsOnline(true);
      if (showToast)
        customToast("success", "You're back online!", { autoClose: false });
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showToast)
        customToast("error", "You're offline!", { autoClose: false });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  return isOnline;
}
