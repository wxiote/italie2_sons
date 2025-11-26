const fs = require('fs')
const path = require('path')

const token = process.env.MAPBOX_TOKEN || ''
const out = `window.__MAPBOX_TOKEN__ = ${JSON.stringify(token)};\n` // will be safe at build-time

const targetDir = path.join(__dirname, '..', 'static')
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
fs.writeFileSync(path.join(targetDir, 'config.js'), out, 'utf-8')
console.log('Wrote static/config.js (length=' + out.length + ')')

// Some Vercel setups run this script directly with an extra arg (eg. "node scripts/inject-token.js vercel-build").
// If the special 'vercel-build' arg is present, run the prepare-public step immediately so Vercel ends up with a `public/` directory.
if (process.argv.includes('vercel-build')) {
	try {
		// require prepare-public will execute it (it performs copies and may exit on error)
		require('./prepare-public.js')
		console.log('Ran prepare-public.js automatically after inject-token (vercel-build arg)')
	} catch (e) {
		console.error('Failed to run prepare-public.js automatically:', e && e.message ? e.message : e)
		process.exitCode = 1
		throw e
	}
}
