export interface ExecutionResult {
  output: string;
  error: string | null;
}

export async function executeJavaScript(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    try {
      // Capture console logs
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(
          args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
        );
      };

      // Safely evaluate code in an isolated scope using a new Function
      // Note: In a production app, use an iframe or Web Worker for true isolation.
      const run = new Function(code);
      const result = run();

      if (result !== undefined) {
        logs.push(String(result));
      }

      console.log = originalLog;

      resolve({
        output: logs.join("\n"),
        error: null,
      });
    } catch (error) {
      resolve({
        output: "",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
