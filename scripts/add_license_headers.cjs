const fs = require('fs');
const path = require('path');

const LICENSE_HEADER = `/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

`;

const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git', '.vscode', 'coverage', 'public', 'tmp'];

function shouldProcessFile(filePath) {
    const ext = path.extname(filePath);
    return TARGET_EXTENSIONS.includes(ext);
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(file)) {
                processDirectory(fullPath);
            }
        } else if (shouldProcessFile(fullPath)) {
            addHeader(fullPath);
        }
    }
}

function addHeader(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if header already exists (simplistic check)
    if (content.includes('GNU Affero General Public License')) {
        console.log(`Skipping ${filePath} (Header present)`);
        return;
    }

    // Handle shebang lines if any (though unlikely in web app source, good practice)
    if (content.startsWith('#!')) {
        const lines = content.split('\n');
        lines.splice(1, 0, '\n' + LICENSE_HEADER);
        fs.writeFileSync(filePath, lines.join('\n'));
    } else {
        fs.writeFileSync(filePath, LICENSE_HEADER + content);
    }
    console.log(`Added header to ${filePath}`);
}

// Run from root or pass directory
const targetDir = process.argv[2] || '.';
console.log(`Applying AGPL headers to: ${path.resolve(targetDir)}`);
processDirectory(targetDir);
