const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, 'src', 'data', 'catalog.xlsx');
const outputPath = path.join(__dirname, 'src', 'data', 'catalog.json');

const workbook = xlsx.readFile(excelPath);
const catalog = {};

workbook.SheetNames.forEach(sheetName => {
  if (sheetName.toLowerCase().includes('welcome') || sheetName.toLowerCase().includes('order summary')) return;
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  catalog[sheetName] = rows.map(row => ({
    category: row['Category'] || sheetName,
    binCode: row['Bin Code'] || '',
    description: row['Description'] || '',
    packaging: row['Packaging Details'] || row['Packaging'] || '',
    quantity: 0,
    chefComment: '',
    shopperComment: ''
  }));
});

fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));
console.log('catalog.json generated successfully at src/data/catalog.json!');