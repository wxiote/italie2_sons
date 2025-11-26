const fs = require('fs')
const path = require('path')

const token = process.env.MAPBOX_TOKEN || ''
const out = `window.__MAPBOX_TOKEN__ = ${JSON.stringify(token)};\n` // will be safe at build-time

const targetDir = path.join(__dirname, '..', 'static')
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
fs.writeFileSync(path.join(targetDir, 'config.js'), out, 'utf-8')
console.log('Wrote static/config.js (length=' + out.length + ')')
