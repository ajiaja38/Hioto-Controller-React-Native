import Toast from "react-native-toast-message";

interface useToastType {
  toastSuccess: (message: string) => void;
  toasError: (message: string) => void;
  toastInfo: (message: string) => void;
}

export const useToast = (): useToastType => {
  return {
    toastSuccess(message) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: message,
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    },
    toasError(message) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    },
    toastInfo(message) {
      Toast.show({
        type: "info",
        text1: "Info",
        text2: message,
        text2Style: { fontSize: 12, fontWeight: "bold" },
      });
    },
  };
};
