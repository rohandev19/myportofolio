"use client";

import { useState, useEffect } from "react";
import { executeCode } from "@/lib/playground/executor";
import { encodeCode, decodeCode } from "@/lib/playground/codec";

const DEFAULT_SNIPPETS: Record<string, string> = {
  javascript: `// Welcome to the Playground!
const greeting = "Hello, World!";
console.log(greeting);

// Math operations
const add = (a, b) => a + b;
console.log("2 + 3 =", add(2, 3));`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    
    add := func(a, b int) int {
        return a + b
    }
    fmt.Printf("2 + 3 = %d\\n", add(2, 3))
}`,
  php: `<?php
echo "Hello from PHP!\\n";

$add = fn($a, $b) => $a + $b;
echo "2 + 3 = " . $add(2, 3) . "\\n";
`,
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; text-align: center; margin-top: 2rem; color: #333; background: #f0f0f0; }
    h1 { color: #2563eb; }
    button { padding: 10px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Hello, HTML!</h1>
  <p>This is a live preview sandbox.</p>
  <button onclick="alert('Clicked!')">Click Me</button>
</body>
</html>`,
};

export function CodePlayground() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState("");

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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_SNIPPETS[newLang] || "");
    setOutput("");
    setError(null);
    setHtmlPreview("");
  };

  const handleRun = async () => {
    if (language === "html") {
      setHtmlPreview(code);
      return;
    }

    setIsExecuting(true);
    setOutput("");
    setError(null);
    setHtmlPreview("");

    const result = await executeCode(code, language);
    if (result.error) {
      setError(result.error);
    } else {
      setOutput(result.output);
    }
    setIsExecuting(false);
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
            disabled={isExecuting}
            className="px-4 py-2 bg-[var(--color-accent-blue)] text-[var(--color-bg-primary)] rounded-md font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isExecuting ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
        {/* Editor — intentionally always dark, like a code editor, regardless of site theme */}
        <div className="flex flex-col border border-[var(--color-border)] rounded-xl overflow-hidden bg-[#181c24]">
          <div className="bg-[#12151b] px-4 py-2 border-b border-white/10 text-xs font-mono flex items-center justify-between">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-[var(--color-accent-blue)] focus:outline-none cursor-pointer"
            >
              <option value="javascript" className="bg-[#181c24]">
                main.js (JS)
              </option>
              <option value="go" className="bg-[#181c24]">
                main.go (Go)
              </option>
              <option value="php" className="bg-[#181c24]">
                main.php (PHP)
              </option>
              <option value="html" className="bg-[#181c24]">
                index.html (HTML)
              </option>
            </select>
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
            {language === "html" ? "Live Preview" : "Console Output"}
          </div>
          <div className="flex-1 w-full p-0 font-mono text-sm overflow-auto">
            {language === "html" && htmlPreview ? (
              <iframe
                srcDoc={htmlPreview}
                className="w-full h-full bg-white border-none"
                title="HTML Preview"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="p-4 whitespace-pre-wrap">
                {isExecuting ? (
                  <span className="text-slate-400 animate-pulse">
                    Running code remotely via Piston API...
                  </span>
                ) : error ? (
                  <span className="text-red-400">{error}</span>
                ) : output ? (
                  <span className="text-green-400">{output}</span>
                ) : (
                  <span className="text-slate-500 italic">
                    Click &quot;Run Code&quot; to see {language === "html" ? "preview" : "output"}
                    ...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
