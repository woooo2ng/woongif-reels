cd "$(dirname "$0")"; { cat head.html; echo "const fx=document.getElementById('fx');"; cat text.js lib.js base_s*.js m*.js end.js; } > index.html
