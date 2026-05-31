import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minus, Square } from 'lucide-react';
import useStore from '../store/useStore';

// ─── Virtual File System ──────────────────────────────────────────────────────
const buildFS = () => ({
    type: 'dir',
    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 28 09:14' },
    content: {
        'projects': {
            type: 'dir',
            meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 31 08:20' },
            content: {
                'aerolang': {
                    type: 'dir',
                    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 30 14:22' },
                    content: {
                        'main.c': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 842, date: 'May 30 14:22' },
                            content: `#include <stdio.h>
#include "lexer.h"
#include "parser.h"

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: aerolang <file.aero>\\n");
        return 1;
    }
    Lexer *lexer = lexer_init(argv[1]);
    TokenStream *tokens = lexer_tokenize(lexer);
    AST *tree = parser_parse(tokens);
    codegen_emit(tree, "output.cpp");
    printf("Compilation successful.\\n");
    return 0;
}`
                        },
                        'lexer.c': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 2104, date: 'May 29 11:45' },
                            content: `#include "lexer.h"
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

Lexer *lexer_init(const char *filename) {
    Lexer *l = malloc(sizeof(Lexer));
    l->source = read_file(filename);
    l->pos = 0;
    l->line = 1;
    return l;
}

Token next_token(Lexer *l) {
    skip_whitespace(l);
    if (isalpha(l->source[l->pos]))
        return lex_identifier(l);
    if (isdigit(l->source[l->pos]))
        return lex_number(l);
    return lex_symbol(l);
}`
                        },
                        'Makefile': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 312, date: 'May 28 16:00' },
                            content: `CC = gcc
CFLAGS = -Wall -Wextra -O2
SRC = main.c lexer.c parser.c codegen.c
OBJ = $(SRC:.c=.o)
TARGET = aerolang

all: $(TARGET)

$(TARGET): $(OBJ)
\t$(CC) $(CFLAGS) -o $@ $^

clean:
\trm -f $(OBJ) $(TARGET)`
                        },
                        'README.md': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 1024, date: 'May 31 09:00' },
                            content: `# AeroLang

A compiled programming language that targets native Android (NDK/C++).

## Pipeline
Lexer → Parser → AST → C++ Codegen → NDK Build → APK

## Usage
\`\`\`
aerolang program.aero
\`\`\`

## Status
Active development. Core pipeline functional.`
                        }
                    }
                },
                'neonmonitor': {
                    type: 'dir',
                    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 29 18:40' },
                    content: {
                        'monitor.cpp': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 3280, date: 'May 29 18:40' },
                            content: `#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <unistd.h>

struct CpuStats { long user, nice, system, idle, iowait, irq, softirq; };

CpuStats readCpuStats() {
    std::ifstream stat("/proc/stat");
    std::string line;
    std::getline(stat, line);
    CpuStats s;
    std::istringstream ss(line);
    std::string cpu;
    ss >> cpu >> s.user >> s.nice >> s.system >> s.idle
       >> s.iowait >> s.irq >> s.softirq;
    return s;
}

double getCpuUsage() {
    auto a = readCpuStats(); sleep(1);
    auto b = readCpuStats();
    long total = (b.user-a.user)+(b.nice-a.nice)+(b.system-a.system)+(b.idle-a.idle);
    long idle  = b.idle - a.idle;
    return 100.0 * (total - idle) / total;
}`
                        },
                        'README.md': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 512, date: 'May 25 10:00' },
                            content: `# NeonMonitor
Linux process monitor in C++. Reads from /proc directly.
Real-time CPU, memory, and per-process telemetry.`
                        }
                    }
                },
                'sightlock': {
                    type: 'dir',
                    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 27 12:00' },
                    content: {
                        'BiometricScanner.kt': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 1560, date: 'May 27 12:00' },
                            content: `class BiometricScanner(private val context: Context) {

    private val executor = ContextCompat.getMainExecutor(context)
    private val biometricPrompt = BiometricPrompt(
        context as FragmentActivity, executor,
        object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                onSuccess(result.cryptoObject)
            }
            override fun onAuthenticationFailed() {
                super.onAuthenticationFailed()
                Log.w("SightLock", "Liveness check failed")
            }
        }
    )

    fun verifyLiveness(): Boolean {
        val info = BiometricManager.from(context)
        return info.canAuthenticate(BIOMETRIC_STRONG) == BiometricManager.BIOMETRIC_SUCCESS
    }
}`
                        }
                    }
                },
                'bybridge': {
                    type: 'dir',
                    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 26 09:30' },
                    content: {
                        'daemon.cpp': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 2048, date: 'May 26 09:30' },
                            content: `// Bybridge daemon — cross-device ecosystem over TCP/WebSocket
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 9876
#define STAT_UPDATE_INTERVAL 1000L

void start_daemon() {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr { AF_INET, htons(PORT), INADDR_ANY };
    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(server_fd, 10);
    // polling thread at 1Hz for system state
    pthread_t stat_thread;
    pthread_create(&stat_thread, NULL, stat_worker, NULL);
    event_loop(server_fd);
}`
                        }
                    }
                }
            }
        },
        '.config': {
            type: 'dir',
            meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 28 09:14' },
            content: {
                'nvim': {
                    type: 'dir',
                    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 25 11:00' },
                    content: {
                        'init.lua': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 724, date: 'May 25 11:00' },
                            content: `-- NeoVim config
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.termguicolors = true
vim.opt.cursorline = true

-- Plugin manager (lazy.nvim)
require("lazy").setup({
  "nvim-treesitter/nvim-treesitter",
  "neovim/nvim-lspconfig",
  { "catppuccin/nvim", name = "catppuccin", priority = 1000 },
})

vim.cmd.colorscheme "catppuccin-mocha"`
                        }
                    }
                },
                'zsh': {
                    type: 'dir',
                    meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 20 10:00' },
                    content: {
                        '.zshrc': {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 890, date: 'May 20 10:00' },
                            content: `export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source $ZSH/oh-my-zsh.sh

export PATH="$HOME/.local/bin:$PATH"
export EDITOR=nvim
export CC=gcc
export CXX=g++

alias ll='ls -la'
alias la='ls -A'
alias gs='git status'
alias gl='git log --oneline'
alias v='nvim'
alias py='python3'`
                        }
                    }
                }
            }
        },
        '.ssh': {
            type: 'dir',
            meta: { perms: 'drwx------', owner: 'siluna', size: 4096, date: 'May 10 08:00' },
            content: {
                'id_rsa': { type: 'file', meta: { perms: '-rw-------', owner: 'siluna', size: 3381, date: 'May 10 08:00' }, content: 'Permission denied' },
                'id_rsa.pub': { type: 'file', meta: { perms: '-rw-r--r--', owner: 'siluna', size: 740, date: 'May 10 08:00' }, content: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7... siluna@silunaos' },
                'known_hosts': { type: 'file', meta: { perms: '-rw-r--r--', owner: 'siluna', size: 2048, date: 'May 28 14:22' }, content: 'github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...' }
            }
        },
        'Documents': {
            type: 'dir',
            meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 30 11:00' },
            content: {
                'Siluna_CV.pdf': { type: 'file', meta: { perms: '-rw-r--r--', owner: 'siluna', size: 184320, date: 'May 30 11:00' }, content: '[binary: PDF document]' },
                'notes.md': {
                    type: 'file',
                    meta: { perms: '-rw-r--r--', owner: 'siluna', size: 256, date: 'May 29 09:00' },
                    content: `# Dev Notes
- AeroLang: finish codegen phase
- NeonMonitor: add mmap optimization
- Bybridge: implement H.264 RTP stream
- SightLock: liveness detection v2`
                }
            }
        },
        'Downloads': {
            type: 'dir',
            meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 20 07:00' },
            content: {}
        },
        'README.md': {
            type: 'file',
            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 412, date: 'May 30 11:00' },
            content: `# siluna@silunaos ~

Welcome to my portfolio terminal.
Type 'help' for available commands.

## Quick Links
- GitHub : https://github.com/GitGuru29
- Email  : sdangalla44@gmail.com
- CV     : /home/siluna/Documents/Siluna_CV.pdf`
        },
        '.bash_logout': {
            type: 'file',
            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 220, date: 'May 28 09:14' },
            content: '# ~/.bash_logout: executed by bash when login shell exits.'
        },
        '.bashrc': {
            type: 'file',
            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 3526, date: 'May 28 09:14' },
            content: `# ~/.bashrc: executed by bash for non-login shells
export PS1='\\u@\\h:\\w\\$ '
export HISTSIZE=1000
export HISTFILESIZE=2000
alias ll='ls -la'
alias la='ls -A'
alias gs='git status'`
        }
    }
});

// Git repos keyed by virtual path prefix
const GIT_REPOS = {
    '~/projects/aerolang': {
        branch: 'main',
        branches: ['main', 'feat/codegen-v2', 'fix/lexer-utf8'],
        log: [
            'a3f9c12 fix: handle UTF-8 identifiers in lexer',
            'e81d047 feat: add struct type support to parser',
            'b2c5a91 feat: implement C++ codegen backend',
            '9f3e6d8 refactor: split lexer into token categories',
            '4a1b2c3 feat: initial AeroLang compiler scaffold',
            '0d3e9f1 chore: add Makefile and project structure',
        ],
        status: `On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)

\tmodified:   lexer.c

no changes added to commit (use "git add" and/or "git commit -a")`
    },
    '~/projects/neonmonitor': {
        branch: 'main',
        branches: ['main', 'feat/mmap-optimization'],
        log: [
            'f4a8b12 perf: switch /proc reads to buffered stream',
            '3c9d0e1 feat: add per-process CPU% calculation',
            '7b2e5f8 feat: memory telemetry via VmRSS',
            '1a4c7d2 feat: initial /proc/stat CPU reader',
        ],
        status: `On branch main
nothing to commit, working tree clean`
    },
    '~/projects/sightlock': {
        branch: 'main',
        branches: ['main', 'feat/liveness-v2'],
        log: [
            '9e1f3a4 feat: liveness detection with depth sensor',
            'c5b8d2e feat: biometric enrollment flow',
            '2d7a0b9 chore: initial Android project scaffold',
        ],
        status: `On branch feat/liveness-v2
Your branch is 3 commits ahead of 'origin/main'.

Changes not staged for commit:
\tmodified:   BiometricScanner.kt`
    },
    '~/projects/bybridge': {
        branch: 'main',
        branches: ['main'],
        log: [
            'b3c1e5a feat: WebSocket bridge for screen mirror',
            '4f2d8b7 feat: H.264 RTP stream prototype',
            '8a9c0d3 feat: TCP daemon with 1Hz polling',
            '0e5f1a2 chore: initial daemon architecture',
        ],
        status: `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`
    }
};

const NEOFETCH_OUTPUT = [
    { text: '       _,met$$$$$gg.          ', color: '#e95420', suffix: { text: 'siluna', color: '#4ade80' }, suffix2: { text: '@', color: '#94a3b8' }, suffix3: { text: 'silunaos', color: '#60a5fa' } },
    { text: '    ,g$$$$$$$$$$$$$$$P.       ', color: '#e95420', info: '──────────────────────────' },
    { text: '  ,g$$P"        """Y$$.".     ', color: '#e95420', info: 'OS:       Debian GNU/Linux 12 (bookworm) x86_64' },
    { text: ' ,$$P\'              `$$$.     ', color: '#e95420', info: 'Kernel:   6.1.0-18-amd64' },
    { text: '\',$$P       ,ggs.     `$$b:   ', color: '#e95420', info: 'Uptime:   23 days, 4 hours, 12 mins' },
    { text: '`d$$\'     ,$P"\'   .    $$$    ', color: '#e95420', info: 'Shell:    zsh 5.9' },
    { text: ' $$P      d$\'     ,    $$P    ', color: '#e95420', info: 'Terminal: kitty 0.31.0' },
    { text: ' $$:      $$.   -    ,d$$\'    ', color: '#e95420', info: 'CPU:      AMD Ryzen 5 5600X (12) @ 4.650GHz' },
    { text: ' $$\\;      Y$b._   _,d$P\'     ', color: '#e95420', info: 'GPU:      NVIDIA GeForce GTX 1650' },
    { text: ' Y$$.    `.`"Y$$$$P"\'         ', color: '#e95420', info: 'Memory:   4.2GiB / 15.5GiB' },
    { text: ' `$$b      "-.__              ', color: '#e95420', info: 'Disk:     128GB / 512GB SSD' },
    { text: '  `Y$$                        ', color: '#e95420' },
    { text: '   `Y$$.                      ', color: '#e95420' },
    { text: '     `$$b.                    ', color: '#e95420', colors: true },
    { text: '       `Y$$b.                 ', color: '#e95420' },
    { text: '          `"Y$b._             ', color: '#e95420' },
    { text: '              `""""           ', color: '#e95420' },
];

const MAN_PAGES = {
    ls:   'ls - list directory contents\nUsage: ls [OPTION]... [FILE]...\n  -a    do not ignore entries starting with .\n  -l    use a long listing format\n  -h    with -l, print sizes in human readable format\n  -la   combine -l and -a',
    cd:   'cd - change the current directory\nUsage: cd [DIR]\n  If DIR is omitted, changes to $HOME (~)',
    cat:  'cat - concatenate files and print on the standard output\nUsage: cat [OPTION]... [FILE]...',
    grep: 'grep - print lines that match patterns\nUsage: grep [OPTION]... PATTERN [FILE]...\n  -i    ignore case distinctions\n  -n    print line number with output lines\n  -r    read all files under each directory, recursively',
    git:  'git - the stupid content tracker\nUsage: git [--version] [--help] <command> [<args>]\n\nCommon commands:\n  git status       Show the working tree status\n  git log          Show commit logs\n  git branch       List, create, or delete branches\n  git add          Add file contents to the index\n  git commit       Record changes to the repository',
    vim:  'vim - Vi IMproved, a programmer\'s text editor\nUsage: vim [options] [file]\n  :q         quit\n  :wq        save and quit\n  :q!        quit without saving\n  i          enter insert mode\n  Esc        return to normal mode',
    echo: 'echo - display a line of text\nUsage: echo [STRING]...',
    find: 'find - search for files in a directory hierarchy\nUsage: find [PATH] [OPTION]\n  -name PATTERN   search for files matching PATTERN\n  -type f         match files only\n  -type d         match directories only',
    sudo: 'sudo - execute a command as another user\nUsage: sudo [OPTION] COMMAND',
    ssh:  'ssh - OpenSSH remote login client\nUsage: ssh [options] [user@]hostname\n  -p port    connect to port on the remote host\n  -i file    identity file (private key)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}M`;
}

function padEnd(str, len) { return str + ' '.repeat(Math.max(0, len - str.length)); }
function padStart(str, len) { return ' '.repeat(Math.max(0, len - str.length)) + str; }

function displayPath(path) {
    return path === '~' ? '~' : path.startsWith('~/') ? path : `~/${path}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TerminalSection() {
    const isTerminalOpen = useStore((state) => state.isTerminalOpen);
    const hasBooted = useStore((state) => state.hasBooted);
    const unlockSystem = useStore((state) => state.unlockSystem);
    const toggleTerminal = useStore((state) => state.toggleTerminal);

    const [fs, setFs] = useState(buildFS);
    const [history, setHistory] = useState(() =>
        hasBooted
            ? [{ type: 'sys', text: "Session restored. Type 'help' for commands." }]
            : [
                { type: 'boot', lines: [
                    'Booting SilunaOS v1.0...',
                    'Mounting /proc filesystem         [ OK ]',
                    'Starting system logger            [ OK ]',
                    'Starting SSH daemon               [ OK ]',
                    'Loading kernel modules            [ OK ]',
                    '',
                    "siluna@silunaos's password: ••••••••••",
                    '',
                    'Last login: Fri May 30 14:23:11 2026 from 192.168.1.105',
                    "Type 'help' to see available commands.",
                ]}
            ]
    );

    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('~');
    const [isRoot, setIsRoot] = useState(false);
    const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);

    const inputRef = useRef(null);
    const bodyRef = useRef(null);

    // Focus input when terminal opens — preventScroll stops the browser scrolling to the input
    useEffect(() => {
        if (isTerminalOpen) {
            setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 80);
        }
    }, [isTerminalOpen]);

    // Auto scroll
    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [history]);

    // ── Path resolution ──────────────────────────────────────────────────────
    const resolvePath = useCallback((base, target) => {
        if (!target || target === '~') return { node: fs, path: '~' };
        if (target === '/') return null; // no root access for fun

        let parts = base === '~' ? ['~'] : base.split('/');
        const segs = target.split('/').filter(Boolean);

        if (target.startsWith('~')) {
            parts = ['~'];
            segs.shift(); // remove the ~ segment
        }

        for (const seg of segs) {
            if (seg === '.') continue;
            if (seg === '..') { if (parts.length > 1) parts.pop(); }
            else parts.push(seg);
        }

        const fullPath = parts.join('/') || '~';
        let node = fs;
        for (let i = 1; i < parts.length; i++) {
            if (!node || node.type !== 'dir' || !node.content[parts[i]]) return null;
            node = node.content[parts[i]];
        }
        return { node, path: fullPath };
    }, [fs]);

    const cwdNode = useCallback(() => resolvePath(cwd, '.'), [cwd, resolvePath]);

    // ── Output builder ───────────────────────────────────────────────────────
    const push = (items) => setHistory(prev => [...prev, ...items]);

    // ── ls helper ────────────────────────────────────────────────────────────
    const lsOutput = useCallback((node, flags = {}) => {
        const { all, long, human } = flags;
        const entries = node.content || {};
        let names = Object.keys(entries);
        const dotEntries = [
            { name: '.', meta: node.meta },
            { name: '..', meta: { perms: 'drwxr-xr-x', owner: 'root', size: 4096, date: 'May 28 09:14' } }
        ];

        const items = [
            ...(all ? dotEntries : []),
            ...names
                .filter(n => all || !n.startsWith('.'))
                .map(name => ({ name, meta: entries[name].meta, isDir: entries[name].type === 'dir' }))
        ].sort((a, b) => a.name.localeCompare(b.name));

        if (!long) {
            // Short format with colors
            const colored = items.map(item => {
                const isDir = item.isDir || (item.name === '.' || item.name === '..');
                return {
                    type: 'ls-entry',
                    name: item.name + (isDir ? '/' : ''),
                    isDir
                };
            });
            return [{ type: 'ls-short', entries: colored }];
        }

        // Long format
        const total = items.reduce((s, i) => s + (i.meta?.size || 4096), 0);
        const lines = [`total ${Math.ceil(total / 1024)}`];

        const maxSize = Math.max(...items.map(i => String(human ? formatSize(i.meta?.size || 0) : (i.meta?.size || 0)).length));

        for (const item of items) {
            const m = item.meta || { perms: '-rw-r--r--', owner: 'siluna', size: 0, date: 'Jan  1 00:00' };
            const sizeStr = human ? formatSize(m.size) : String(m.size);
            lines.push(
                `${m.perms}  1 ${padEnd(m.owner, 6)} ${padEnd(m.owner, 6)} ${padStart(sizeStr, maxSize)} ${m.date} ${item.name}${item.isDir ? '/' : ''}`
            );
        }
        return lines.map((l, i) => ({
            type: i === 0 ? 'out' : (l.match(/^d/) ? 'ls-dir' : l.match(/^\-rw\-\-\-\-\-\-\-/) ? 'ls-priv' : 'ls-file'),
            text: l
        }));
    }, []);

    // ── Grep helper ──────────────────────────────────────────────────────────
    const grepFile = (pattern, content, flags = {}) => {
        const lines = content.split('\n');
        const results = [];
        lines.forEach((line, idx) => {
            const match = flags.i ? line.toLowerCase().includes(pattern.toLowerCase()) : line.includes(pattern);
            if (match) {
                results.push({
                    type: 'grep-match',
                    lineNum: idx + 1,
                    text: line,
                    pattern,
                    showLine: flags.n
                });
            }
        });
        return results;
    };

    // ── Get git repo for cwd ─────────────────────────────────────────────────
    const getGitRepo = useCallback(() => {
        for (const prefix of Object.keys(GIT_REPOS)) {
            if (cwd === prefix || cwd.startsWith(prefix + '/')) return GIT_REPOS[prefix];
        }
        return null;
    }, [cwd]);

    // ── Command processor ────────────────────────────────────────────────────
    const handleEnter = useCallback(() => {
        const raw = input.trim();
        setInput('');
        if (!raw && !isAwaitingPassword) return;

        // Password flow
        if (isAwaitingPassword) {
            setIsAwaitingPassword(false);
            const masked = raw.replace(/./g, '•');
            if (raw === 'hunter2' || raw === 'root' || raw === 'siluna') {
                setIsRoot(true);
                push([
                    { type: 'cmd', text: masked, cwd, isRoot },
                    { type: 'sys', text: 'Authentication successful. Root access granted.\n[sudo] siluna is now root' }
                ]);
            } else {
                push([
                    { type: 'cmd', text: masked, cwd, isRoot },
                    { type: 'err', text: 'sudo: 3 incorrect password attempts' }
                ]);
            }
            return;
        }

        // Add to cmd history
        if (raw) {
            setCmdHistory(prev => {
                const next = [...prev.filter(c => c !== raw), raw];
                return next.slice(-100);
            });
            setHistoryIdx(-1);
        }

        const prompt = { type: 'cmd', text: raw, cwd, isRoot };
        const parts = raw.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
        const cmd = parts[0]?.toLowerCase() || '';
        const args = parts.slice(1);
        const out = [];

        // ── Commands ──────────────────────────────────────────────────────

        if (cmd === 'clear') { setHistory([]); return; }

        push([prompt]);

        if (cmd === 'start' || cmd === 'sudo unlock') {
            push([{ type: 'sys', text: 'Authentication successful. Unlocking mainframe...' }]);
            setTimeout(() => unlockSystem(), 800);
            return;
        }

        if (cmd === 'help') {
            out.push({ type: 'help', text: '' });
        }

        else if (cmd === 'pwd') {
            const full = cwd === '~' ? '/home/siluna' : `/home/siluna/${cwd.slice(2)}`;
            out.push({ type: 'out', text: full });
        }

        else if (cmd === 'whoami') {
            out.push({ type: 'out', text: isRoot ? 'root' : 'siluna' });
        }

        else if (cmd === 'id') {
            if (isRoot) out.push({ type: 'out', text: 'uid=0(root) gid=0(root) groups=0(root)' });
            else out.push({ type: 'out', text: 'uid=1000(siluna) gid=1000(siluna) groups=1000(siluna),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users)' });
        }

        else if (cmd === 'uname') {
            const flag = args[0] || '';
            if (flag === '-a' || flag === '--all') {
                out.push({ type: 'out', text: 'Linux silunaos 6.1.0-18-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.76-1 (2024-02-01) x86_64 GNU/Linux' });
            } else {
                out.push({ type: 'out', text: 'Linux' });
            }
        }

        else if (cmd === 'hostname') {
            out.push({ type: 'out', text: 'silunaos' });
        }

        else if (cmd === 'date') {
            out.push({ type: 'out', text: new Date().toString() });
        }

        else if (cmd === 'uptime') {
            out.push({ type: 'out', text: ' 08:22:14 up 23 days,  4:12,  1 user,  load average: 0.42, 0.51, 0.48' });
        }

        else if (cmd === 'echo') {
            const str = args.join(' ')
                .replace(/\$HOME/g, '/home/siluna')
                .replace(/\$USER/g, isRoot ? 'root' : 'siluna')
                .replace(/\$SHELL/g, '/bin/zsh')
                .replace(/\$PATH/g, '/home/siluna/.local/bin:/usr/local/bin:/usr/bin:/bin')
                .replace(/\$PWD/g, cwd === '~' ? '/home/siluna' : `/home/siluna/${cwd.slice(2)}`)
                .replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            out.push({ type: 'out', text: str });
        }

        else if (cmd === 'env' || cmd === 'printenv') {
            const envVars = [
                'SHELL=/bin/zsh',
                'USER=' + (isRoot ? 'root' : 'siluna'),
                'HOME=/home/siluna',
                `PWD=${cwd === '~' ? '/home/siluna' : `/home/siluna/${cwd.slice(2)}`}`,
                'EDITOR=nvim',
                'LANG=en_US.UTF-8',
                'TERM=xterm-256color',
                'COLORTERM=truecolor',
                'CC=gcc',
                'CXX=g++',
                'PATH=/home/siluna/.local/bin:/usr/local/bin:/usr/bin:/bin',
                'LS_COLORS=di=34:ln=36:ex=32:fi=0',
            ];
            envVars.forEach(v => out.push({ type: 'out', text: v }));
        }

        else if (cmd === 'which') {
            const binaries = {
                ls: '/bin/ls', cd: '/bin/zsh', cat: '/bin/cat', grep: '/bin/grep',
                find: '/usr/bin/find', git: '/usr/bin/git', vim: '/usr/bin/vim',
                nvim: '/usr/bin/nvim', python3: '/usr/bin/python3', node: '/usr/bin/node',
                gcc: '/usr/bin/gcc', g: '/usr/bin/g++', make: '/usr/bin/make',
                sudo: '/usr/bin/sudo', ssh: '/usr/bin/ssh', curl: '/usr/bin/curl',
                htop: '/usr/bin/htop', neofetch: '/usr/bin/neofetch',
            };
            const bin = args[0];
            if (!bin) out.push({ type: 'err', text: 'which: missing argument' });
            else if (binaries[bin]) out.push({ type: 'out', text: binaries[bin] });
            else out.push({ type: 'err', text: `which: no ${bin} in ($PATH)` });
        }

        else if (cmd === 'ls' || cmd === 'll' || cmd === 'la') {
            // Parse flags
            let flagStr = args.filter(a => a.startsWith('-')).join('');
            let pathArg = args.filter(a => !a.startsWith('-'))[0];

            if (cmd === 'll') flagStr += 'la';
            if (cmd === 'la') flagStr += 'a';

            const flags = {
                all: flagStr.includes('a'),
                long: flagStr.includes('l'),
                human: flagStr.includes('h'),
            };

            const target = pathArg ? resolvePath(cwd, pathArg) : cwdNode();
            if (!target) {
                out.push({ type: 'err', text: `ls: cannot access '${pathArg}': No such file or directory` });
            } else if (target.node.type === 'file') {
                out.push({ type: 'out', text: pathArg });
            } else {
                lsOutput(target.node, flags).forEach(e => out.push(e));
            }
        }

        else if (cmd === 'cd') {
            const target = args[0] || '~';
            if (target === '-') {
                out.push({ type: 'err', text: 'cd: OLDPWD not set' });
            } else {
                const resolved = resolvePath(cwd, target);
                if (!resolved) {
                    out.push({ type: 'err', text: `cd: no such file or directory: ${target}` });
                } else if (resolved.node.type !== 'dir') {
                    out.push({ type: 'err', text: `cd: not a directory: ${target}` });
                } else if (resolved.path === '~/..ssh' || resolved.node.meta?.perms?.includes('------') && !isRoot) {
                    out.push({ type: 'err', text: `cd: permission denied: ${target}` });
                } else {
                    setCwd(resolved.path);
                }
            }
        }

        else if (cmd === 'cat') {
            if (!args.length) { out.push({ type: 'err', text: 'cat: missing file operand' }); }
            else {
                for (const arg of args) {
                    const resolved = resolvePath(cwd, arg);
                    if (!resolved) out.push({ type: 'err', text: `cat: ${arg}: No such file or directory` });
                    else if (resolved.node.type === 'dir') out.push({ type: 'err', text: `cat: ${arg}: Is a directory` });
                    else if (resolved.node.content === 'Permission denied' && !isRoot) out.push({ type: 'err', text: `cat: ${arg}: Permission denied` });
                    else {
                        const ext = arg.split('.').pop();
                        out.push({ type: 'code', text: resolved.node.content, ext });
                    }
                }
            }
        }

        else if (cmd === 'grep') {
            const flags = { i: false, n: false, r: false };
            const nonFlags = [];
            for (const a of args) {
                if (a.startsWith('-')) { if (a.includes('i')) flags.i = true; if (a.includes('n')) flags.n = true; if (a.includes('r')) flags.r = true; }
                else nonFlags.push(a);
            }
            const [pattern, fileArg] = nonFlags;
            if (!pattern) { out.push({ type: 'err', text: 'grep: missing pattern' }); }
            else if (!fileArg) { out.push({ type: 'err', text: 'grep: missing file operand' }); }
            else {
                const resolved = resolvePath(cwd, fileArg);
                if (!resolved) out.push({ type: 'err', text: `grep: ${fileArg}: No such file or directory` });
                else if (resolved.node.type === 'dir') out.push({ type: 'err', text: `grep: ${fileArg}: Is a directory` });
                else {
                    const results = grepFile(pattern, resolved.node.content, flags);
                    if (results.length === 0) { /* no output, exit 1 */ }
                    else results.forEach(r => out.push(r));
                }
            }
        }

        else if (cmd === 'find') {
            const searchPath = args[0] && !args[0].startsWith('-') ? args[0] : '.';
            const nameIdx = args.indexOf('-name');
            const pattern = nameIdx >= 0 ? args[nameIdx + 1]?.replace(/\*/g, '') : null;
            const typeIdx = args.indexOf('-type');
            const typeFilter = typeIdx >= 0 ? args[typeIdx + 1] : null;

            const resolved = resolvePath(cwd, searchPath);
            if (!resolved) { out.push({ type: 'err', text: `find: '${searchPath}': No such file or directory` }); }
            else {
                const results = [];
                const walk = (node, path) => {
                    if (node.type === 'dir' && node.content) {
                        for (const [name, child] of Object.entries(node.content)) {
                            const childPath = `${path}/${name}`;
                            const matchType = !typeFilter || (typeFilter === 'f' && child.type === 'file') || (typeFilter === 'd' && child.type === 'dir');
                            const matchName = !pattern || name.includes(pattern);
                            if (matchType && matchName) results.push(childPath);
                            if (child.type === 'dir') walk(child, childPath);
                        }
                    }
                };
                const base = searchPath === '.' ? '.' : searchPath;
                walk(resolved.node, base);
                if (results.length === 0) { /* nothing found */ }
                else results.forEach(r => out.push({ type: 'out', text: r }));
            }
        }

        else if (cmd === 'touch') {
            if (!args[0]) { out.push({ type: 'err', text: 'touch: missing file operand' }); }
            else {
                const parentPath = args[0].includes('/') ? args[0].slice(0, args[0].lastIndexOf('/')) : '.';
                const fileName = args[0].split('/').pop();
                const parentResolved = resolvePath(cwd, parentPath);
                if (!parentResolved || parentResolved.node.type !== 'dir') {
                    out.push({ type: 'err', text: `touch: cannot touch '${args[0]}': No such file or directory` });
                } else {
                    setFs(prev => {
                        const next = JSON.parse(JSON.stringify(prev));
                        const node = parentResolved.path === '~'
                            ? next
                            : (() => {
                                let n = next;
                                for (const seg of parentResolved.path.split('/').slice(1)) n = n.content[seg];
                                return n;
                            })();
                        node.content[fileName] = {
                            type: 'file',
                            meta: { perms: '-rw-r--r--', owner: 'siluna', size: 0, date: 'May 31 ' + new Date().toTimeString().slice(0, 5) },
                            content: ''
                        };
                        return next;
                    });
                }
            }
        }

        else if (cmd === 'mkdir') {
            if (!args[0]) { out.push({ type: 'err', text: 'mkdir: missing operand' }); }
            else {
                const dirName = args[args.length - 1]; // ignore flags like -p
                const parentPath = '.';
                const parentResolved = resolvePath(cwd, parentPath);
                if (!parentResolved || parentResolved.node.type !== 'dir') {
                    out.push({ type: 'err', text: `mkdir: cannot create directory '${dirName}'` });
                } else if (parentResolved.node.content[dirName]) {
                    out.push({ type: 'err', text: `mkdir: cannot create directory '${dirName}': File exists` });
                } else {
                    setFs(prev => {
                        const next = JSON.parse(JSON.stringify(prev));
                        const node = cwd === '~'
                            ? next
                            : (() => {
                                let n = next;
                                for (const seg of cwd.split('/').slice(1)) n = n.content[seg];
                                return n;
                            })();
                        node.content[dirName] = {
                            type: 'dir',
                            meta: { perms: 'drwxr-xr-x', owner: 'siluna', size: 4096, date: 'May 31 ' + new Date().toTimeString().slice(0, 5) },
                            content: {}
                        };
                        return next;
                    });
                }
            }
        }

        else if (cmd === 'rm') {
            const flags = args.filter(a => a.startsWith('-')).join('');
            const targets = args.filter(a => !a.startsWith('-'));
            if (!targets[0]) { out.push({ type: 'err', text: 'rm: missing operand' }); }
            else {
                for (const t of targets) {
                    const resolved = resolvePath(cwd, t);
                    if (!resolved) out.push({ type: 'err', text: `rm: cannot remove '${t}': No such file or directory` });
                    else if (resolved.node.type === 'dir' && !flags.includes('r')) {
                        out.push({ type: 'err', text: `rm: cannot remove '${t}': Is a directory` });
                    } else {
                        // Remove from FS
                        const name = t.split('/').pop();
                        const parentPath = t.includes('/') ? t.slice(0, t.lastIndexOf('/')) : '.';
                        const parentResolved = resolvePath(cwd, parentPath);
                        setFs(prev => {
                            const next = JSON.parse(JSON.stringify(prev));
                            const node = parentResolved.path === '~'
                                ? next
                                : (() => {
                                    let n = next;
                                    for (const seg of parentResolved.path.split('/').slice(1)) n = n.content[seg];
                                    return n;
                                })();
                            delete node.content[name];
                            return next;
                        });
                    }
                }
            }
        }

        else if (cmd === 'cp') {
            if (args.length < 2) out.push({ type: 'err', text: 'cp: missing destination' });
            else {
                const src = resolvePath(cwd, args[0]);
                if (!src) out.push({ type: 'err', text: `cp: '${args[0]}': No such file or directory` });
                else if (src.node.type === 'dir') out.push({ type: 'err', text: `cp: omitting directory '${args[0]}' — use -r` });
                else {
                    const dstName = args[1].split('/').pop();
                    const dstParentPath = args[1].includes('/') ? args[1].slice(0, args[1].lastIndexOf('/')) : '.';
                    const dstParent = resolvePath(cwd, dstParentPath);
                    if (!dstParent || dstParent.node.type !== 'dir') {
                        out.push({ type: 'err', text: `cp: '${args[1]}': No such file or directory` });
                    } else {
                        setFs(prev => {
                            const next = JSON.parse(JSON.stringify(prev));
                            const node = dstParent.path === '~'
                                ? next
                                : (() => { let n = next; for (const seg of dstParent.path.split('/').slice(1)) n = n.content[seg]; return n; })();
                            node.content[dstName] = JSON.parse(JSON.stringify(src.node));
                            return next;
                        });
                    }
                }
            }
        }

        else if (cmd === 'mv') {
            if (args.length < 2) out.push({ type: 'err', text: 'mv: missing destination' });
            else {
                const src = resolvePath(cwd, args[0]);
                if (!src) out.push({ type: 'err', text: `mv: '${args[0]}': No such file or directory` });
                else {
                    const srcName = args[0].split('/').pop();
                    const srcParentPath = args[0].includes('/') ? args[0].slice(0, args[0].lastIndexOf('/')) : '.';
                    const srcParent = resolvePath(cwd, srcParentPath);
                    const dstName = args[1].split('/').pop();
                    const dstParentPath = args[1].includes('/') ? args[1].slice(0, args[1].lastIndexOf('/')) : '.';
                    const dstParent = resolvePath(cwd, dstParentPath);
                    if (!dstParent || dstParent.node.type !== 'dir') {
                        out.push({ type: 'err', text: `mv: '${args[1]}': No such file or directory` });
                    } else {
                        setFs(prev => {
                            const next = JSON.parse(JSON.stringify(prev));
                            const srcNode = srcParent.path === '~'
                                ? next
                                : (() => { let n = next; for (const seg of srcParent.path.split('/').slice(1)) n = n.content[seg]; return n; })();
                            const dstNode = dstParent.path === '~'
                                ? next
                                : (() => { let n = next; for (const seg of dstParent.path.split('/').slice(1)) n = n.content[seg]; return n; })();
                            dstNode.content[dstName] = JSON.parse(JSON.stringify(srcNode.content[srcName]));
                            delete srcNode.content[srcName];
                            return next;
                        });
                    }
                }
            }
        }

        else if (cmd === 'history') {
            cmdHistory.slice(-20).forEach((c, i) => {
                out.push({ type: 'out', text: `  ${String(cmdHistory.length - 19 + i).padStart(4)}  ${c}` });
            });
        }

        else if (cmd === 'git') {
            const subCmd = args[0];
            const repo = getGitRepo();
            if (!subCmd) {
                out.push({ type: 'out', text: 'usage: git [-v | --version] [-h | --help] [-C <path>] [-c <name>=<value>]' });
                out.push({ type: 'out', text: '           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]' });
                out.push({ type: 'out', text: '           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]' });
            } else if (!repo) {
                out.push({ type: 'err', text: `fatal: not a git repository (or any of the parent directories): .git` });
            } else if (subCmd === 'status') {
                out.push({ type: 'git-status', text: repo.status });
            } else if (subCmd === 'log') {
                const oneline = args.includes('--oneline');
                if (oneline) {
                    repo.log.forEach(entry => out.push({ type: 'git-log', text: entry }));
                } else {
                    repo.log.forEach((entry, i) => {
                        const [hash, ...msg] = entry.split(' ');
                        out.push({ type: 'git-log-full', hash, msg: msg.join(' '), date: `Fri May ${31 - i} 14:${String(22 - i * 3).padStart(2, '0')}:00 2026 +0530` });
                    });
                }
            } else if (subCmd === 'branch') {
                repo.branches.forEach(b => {
                    out.push({ type: 'out', text: (b === repo.branch ? '* ' : '  ') + b });
                });
            } else if (subCmd === 'diff') {
                out.push({ type: 'git-diff', text: `diff --git a/lexer.c b/lexer.c\nindex 4f2a1b3..9c8d7e2 100644\n--- a/lexer.c\n+++ b/lexer.c\n@@ -24,6 +24,10 @@ Token next_token(Lexer *l) {\n     if (isalpha(l->source[l->pos]))\n         return lex_identifier(l);\n     if (isdigit(l->source[l->pos]))\n         return lex_number(l);\n+    if (l->source[l->pos] == '\\0')\n+        return (Token){ TOKEN_EOF, NULL, l->line };\n     return lex_symbol(l);\n }` });
            } else if (subCmd === 'add') {
                out.push({ type: 'sys', text: '' }); // silent success
            } else if (subCmd === 'commit') {
                const mIdx = args.indexOf('-m');
                const msg = mIdx >= 0 ? args[mIdx + 1]?.replace(/^"|"$/g, '').replace(/^'|'$/g, '') : null;
                if (!msg) out.push({ type: 'err', text: 'error: switch `m\' requires a value' });
                else out.push({ type: 'out', text: `[${repo.branch} a1b2c3d] ${msg}\n 1 file changed, 4 insertions(+)` });
            } else if (subCmd === 'push') {
                out.push({ type: 'sys', text: `Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nDelta compression using up to 12 threads\nCompressing objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 412 bytes | 412.00 KiB/s, done.\nTotal 3 (delta 2), reused 0 (delta 0), pack-reused 0\nTo github.com:GitGuru29/${cwd.split('/').pop()}.git\n   e81d047..a3f9c12  ${repo.branch} -> ${repo.branch}` });
            } else if (subCmd === 'pull') {
                out.push({ type: 'out', text: `Already up to date.` });
            } else if (subCmd === 'clone') {
                out.push({ type: 'err', text: `fatal: destination path already exists` });
            } else {
                out.push({ type: 'err', text: `git: '${subCmd}' is not a git command. See 'git --help'.` });
            }
        }

        else if (cmd === 'ssh') {
            const host = args.find(a => !a.startsWith('-'));
            if (!host) out.push({ type: 'err', text: 'ssh: missing hostname' });
            else out.push({ type: 'err', text: `ssh: connect to host ${host} port 22: Connection refused` });
        }

        else if (cmd === 'curl') {
            out.push({ type: 'err', text: 'curl: (6) Could not resolve host: sandbox mode active' });
        }

        else if (cmd === 'ping') {
            const host = args.find(a => !a.startsWith('-')) || 'localhost';
            if (host === 'localhost' || host === '127.0.0.1') {
                out.push({ type: 'out', text: `PING ${host} (127.0.0.1) 56(84) bytes of data.\n64 bytes from ${host} (127.0.0.1): icmp_seq=1 ttl=64 time=0.045 ms\n64 bytes from ${host} (127.0.0.1): icmp_seq=2 ttl=64 time=0.038 ms\n\n--- ${host} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss` });
            } else {
                out.push({ type: 'err', text: `ping: ${host}: Temporary failure in name resolution` });
            }
        }

        else if (cmd === 'neofetch') {
            out.push({ type: 'neofetch' });
        }

        else if (cmd === 'htop' || cmd === 'top') {
            out.push({ type: 'htop' });
        }

        else if (cmd === 'python3' || cmd === 'python') {
            if (args[0] === '--version' || args[0] === '-V') out.push({ type: 'out', text: 'Python 3.11.2' });
            else out.push({ type: 'sys', text: 'Python 3.11.2 (main, Mar 13 2023, 12:18:29) [GCC 12.2.0]\nType "help", "copyright", "credits" or "license" for more information.\n>>> (This is a simulated REPL. Type exit() to leave)' });
        }

        else if (cmd === 'node') {
            if (args[0] === '--version' || args[0] === '-v') out.push({ type: 'out', text: 'v20.11.0' });
            else out.push({ type: 'sys', text: 'Welcome to Node.js v20.11.0.\nType ".help" for more information.\n> (simulated REPL)' });
        }

        else if (cmd === 'gcc' || cmd === 'g++') {
            if (args[0] === '--version') out.push({ type: 'out', text: `${cmd} (Debian 12.2.0-14) 12.2.0\nCopyright (C) 2022 Free Software Foundation, Inc.` });
            else {
                const src = args.find(a => !a.startsWith('-'));
                if (!src) out.push({ type: 'err', text: `${cmd}: fatal error: no input files\ncompilation terminated.` });
                else out.push({ type: 'out', text: '' });
            }
        }

        else if (cmd === 'make') {
            const resolved = cwdNode();
            if (resolved?.node?.content?.Makefile) {
                out.push({ type: 'sys', text: 'gcc -Wall -Wextra -O2 -c main.c -o main.o\ngcc -Wall -Wextra -O2 -c lexer.c -o lexer.o\ngcc -Wall -Wextra -O2 main.o lexer.o -o aerolang' });
            } else {
                out.push({ type: 'err', text: 'make: *** No targets specified and no makefile found.  Stop.' });
            }
        }

        else if (cmd === 'man') {
            const topic = args[0];
            if (!topic) out.push({ type: 'err', text: 'What manual page do you want?' });
            else if (MAN_PAGES[topic]) out.push({ type: 'man', text: MAN_PAGES[topic] });
            else out.push({ type: 'err', text: `No manual entry for ${topic}` });
        }

        else if (cmd === 'sudo') {
            const subArgs = args;
            if (subArgs[0] === 'su' || subArgs[0] === '-s') {
                setIsAwaitingPassword(true);
                out.push({ type: 'sys', text: '[sudo] password for siluna: ' });
            } else if (subArgs[0] === 'rm' && subArgs[1] === '-rf' && subArgs[2] === '/') {
                out.push({ type: 'err', text: 'sudo: rm -rf /: Operation not permitted (protected by safety guard)' });
            } else if (isRoot) {
                // Execute sub command as root
                out.push({ type: 'sys', text: `[sudo] Running as root: ${subArgs.join(' ')}` });
            } else {
                setIsAwaitingPassword(true);
                out.push({ type: 'sys', text: `[sudo] password for siluna: ` });
            }
        }

        else if (cmd === 'exit' || cmd === 'quit') {
            toggleTerminal();
            return;
        }

        else if (cmd === 'about') {
            out.push({ type: 'out', text:
`Siluna Nusal Dangalla
──────────────────────────────────────────────────
Final-year Software Engineering undergraduate.
Building high-performance, system-level software.

Focus Areas:
  · Native Android development (NDK, AOSP, Kotlin)
  · Linux-based tooling and kernel internals
  · Compiler & language design (AeroLang)
  · Low-level system behavior & performance

Philosophy:
  Engineer software from the inside out — understand
  how systems operate at their core before shaping
  the user experience on top.

Currently:
  BSc Software Engineering (Final Year)
  Building AeroLang — a compiler targeting native Android

Site: silunadangalla.vercel.app` });
        }

        else if (cmd === 'skills') {
            out.push({ type: 'skills' });
        }

        else if (cmd === 'contact') {
            out.push({ type: 'out', text:
`──────────────────────────────────────
Contact Siluna Nusal Dangalla
──────────────────────────────────────
Email    : sdangalla44@gmail.com
GitHub   : https://github.com/GitGuru29
LinkedIn : https://linkedin.com/in/siluna-dangalla-0744a02b1
Portfolio: https://silunadangalla.vercel.app
Resume   : /home/siluna/Documents/Siluna_CV.pdf` });
        }

        else if (cmd === 'github') {
            out.push({ type: 'out', text:
`github.com/GitGuru29
──────────────────────────────────────
Languages: C++  ·  Kotlin  ·  Python  ·  Bash
Focus:     Systems  ·  Android  ·  Compilers

Pinned Repositories:
  aerolang         — Compiler targeting native Android via LLVM/NDK
  NeoMonitor       — Real-time Linux process monitor reading /proc
  Bybridge         — Cross-device daemon (C++ TCP/WebSocket)
  AegisLayer       — On-device ML daemon for Android (Kotlin)
  AutoGpuSwitcher  — Automated GPU switching for Arch Linux
  TitanShare       — Android ↔ Linux control suite with uinput

Stats: 30+ repos · Active contributor` });
        }

        else if (cmd === 'resume') {
            out.push({ type: 'out', text:
`Siluna Nusal Dangalla
──────────────────────────────────────
Email    : sdangalla44@gmail.com
LinkedIn : linkedin.com/in/siluna-dangalla-0744a02b1

Opening CV in new tab...` });
            setTimeout(() => window.open('/Siluna_Nusal_CV.pdf', '_blank'), 400);
        }

        else if (cmd === 'projects') {
            out.push({ type: 'projects' });
        }

        else if (cmd === 'timeline' || cmd === 'history --career') {
            out.push({ type: 'out', text:
`Build Log — Career Timeline
──────────────────────────────────────────────────────────
2023 Q3  [EDUCATION] Started Software Engineering BSc
          Dove into C/C++, Linux, Android outside curriculum

2024 Q1  [PROJECT]   Bybridge — Cross-Device Daemon
          C++ daemon · WebSocket/TCP · H.264 RTP · Biometric auth

2024 Q3  [PROJECT]   NeonMonitor & Linux CLI Tooling
          Real-time /proc reader · C++ · Live CPU/memory telemetry

2024 Q4  [PROJECT]   AutoGpuSwitcher for Arch Linux
          ELF binary analysis · pacman hooks · NVIDIA/AMD switching

2025 Q1  [PROJECT]   AeroLang — Language Design Begins
          Custom compiler · C++ · LLVM · Lexer → Parser → AST → NDK

2026 Q1  [PROJECT]   TitanShare — Android ↔ Linux Suite
          uinput emulation · mDNS · systemd · Custom binary protocol

2026 Q2  [PROJECT]   AegisLayer — On-Device ML Daemon
          Kotlin · Zero-dependency ML · Passive habit learning

2026 Q2  [ONGOING]   Market Regime Intelligence
          Python · Crypto trading · AI regime classification` });
        }

        else if (cmd === 'start') {
            push([{ type: 'sys', text: 'Authentication successful. Unlocking mainframe...' }]);
            setTimeout(() => unlockSystem(), 800);
            return;
        }

        else if (cmd === '' ) {
            // Empty enter — do nothing
        }

        else {
            out.push({ type: 'err', text: `zsh: command not found: ${cmd}` });
        }

        if (out.length > 0) push(out);

    }, [input, isAwaitingPassword, cwd, isRoot, cmdHistory, fs, lsOutput, resolvePath, cwdNode, getGitRepo, unlockSystem, toggleTerminal]);

    // ── Keyboard handler ─────────────────────────────────────────────────────
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') { handleEnter(); return; }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!cmdHistory.length) return;
            const newIdx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
            setHistoryIdx(newIdx);
            setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                const newIdx = historyIdx - 1;
                setHistoryIdx(newIdx);
                setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
            } else {
                setHistoryIdx(-1);
                setInput('');
            }
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const parts = input.split(' ');
            if (parts.length === 1) {
                const allCmds = ['ls', 'll', 'la', 'cd', 'cat', 'pwd', 'echo', 'grep', 'find', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'git', 'make', 'gcc', 'g++', 'sudo', 'man', 'which', 'uname', 'date', 'uptime', 'whoami', 'id', 'env', 'history', 'neofetch', 'htop', 'top', 'python3', 'node', 'ssh', 'ping', 'curl', 'clear', 'exit', 'help', 'about', 'skills', 'projects', 'github', 'resume', 'contact', 'start'];
                const matches = allCmds.filter(c => c.startsWith(input));
                if (matches.length === 1) setInput(matches[0] + ' ');
                else if (matches.length > 1) push([{ type: 'tab-complete', entries: matches }]);
            } else {
                const partial = parts[parts.length - 1];
                const node = cwdNode();
                if (node?.node?.content) {
                    const matches = Object.keys(node.node.content).filter(k => k.startsWith(partial));
                    if (matches.length === 1) {
                        const isDir = node.node.content[matches[0]].type === 'dir';
                        parts[parts.length - 1] = matches[0] + (isDir ? '/' : '');
                        setInput(parts.join(' '));
                    } else if (matches.length > 1) {
                        push([{ type: 'tab-complete', entries: matches }]);
                    }
                }
            }
        }

        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            push([{ type: 'cmd', text: input + '^C', cwd, isRoot }]);
            setInput('');
        }
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            setHistory([]);
        }
    }, [input, historyIdx, cmdHistory, handleEnter, cwd, isRoot, cwdNode]);

    // ── Prompt component ─────────────────────────────────────────────────────
    const Prompt = ({ c = cwd, root = isRoot, active = false }) => {
        const pathDisplay = c === '~' ? '~' : c;
        return (
            <div className="flex items-center gap-0 flex-wrap leading-tight select-none">
                <span style={{ color: root ? '#f87171' : '#4ade80' }}>
                    {root ? 'root' : 'siluna'}
                </span>
                <span style={{ color: '#94a3b8' }}>@</span>
                <span style={{ color: '#60a5fa' }}>silunaos</span>
                <span style={{ color: '#64748b' }}> </span>
                <span style={{ color: '#c4b5fd' }}>{pathDisplay}</span>
                <span style={{ color: '#64748b' }}> </span>
                <span style={{ color: root ? '#f87171' : '#4ade80' }}>❯</span>
                {active && <span style={{ color: '#64748b' }}>&nbsp;</span>}
            </div>
        );
    };

    // ── Render history entry ─────────────────────────────────────────────────
    const renderEntry = (entry, idx) => {
        switch (entry.type) {
            case 'boot':
                return (
                    <div key={idx} className="mb-4">
                        {entry.lines.map((l, i) => (
                            <div key={i} style={{ color: l.includes('[ OK ]') ? '#4ade80' : '#94a3b8' }} className="leading-relaxed">{l}</div>
                        ))}
                    </div>
                );
            case 'sys':
                return <div key={idx} style={{ color: '#94a3b8' }} className="leading-relaxed whitespace-pre-wrap mb-0.5">{entry.text}</div>;
            case 'err':
                return <div key={idx} style={{ color: '#f87171' }} className="leading-relaxed whitespace-pre-wrap mb-0.5">{entry.text}</div>;
            case 'out':
                return <div key={idx} style={{ color: '#cbd5e1' }} className="leading-relaxed whitespace-pre-wrap mb-0.5">{entry.text}</div>;
            case 'code':
                return (
                    <pre key={idx} className="leading-relaxed overflow-x-auto mb-1 text-[13px]" style={{ color: '#7dd3fc' }}>
                        {entry.text}
                    </pre>
                );
            case 'cmd':
                return (
                    <div key={idx} className="mt-3 mb-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Prompt c={entry.cwd} root={entry.isRoot} />
                            <span style={{ color: '#f1f5f9' }}>{entry.text}</span>
                        </div>
                    </div>
                );
            case 'ls-short':
                return (
                    <div key={idx} className="flex flex-wrap gap-x-6 gap-y-0.5 mb-1">
                        {entry.entries.map((e, i) => (
                            <span key={i} style={{ color: e.isDir ? '#60a5fa' : '#cbd5e1' }} className="font-mono">
                                {e.name}
                            </span>
                        ))}
                    </div>
                );
            case 'ls-dir':
                return <div key={idx} style={{ color: '#60a5fa' }} className="font-mono text-[13px] whitespace-pre leading-snug">{entry.text}</div>;
            case 'ls-file':
                return <div key={idx} style={{ color: '#cbd5e1' }} className="font-mono text-[13px] whitespace-pre leading-snug">{entry.text}</div>;
            case 'ls-priv':
                return <div key={idx} style={{ color: '#f87171' }} className="font-mono text-[13px] whitespace-pre leading-snug">{entry.text}</div>;
            case 'grep-match':
                return (
                    <div key={idx} style={{ color: '#cbd5e1' }} className="font-mono text-[13px] leading-snug whitespace-pre-wrap">
                        {entry.showLine && <span style={{ color: '#94a3b8' }}>{entry.lineNum}:</span>}
                        {entry.text.split(new RegExp(`(${entry.pattern})`, 'gi')).map((part, i) =>
                            part.toLowerCase() === entry.pattern.toLowerCase()
                                ? <span key={i} style={{ color: '#fbbf24', fontWeight: 'bold' }}>{part}</span>
                                : part
                        )}
                    </div>
                );
            case 'git-status':
                return (
                    <pre key={idx} style={{ color: '#94a3b8' }} className="text-[13px] leading-relaxed whitespace-pre-wrap mb-1">
                        {entry.text.split('\n').map((line, i) => {
                            const color = line.includes('modified:') ? '#fbbf24' : line.includes('On branch') || line.includes('up to date') ? '#4ade80' : '#94a3b8';
                            return <div key={i} style={{ color }}>{line}</div>;
                        })}
                    </pre>
                );
            case 'git-log':
                return (
                    <div key={idx} className="font-mono text-[13px] leading-snug">
                        <span style={{ color: '#f59e0b' }}>{entry.text.slice(0, 7)}</span>
                        <span style={{ color: '#cbd5e1' }}>{entry.text.slice(7)}</span>
                    </div>
                );
            case 'git-log-full':
                return (
                    <div key={idx} className="mb-2">
                        <div><span style={{ color: '#f59e0b' }}>commit {entry.hash}a1b2c3def456</span></div>
                        <div style={{ color: '#94a3b8' }}>Date:   {entry.date}</div>
                        <div style={{ color: '#f1f5f9' }} className="ml-4 mt-1">{entry.msg}</div>
                    </div>
                );
            case 'git-diff':
                return (
                    <pre key={idx} className="text-[12px] leading-snug whitespace-pre-wrap mb-1 overflow-x-auto">
                        {entry.text.split('\n').map((line, i) => {
                            const color = line.startsWith('+') && !line.startsWith('+++') ? '#4ade80' : line.startsWith('-') && !line.startsWith('---') ? '#f87171' : line.startsWith('@@') ? '#c4b5fd' : '#94a3b8';
                            return <div key={i} style={{ color }}>{line}</div>;
                        })}
                    </pre>
                );
            case 'man':
                return (
                    <pre key={idx} style={{ color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid #334155' }}
                        className="text-[13px] leading-relaxed whitespace-pre-wrap mb-1 p-3 rounded">
                        {entry.text}
                    </pre>
                );
            case 'neofetch':
                return (
                    <div key={idx} className="mb-2 font-mono text-[12px] md:text-[13px] leading-snug">
                        {NEOFETCH_OUTPUT.map((row, i) => (
                            <div key={i} className="flex gap-2">
                                <span style={{ color: row.color }}>{row.text}</span>
                                {row.suffix && (
                                    <span>
                                        <span style={{ color: row.suffix.color }}>{row.suffix.text}</span>
                                        <span style={{ color: row.suffix2?.color }}>{row.suffix2?.text}</span>
                                        <span style={{ color: row.suffix3?.color }}>{row.suffix3?.text}</span>
                                    </span>
                                )}
                                {row.info && <span style={{ color: '#94a3b8' }}>{row.info}</span>}
                                {row.colors && (
                                    <span className="flex gap-1 items-center">
                                        {['#1e2a3a','#ef4444','#22c55e','#eab308','#3b82f6','#a855f7','#06b6d4','#94a3b8'].map((c, ci) => (
                                            <span key={ci} style={{ background: c, width: 14, height: 14, display: 'inline-block', borderRadius: 2 }} />
                                        ))}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 'htop':
                return (
                    <div key={idx} className="mb-2 font-mono text-[12px] bg-black/40 p-2 rounded border border-white/5">
                        <div style={{ color: '#4ade80' }}>  PID USER      PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command</div>
                        <div style={{ color: '#60a5fa' }}>12847 siluna     20   0  4.2G  2.1G  450M S 42.3 13.5  12:33.44 /usr/bin/g++ aerolang/main.c</div>
                        <div style={{ color: '#cbd5e1' }}>  941 siluna     20   0  225M  18M   12M S  8.1  0.1  0:04.12 /usr/bin/node server.js</div>
                        <div style={{ color: '#cbd5e1' }}>    1 root       20   0   168M  12M   8M S  0.0  0.0  0:03.55 /sbin/init</div>
                        <div className="mt-1" style={{ color: '#64748b' }}>Tasks: 149, 451 thr; 1 running · Load: 0.42 · Uptime: 23 days 04:12</div>
                        <div style={{ color: '#64748b' }}>Memory[|||||||||         4.2G/15.5G]  Swap[          0K/2G]</div>
                    </div>
                );
            case 'tab-complete':
                return (
                    <div key={idx} className="flex flex-wrap gap-x-6 gap-y-0.5 mb-1" style={{ color: '#94a3b8' }}>
                        {entry.entries.map((e, i) => <span key={i}>{e}</span>)}
                    </div>
                );
            case 'skills':
                return (
                    <div key={idx} className="mb-3 text-[13px]">
                        <div style={{ color: '#4ade80' }} className="mb-2 font-bold">Technical Specifications — Systems & Capabilities</div>
                        <div className="mb-2">
                            <div style={{ color: '#94a3b8' }} className="mb-1 text-[11px] uppercase tracking-widest">Core Languages</div>
                            {[
                                { name: 'C / C++',       pct: 95 },
                                { name: 'Kotlin / Java', pct: 90 },
                                { name: 'Bash / Shell',  pct: 85 },
                                { name: 'Python',        pct: 80 },
                            ].map(({ name, pct }) => {
                                const filled = Math.round(pct / 100 * 20);
                                const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
                                return (
                                    <div key={name} className="flex items-center gap-3 mb-0.5">
                                        <span style={{ color: '#94a3b8', minWidth: 100 }}>{name}</span>
                                        <span style={{ color: '#3b82f6' }}>{bar}</span>
                                        <span style={{ color: '#64748b' }}>{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mb-2">
                            <div style={{ color: '#94a3b8' }} className="mb-1 text-[11px] uppercase tracking-widest">OS & Kernel</div>
                            {[
                                { name: 'Linux Internals', pct: 92 },
                                { name: 'Android NDK',     pct: 88 },
                            ].map(({ name, pct }) => {
                                const filled = Math.round(pct / 100 * 20);
                                const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);
                                return (
                                    <div key={name} className="flex items-center gap-3 mb-0.5">
                                        <span style={{ color: '#94a3b8', minWidth: 100 }}>{name}</span>
                                        <span style={{ color: '#c4b5fd' }}>{bar}</span>
                                        <span style={{ color: '#64748b' }}>{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            <div style={{ color: '#94a3b8' }} className="mb-1 text-[11px] uppercase tracking-widest">Architecture & Tooling</div>
                            <div style={{ color: '#60a5fa' }}>LLVM IR · Compiler Design · System Design · Reverse Engineering</div>
                            <div style={{ color: '#60a5fa' }}>POSIX · CMake/GCC · Docker · AWS · mDNS · uinput · /proc</div>
                        </div>
                    </div>
                );
            case 'projects':
                return (
                    <div key={idx} className="mb-3 text-[13px]">
                        <div style={{ color: '#4ade80' }} className="mb-2 font-bold">Projects — silunadangalla.vercel.app</div>
                        {[
                            { name: 'AeroLang',                       role: 'Compiler Dev',             tech: 'C++ · LLVM · NDK',           cat: 'OS' },
                            { name: 'AegisLayer',                     role: 'Android ML Daemon',         tech: 'Kotlin · On-device ML',      cat: 'AI' },
                            { name: 'Bybridge',                       role: 'C++ Daemon / WebSockets',   tech: 'C++ · TCP · H.264 RTP',      cat: 'LX' },
                            { name: 'TitanShare',                     role: 'C++ Systems Integration',  tech: 'C++ · uinput · mDNS',        cat: 'LX' },
                            { name: 'TitanShare (Android)',           role: 'Android / Network',         tech: 'Kotlin · Binary Protocol',   cat: 'AN' },
                            { name: 'AutoGpuSwitcher',                role: 'Linux Systems',             tech: 'Bash · ELF · pacman hooks',  cat: 'LX' },
                            { name: 'NeonMonitor',                    role: 'Linux CLI Tool',            tech: 'C++ · /proc · ncurses',      cat: 'LX' },
                            { name: 'Market Regime Intelligence',     role: 'Quant Researcher',          tech: 'Python · AI · Crypto',       cat: 'AI' },
                            { name: 'Android Game System Controller', role: 'Android Performance',       tech: 'Kotlin · System-level',      cat: 'AN' },
                            { name: 'LankaSmartMart',                 role: 'Android / E-Commerce',      tech: 'Compose · Firebase · MLKit', cat: 'AN' },
                        ].map(({ name, role, tech, cat }) => {
                            const catColor = cat === 'AI' ? '#a78bfa' : cat === 'LX' ? '#4ade80' : cat === 'AN' ? '#60a5fa' : '#f59e0b';
                            return (
                                <div key={name} className="mb-0.5 flex flex-wrap gap-2">
                                    <span style={{ color: '#f1f5f9', minWidth: 230 }}>{name}</span>
                                    <span style={{ color: '#64748b', minWidth: 160 }}>{role}</span>
                                    <span style={{ color: catColor }}>{tech}</span>
                                </div>
                            );
                        })}
                        <div style={{ color: '#64748b' }} className="mt-1 text-[11px]">Tip: type 'timeline' for career log · 'github' for repos</div>
                    </div>
                );
            case 'help':
                return (
                    <div key={idx} className="mb-2 text-[13px] leading-relaxed">
                        <div style={{ color: '#4ade80' }} className="mb-1 font-bold">Available commands:</div>
                        {[
                            ['Navigation', 'ls, ls -la, ls -lah, cd, pwd, find'],
                            ['Files',      'cat, grep -in, touch, mkdir, rm, cp, mv'],
                            ['Git',        'git status, git log --oneline, git branch, git diff'],
                            ['System',     'uname -a, uptime, date, whoami, id, env, which, history'],
                            ['Dev',        'gcc, g++, make, python3, node, neofetch, htop'],
                            ['Portfolio',  'about, skills, projects, timeline, github, resume, contact'],
                            ['Shell',      'echo $HOME, man <cmd>, sudo su, exit, clear, Ctrl+L, Ctrl+C'],
                        ].map(([cat, cmds]) => (
                            <div key={cat} className="flex gap-3">
                                <span style={{ color: '#64748b', minWidth: 80 }}>{cat}</span>
                                <span style={{ color: '#7dd3fc' }}>{cmds}</span>
                            </div>
                        ))}
                    </div>
                );
            default:
                return <div key={idx} style={{ color: '#94a3b8' }} className="whitespace-pre-wrap leading-relaxed">{entry.text}</div>;
        }
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <AnimatePresence>
            {isTerminalOpen && (
                <motion.div
                    key="terminal-overlay"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-8 pb-16"
                    onPointerDown={() => toggleTerminal()}
                >
                    <motion.div
                        className="w-full max-w-5xl flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/10"
                        style={{
                            height: 'min(85vh, 700px)',
                            background: '#0d1117',
                            fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Menlo, monospace',
                        }}
                        onPointerDown={e => { e.stopPropagation(); inputRef.current?.focus(); }}
                    >
                        {/* ── Title Bar ─────────────────────────────────── */}
                        <div className="flex items-center justify-between px-4 h-10 border-b border-white/8 select-none flex-shrink-0"
                            style={{ background: '#161b22' }}>
                            <div className="flex items-center gap-2">
                                <button
                                    onPointerDown={e => { e.stopPropagation(); toggleTerminal(); }}
                                    className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
                                    style={{ background: '#ff5f57' }}
                                />
                                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                            </div>
                            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#8b949e' }}>
                                <Terminal size={11} />
                                <span>siluna@silunaos: {cwd === '~' ? '~' : cwd}</span>
                            </div>
                            <div className="w-16" />
                        </div>

                        {/* ── Body ──────────────────────────────────────── */}
                        <div
                            ref={bodyRef}
                            className="flex-1 overflow-y-auto p-4 md:p-5 text-[13px] md:text-[14px]"
                            style={{ lineHeight: 1.6 }}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {history.map((entry, i) => renderEntry(entry, i))}

                            {/* Active input row */}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Prompt active />
                                {isAwaitingPassword ? (
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent outline-none border-none min-w-0"
                                        style={{ color: '#f1f5f9', caretColor: '#4ade80', fontSize: 'inherit', fontFamily: 'inherit' }}
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                ) : (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent outline-none border-none min-w-0"
                                        style={{ color: '#f1f5f9', caretColor: '#4ade80', fontSize: 'inherit', fontFamily: 'inherit' }}
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
