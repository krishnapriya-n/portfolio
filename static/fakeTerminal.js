document.addEventListener("DOMContentLoaded", function () {
  const terminal = document.getElementById("terminal");

  const terminalLines = [
    "krishna-priya@portfolio:~",
    "KrishnaPriya@Portfolio:~$ npm start",
    "Starting development server...",
    "Compiled successfully!",
    "You can now view your app in the browser.",
    "Local: http://localhost:3000",
    "Building portfolio terminal...",
    "Loading social matrix...",
    "Initializing personal dashboard...",
    "🚀 Ready!",
    ">"
  ];

  let lineIndex = 0;
  let charIndex = 0;

  function typeLine() {
    if (lineIndex >= terminalLines.length) return;

    const line = terminalLines[lineIndex];
    const span = document.createElement("div");
    span.className = "terminal-line";
    terminal.appendChild(span);

    const interval = setInterval(() => {
      if (charIndex < line.length) {
        span.textContent += line.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(interval);
        lineIndex++;
        charIndex = 0;
        setTimeout(typeLine, 400);
      }
    }, 35);
  }

  typeLine();
});
