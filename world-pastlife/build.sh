cd "$(dirname "$0")"; { cat head.html; echo "const fx=document.getElementById('fx');"; cat text.js lib.js s*.js end.js; } > index.html
