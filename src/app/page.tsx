'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { JSX } from 'react/jsx-runtime';

const TerminalPage = () => {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/user/terminal');
  const [caretVisible, setCaretVisible] = useState(true);
  const [glitchEffect, setGlitchEffect] = useState(false);

  const [fileSystem, setFileSystem] = useState<{ [key: string]: string[] }>({
    '/home/user/terminal': ['projects', 'documents'],
    '/home/user/terminal/projects': ['portfolio', 'terminal'],
    '/home/user/terminal/documents': ['doc1.txt'],
  });

  useEffect(() => {
    const caretInterval = setInterval(() => {
      setCaretVisible(v => !v);
    }, 500);
    return () => clearInterval(caretInterval);
  }, []);

  const triggerGlitch = useCallback(() => {
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 100);
  }, []);

  const print = useCallback((content: string | JSX.Element) => {
    setHistory(prev => [...prev, content]);
  }, []);

  const resolvePath = (base: string, path: string) => {
    if (path.startsWith('/')) return path;
    if (path === '..') return base.substring(0, base.lastIndexOf('/')) || '/';
    return base + '/' + path;
  };

  const processCommand = useCallback(async (cmd: string): Promise<string | JSX.Element> => {
    const tokens = cmd.trim().split(' ');
    const baseCmd = tokens[0];
    const arg = tokens[1];
    const args = tokens.slice(1);

    await new Promise(resolve => setTimeout(resolve, 50));

    if (baseCmd === 'help') {
      return (
        <div className="text-cyan-300 grid grid-cols-2 gap-2">
          <div>pwd        - Show current directory</div>
          <div>ls         - List files</div>
          <div>cd [dir]   - Change directory</div>
          <div>mkdir [dir] - Create directory</div>
          <div>rm [file]  - Remove file</div>
          <div>cat [file] - View file</div>
          <div>npx [cmd]  - Execute NPX command</div>
          <div>sudo [cmd] - Superuser access</div>
          <div>clear      - Clear the screen</div>
        </div>
      );
    }

    if (baseCmd === 'pwd') {
      return currentDir;
    }

    if (baseCmd === 'ls') {
      return (fileSystem[currentDir] || []).join('  ');
    }

    if (baseCmd === 'cd') {
      if (!arg) return 'Missing directory name';
      const newPath = resolvePath(currentDir, arg);
      if (fileSystem[newPath]) {
        setCurrentDir(newPath);
        return '';
      }
      return `No such directory: ${arg}`;
    }

    if (baseCmd === 'mkdir') {
      if (!arg) return 'Missing directory name';
      const path = currentDir + '/' + arg;
      if (fileSystem[path]) return 'Directory already exists';
      setFileSystem(prev => {
        const newFileSystem = { ...prev };
        newFileSystem[path] = [];
        newFileSystem[currentDir] = [...(prev[currentDir] || []), arg];
        return newFileSystem;
      });
      return '';
    }

    if (baseCmd === 'rm') {
      if (!arg) return 'Missing file or directory name';
      const target = currentDir + '/' + arg;
      if (!fileSystem[target] && !(fileSystem[currentDir] || []).includes(arg)) return 'File not found';
      const isDir = fileSystem[target];
      if (isDir && baseCmd === 'rm') return 'Cannot remove directory without sudo';
      setFileSystem(prev => {
        const newFS = { ...prev };
        delete newFS[target];
        newFS[currentDir] = newFS[currentDir].filter(f => f !== arg);
        return newFS;
      });
      return '';
    }

    if (baseCmd === 'cat') {
      if (!arg) return 'Missing file name';
      const files = fileSystem[currentDir] || [];
      if (!files.includes(arg)) return 'File not found';
      return `Contents of ${arg}: [simulated file content]`;
    }

    if (baseCmd === 'sudo') {
      const sudoCmd = args.join(' ');
      if (sudoCmd.startsWith('rm ')) {
        const sudoArg = args[1];
        const target = currentDir + '/' + sudoArg;
        if (!fileSystem[target]) return 'Target not found';
        setFileSystem(prev => {
          const newFS = { ...prev };
          delete newFS[target];
          newFS[currentDir] = newFS[currentDir].filter(f => f !== sudoArg);
          return newFS;
        });
        return '';
      }
      return 'Sudo command executed';
    }

    if (baseCmd === 'npx') {
      return `Running NPX command: ${args.join(' ')}`;
    }

    if (baseCmd === 'clear') {
      setHistory([]);
      return '';
    }

    triggerGlitch();
    return <span className="text-red-400 blink">Command not found: {cmd}</span>;
  }, [fileSystem, currentDir, triggerGlitch]);

  const handleCommand = useCallback(async (cmd: string) => {
    const prompt = (
      <div className="text-cyan-400">
        <span className="text-purple-400">visitor@cyber-terminal:</span>
        <span className="text-blue-400">{currentDir}</span>$
      </div>
    );

    setHistory(prev => [
      ...prev,
      <div className="flex items-center">
        {prompt}
        <span className="typewriter">{cmd}</span>
      </div>
    ]);

    const output = await processCommand(cmd);
    if (output) print(output);
    setInput('');
  }, [currentDir, print, processCommand]);

  return (
    <main className={`h-screen w-full bg-black overflow-hidden relative ${glitchEffect ? 'glitch' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-900 opacity-20 animate-pulse" />
      <div className="absolute inset-0 noise" />

      <div className="relative z-10 h-full p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto font-mono text-sm">
          {history.map((line, i) => (
            <div key={i} className="terminal-line">{line}</div>
          ))}
        </div>

        <div className="flex items-center mt-4 border-t-2 border-cyan-400/20 pt-4">
          <div className="flex items-center text-cyan-400">
            <span className="text-purple-400">visitor@cyber-terminal:</span>
            <span className="text-blue-400">{currentDir}</span>$
          </div>
          <div className="flex-1 ml-2 relative">
            <input
              autoFocus
              className="w-full bg-transparent outline-none text-cyan-400 caret-cyan-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCommand(input);
              }}
            />
            <div className={`absolute right-0 top-0 h-full w-1 bg-cyan-400 ${caretVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
    </main>
  );
};

export default TerminalPage;
