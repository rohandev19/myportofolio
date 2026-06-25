export function getSessionFingerprint(): string {
  if (typeof window === "undefined") return "server-side";

  let fingerprint = localStorage.getItem("session_fingerprint");

  if (!fingerprint) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    fingerprint = `sess_${timestamp}_${randomStr}`;
    localStorage.setItem("session_fingerprint", fingerprint);
  }

  return fingerprint;
}
