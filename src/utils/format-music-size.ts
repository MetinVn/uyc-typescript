export function formatSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes <= 0 || isNaN(bytes)) return "0 Bytes";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizeIndex = Math.min(i, sizes.length - 1);
  const value = bytes / Math.pow(1024, sizeIndex);

  return `${value.toFixed(2)} ${sizes[sizeIndex]}`;
}
