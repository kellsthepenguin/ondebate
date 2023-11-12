const fs = require('fs')

let text = ''

for (let i = 0; i < 1000; i++) {
  text += String.fromCharCode(Math.floor(Math.random() * 65535))
}

fs.writeFileSync('private.key', text)
