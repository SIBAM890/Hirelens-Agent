import React from 'react';
import Editor from "@monaco-editor/react";
import { Code as CodeIcon } from 'lucide-react';

const CodeEditor = ({ code, setCode, language = "javascript" }) => {
    return (
        <div className="flex flex-col h-full w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-700 shadow-2xl">

            {/* Editor Header */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-2 text-gray-300">
                    <CodeIcon size={16} className="text-neon-blue" />
                    <span className="text-sm font-mono uppercase">{language} Editor</span>
                </div>
                <div className="text-xs text-gray-500">Auto-Save: ON</div>
            </div>

            {/* The Monaco Editor */}
            <div className="flex-grow">
                <Editor
                    height="100%"
                    defaultLanguage={language}
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        minimap: { enabled: false }, // Hides the side preview to save space
                        fontSize: 16,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20, bottom: 20 },
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;