import Swal from "sweetalert2";

export const AlertInfo = Swal.mixin({
  title: "Info",
  icon: "info",
  confirmButtonText: "Ok",
});

export const AlertError = Swal.mixin({
  title: "Error",
  icon: "error",
  confirmButtonText: "Ok",
});

export const AlertSuccess = Swal.mixin({
  title: "Success",
  icon: "success",
  confirmButtonText: "Ok",
});

export const AlertWarning = Swal.mixin({
  title: "Warning",
  icon: "warning",
  confirmButtonText: "Ok",
});

export const ToastInfo = Swal.mixin({
  toast: true,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  icon: "info",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const ToastError = Swal.mixin({
  toast: true,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  icon: "error",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const ToastSuccess = Swal.mixin({
  toast: true,
  position: "top-right",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  icon: "success",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const ToastWarning = Swal.mixin({
  toast: true,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  icon: "warning",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const ConfirmWarning = Swal.mixin({
  title: "Confirmation",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes",
  cancelButtonText: "No",
});

export const RedConfirmWarning = Swal.mixin({
  title: "Are you Sure?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
});

export const ConfirmInfo = Swal.mixin({
  title: "Confirmation",
  icon: "info",
  showCancelButton: true,
  confirmButtonText: "Yes",
  cancelButtonText: "Cancel",
});
export const LoadingSSO = Swal.mixin({
  title: "Please wait...",
  html: "You will be redirected automatically...",
  onBeforeOpen: () => {
    Swal.showLoading();
  },
  allowOutsideClick: () => !Swal.isLoading(),
});

export const CloseAlert = () => Swal.close();
