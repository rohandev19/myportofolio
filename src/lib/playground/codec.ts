export function encodeCode(code: string): string {
  try {
    // btoa can produce '+', '/', and '=' which are problematic in URLs.
    // encodeURIComponent ensures the base64 string is URL safe.
    return encodeURIComponent(btoa(encodeURIComponent(code)));
  } catch (error) {
    console.error("Failed to encode code", error);
    return "";
  }
}

export function decodeCode(encoded: string): string {
  try {
    // URLSearchParams.get already decodes URI components, but we do it anyway to be safe
    // in case it was passed raw.
    return decodeURIComponent(atob(decodeURIComponent(encoded)));
  } catch (error) {
    console.error("Failed to decode code", error);
    return "";
  }
}
