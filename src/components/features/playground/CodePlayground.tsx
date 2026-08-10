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
            className="px-4 py-2 bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Run Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
        {/* Editor — intentionally always dark, like a code editor, regardless of site theme */}
        <div className="flex flex-col border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#181c24]">
          <div className="bg-[#12151b] px-4 py-2 border-b border-white/10 text-xs font-mono text-slate-400">
            index.js
          </div>
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="flex-1 w-full p-4 bg-transparent text-slate-100 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)]/50"
            spellCheck={false}
          />
        </div>

        {/* Output — intentionally always dark, matching the editor panel */}
        <div className="flex flex-col border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#181c24]">
          <div className="bg-[#12151b] px-4 py-2 border-b border-white/10 text-xs font-mono text-slate-400">
            Console Output
          </div>
          <div className="flex-1 w-full p-4 font-mono text-sm overflow-auto whitespace-pre-wrap">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : output ? (
              <span className="text-green-400">{output}</span>
            ) : (
              <span className="text-slate-500 italic">
                Click &quot;Run Code&quot; to see output...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
