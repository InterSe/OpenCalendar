// utils/wordParser.js
import mammoth from 'mammoth';

export async function parseWordTable(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });

  const html = result.value;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const table = tempDiv.querySelector('table');
  if (!table) return [];

  const rows = Array.from(table.rows).map(row =>
    Array.from(row.cells).map(cell => cell.innerText.trim())
  );

  // Optional: remove header if present
  return rows.length > 1 ? rows.slice(1) : rows;
}
