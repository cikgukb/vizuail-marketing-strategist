const fs = require('fs');
const path = require('path');
// Let's write a simple manual CSV parser that works for this format.

const dirPath = __dirname;
const outputFilePath = path.join(__dirname, '..', 'service-data.js');

const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.csv'));

const parseCSVLine = (line) => {
    const result = [];
    let curVal = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (inQuotes) {
            if (char === '"') {
                if (i < line.length - 1 && line[i + 1] === '"') {
                    curVal += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                curVal += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(curVal);
                curVal = '';
            } else {
                curVal += char;
            }
        }
    }
    result.push(curVal);
    return result;
};

const allData = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
    
    // Skip header line usually
    let startIdx = 1;
    if (!lines[0].toLowerCase().includes('saiz')) {
        startIdx = 0; // fallback if no header
    }

    for (let i = startIdx; i < lines.length; i++) {
        const parsed = parseCSVLine(lines[i]);
        if (parsed.length >= 4) {
            allData.push({
                saizSyarikat: parsed[0].trim(),
                perniagaan: parsed[1].trim(),
                jenisPromosi: parsed[2].trim(),
                prompt: parsed[3].trim()
            });
        }
    }
});

const jsContent = `const serviceDatabase = ${JSON.stringify(allData, null, 2)};\n`;
fs.writeFileSync(outputFilePath, jsContent, 'utf8');
console.log('Successfully generated service-data.js with ' + allData.length + ' records.');
