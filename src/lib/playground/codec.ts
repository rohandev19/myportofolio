export function encodeCode(code: string): string {
  try {
    return btoa(encodeURIComponent(code));
  } catch (error) {
    console.error("Failed to encode code", error);
    return "";
  }
}

export function decodeCode(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch (error) {
    console.error("Failed to decode code", error);
    return "";
  }
}
