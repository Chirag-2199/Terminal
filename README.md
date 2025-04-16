# 🖥️ Terminal Portfolio - Built with Next.js

Welcome to the **Terminal Portfolio**, a futuristic and interactive developer portfolio styled like a real Linux terminal.  
Users can navigate through your projects and skills using terminal-like commands — creating a unique and hacker-ish experience 😎.

---

## 🚀 Live Preview (Optional)
You can host this on Vercel or Netlify for the world to explore.

---

## 🛠️ Tech Stack

- **Next.js 15**
- **React 18**
- **Tailwind CSS**
- **TypeScript (Optional)**

---

## 🖱️ How It Works

The terminal interface mimics a real Linux terminal and accepts custom commands to explore your portfolio and interact with a simulated file system.

---

## 💻 Available Commands

| Command           | Description                                                |
|------------------|------------------------------------------------------------|
| `help`           | Show all available commands                                |
| `pwd`            | Show the current directory path                            |
| `ls`             | List all files/folders in the current directory            |
| `cd [folder]`    | Change into a directory (like `cd projects`)               |
| `mkdir [name]`   | Create a new folder in the current directory               |
| `rm [file]`      | Delete a file (use `sudo rm` to delete folders)            |
| `sudo rm [dir]`  | Delete a folder with superuser privileges                  |
| `cat [file]`     | Show the contents of a file (simulated output)             |
| `npx [cmd]`      | Simulate running an NPX command (e.g., `npx create-react-app`) |
| `clear`          | Clear the terminal screen                                  |

---

## 🧠 Simulated File System Structure

You start in:  
```
/home/user/terminal
```

Sample pre-seeded structure:
```
/home/user/terminal
├── documents
│   └── doc1.txt
└── projects
    ├── portfolio
    └── terminal
```

You can navigate into directories, create new folders, and simulate reading or deleting files/folders.

---

## ✨ Cool Features

- Blinking caret and typewriter-like animation
- Command history and smooth scroll
- Glitch animation for invalid commands
- Dynamic command interpreter
- Styled using Tailwind CSS for a cyberpunk aesthetic

---

## 📦 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/Chirag-2199/Terminal.git
cd Terminal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## 📁 File Structure

```
terminal-portfolio/
├── app/
│   └── terminal/
│       └── page.tsx        // Main terminal logic
├── data/
│   └── projects.ts         // (Optional) Data for project listing
├── styles/                 // Tailwind styles
├── public/
│   └── ...                 // Static assets
├── README.md               // This file
└── next.config.js
```

---

## 🧑‍💻 Author

- **Chirag Kumar**
- [LinkedIn](https://www.linkedin.com/in/chirag2199/)
- [GitHub](https://github.com/Chirag-2199)

---

## 🔧 Upcoming Features

✨ **More terminal commands are coming soon!**  
Such as:
- `touch` to create a new file  
- `echo` to write to a file  
- `whoami`, `date`, and more fun Linux-style tricks  
Stay tuned! 💻🚀

---

## 📜 License

This project is open-source and free to use for any kind of personal portfolio or terminal-style app.

---

> Feel free to fork it, improve it, and impress recruiters with your terminal skills! 💼👨‍💻
