import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../contexts/ThemeContext';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    // Configure editor options for better experience
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Consolas, "Courier New", monospace',
      wordWrap: 'on',
      automaticLayout: true,
      bracketPairColorization: {
        enabled: true,
        independentColorPoolPerBracketType: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
      },
      renderWhitespace: 'selection',
      tabSize: 4,
      insertSpaces: true,
      detectIndentation: false,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      foldingHighlight: true,
      foldingImportsByDefault: true,
      unfoldOnClickAfterEndOfLine: false,
      links: false,
      colorDecorators: true,
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showWords: true,
        showUsers: true,
        showIssues: true,
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true,
      },
      parameterHints: {
        enabled: true,
      },
      hover: {
        enabled: true,
        delay: 300,
      },
      contextmenu: true,
      mouseWheelZoom: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      cursorStyle: 'line',
      multiCursorModifier: 'alt',
      accessibilitySupport: 'auto',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: true,
      dragAndDrop: true,
      emptySelectionClipboard: true,
      copyWithSyntaxHighlighting: true,
      find: {
        addExtraSpaceOnTop: false,
        autoFindInSelection: 'never',
        seedSearchStringFromSelection: 'always',
      },
    });

    // Configure language-specific settings
    if (language === 'JAVA') {
      editor.updateOptions({
        tabSize: 4,
        insertSpaces: true,
      });
    } else if (language === 'PYTHON') {
      editor.updateOptions({
        tabSize: 4,
        insertSpaces: true,
      });
    } else if (language === 'CPP') {
      editor.updateOptions({
        tabSize: 2,
        insertSpaces: true,
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Get Monaco language from our language enum
  const getMonacoLanguage = (lang: string): string => {
    switch (lang) {
      case 'JAVA':
        return 'java';
      case 'PYTHON':
        return 'python';
      case 'CPP':
        return 'cpp';
      default:
        return 'plaintext';
    }
  };

  return (
    <div>
      <Editor
        height="400px"
        defaultLanguage={getMonacoLanguage(language)}
        value={value}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          readOnly,
          theme: 'vs-dark',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 20,
          fontFamily: 'Consolas, "Courier New", monospace',
          wordWrap: 'on',
          bracketPairColorization: {
            enabled: true,
            independentColorPoolPerBracketType: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
            highlightActiveIndentation: true,
          },
          renderWhitespace: 'selection',
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          foldingHighlight: true,
          foldingImportsByDefault: true,
          unfoldOnClickAfterEndOfLine: false,
          links: false,
          colorDecorators: true,
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showClasses: true,
            showFunctions: true,
            showVariables: true,
            showConstants: true,
            showEnums: true,
            showEnumMembers: true,
            showColors: true,
            showFiles: true,
            showReferences: true,
            showFolders: true,
            showTypeParameters: true,
            showWords: true,
            showUsers: true,
            showIssues: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          parameterHints: {
            enabled: true,
          },
          hover: {
            enabled: true,
            delay: 300,
          },
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          cursorStyle: 'line',
          multiCursorModifier: 'alt',
          accessibilitySupport: 'auto',
          autoIndent: 'full',
          formatOnPaste: true,
          formatOnType: true,
          dragAndDrop: true,
          emptySelectionClipboard: true,
          copyWithSyntaxHighlighting: true,
          find: {
            addExtraSpaceOnTop: false,
            autoFindInSelection: 'never',
            seedSearchStringFromSelection: 'always',
          },
        }}
      />
    </div>
  );
};

export default CodeEditor; 