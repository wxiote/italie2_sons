const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public')

function rmrf(dir) {
  if (!fs.existsSync(dir)) return
  fs.rmSync(dir, { recursive: true, force: true })
}

function mkdir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function copy(src, dest) {
  if (!fs.existsSync(src)) return
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    mkdir(dest)
    for (const child of fs.readdirSync(src)) copy(path.join(src, child), path.join(dest, child))
  } else {
    mkdir(path.dirname(dest))
    fs.copyFileSync(src, dest)
  }
}

// clean previous public
rmrf(publicDir)
mkdir(publicDir)

// files to copy
const items = [
  'index.html',
  'static',
  'src/assets'
]

items.forEach(item => {
  const src = path.join(root, item)
  const dest = path.join(publicDir, item)
  copy(src, dest)
})

// optional: copy README to public for convenience
copy(path.join(root, 'README.md'), path.join(publicDir, 'README.md'))

console.log('Prepared public/ output with files: index.html, static/, src/assets/')
