import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

export function toastSuccess(message, options) {
  toast.success(message, { ...defaultOptions, ...options });
}

export function toastError(message, options) {
  toast.error(message, { ...defaultOptions, ...options });
}

export function toastWarning(message, options) {
  toast.warning(message, { ...defaultOptions, ...options });
}

export function toastInfo(message, options) {
  toast.info(message, { ...defaultOptions, ...options });
}

/** Show API / axios error message when available */
export function toastApiError(err, fallback = "Something went wrong") {
  const message =
    err?.response?.data?.message ||
    err?.message ||
    (typeof err === "string" ? err : fallback);
  toastError(message);
}
