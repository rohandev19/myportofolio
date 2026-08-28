export interface ExecutionResult {
  output: string;
  error: string | null;
}

export async function executeCode(code: string, language: string): Promise<ExecutionResult> {
  if (language === "javascript") {
    return new Promise((resolve) => {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(
            args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")
          );
        };

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

  return { output: "", error: "Language not supported in this environment" };
}
