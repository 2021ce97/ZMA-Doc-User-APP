export const triggerHaptic = (
  type: "light" | "medium" | "success" | "error" = "light",
) => {
  if (!navigator.vibrate) return;

  switch (type) {
    case "light":
      navigator.vibrate(50);
      break;
    case "medium":
      navigator.vibrate(100);
      break;
    case "success":
      navigator.vibrate([50, 50, 50]);
      break;
    case "error":
      navigator.vibrate([50, 100, 50, 100]);
      break;
  }
};
