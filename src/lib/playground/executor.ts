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

  // External execution for Go and PHP using Piston API
  try {
    let version = "*";
    if (language === "go") version = "1.16.2";
    if (language === "php") version = "8.2.3";

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ content: code }],
      }),
    });

    if (!response.ok) {
      return {
        output: "",
        error: `Remote execution failed with status: ${response.status}. Please try again later.`,
      };
    }

    const data = await response.json();

    if (data.compile && data.compile.code !== 0) {
      return { output: "", error: data.compile.output };
    }

    if (data.run) {
      if (data.run.code !== 0 && data.run.stderr) {
        return { output: data.run.stdout, error: data.run.stderr };
      }
      return { output: data.run.output, error: null };
    }

    return { output: "", error: "Unknown execution error from Piston API" };
  } catch (error) {
    return { output: "", error: "Failed to connect to remote execution engine" };
  }
}
