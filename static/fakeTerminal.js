document.addEventListener("DOMContentLoaded", function () {
  const terminal = document.querySelector('.fake-terminal');
  const terminalContent = document.querySelector('.terminal-content');

  const messages = [
    'KrishnaPriya@Portfolio:~$ npm start',
    'Starting development server...',
    'Compiled successfully!',
    'You can now view your app in the browser.',
    'Local: http://localhost:3000',
    '',
    'Building portfolio terminal...',
    'Loading social matrix...',
    'Initializing personal AI...',
    '🚀 Ready!'
  ];

  if (terminal && terminalContent) {
    terminal.style.display = 'block';
    terminalContent.textContent = '';

    let index = 0;

    function typeLine() {
      if (index < messages.length) {
        const line = document.createElement('div');
        line.textContent = messages[index];
        terminalContent.appendChild(line);
        terminalContent.scrollTop = terminalContent.scrollHeight;
        index++;
        setTimeout(typeLine, 700);
      }
    }

    typeLine();
  }
});
