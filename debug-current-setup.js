// Debug script to check current setup
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 DEBUGGING CURRENT SETUP\n');

// Check if dev server is running
console.log('1. Checking dev server status...');
console.log('   Run: npm run dev');
console.log('   Server should be at: http://localhost:5173\n');

// Check file paths
console.log('2. File path analysis:');
const files = [
    'index.html',
    'src/index.css',
    'src/App.tsx',
    'src/main.tsx'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${file} exists`);
    } else {
        console.log(`   ❌ ${file} missing`);
    }
});

console.log('\n3. CSS CONFLICT ANALYSIS:');

console.log('   index.html has critical CSS:');
console.log('   - background: #0f172a');
console.log('   - color: white');

console.log('\n   src/index.css has:');
console.log('   - :root { --bg: #0b0f19 }');
console.log('   - body { background: var(--bg) }');

console.log('\n   src/App.tsx has:');
console.log('   - bg-slate-950 (which is #020617)');

console.log('\n4. CONFLICT RESOLUTION:');
console.log('   The issue is that index.html critical CSS is overriding');
console.log('   the CSS variables and Tailwind classes.');
console.log('   ');
console.log('   Solution: Remove critical CSS from index.html OR');
console.log('   make it consistent with the Gen-Z theme.');

console.log('\n5. TEST YOUR FIX:');
console.log('   1. Visit: http://localhost:5173/test-css-conflicts.html');
console.log('   2. Check which backgrounds are actually showing');
console.log('   3. The computed styles will tell you which CSS is winning');

console.log('\n6. RECOMMENDED FIX:');
console.log('   Update index.html critical CSS to match Gen-Z theme:');
console.log('   - Change background: #0f172a to background: #0b0f19');
console.log('   - This matches the --bg variable in index.css');
