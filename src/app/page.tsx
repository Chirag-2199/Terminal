'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { JSX } from 'react/jsx-runtime';

type Theme = 'cyberpunk' | 'matrix' | 'retro';
type FileSystem = { [key: string]: string[] };
type Files = { [key: string]: string };

const TerminalPage = () => {
  const [history, setHistory] = useState<(string | JSX.Element)[]>([]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/home/user/terminal');
  const [caretVisible, setCaretVisible] = useState(true);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState<Theme>('cyberpunk');
  const [files, setFiles] = useState<Files>({});
  const [currentUser] = useState('visitor');

  const [fileSystem, setFileSystem] = useState<FileSystem>({
    '/home/user/terminal': ['projects', 'documents'],
    '/home/user/terminal/projects': ['portfolio', 'terminal'],
    '/home/user/terminal/documents': ['doc1.txt'],
  });

  // Load initial file contents
  useEffect(() => {
    setFiles({
      '/home/user/terminal/documents/doc1.txt': 'Welcome to the cyber terminal!\n\nThis is a sample document.\nUse `help` to see available commands.',
    });
  }, []);

  // Load saved state
  useEffect(() => {
    const savedHistory = localStorage.getItem('terminalHistory');
    const savedTheme = localStorage.getItem('terminalTheme') as Theme;
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('terminalHistory', JSON.stringify(history));
    localStorage.setItem('terminalTheme', theme);
  }, [history, theme]);

  // Caret animation
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
    const args = tokens.slice(1);

    await new Promise(resolve => setTimeout(resolve, 50));

    const themeColors = {
      cyberpunk: { prompt: 'text-purple-400', path: 'text-blue-400', text: 'text-cyan-300' },
      matrix: { prompt: 'text-green-400', path: 'text-green-600', text: 'text-green-300' },
      retro: { prompt: 'text-amber-400', path: 'text-amber-600', text: 'text-amber-300' },
    };

    if (baseCmd === 'help') {
      return (
        <div className={`${themeColors[theme].text} grid grid-cols-2 gap-2`}>
          <div>pwd        - Show current directory</div>
          <div>ls         - List files</div>
          <div>cd [dir]   - Change directory</div>
          <div>mkdir [dir] - Create directory</div>
          <div>rm [file]  - Remove file</div>
          <div>cat [file] - View file</div>
          <div>touch [file] - Create file</div>
          <div>echo [text] - Display text</div>
          <div>grep [pat] [file] - Search file</div>
          <div>npx [cmd]  - Execute NPX command</div>
          <div>sudo [cmd] - Superuser access</div>
          <div>clear      - Clear screen</div>
          <div>history    - Command history</div>
          <div>neofetch   - System info</div>
          <div>theme [name] - Change theme</div>
          <div>date       - Show date/time</div>
          <div>whoami     - Show current user</div>
        </div>
      );
    }

    if (baseCmd === 'pwd') return currentDir;

    if (baseCmd === 'ls') return (fileSystem[currentDir] || []).join('  ');

    if (baseCmd === 'cd') {
      if (!args[0]) return 'Missing directory name';
      const newPath = resolvePath(currentDir, args[0]);
      return fileSystem[newPath] ? (setCurrentDir(newPath), '') : `No such directory: ${args[0]}`;
    }

    if (baseCmd === 'mkdir') {
      if (!args[0]) return 'Missing directory name';
      const path = currentDir + '/' + args[0];
      return fileSystem[path]
        ? 'Directory exists'
        : (setFileSystem(prev => ({
          ...prev,
          [path]: [],
          [currentDir]: [...(prev[currentDir] || []), args[0]]
        })), '');
    }

    if (baseCmd === 'rm') {
      if (!args[0]) return 'Missing target';
      const target = currentDir + '/' + args[0];
      return (!fileSystem[target] && !fileSystem[currentDir]?.includes(args[0]))
        ? 'File not found'
        : (setFileSystem(prev => ({
          ...prev,
          [currentDir]: prev[currentDir].filter(f => f !== args[0])
        })), '');
    }

    if (baseCmd === 'cat') {
      if (!args[0]) return 'Missing file name';
      const filePath = currentDir + '/' + args[0];
      return files[filePath] || 'File not found';
    }

    if (baseCmd === 'touch') {
      if (!args[0]) return 'Missing file name';
      const fileName = args[0];
      return fileSystem[currentDir]?.includes(fileName)
        ? 'File exists'
        : (setFileSystem(prev => ({
          ...prev,
          [currentDir]: [...(prev[currentDir] || []), fileName]
        })), setFiles(prev => ({
          ...prev,
          [`${currentDir}/${fileName}`]: 'New file created.'
        })), '');
    }

    if (baseCmd === 'echo') return args.join(' ');

    if (baseCmd === 'grep') {
      if (args.length < 2) return 'Usage: grep [pattern] [file]';
      const content = files[currentDir + '/' + args[1]];
      return content
        ? content.split('\n').filter(line => line.includes(args[0])).join('\n')
        : 'File not found';
    }

    if (baseCmd === 'sudo') {
      if (args[0] === 'rm' && args[1] === '-r') {
        const dir = args[2];
        const target = resolvePath(currentDir, dir);
        return fileSystem[target]
          ? (setFileSystem(prev => {
            const newFS = { ...prev };
            delete newFS[target];
            newFS[currentDir] = newFS[currentDir].filter(f => f !== dir);
            return newFS;
          }), '')
          : 'Directory not found';
      }
      return 'Permission granted';
    }

    if (baseCmd === 'npx') return `Running: npx ${args.join(' ')}`;

    if (baseCmd === 'clear') return setHistory([]), '';

    if (baseCmd === 'history') return commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');

    if (baseCmd === 'neofetch') return (
      <pre className={`${themeColors[theme].text}`}>
        {`${currentUser}@cyber-terminal\n` +
          '----------------------\n' +
          `OS: Cyber Terminal v2.0\n` +
          `Theme: ${theme}\n` +
          `Shell: zsh 5.8\n` +
          `Uptime: 24/7/365\n` +
          `\n    ▄▄▄▄▄▄▄▄▄▄▄\n` +
          `    ████████████\n` +
          `    ██${theme === 'matrix' ? '▓▓' : '██'}${theme === 'retro' ? '▒▒' : '██'}████\n` +
          `    ████████████`}
      </pre>
    );

    if (baseCmd === 'theme') {
      const newTheme = args[0] as Theme;
      return ['cyberpunk', 'matrix', 'retro'].includes(newTheme)
        ? (setTheme(newTheme), `Theme set to ${newTheme}`)
        : 'Available themes: cyberpunk, matrix, retro';
    }

    if (baseCmd === 'date') return new Date().toString();

    if (baseCmd === 'whoami') return currentUser;

    triggerGlitch();
    return <span className="text-red-400 blink">Command not found: {cmd}</span>;
  }, [fileSystem, currentDir, files, theme, currentUser, commandHistory, triggerGlitch]);

  const handleCommand = useCallback(async (cmd: string) => {
    if (!cmd.trim()) return;

    const prompt = (
      <div className={theme === 'cyberpunk' ? 'text-cyan-400' : theme === 'matrix' ? 'text-green-400' : 'text-amber-400'}>
        <span className={theme === 'cyberpunk' ? 'text-purple-400' : theme === 'matrix' ? 'text-green-600' : 'text-amber-600'}>
          {currentUser}@cyber-terminal:
        </span>
        <span className={theme === 'cyberpunk' ? 'text-blue-400' : theme === 'matrix' ? 'text-green-400' : 'text-amber-400'}>
          {currentDir}
        </span>$
      </div>
    );

    setHistory(prev => [
      ...prev,
      <div className="flex items-center">
        {prompt}
        <span className="typewriter">{cmd}</span>
      </div>
    ]);

    setCommandHistory(prev => [...prev, cmd]);
    setCurrentHistoryIndex(-1);

    const output = await processCommand(cmd);
    if (output) print(output);
    setInput('');
  }, [currentDir, print, processCommand, currentUser, theme]);

  const handleAutocomplete = () => {
    const tokens = input.split(' ');
    const currentToken = tokens[tokens.length - 1];
    const commands = ['help', 'ls', 'cd', 'mkdir', 'rm', 'cat', 'sudo', 'npx', 'clear', 'touch', 'echo', 'grep', 'history', 'neofetch', 'theme', 'date', 'whoami'];
    const currentDirFiles = fileSystem[currentDir] || [];

    // Command completion
    const commandMatches = commands.filter(c => c.startsWith(currentToken));
    if (commandMatches.length === 1) {
      tokens[tokens.length - 1] = commandMatches[0];
      return setInput(tokens.join(' ') + ' ');
    }

    // File/directory completion
    const fileMatches = currentDirFiles.filter(f => f.startsWith(currentToken));
    if (fileMatches.length === 1) {
      tokens[tokens.length - 1] = fileMatches[0];
      const isDirectory = fileSystem[`${currentDir}/${fileMatches[0]}`];
      return setInput(tokens.join(' ') + (isDirectory ? '/' : ' '));
    }
  };

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
          <div className={`flex items-center ${theme === 'cyberpunk' ? 'text-cyan-400' : theme === 'matrix' ? 'text-green-400' : 'text-amber-400'}`}>
            <span className={theme === 'cyberpunk' ? 'text-purple-400' : theme === 'matrix' ? 'text-green-600' : 'text-amber-600'}>
              {currentUser}@cyber-terminal:
            </span>
            <span className={theme === 'cyberpunk' ? 'text-blue-400' : theme === 'matrix' ? 'text-green-400' : 'text-amber-400'}>
              {currentDir}
            </span>$
          </div>
          <div className="flex-1 ml-2 relative">
            <input
              autoFocus
              className={`w-full bg-transparent outline-none ${theme === 'cyberpunk' ? 'text-cyan-400' : theme === 'matrix' ? 'text-green-400' : 'text-amber-400'} caret-${theme === 'cyberpunk' ? 'cyan' : theme === 'matrix' ? 'green' : 'amber'}-400`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleCommand(input);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  if (commandHistory.length === 0) return;
                  const newIndex = currentHistoryIndex < commandHistory.length - 1
                    ? currentHistoryIndex + 1
                    : commandHistory.length - 1;
                  setCurrentHistoryIndex(newIndex);
                  setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  const newIndex = currentHistoryIndex > 0
                    ? currentHistoryIndex - 1
                    : -1;
                  setCurrentHistoryIndex(newIndex);
                  setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex]);
                } else if (e.key === 'Tab') {
                  e.preventDefault();
                  handleAutocomplete();
                }
              }}
            />
            <div className={`absolute right-0 top-0 h-full w-1 ${theme === 'cyberpunk' ? 'bg-cyan-400' : theme === 'matrix' ? 'bg-green-400' : 'bg-amber-400'} ${caretVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
    </main>
  );
};

export default TerminalPage;