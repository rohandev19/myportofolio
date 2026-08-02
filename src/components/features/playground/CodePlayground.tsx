"use client";

import { useState, useEffect } from "react";
import { executeJavaScript } from "@/lib/playground/executor";
import { encodeCode, decodeCode } from "@/lib/playground/codec";

const DEFAULT_CODE = `// Welcome to the Playground!
const greeting = "Hello, World!";
console.log(greeting);

// Math operations
const add = (a, b) => a + b;
console.log("2 + 3 =", add(2, 3));
`;

export function CodePlayground() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get("code");
      if (codeParam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCode(decodeCode(codeParam));
      }
    }
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
  };

  const handleRun = async () => {
    setOutput("");
    setError(null);
    const result = await executeJavaScript(code);
    if (result.error) {
      setError(result.error);
    } else {
      setOutput(result.output);
    }
  };

  const handleShare = () => {
    const encoded = encodeCode(code);
    const newUrl = `${window.location.pathname}?code=${encoded}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    navigator.clipboard.writeText(window.location.href);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
          Interactive Code Sandbox
        </h3>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] rounded-md text-sm transition-colors"
          >
            Share Link
          </button>
          <button
            onClick={handleRun}
            className="px-4 py-2 bg-[var(--color-accent-blue)] text-[#141418] rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Run Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
        {/* Editor */}
        <div className="flex flex-col border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#181c24]">
          <div className="bg-[var(--color-bg-secondary)] px-4 py-2 border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)]">
            index.js
          </div>
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="flex-1 w-full p-4 bg-transparent text-[var(--color-text-primary)] font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]/50"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col border border-[var(--color-border)] rounded-xl overflow-hidden bg-black/50">
          <div className="bg-[var(--color-bg-secondary)] px-4 py-2 border-b border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)]">
            Console Output
          </div>
          <div className="flex-1 w-full p-4 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : output ? (
              <span className="text-green-400">{output}</span>
            ) : (
              <span className="text-[var(--color-text-tertiary)] italic">
                Click &quot;Run Code&quot; to see output...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
