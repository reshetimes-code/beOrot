import Swal from "sweetalert2";

// עיצוב אחיד לכל החלונות הקופצים (RTL, כהה, כפתורים גדולים לנגיעה בטלפון).
const base = Swal.mixin({
  background: "#1a1610",
  color: "#f5efe6",
  confirmButtonColor: "#d9a256",
  cancelButtonColor: "#4a4339",
  confirmButtonText: "אישור",
  cancelButtonText: "ביטול",
  heightAuto: false,
  customClass: { popup: "admin-swal", confirmButton: "admin-swal-btn", cancelButton: "admin-swal-btn" },
});

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export const alertSuccess = (title: string, text?: string) =>
  base.fire({ icon: "success", title, text, timer: 2200, timerProgressBar: true, confirmButtonText: "סגירה" });

export const alertError = (title: string, text?: string) =>
  base.fire({ icon: "error", title, text });

export const alertWarning = (title: string, text?: string) =>
  base.fire({ icon: "warning", title, text });

/** רשימת בעיות: כל שורה מסבירה מה לתקן. */
export const alertList = (title: string, icon: "error" | "warning", items: string[]) =>
  base.fire({
    icon,
    title,
    html: `<ul class="admin-swal-list">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`,
  });

export async function confirmBox(title: string, text: string, confirmText: string): Promise<boolean> {
  const res = await base.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    reverseButtons: true,
  });
  return res.isConfirmed;
}

export const showLoading = (title: string) =>
  base.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });

export const closeAlert = () => Swal.close();
