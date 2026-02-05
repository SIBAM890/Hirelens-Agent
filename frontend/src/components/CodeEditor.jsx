import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, code, onChange }) => {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={code}
                onChange={onChange}
                theme="light" // Professional light theme
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 20 },
                    scrollBeyondLastLine: false,
                    fontFamily: 'JetBrains Mono, monospace',
                    lineNumbers: 'on',
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                }}
            />
        </div>
    );
};

export default CodeEditor;
