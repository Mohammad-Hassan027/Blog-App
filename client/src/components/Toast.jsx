import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Wrapper component: triggers a SweetAlert2 toast when `show` becomes true.
export default function Toast({ message, show, onClose, type = "info" }) {
  useEffect(() => {
    if (!show || !message) return;

    const opts = {
      toast: true,
      position: "bottom-end",
      icon: type === "success" || type === "error" ? type : undefined,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background:
        type === "success"
          ? "#f59e0b"
          : type === "error"
          ? "#dc2626"
          : "#111827",
      color: type === "success" ? "#111827" : "#ffffff",
    };

    MySwal.fire(opts).then(() => {
      onClose && onClose();
    });

    // no cleanup needed: SweetAlert auto-dismisses
  }, [show, message, type, onClose]);

  return null;
}
