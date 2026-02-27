export const getColorHex = (colorName?: string) => {
  if (!colorName) return "#e5e7eb";
  const color = colorName.toLowerCase().trim();
  const colors: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    blue: "#1e3a8a",
    red: "#dc2626",
    green: "#065f46",
    gray: "#6b7280",
    yellow: "#facc15",
  };
  return colors[color] || colorName;
};
