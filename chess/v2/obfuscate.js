// Simple obfuscation script - run with: node obfuscate.js
const fs = require('fs');
const Terser = require('terser'); // You'll need to install this: npm install terser

async function obfuscate() {
    // Read original files
    const html = fs.readFileSync('ai.html', 'utf8');
    const js = fs.readFileSync('ai.js', 'utf8');

    // Minify and obfuscate JavaScript
    const result = await Terser.minify(js, {
        mangle: {
            toplevel: true,
            properties: true
        },
        compress: {
            drop_console: true,
            drop_debugger: true
        }
    });

    if (result.error) {
        console.error('Obfuscation error:', result.error);
        return;
    }

    // Update HTML to reference obfuscated JS
    const obfuscatedHtml = html.replace('ai.js', 'ai-obfuscated.js');

    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    // Write obfuscated files
    fs.writeFileSync('dist/index.html', obfuscatedHtml);
    fs.writeFileSync('dist/ai-obfuscated.js', result.code);

    console.log('Obfuscation complete! Files saved to /dist');
}

obfuscate().catch(console.error);