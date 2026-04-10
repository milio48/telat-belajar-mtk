/**
 * build.js — Converts drafts/*.md → docs/*.html
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

const DRAFTS_DIR = path.join(__dirname, 'drafts');
const DOCS_DIR = path.join(__dirname, 'docs');

/* ═══════════ Curriculum metadata (mirrors navigation.js) ═══════════ */
const CHAPTERS = {
  '1-1': { title: 'Pengenalan & Operasi Bilangan', cls: 1 },
  '1-2': { title: 'Pengukuran Waktu, Panjang, Berat', cls: 1 },
  '1-3': { title: 'Bangun Datar & Bangun Ruang', cls: 1 },
  '2-1': { title: 'Bilangan Cacah & Operasi Hitung', cls: 2 },
  '2-2': { title: 'Perkalian dan Pembagian', cls: 2 },
  '2-3': { title: 'Pengukuran (Panjang, Berat, Waktu)', cls: 2 },
  '2-4': { title: 'Bangun Datar', cls: 2 },
  '3-1': { title: 'Bilangan, Uang, & Operasi Hitung', cls: 3 },
  '3-2': { title: 'Pecahan Sederhana', cls: 3 },
  '3-3': { title: 'Pengukuran Baku', cls: 3 },
  '3-4': { title: 'Bangun Datar, Keliling, & Luas', cls: 3 },
  '4-1': { title: 'Operasi Hitung & Bilangan Bulat', cls: 4 },
  '4-2': { title: 'Kelipatan, Faktor, Bil. Romawi', cls: 4 },
  '4-3': { title: 'Pecahan Lanjutan', cls: 4 },
  '4-4': { title: 'Pengukuran (Sudut, Waktu, dll)', cls: 4 },
  '4-5': { title: 'Bangun Datar & Bangun Ruang', cls: 4 },
  '5-1': { title: 'Operasi Bilangan, Pangkat, Akar', cls: 5 },
  '5-2': { title: 'Pengukuran Lanjutan', cls: 5 },
  '5-3': { title: 'Pecahan, Persen, & Skala', cls: 5 },
  '5-4': { title: 'Bangun Datar & Bangun Ruang', cls: 5 },
  '6-1': { title: 'Operasi Bilangan Bulat & Pecahan', cls: 6 },
  '6-2': { title: 'Pengukuran (Volume, Waktu, Debit)', cls: 6 },
  '6-3': { title: 'Geometri (Luas & Volume)', cls: 6 },
  '6-4': { title: 'Sistem Koordinat', cls: 6 },
  '6-5': { title: 'Pengolahan & Penyajian Data', cls: 6 },
  '7-1': { title: 'Bilangan', cls: 7 },
  '7-2': { title: 'Bentuk Aljabar', cls: 7 },
  '7-3': { title: 'Segiempat dan Segitiga', cls: 7 },
  '7-4': { title: 'Persamaan & Pertidaksamaan Linear', cls: 7 },
  '7-5': { title: 'Penyajian Data', cls: 7 },
  '7-6': { title: 'Aritmetika Sosial', cls: 7 },
  '7-7': { title: 'Perbandingan', cls: 7 },
  '7-8': { title: 'Garis dan Sudut', cls: 7 },
  '8-1': { title: 'Persamaan Garis Lurus', cls: 8 },
  '8-2': { title: 'Persamaan Linear Dua Variabel', cls: 8 },
  '8-3': { title: 'Teorema Pythagoras', cls: 8 },
  '8-4': { title: 'Statistika', cls: 8 },
  '8-5': { title: 'Lingkaran', cls: 8 },
  '8-6': { title: 'Peluang', cls: 8 },
  '8-7': { title: 'Bidang Kartesius', cls: 8 },
  '8-8': { title: 'Bilangan Berpangkat & Bentuk Akar', cls: 8 },
  '9-1': { title: 'Kesebangunan & Kekongruenan', cls: 9 },
  '9-2': { title: 'Bangun Ruang Sisi Datar', cls: 9 },
  '9-3': { title: 'Bangun Ruang Sisi Lengkung', cls: 9 },
  '9-4': { title: 'Pola Bilangan', cls: 9 },
  '9-5': { title: 'Persamaan Kuadrat', cls: 9 },
  '9-6': { title: 'Relasi dan Fungsi', cls: 9 },
  '10-1': { title: 'Pangkat, Akar, & Logaritma', cls: 10 },
  '10-2': { title: 'Persamaan & Fungsi Kuadrat', cls: 10 },
  '10-3': { title: 'Sistem Persamaan Linear & Kuadrat', cls: 10 },
  '10-4': { title: 'Pertidaksamaan', cls: 10 },
  '10-5': { title: 'Logika Matematika', cls: 10 },
  '10-6': { title: 'Trigonometri Dasar', cls: 10 },
  '10-7': { title: 'Ruang Dimensi Tiga', cls: 10 },
  '11-1': { title: 'Statistika', cls: 11 },
  '11-2': { title: 'Peluang', cls: 11 },
  '11-3': { title: 'Trigonometri Lanjutan', cls: 11 },
  '11-4': { title: 'Lingkaran', cls: 11 },
  '11-5': { title: 'Suku Banyak (Polinomial)', cls: 11 },
  '11-6': { title: 'Fungsi Komposisi & Invers', cls: 11 },
  '11-7': { title: 'Limit Fungsi', cls: 11 },
  '11-8': { title: 'Turunan (Diferensial)', cls: 11 },
  '12-1': { title: 'Integral', cls: 12 },
  '12-2': { title: 'Program Linear', cls: 12 },
  '12-3': { title: 'Matriks', cls: 12 },
  '12-4': { title: 'Barisan, Deret, & Notasi Sigma', cls: 12 },
  '12-5': { title: 'Eksponen dan Logaritma', cls: 12 },
};

function getGradeClass(cls) {
  if (cls <= 6) return 'grade-sd';
  if (cls <= 9) return 'grade-smp';
  return 'grade-sma';
}

function getGradeLabel(cls) {
  if (cls <= 6) return 'SD';
  if (cls <= 9) return 'SMP';
  return 'SMA';
}

/* ═══════════ Pillar icon map ═══════════ */
const PILLAR_ICONS = {
  '1': 'tree-pine',      // Akar Konsep
  '2': 'globe-2',        // Pijakan Bumi
  '3': 'calculator',     // Mekanika Dasar
  '4': 'code-2',         // Logika Komputasi
  '5': 'languages',      // Navigasi Global
  '6': 'swords',         // Uji Ketangkasan
};
const PILLAR_NAMES = {
  '1': 'Akar Konsep',
  '2': 'Pijakan Bumi',
  '3': 'Mekanika Dasar',
  '4': 'Logika Komputasi',
  '5': 'Navigasi Global',
  '6': 'Uji Ketangkasan',
};

/* ═══════════ Markdown → HTML conversion ═══════════ */

/**
 * Escape HTML entities
 */
function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Convert inline markdown to HTML (bold, italic, inline code, inline math, links)
 */
function inlineMd(text) {
  // Preserve inline KaTeX: $...$
  text = text.replace(/\$\$(.+?)\$\$/g, '<span class="katex-display-inline">\\[$1\\]</span>');
  text = text.replace(/\$(.+?)\$/g, '\\($1\\)');
  // Bold + italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  return text;
}

/**
 * Map pillar names to their numbers (handles unnumbered headers)
 */
const PILLAR_NAME_MAP = {
  'akar konsep': '1',
  'pijakan bumi': '2',
  'mekanika dasar': '3',
  'logika komputasi': '4',
  'navigasi global': '5',
  'uji ketangkasan': '6',
};

/**
 * Parse the markdown into sections by ## headers
 */
function parseDraft(md) {
  const lines = md.split(/\r?\n/);
  let mainTitle = '';
  const sections = []; // { pillar: '1'|'2'|..., title, lines[] }
  let currentSection = null;
  const footnotes = [];

  for (const line of lines) {
    // Main title
    if (line.startsWith('# ') && !mainTitle) {
      mainTitle = line.replace(/^# /, '').trim();
      continue;
    }
    // Pillar sections: ## 1. Akar Konsep, or ## Akar Konsep (unnumbered)
    const sectionMatch = line.match(/^## (\d)\.\s*(.+)/);
    if (sectionMatch) {
      currentSection = { pillar: sectionMatch[1], title: sectionMatch[2].trim(), lines: [] };
      sections.push(currentSection);
      continue;
    }
    // Unnumbered pillar sections: ## Akar Konsep, ## Pijakan Bumi, etc.
    const unnumberedMatch = line.match(/^## (.+)/);
    if (unnumberedMatch) {
      const sectionTitle = unnumberedMatch[1].trim();
      const pillarNum = PILLAR_NAME_MAP[sectionTitle.toLowerCase()];
      if (pillarNum) {
        currentSection = { pillar: pillarNum, title: sectionTitle, lines: [] };
        sections.push(currentSection);
        continue;
      }
    }
    // Footnotes
    const fnMatch = line.match(/^\[\^(\d+)\]:\s*(.+)/);
    if (fnMatch) {
      footnotes.push(fnMatch[2].trim());
      continue;
    }
    // Accumulate lines
    if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  return { mainTitle, sections, footnotes };
}

/**
 * Render a pillar section's body lines → HTML
 */
function renderPillarBody(pillar, lines) {
  let html = '';
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listType = 'ul';

  const flushList = () => { if (inList) { html += `</${listType}>`; inList = false; } };
  const flushTable = () => {
    if (!inTable) return;
    inTable = false;
    html += '<table class="glossary-table"><thead><tr>';
    const headers = tableRows[0];
    headers.forEach(h => { html += `<th>${inlineMd(h.trim())}</th>`; });
    html += '</tr></thead><tbody>';
    for (let i = 1; i < tableRows.length; i++) {
      html += '<tr>';
      tableRows[i].forEach(c => { html += `<td>${inlineMd(c.trim())}</td>`; });
      html += '</tr>';
    }
    html += '</tbody></table>';
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```') && !inCodeBlock) {
      flushList();
      flushTable();
      inCodeBlock = true;
      codeContent = '';
      // Extract language identifier (e.g. ```javascript → "javascript")
      codeLang = line.trim().replace(/^```/, '').trim() || 'javascript';
      continue;
    }
    if (line.trim().startsWith('```') && inCodeBlock) {
      inCodeBlock = false;
      html += `<pre class="code-block" data-lang="${codeLang}"><code class="language-${codeLang}">${escHtml(codeContent.trim())}</code></pre>`;
      continue;
    }
    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Table rows
    if (line.trim().startsWith('|') && !line.trim().match(/^\|[\s-|]+\|$/)) {
      flushList();
      if (!inTable) inTable = true;
      const cells = line.split('|').filter(c => c.trim() !== '');
      tableRows.push(cells);
      continue;
    }
    if (line.trim().match(/^\|[\s-|]+\|$/)) {
      // table separator, skip
      continue;
    }
    if (inTable && !line.trim().startsWith('|')) {
      flushTable();
    }

    // Blockquotes
    if (line.trim().startsWith('>')) {
      flushList();
      const content = line.replace(/^>\s*/, '');
      html += `<div class="info-card" style="border-left:4px solid var(--accent);">${inlineMd(content)}</div>`;
      continue;
    }

    // Display math ($$...$$) — standalone lines 
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
      flushList();
      const mathContent = line.trim().replace(/^\$\$/, '').replace(/\$\$$/, '');
      html += `<div class="katex-display">\\[${mathContent}\\]</div>`;
      continue;
    }
    if (line.trim() === '$$') {
      flushList();
      // Multi-line display math
      let mathLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i]);
        i++;
      }
      html += `<div class="katex-display">\\[${mathLines.join('\n')}\\]</div>`;
      continue;
    }

    // Horizontal rules
    if (line.trim() === '---') {
      flushList();
      html += '<hr style="border:none;border-top:1px solid var(--gray-200);margin:1.25rem 0;">';
      continue;
    }

    // List items (- or *)
    const bulletMatch = line.match(/^(\s*)[*-]\s+(.+)/);
    if (bulletMatch) {
      if (!inList) { inList = true; listType = 'ul'; html += '<ul>'; }
      html += `<li>${inlineMd(bulletMatch[2])}</li>`;
      continue;
    }

    // Numbered list items
    const numMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
    if (numMatch) {
      if (!inList) { inList = true; listType = 'ol'; html += '<ol>'; }
      html += `<li>${inlineMd(numMatch[2])}</li>`;
      continue;
    }

    // Close list if line is not list
    if (inList && line.trim() !== '') {
      flushList();
    }

    // Empty line
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // Regular paragraph
    html += `<p>${inlineMd(line)}</p>`;
  }

  flushList();
  flushTable();
  return html;
}

/* ═══════════ Playground generator ═══════════ */

/**
 * Generate a context-aware interactive playground based on chapter content
 */
function generatePlayground(chapterId, mainTitle, sections) {
  // Extract code from Logika Komputasi section
  const codeSection = sections.find(s => s.pillar === '4');
  let jsCode = '';
  if (codeSection) {
    let inCode = false;
    for (const line of codeSection.lines) {
      if (line.trim().startsWith('```') && !inCode) { inCode = true; continue; }
      if (line.trim().startsWith('```') && inCode) { inCode = false; continue; }
      if (inCode) jsCode += line + '\n';
    }
  }

  // Determine playground type based on chapter content
  const cls = parseInt(chapterId.split('-')[0]);
  const bab = parseInt(chapterId.split('-')[1]);
  const titleLower = mainTitle.toLowerCase();

  // Default playground: generic calculator based on the JS code
  let playgroundHtml = '';

  // Addition / Subtraction (1-1, 2-1)
  if (titleLower.includes('operasi bilangan') || titleLower.includes('operasi hitung') ||
      (titleLower.includes('bilangan') && (cls <= 3))) {
    playgroundHtml = buildCalcPlayground(chapterId, 'Kalkulator Operasi Hitung', [
      { id: 'numA', label: 'Angka Pertama (a)', min: 0, max: 100, value: 15 },
      { id: 'numB', label: 'Angka Kedua (b)', min: 0, max: 100, value: 4 },
    ], `
      const a = parseFloat(document.getElementById('pg-numA').value) || 0;
      const b = parseFloat(document.getElementById('pg-numB').value) || 0;
      document.getElementById('pg-result').textContent = a + ' + ' + b + ' = ' + (a+b);
      document.getElementById('pg-result2').textContent = a + ' - ' + b + ' = ' + (a-b);
    `, true);
  }
  // Perkalian / Pembagian
  else if (titleLower.includes('perkalian') || titleLower.includes('pembagian')) {
    playgroundHtml = buildCalcPlayground(chapterId, 'Kalkulator Perkalian & Pembagian', [
      { id: 'numA', label: 'Angka Pertama (a)', min: 1, max: 100, value: 12 },
      { id: 'numB', label: 'Angka Kedua (b)', min: 1, max: 100, value: 4 },
    ], `
      const a = parseFloat(document.getElementById('pg-numA').value) || 1;
      const b = parseFloat(document.getElementById('pg-numB').value) || 1;
      document.getElementById('pg-result').textContent = a + ' × ' + b + ' = ' + (a*b);
      document.getElementById('pg-result2').textContent = a + ' ÷ ' + b + ' = ' + (a/b).toFixed(2);
    `, true);
  }
  // Pecahan
  else if (titleLower.includes('pecahan')) {
    playgroundHtml = buildCalcPlayground(chapterId, 'Kalkulator Pecahan', [
      { id: 'numA', label: 'Pembilang 1', min: 0, max: 20, value: 2 },
      { id: 'denA', label: 'Penyebut 1', min: 1, max: 20, value: 8 },
      { id: 'numB', label: 'Pembilang 2', min: 0, max: 20, value: 3 },
      { id: 'denB', label: 'Penyebut 2', min: 1, max: 20, value: 8 },
    ], `
      const n1 = parseInt(document.getElementById('pg-numA').value) || 0;
      const d1 = parseInt(document.getElementById('pg-denA').value) || 1;
      const n2 = parseInt(document.getElementById('pg-numB').value) || 0;
      const d2 = parseInt(document.getElementById('pg-denB').value) || 1;
      const rNum = n1*d2 + n2*d1;
      const rDen = d1*d2;
      function gcd(a,b){return b?gcd(b,a%b):a;}
      const g = gcd(Math.abs(rNum), Math.abs(rDen));
      document.getElementById('pg-result').textContent = n1+'/'+d1+' + '+n2+'/'+d2+' = '+rNum+'/'+rDen;
      document.getElementById('pg-result2').textContent = 'Disederhanakan: '+(rNum/g)+'/'+(rDen/g);
    `, true);
  }
  // Keliling / Luas / Bangun Datar
  else if (titleLower.includes('keliling') || titleLower.includes('luas') || 
           titleLower.includes('bangun datar') || titleLower.includes('persegi')) {
    playgroundHtml = buildGeoPlayground(chapterId, 'persegi');
  }
  // Pythagoras
  else if (titleLower.includes('pythagoras')) {
    playgroundHtml = buildPythagorasPlayground(chapterId);
  }
  // Lingkaran
  else if (titleLower.includes('lingkaran')) {
    playgroundHtml = buildCirclePlayground(chapterId);
  }
  // Geometri / Volume / Tabung / Prisma / Bangun Ruang
  else if (titleLower.includes('geometri') || titleLower.includes('volume') || 
           titleLower.includes('bangun ruang') || titleLower.includes('tabung') ||
           titleLower.includes('dimensi tiga')) {
    playgroundHtml = buildVolumePlayground(chapterId);
  }
  // Koordinat / Kartesius
  else if (titleLower.includes('koordinat') || titleLower.includes('kartesius')) {
    playgroundHtml = buildCoordinatePlayground(chapterId);
  }
  // Persamaan linear / garis lurus
  else if (titleLower.includes('persamaan') && (titleLower.includes('linear') || titleLower.includes('garis'))) {
    playgroundHtml = buildLinearPlayground(chapterId);
  }
  // Kuadrat
  else if (titleLower.includes('kuadrat') && !titleLower.includes('pertidaksamaan')) {
    playgroundHtml = buildQuadraticPlayground(chapterId);
  }
  // Statistika / Data
  else if (titleLower.includes('statistika') || titleLower.includes('data') || titleLower.includes('penyajian')) {
    playgroundHtml = buildStatsPlayground(chapterId);
  }
  // Trigonometri
  else if (titleLower.includes('trigonometri')) {
    playgroundHtml = buildTrigPlayground(chapterId);
  }
  // Logaritma / Pangkat / Eksponen
  else if (titleLower.includes('logaritma') || titleLower.includes('pangkat') || titleLower.includes('eksponen') || titleLower.includes('akar')) {
    playgroundHtml = buildExpPlayground(chapterId);
  }
  // Peluang
  else if (titleLower.includes('peluang')) {
    playgroundHtml = buildProbPlayground(chapterId);
  }
  // Limit
  else if (titleLower.includes('limit')) {
    playgroundHtml = buildLimitPlayground(chapterId);
  }
  // Turunan / Diferensial
  else if (titleLower.includes('turunan') || titleLower.includes('diferensial')) {
    playgroundHtml = buildDerivativePlayground(chapterId);
  }
  // Integral
  else if (titleLower.includes('integral')) {
    playgroundHtml = buildIntegralPlayground(chapterId);
  }
  // Matriks
  else if (titleLower.includes('matriks')) {
    playgroundHtml = buildMatrixPlayground(chapterId);
  }
  // Barisan / Deret
  else if (titleLower.includes('barisan') || titleLower.includes('deret') || titleLower.includes('pola bilangan')) {
    playgroundHtml = buildSequencePlayground(chapterId);
  }
  // FPB / KPK / Kelipatan / Faktor
  else if (titleLower.includes('fpb') || titleLower.includes('kpk') || titleLower.includes('kelipatan') || titleLower.includes('faktor')) {
    playgroundHtml = buildGcdLcmPlayground(chapterId);
  }
  // Pengukuran
  else if (titleLower.includes('pengukuran') || titleLower.includes('waktu') || titleLower.includes('debit')) {
    playgroundHtml = buildMeasurePlayground(chapterId);
  }
  // Aljabar
  else if (titleLower.includes('aljabar')) {
    playgroundHtml = buildAlgebraPlayground(chapterId);
  }
  // Perbandingan
  else if (titleLower.includes('perbandingan')) {
    playgroundHtml = buildRatioPlayground(chapterId);
  }
  // Aritmetika Sosial
  else if (titleLower.includes('aritmetika')) {
    playgroundHtml = buildSocialArithPlayground(chapterId);
  }
  // Sudut / Garis
  else if (titleLower.includes('sudut') || titleLower.includes('garis')) {
    playgroundHtml = buildAnglePlayground(chapterId);
  }
  // Logika
  else if (titleLower.includes('logika')) {
    playgroundHtml = buildLogicPlayground(chapterId);
  }
  // Fungsi / Relasi / Komposisi / Invers
  else if (titleLower.includes('fungsi') || titleLower.includes('relasi') || titleLower.includes('invers') || titleLower.includes('komposisi')) {
    playgroundHtml = buildFunctionPlayground(chapterId);
  }
  // Pertidaksamaan
  else if (titleLower.includes('pertidaksamaan')) {
    playgroundHtml = buildInequalityPlayground(chapterId);
  }
  // Program Linear
  else if (titleLower.includes('program linear')) {
    playgroundHtml = buildLinProgPlayground(chapterId);
  }
  // Suku Banyak / Polinomial
  else if (titleLower.includes('suku banyak') || titleLower.includes('polinomial')) {
    playgroundHtml = buildPolynomialPlayground(chapterId);
  }
  // Kesebangunan
  else if (titleLower.includes('kesebangunan') || titleLower.includes('kekongruenan')) {
    playgroundHtml = buildSimilarityPlayground(chapterId);
  }
  // Default fallback
  else {
    playgroundHtml = buildCalcPlayground(chapterId, 'Kalkulator Interaktif', [
      { id: 'numA', label: 'Nilai A', min: 0, max: 100, value: 10 },
      { id: 'numB', label: 'Nilai B', min: 0, max: 100, value: 5 },
    ], `
      const a = parseFloat(document.getElementById('pg-numA').value) || 0;
      const b = parseFloat(document.getElementById('pg-numB').value) || 0;
      document.getElementById('pg-result').textContent = 'A + B = ' + (a+b);
      document.getElementById('pg-result2').textContent = 'A × B = ' + (a*b);
    `, true);
  }

  return playgroundHtml;
}

/* ─── Playground builders ─── */

function buildCalcPlayground(id, title, inputs, calcJS, hasTwoResults) {
  let inputsHtml = '';
  inputs.forEach(inp => {
    inputsHtml += `
      <label for="pg-${inp.id}">${inp.label}</label>
      <input type="number" id="pg-${inp.id}" value="${inp.value}" min="${inp.min}" max="${inp.max}" oninput="pgCalc_${id.replace('-','_')}()">
    `;
  });
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> ${title}</div>
      <div class="playground-grid">
        <div class="playground-controls">${inputsHtml}</div>
        <div class="playground-output">
          <div class="playground-result" id="pg-result">—</div>
          <div class="playground-result-label">Hasil Perhitungan</div>
          ${hasTwoResults ? '<div class="playground-result" id="pg-result2" style="margin-top:.5rem;font-size:1.2rem;">—</div>' : ''}
        </div>
      </div>
    </div>
    <script>
    function pgCalc_${id.replace('-','_')}() {
      ${calcJS}
    }
    pgCalc_${id.replace('-','_')}();
    </script>`;
}

function buildGeoPlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Kalkulator Keliling & Luas Persegi Panjang</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-panjang">Panjang (p)</label>
          <input type="range" id="pg-panjang" min="1" max="20" value="8" oninput="pgGeo_${id.replace('-','_')}()">
          <span id="pg-panjang-val" class="text-accent" style="font-weight:600">8</span> cm
          <label for="pg-lebar" style="margin-top:.5rem">Lebar (l)</label>
          <input type="range" id="pg-lebar" min="1" max="20" value="5" oninput="pgGeo_${id.replace('-','_')}()">
          <span id="pg-lebar-val" class="text-accent" style="font-weight:600">5</span> cm
        </div>
        <div>
          <div class="playground-visual">
            <svg id="pg-svg-geo" viewBox="0 0 260 180" class="geo-svg" style="width:100%;max-width:260px">
              <rect id="pg-rect" x="30" y="20" width="160" height="100" class="shape-stroke" rx="2"/>
              <text id="pg-label-p" x="110" y="140" text-anchor="middle">p = 8</text>
              <text id="pg-label-l" x="210" y="75" text-anchor="start">l = 5</text>
            </svg>
          </div>
          <div class="playground-output">
            <div class="playground-result" id="pg-result">K = 26 cm</div>
            <div class="playground-result-label">Keliling = 2(p + l)</div>
            <div class="playground-result" id="pg-result2" style="margin-top:.5rem;font-size:1.2rem">L = 40 cm²</div>
            <div class="playground-result-label">Luas = p × l</div>
          </div>
        </div>
      </div>
    </div>
    <script>
    function pgGeo_${id.replace('-','_')}() {
      const p = parseInt(document.getElementById('pg-panjang').value);
      const l = parseInt(document.getElementById('pg-lebar').value);
      document.getElementById('pg-panjang-val').textContent = p;
      document.getElementById('pg-lebar-val').textContent = l;
      const w = Math.max(40, p*10); const h = Math.max(30, l*10);
      const rect = document.getElementById('pg-rect');
      rect.setAttribute('width', w); rect.setAttribute('height', h);
      document.getElementById('pg-label-p').textContent = 'p = ' + p;
      document.getElementById('pg-label-p').setAttribute('x', 30 + w/2);
      document.getElementById('pg-label-p').setAttribute('y', 20 + h + 20);
      document.getElementById('pg-label-l').textContent = 'l = ' + l;
      document.getElementById('pg-label-l').setAttribute('x', 30 + w + 10);
      document.getElementById('pg-label-l').setAttribute('y', 20 + h/2);
      document.getElementById('pg-result').textContent = 'K = ' + (2*(p+l)) + ' cm';
      document.getElementById('pg-result2').textContent = 'L = ' + (p*l) + ' cm²';
    }
    pgGeo_${id.replace('-','_')}();
    </script>`;
}

function buildPythagorasPlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Kalkulator Teorema Pythagoras</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-sisiA">Sisi Tegak a</label>
          <input type="range" id="pg-sisiA" min="1" max="20" value="6" oninput="pgPyth()">
          <span id="pg-sisiA-val" class="text-accent" style="font-weight:600">6</span> cm
          <label for="pg-sisiB" style="margin-top:.5rem">Sisi Tegak b</label>
          <input type="range" id="pg-sisiB" min="1" max="20" value="8" oninput="pgPyth()">
          <span id="pg-sisiB-val" class="text-accent" style="font-weight:600">8</span> cm
        </div>
        <div>
          <div class="playground-visual">
            <svg id="pg-svg-pyth" viewBox="0 0 240 200" class="geo-svg" style="width:100%;max-width:240px">
              <polygon id="pg-tri" points="30,170 30,30 210,170" class="shape-stroke"/>
              <text id="pg-lbl-a" x="15" y="100" text-anchor="end">a=6</text>
              <text id="pg-lbl-b" x="120" y="190" text-anchor="middle">b=8</text>
              <text id="pg-lbl-c" x="130" y="90" text-anchor="start" style="fill:var(--accent);font-weight:700">c=10</text>
              <rect x="30" y="155" width="15" height="15" fill="none" stroke="var(--gray-400)" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="playground-output">
            <div class="playground-result" id="pg-result">c = 10.00 cm</div>
            <div class="playground-result-label">Hipotenusa = √(a² + b²)</div>
          </div>
        </div>
      </div>
    </div>
    <script>
    function pgPyth() {
      const a = parseFloat(document.getElementById('pg-sisiA').value);
      const b = parseFloat(document.getElementById('pg-sisiB').value);
      document.getElementById('pg-sisiA-val').textContent = a;
      document.getElementById('pg-sisiB-val').textContent = b;
      const c = Math.sqrt(a*a + b*b);
      const sx = 30, sy = 170;
      const h = Math.min(140, a*14); const w = Math.min(180, b*14);
      document.getElementById('pg-tri').setAttribute('points', sx+','+sy+' '+sx+','+(sy-h)+' '+(sx+w)+','+sy);
      document.getElementById('pg-lbl-a').textContent = 'a='+a;
      document.getElementById('pg-lbl-a').setAttribute('y', sy - h/2);
      document.getElementById('pg-lbl-b').textContent = 'b='+b;
      document.getElementById('pg-lbl-b').setAttribute('x', sx + w/2);
      document.getElementById('pg-lbl-c').textContent = 'c='+c.toFixed(2);
      document.getElementById('pg-lbl-c').setAttribute('x', sx + w/2 + 10);
      document.getElementById('pg-lbl-c').setAttribute('y', sy - h/2 - 5);
      document.getElementById('pg-result').textContent = 'c = ' + c.toFixed(2) + ' cm';
    }
    pgPyth();
    </script>`;
}

function buildCirclePlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Visualisasi Lingkaran</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-radius">Jari-jari (r)</label>
          <input type="range" id="pg-radius" min="1" max="15" value="7" oninput="pgCirc_${id.replace('-','_')}()">
          <span id="pg-radius-val" class="text-accent" style="font-weight:600">7</span> cm
        </div>
        <div>
          <div class="playground-visual">
            <svg id="pg-svg-circ" viewBox="0 0 240 240" class="geo-svg" style="width:100%;max-width:240px">
              <circle id="pg-circle" cx="120" cy="120" r="90" class="shape-stroke"/>
              <line x1="120" y1="120" x2="210" y2="120" class="dim-line" id="pg-rline"/>
              <text id="pg-rlbl" x="165" y="112" text-anchor="middle">r = 7</text>
              <circle cx="120" cy="120" r="3" fill="var(--accent)"/>
            </svg>
          </div>
          <div class="playground-output">
            <div class="playground-result" id="pg-result">L = 153.94 cm²</div>
            <div class="playground-result-label">Luas = π × r²</div>
            <div class="playground-result" id="pg-result2" style="margin-top:.5rem;font-size:1.2rem">K = 43.98 cm</div>
            <div class="playground-result-label">Keliling = 2π × r</div>
          </div>
        </div>
      </div>
    </div>
    <script>
    function pgCirc_${id.replace('-','_')}() {
      const r = parseFloat(document.getElementById('pg-radius').value);
      document.getElementById('pg-radius-val').textContent = r;
      const svgR = Math.max(20, r * 12);
      document.getElementById('pg-circle').setAttribute('r', svgR);
      document.getElementById('pg-rline').setAttribute('x2', 120 + svgR);
      document.getElementById('pg-rlbl').setAttribute('x', 120 + svgR/2);
      document.getElementById('pg-rlbl').textContent = 'r = ' + r;
      document.getElementById('pg-result').textContent = 'L = ' + (Math.PI * r * r).toFixed(2) + ' cm²';
      document.getElementById('pg-result2').textContent = 'K = ' + (2 * Math.PI * r).toFixed(2) + ' cm';
    }
    pgCirc_${id.replace('-','_')}();
    </script>`;
}

function buildVolumePlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Kalkulator Volume Tabung</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-vr">Jari-jari (r)</label>
          <input type="range" id="pg-vr" min="1" max="15" value="5" oninput="pgVol_${id.replace('-','_')}()">
          <span id="pg-vr-val" class="text-accent" style="font-weight:600">5</span>
          <label for="pg-vt" style="margin-top:.5rem">Tinggi (t)</label>
          <input type="range" id="pg-vt" min="1" max="20" value="10" oninput="pgVol_${id.replace('-','_')}()">
          <span id="pg-vt-val" class="text-accent" style="font-weight:600">10</span>
        </div>
        <div class="playground-output">
          <div class="playground-result" id="pg-result">V = 785.40</div>
          <div class="playground-result-label">Volume = π × r² × t</div>
        </div>
      </div>
    </div>
    <script>
    function pgVol_${id.replace('-','_')}() {
      const r = parseFloat(document.getElementById('pg-vr').value);
      const t = parseFloat(document.getElementById('pg-vt').value);
      document.getElementById('pg-vr-val').textContent = r;
      document.getElementById('pg-vt-val').textContent = t;
      document.getElementById('pg-result').textContent = 'V = ' + (Math.PI*r*r*t).toFixed(2);
    }
    pgVol_${id.replace('-','_')}();
    </script>`;
}

function buildCoordinatePlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Peta Koordinat Kartesius</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-cx">Koordinat X</label>
          <input type="range" id="pg-cx" min="-10" max="10" value="3" oninput="pgCoord_${id.replace('-','_')}()">
          <span id="pg-cx-val" class="text-accent" style="font-weight:600">3</span>
          <label for="pg-cy" style="margin-top:.5rem">Koordinat Y</label>
          <input type="range" id="pg-cy" min="-10" max="10" value="4" oninput="pgCoord_${id.replace('-','_')}()">
          <span id="pg-cy-val" class="text-accent" style="font-weight:600">4</span>
        </div>
        <div>
          <div class="playground-visual">
            <svg viewBox="0 0 240 240" class="geo-svg" style="width:100%;max-width:240px">
              <line x1="0" y1="120" x2="240" y2="120" stroke="var(--gray-300)" stroke-width="1"/>
              <line x1="120" y1="0" x2="120" y2="240" stroke="var(--gray-300)" stroke-width="1"/>
              <text x="232" y="115" font-size="11" fill="var(--gray-400)">x</text>
              <text x="125" y="12" font-size="11" fill="var(--gray-400)">y</text>
              <circle id="pg-dot" cx="156" cy="72" r="6" fill="var(--accent)"/>
              <text id="pg-coord-lbl" x="162" y="66" font-size="12" fill="var(--accent)" font-weight="600">(3, 4)</text>
            </svg>
          </div>
          <div class="playground-output">
            <div class="playground-result" id="pg-result">Titik (3, 4)</div>
            <div class="playground-result-label">Kuadran I</div>
          </div>
        </div>
      </div>
    </div>
    <script>
    function pgCoord_${id.replace('-','_')}() {
      const x = parseInt(document.getElementById('pg-cx').value);
      const y = parseInt(document.getElementById('pg-cy').value);
      document.getElementById('pg-cx-val').textContent = x;
      document.getElementById('pg-cy-val').textContent = y;
      const svgX = 120 + x*12;
      const svgY = 120 - y*12;
      document.getElementById('pg-dot').setAttribute('cx', svgX);
      document.getElementById('pg-dot').setAttribute('cy', svgY);
      document.getElementById('pg-coord-lbl').textContent = '('+x+', '+y+')';
      document.getElementById('pg-coord-lbl').setAttribute('x', svgX+8);
      document.getElementById('pg-coord-lbl').setAttribute('y', svgY-8);
      let kuadran = '';
      if(x>0&&y>0) kuadran='Kuadran I'; else if(x<0&&y>0) kuadran='Kuadran II';
      else if(x<0&&y<0) kuadran='Kuadran III'; else if(x>0&&y<0) kuadran='Kuadran IV';
      else kuadran='Sumbu';
      document.getElementById('pg-result').textContent = 'Titik ('+x+', '+y+')';
      document.querySelector('#playground-${id} .playground-result-label').textContent = kuadran;
    }
    pgCoord_${id.replace('-','_')}();
    </script>`;
}

function buildLinearPlayground(id) {
  return buildCalcPlayground(id, 'Grafik Persamaan Linear', [
    { id: 'numA', label: 'Gradien (m)', min: -10, max: 10, value: 2 },
    { id: 'numB', label: 'Konstanta (c)', min: -10, max: 10, value: 1 },
  ], `
    const m = parseFloat(document.getElementById('pg-numA').value);
    const c = parseFloat(document.getElementById('pg-numB').value);
    document.getElementById('pg-result').textContent = 'y = ' + m + 'x + ' + c;
    document.getElementById('pg-result2').textContent = 'x=0 → y=' + c + ' | x=5 → y=' + (m*5+c);
  `, true);
}

function buildQuadraticPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Persamaan Kuadrat (ax² + bx + c = 0)', [
    { id: 'numA', label: 'Koefisien a', min: -10, max: 10, value: 1 },
    { id: 'numB', label: 'Koefisien b', min: -20, max: 20, value: -5 },
    { id: 'denA', label: 'Koefisien c', min: -20, max: 20, value: 6 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value) || 1;
    const b = parseFloat(document.getElementById('pg-numB').value);
    const c = parseFloat(document.getElementById('pg-denA').value);
    const D = b*b - 4*a*c;
    let roots = '';
    if (D > 0) { const x1=(-b+Math.sqrt(D))/(2*a); const x2=(-b-Math.sqrt(D))/(2*a); roots='x₁='+x1.toFixed(2)+', x₂='+x2.toFixed(2); }
    else if (D === 0) { roots='x = '+(-b/(2*a)).toFixed(2)+' (kembar)'; }
    else { roots='Tidak ada akar real (D < 0)'; }
    document.getElementById('pg-result').textContent = 'D = ' + D.toFixed(2);
    document.getElementById('pg-result2').textContent = roots;
  `, true);
}

function buildStatsPlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Kalkulator Statistika</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-data">Data (pisahkan koma)</label>
          <input type="text" id="pg-data" value="5,8,3,9,7,4,6" oninput="pgStats_${id.replace('-','_')}()" style="width:100%;padding:.5rem .75rem;border:1px solid var(--gray-300);border-radius:8px;font-family:var(--font-mono);font-size:.9rem;">
        </div>
        <div class="playground-output">
          <div class="playground-result" id="pg-result">Mean: 6.00</div>
          <div class="playground-result" id="pg-result2" style="font-size:1rem;margin-top:.3rem">Median: 6 | Modus: —</div>
        </div>
      </div>
    </div>
    <script>
    function pgStats_${id.replace('-','_')}() {
      const raw = document.getElementById('pg-data').value;
      const nums = raw.split(',').map(Number).filter(n=>!isNaN(n)).sort((a,b)=>a-b);
      if(!nums.length){document.getElementById('pg-result').textContent='Masukkan data';return;}
      const sum = nums.reduce((a,b)=>a+b,0);
      const mean = sum/nums.length;
      const mid = Math.floor(nums.length/2);
      const median = nums.length%2 ? nums[mid] : (nums[mid-1]+nums[mid])/2;
      const freq = {}; nums.forEach(n=>{freq[n]=(freq[n]||0)+1;});
      const maxF = Math.max(...Object.values(freq));
      const modus = maxF>1?Object.keys(freq).filter(k=>freq[k]===maxF).join(', '):'—';
      document.getElementById('pg-result').textContent = 'Mean: ' + mean.toFixed(2);
      document.getElementById('pg-result2').textContent = 'Median: '+median+' | Modus: '+modus;
    }
    pgStats_${id.replace('-','_')}();
    </script>`;
}

function buildTrigPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Trigonometri', [
    { id: 'numA', label: 'Sudut (derajat)', min: 0, max: 360, value: 45 },
  ], `
    const deg = parseFloat(document.getElementById('pg-numA').value);
    const rad = deg * Math.PI / 180;
    document.getElementById('pg-result').textContent = 'sin '+deg+'° = '+Math.sin(rad).toFixed(4);
    document.getElementById('pg-result2').textContent = 'cos '+deg+'° = '+Math.cos(rad).toFixed(4)+' | tan '+deg+'° = '+(Math.abs(Math.cos(rad))<0.0001?'∞':Math.tan(rad).toFixed(4));
  `, true);
}

function buildExpPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Pangkat & Logaritma', [
    { id: 'numA', label: 'Basis (a)', min: 1, max: 20, value: 2 },
    { id: 'numB', label: 'Pangkat (n)', min: 0, max: 20, value: 5 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value) || 2;
    const n = parseFloat(document.getElementById('pg-numB').value) || 0;
    const result = Math.pow(a, n);
    const logResult = n > 0 ? (Math.log(result) / Math.log(a)).toFixed(4) : '—';
    document.getElementById('pg-result').textContent = a + '^' + n + ' = ' + result;
    document.getElementById('pg-result2').textContent = 'log_'+a+'('+result+') = '+logResult;
  `, true);
}

function buildProbPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Peluang', [
    { id: 'numA', label: 'Kejadian diinginkan', min: 0, max: 100, value: 3 },
    { id: 'numB', label: 'Total kemungkinan', min: 1, max: 100, value: 12 },
  ], `
    const k = parseFloat(document.getElementById('pg-numA').value) || 0;
    const n = parseFloat(document.getElementById('pg-numB').value) || 1;
    const p = k / n;
    document.getElementById('pg-result').textContent = 'P = ' + k + '/' + n + ' = ' + p.toFixed(4);
    document.getElementById('pg-result2').textContent = (p*100).toFixed(1) + '% peluang';
  `, true);
}

function buildLimitPlayground(id) {
  return buildCalcPlayground(id, 'Eksplorasi Limit Fungsi f(x) = (x²−a²)/(x−a)', [
    { id: 'numA', label: 'Nilai a', min: 1, max: 10, value: 3 },
    { id: 'numB', label: 'x mendekati a (delta)', min: 1, max: 100, value: 99 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value) || 3;
    const delta = parseFloat(document.getElementById('pg-numB').value) / 100;
    const x = a + (1 - delta)*0.01;
    const fx = (x*x - a*a)/(x - a);
    document.getElementById('pg-result').textContent = 'f('+x.toFixed(6)+') = ' + fx.toFixed(6);
    document.getElementById('pg-result2').textContent = 'Limit = ' + (2*a).toFixed(4) + ' (analitik: 2a)';
  `, true);
}

function buildDerivativePlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Turunan f(x) = axⁿ', [
    { id: 'numA', label: 'Koefisien (a)', min: 1, max: 10, value: 3 },
    { id: 'numB', label: 'Pangkat (n)', min: 1, max: 10, value: 2 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value) || 1;
    const n = parseFloat(document.getElementById('pg-numB').value) || 1;
    document.getElementById('pg-result').textContent = "f(x) = "+a+"x^"+n;
    document.getElementById('pg-result2').textContent = "f'(x) = "+(a*n)+"x^"+(n-1);
  `, true);
}

function buildIntegralPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Integral ∫axⁿ dx', [
    { id: 'numA', label: 'Koefisien (a)', min: 1, max: 10, value: 3 },
    { id: 'numB', label: 'Pangkat (n)', min: 0, max: 10, value: 2 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value) || 1;
    const n = parseFloat(document.getElementById('pg-numB').value) || 0;
    const newCoeff = (a / (n+1)).toFixed(4).replace(/\\.?0+$/, '');
    document.getElementById('pg-result').textContent = '∫'+a+'x^'+n+' dx';
    document.getElementById('pg-result2').textContent = '= '+newCoeff+'x^'+(n+1)+' + C';
  `, true);
}

function buildMatrixPlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Kalkulator Determinan Matriks 2×2</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
            <div><label>a</label><input type="number" id="pg-ma" value="3" oninput="pgMtx_${id.replace('-','_')}()" style="width:100%;padding:.4rem;border:1px solid var(--gray-300);border-radius:6px;font-family:var(--font-mono);"></div>
            <div><label>b</label><input type="number" id="pg-mb" value="1" oninput="pgMtx_${id.replace('-','_')}()" style="width:100%;padding:.4rem;border:1px solid var(--gray-300);border-radius:6px;font-family:var(--font-mono);"></div>
            <div><label>c</label><input type="number" id="pg-mc" value="2" oninput="pgMtx_${id.replace('-','_')}()" style="width:100%;padding:.4rem;border:1px solid var(--gray-300);border-radius:6px;font-family:var(--font-mono);"></div>
            <div><label>d</label><input type="number" id="pg-md" value="4" oninput="pgMtx_${id.replace('-','_')}()" style="width:100%;padding:.4rem;border:1px solid var(--gray-300);border-radius:6px;font-family:var(--font-mono);"></div>
          </div>
        </div>
        <div class="playground-output">
          <div class="playground-result" id="pg-result">det = 10</div>
          <div class="playground-result-label">det(A) = ad − bc</div>
        </div>
      </div>
    </div>
    <script>
    function pgMtx_${id.replace('-','_')}() {
      const a=parseFloat(document.getElementById('pg-ma').value)||0;
      const b=parseFloat(document.getElementById('pg-mb').value)||0;
      const c=parseFloat(document.getElementById('pg-mc').value)||0;
      const d=parseFloat(document.getElementById('pg-md').value)||0;
      document.getElementById('pg-result').textContent = 'det = '+(a*d - b*c);
    }
    pgMtx_${id.replace('-','_')}();
    </script>`;
}

function buildSequencePlayground(id) {
  return buildCalcPlayground(id, 'Generator Barisan Aritmetika', [
    { id: 'numA', label: 'Suku pertama (a)', min: -20, max: 20, value: 2 },
    { id: 'numB', label: 'Beda (b)', min: -10, max: 10, value: 3 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value);
    const b = parseFloat(document.getElementById('pg-numB').value);
    let seq = [];
    for(let i=0;i<8;i++) seq.push(a + i*b);
    document.getElementById('pg-result').textContent = seq.join(', ') + ', ...';
    const n = 10; const sn = n/2*(2*a+(n-1)*b);
    document.getElementById('pg-result2').textContent = 'S₁₀ = '+sn;
  `, true);
}

function buildGcdLcmPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator FPB & KPK', [
    { id: 'numA', label: 'Bilangan 1', min: 1, max: 200, value: 24 },
    { id: 'numB', label: 'Bilangan 2', min: 1, max: 200, value: 36 },
  ], `
    let a = parseInt(document.getElementById('pg-numA').value)||1;
    let b = parseInt(document.getElementById('pg-numB').value)||1;
    function gcd(x,y){return y?gcd(y,x%y):x;}
    const fpb = gcd(a,b);
    const kpk = (a*b)/fpb;
    document.getElementById('pg-result').textContent = 'FPB('+a+','+b+') = '+fpb;
    document.getElementById('pg-result2').textContent = 'KPK('+a+','+b+') = '+kpk;
  `, true);
}

function buildMeasurePlayground(id) {
  return buildCalcPlayground(id, 'Konversi Satuan', [
    { id: 'numA', label: 'Nilai', min: 0, max: 10000, value: 100 },
  ], `
    const v = parseFloat(document.getElementById('pg-numA').value)||0;
    document.getElementById('pg-result').textContent = v+' cm = '+(v/100).toFixed(4)+' m';
    document.getElementById('pg-result2').textContent = v+' g = '+(v/1000).toFixed(4)+' kg';
  `, true);
}

function buildAlgebraPlayground(id) {
  return buildCalcPlayground(id, 'Evaluator Ekspresi ax + b', [
    { id: 'numA', label: 'Koefisien (a)', min: -10, max: 10, value: 3 },
    { id: 'numB', label: 'Konstanta (b)', min: -10, max: 10, value: 5 },
    { id: 'denA', label: 'Nilai x', min: -10, max: 10, value: 4 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value);
    const b = parseFloat(document.getElementById('pg-numB').value);
    const x = parseFloat(document.getElementById('pg-denA').value);
    document.getElementById('pg-result').textContent = a+'('+x+') + '+b+' = '+(a*x+b);
    document.getElementById('pg-result2').textContent = 'f(x) = '+a+'x + '+b;
  `, true);
}

function buildRatioPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Perbandingan', [
    { id: 'numA', label: 'Bagian A', min: 1, max: 50, value: 3 },
    { id: 'numB', label: 'Bagian B', min: 1, max: 50, value: 5 },
    { id: 'denA', label: 'Total yang dibagi', min: 1, max: 1000, value: 160 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value)||1;
    const b = parseFloat(document.getElementById('pg-numB').value)||1;
    const total = parseFloat(document.getElementById('pg-denA').value)||0;
    const partA = total * (a/(a+b));
    const partB = total * (b/(a+b));
    document.getElementById('pg-result').textContent = 'A : B = '+a+' : '+b;
    document.getElementById('pg-result2').textContent = 'A='+ partA.toFixed(1)+' | B='+partB.toFixed(1);
  `, true);
}

function buildSocialArithPlayground(id) {
  return buildCalcPlayground(id, 'Kalkulator Untung Rugi', [
    { id: 'numA', label: 'Harga Beli', min: 0, max: 100000, value: 50000 },
    { id: 'numB', label: 'Harga Jual', min: 0, max: 100000, value: 65000 },
  ], `
    const beli = parseFloat(document.getElementById('pg-numA').value)||0;
    const jual = parseFloat(document.getElementById('pg-numB').value)||0;
    const selisih = jual - beli;
    const persen = beli > 0 ? ((selisih/beli)*100).toFixed(1) : 0;
    document.getElementById('pg-result').textContent = (selisih>=0?'Untung: ':'Rugi: ')+'Rp '+Math.abs(selisih).toLocaleString('id-ID');
    document.getElementById('pg-result2').textContent = 'Persentase: '+Math.abs(persen)+'%';
  `, true);
}

function buildAnglePlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Visualisasi Sudut</div>
      <div class="playground-grid">
        <div class="playground-controls">
          <label for="pg-angle">Besar Sudut (°)</label>
          <input type="range" id="pg-angle" min="0" max="360" value="45" oninput="pgAngle_${id.replace('-','_')}()">
          <span id="pg-angle-val" class="text-accent" style="font-weight:600">45</span>°
        </div>
        <div>
          <div class="playground-visual">
            <svg viewBox="0 0 200 200" class="geo-svg" style="width:100%;max-width:200px">
              <line x1="100" y1="100" x2="190" y2="100" stroke="var(--gray-400)" stroke-width="2"/>
              <line id="pg-angle-line" x1="100" y1="100" x2="163" y2="37" stroke="var(--accent)" stroke-width="2.5"/>
              <path id="pg-angle-arc" d="" fill="var(--accent-light)" fill-opacity="0.5" stroke="var(--accent)" stroke-width="1.5"/>
              <circle cx="100" cy="100" r="3" fill="var(--accent)"/>
              <text id="pg-angle-lbl" x="140" y="88" font-size="13" fill="var(--accent)" font-weight="600">45°</text>
            </svg>
          </div>
          <div class="playground-output">
            <div class="playground-result" id="pg-result">Sudut Lancip</div>
          </div>
        </div>
      </div>
    </div>
    <script>
    function pgAngle_${id.replace('-','_')}() {
      const deg = parseInt(document.getElementById('pg-angle').value);
      document.getElementById('pg-angle-val').textContent = deg;
      const rad = -deg * Math.PI / 180;
      const len = 90;
      const ex = 100 + len * Math.cos(rad);
      const ey = 100 + len * Math.sin(rad);
      document.getElementById('pg-angle-line').setAttribute('x2', ex);
      document.getElementById('pg-angle-line').setAttribute('y2', ey);
      const arcR = 35;
      const ax = 100 + arcR * Math.cos(0);
      const ay = 100;
      const bx = 100 + arcR * Math.cos(rad);
      const by = 100 + arcR * Math.sin(rad);
      const largeArc = deg > 180 ? 1 : 0;
      document.getElementById('pg-angle-arc').setAttribute('d', 'M100,100 L'+ax+','+ay+' A'+arcR+','+arcR+' 0 '+largeArc+',0 '+bx+','+by+' Z');
      document.getElementById('pg-angle-lbl').textContent = deg+'°';
      let jenis = 'Sudut Nol';
      if(deg>0&&deg<90) jenis='Sudut Lancip';
      else if(deg===90) jenis='Sudut Siku-siku';
      else if(deg>90&&deg<180) jenis='Sudut Tumpul';
      else if(deg===180) jenis='Sudut Lurus';
      else if(deg>180&&deg<360) jenis='Sudut Refleks';
      else if(deg===360) jenis='Sudut Penuh';
      document.getElementById('pg-result').textContent = jenis;
    }
    pgAngle_${id.replace('-','_')}();
    </script>`;
}

function buildLogicPlayground(id) {
  return `
    <div class="playground" id="playground-${id}">
      <div class="playground-title"><i data-lucide="play-circle"></i> Tabel Kebenaran Logika</div>
      <div class="playground-grid" style="grid-template-columns:1fr">
        <div class="playground-controls" style="text-align:center;">
          <label>Operator</label>
          <select id="pg-op" onchange="pgLogic_${id.replace('-','_')}()" style="padding:.4rem .75rem;border:1px solid var(--gray-300);border-radius:8px;font-size:.9rem;margin-bottom:.5rem;">
            <option value="and">Konjungsi (∧)</option>
            <option value="or">Disjungsi (∨)</option>
            <option value="imp">Implikasi (→)</option>
            <option value="bi">Biimplikasi (↔)</option>
          </select>
        </div>
        <div class="playground-output" id="pg-logic-table" style="text-align:left;"></div>
      </div>
    </div>
    <script>
    function pgLogic_${id.replace('-','_')}() {
      const op = document.getElementById('pg-op').value;
      const ops = {and:(p,q)=>p&&q, or:(p,q)=>p||q, imp:(p,q)=>!p||q, bi:(p,q)=>(p&&q)||(!p&&!q)};
      const sym = {and:'∧',or:'∨',imp:'→',bi:'↔'};
      let html = '<table class="glossary-table"><tr><th>p</th><th>q</th><th>p '+sym[op]+' q</th></tr>';
      [[true,true],[true,false],[false,true],[false,false]].forEach(([p,q])=>{
        html+='<tr><td>'+(p?'T':'F')+'</td><td>'+(q?'T':'F')+'</td><td style="font-weight:600;color:var(--accent)">'+(ops[op](p,q)?'T':'F')+'</td></tr>';
      });
      html+='</table>';
      document.getElementById('pg-logic-table').innerHTML = html;
    }
    pgLogic_${id.replace('-','_')}();
    </script>`;
}

function buildFunctionPlayground(id) {
  return buildCalcPlayground(id, 'Evaluator Fungsi f(x) = ax + b', [
    { id: 'numA', label: 'Koefisien a', min: -10, max: 10, value: 2 },
    { id: 'numB', label: 'Konstanta b', min: -10, max: 10, value: 3 },
    { id: 'denA', label: 'Nilai x', min: -10, max: 10, value: 5 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value);
    const b = parseFloat(document.getElementById('pg-numB').value);
    const x = parseFloat(document.getElementById('pg-denA').value);
    document.getElementById('pg-result').textContent = 'f('+x+') = '+a+'('+x+') + '+b+' = '+(a*x+b);
    document.getElementById('pg-result2').textContent = 'f(x) = '+a+'x + '+b;
  `, true);
}

function buildInequalityPlayground(id) {
  return buildCalcPlayground(id, 'Cek Pertidaksamaan ax + b > 0', [
    { id: 'numA', label: 'Koefisien a', min: -10, max: 10, value: 2 },
    { id: 'numB', label: 'Konstanta b', min: -20, max: 20, value: -6 },
    { id: 'denA', label: 'Nilai x', min: -10, max: 10, value: 4 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value)||1;
    const b = parseFloat(document.getElementById('pg-numB').value);
    const x = parseFloat(document.getElementById('pg-denA').value);
    const v = a*x+b;
    document.getElementById('pg-result').textContent = a+'('+x+') + ('+b+') = '+v;
    document.getElementById('pg-result2').textContent = v > 0 ? '✅ Benar ('+v+' > 0)' : '❌ Salah ('+v+' ≤ 0)';
  `, true);
}

function buildLinProgPlayground(id) {
  return buildCalcPlayground(id, 'Evaluator Fungsi Tujuan Z = ax + by', [
    { id: 'numA', label: 'Koefisien a', min: 0, max: 10, value: 3 },
    { id: 'numB', label: 'Koefisien b', min: 0, max: 10, value: 5 },
    { id: 'denA', label: 'Nilai x', min: 0, max: 20, value: 4 },
    { id: 'denB', label: 'Nilai y', min: 0, max: 20, value: 2 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value);
    const b = parseFloat(document.getElementById('pg-numB').value);
    const x = parseFloat(document.getElementById('pg-denA').value);
    const y = parseFloat(document.getElementById('pg-denB').value);
    document.getElementById('pg-result').textContent = 'Z = '+a+'('+x+') + '+b+'('+y+') = '+(a*x+b*y);
    document.getElementById('pg-result2').textContent = 'Titik: ('+x+', '+y+')';
  `, true);
}

function buildPolynomialPlayground(id) {
  return buildCalcPlayground(id, 'Evaluator P(x) = ax³ + bx² + cx + d', [
    { id: 'numA', label: 'a', min: -5, max: 5, value: 1 },
    { id: 'numB', label: 'b', min: -10, max: 10, value: -2 },
    { id: 'denA', label: 'c', min: -10, max: 10, value: 3 },
    { id: 'denB', label: 'x', min: -10, max: 10, value: 2 },
  ], `
    const a = parseFloat(document.getElementById('pg-numA').value);
    const b = parseFloat(document.getElementById('pg-numB').value);
    const c = parseFloat(document.getElementById('pg-denA').value);
    const x = parseFloat(document.getElementById('pg-denB').value);
    const result = a*x*x*x + b*x*x + c*x;
    document.getElementById('pg-result').textContent = 'P('+x+') = '+result;
    document.getElementById('pg-result2').textContent = a+'x³ + ('+b+')x² + ('+c+')x';
  `, true);
}

function buildSimilarityPlayground(id) {
  return buildCalcPlayground(id, 'Cek Kesebangunan Segitiga (rasio sisi)', [
    { id: 'numA', label: 'Sisi a₁', min: 1, max: 20, value: 3 },
    { id: 'numB', label: 'Sisi b₁', min: 1, max: 20, value: 4 },
    { id: 'denA', label: 'Sisi a₂', min: 1, max: 40, value: 6 },
    { id: 'denB', label: 'Sisi b₂', min: 1, max: 40, value: 8 },
  ], `
    const a1 = parseFloat(document.getElementById('pg-numA').value)||1;
    const b1 = parseFloat(document.getElementById('pg-numB').value)||1;
    const a2 = parseFloat(document.getElementById('pg-denA').value)||1;
    const b2 = parseFloat(document.getElementById('pg-denB').value)||1;
    const r1 = (a1/a2).toFixed(4);
    const r2 = (b1/b2).toFixed(4);
    document.getElementById('pg-result').textContent = 'Rasio a: '+r1+' | Rasio b: '+r2;
    document.getElementById('pg-result2').textContent = r1===r2 ? '✅ Sebangun (rasio sama)' : '❌ Tidak sebangun';
  `, true);
}

/* ═══════════ HTML template ═══════════ */

function buildHtml(chapterId, meta, parsed) {
  const { mainTitle, sections, footnotes } = parsed;
  const cls = meta.cls;
  const gradeClass = getGradeClass(cls);
  const gradeLabel = getGradeLabel(cls);

  // Build pillar sections
  let sectionsHtml = '';
  for (const sec of sections) {
    const pilarNum = sec.pillar;
    const icon = PILLAR_ICONS[pilarNum] || 'book-open';
    const pilarName = PILLAR_NAMES[pilarNum] || sec.title;

    // Determine card wrapping for pillar 2 (Pijakan Bumi) and 4 (Logika Komputasi)
    const useCard = pilarNum === '2';
    const bodyHtml = renderPillarBody(pilarNum, sec.lines);

    sectionsHtml += `
      <!-- Pilar ${pilarNum}: ${pilarName} -->
      <section class="pillar-section" id="pillar-${pilarNum}">
        <div class="pillar-header">
          <i data-lucide="${icon}"></i>
          <h2>${pilarNum}. ${pilarName}</h2>
        </div>
        ${useCard ? '<div class="info-card">' : ''}
        ${pilarNum === '6' ? '<div class="exercise-card">' : ''}
        ${bodyHtml}
        ${pilarNum === '6' ? '</div>' : ''}
        ${useCard ? '</div>' : ''}
      </section>`;
  }

  // Footnotes
  let footnotesHtml = '';
  if (footnotes.length > 0) {
    footnotesHtml = '<div class="footnote">';
    footnotes.forEach(fn => { footnotesHtml += `<p>${inlineMd(fn)}</p>`; });
    footnotesHtml += '</div>';
  }

  // Playground
  const playgroundHtml = generatePlayground(chapterId, mainTitle, sections);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chapterId}: ${meta.title} — Telat Belajar MTK</title>
  <meta name="description" content="${meta.title} — Materi matematika Kelas ${cls} ${gradeLabel} dengan metode Grounded Math. Belajar dari akar konsep, contoh dunia nyata, logika komputasi, hingga soal latihan.">

  <!-- Styles -->
  <link rel="stylesheet" href="assets/styles.css">
  <!-- KaTeX -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body, {delimiters:[{left:'\\\\[',right:'\\\\]',display:true},{left:'\\\\(',right:'\\\\)',display:false}]});"></script>
  <!-- Prism.js Syntax Highlighting -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="${gradeClass}">

  <!-- Mobile overlay -->
  <div id="nav-overlay"></div>

  <div class="app-layout">
    <!-- Sidebar (injected by navigation.js) -->
    <nav id="nav-sidebar" aria-label="Navigasi Materi"></nav>

    <!-- Main content -->
    <main class="main-content">
      <!-- Top bar -->
      <div class="top-bar">
        <button id="nav-hamburger" aria-label="Menu navigasi">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="breadcrumb">
          <a href="index.html">Beranda</a> / Kelas ${cls} / <strong>${chapterId}</strong>
        </div>
      </div>

      <!-- Hero -->
      <div class="page-hero">
        <span class="hero-badge">${gradeLabel} — Kelas ${cls}</span>
        <h1>${mainTitle}</h1>
        <p class="hero-subtitle">Metode Grounded Math — 6 Pilar Pembelajaran</p>
      </div>

      <!-- Content -->
      <div class="content-body">
        ${sectionsHtml}

        ${footnotesHtml}

        <!-- Interactive Playground -->
        ${playgroundHtml}

        <!-- Prev/Next navigation -->
        <div id="prev-next-bar"></div>
      </div>
    </main>
  </div>

  <!-- Navigation JS -->
  <script src="assets/navigation.js"></script>
  <!-- Prism.js Syntax Highlighting -->
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
  <!-- Initialize Lucide icons -->
  <script>lucide.createIcons();</script>
</body>
</html>`;
}

/* ═══════════ Main build process ═══════════ */

function build() {
  console.log('🔨 Building HTML from drafts...\n');

  // Ensure docs/assets exists
  const assetsDir = path.join(DOCS_DIR, 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  let count = 0;
  const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md')).sort((a, b) => {
    const [aClass, aBab] = a.replace('.md', '').split('-').map(Number);
    const [bClass, bBab] = b.replace('.md', '').split('-').map(Number);
    return aClass !== bClass ? aClass - bClass : aBab - bBab;
  });

  for (const file of files) {
    const id = file.replace('.md', '');
    const meta = CHAPTERS[id];
    if (!meta) {
      console.log(`  ⚠ Skipping ${file} (not in curriculum index)`);
      continue;
    }

    const mdPath = path.join(DRAFTS_DIR, file);
    const htmlPath = path.join(DOCS_DIR, `${id}.html`);

    // Versioning check: skip if HTML exists and is newer than MD
    if (fs.existsSync(htmlPath)) {
      const mdStat = fs.statSync(mdPath);
      const htmlStat = fs.statSync(htmlPath);
      if (htmlStat.mtimeMs >= mdStat.mtimeMs) {
        console.log(`  ⏭ ${id}.html is up to date`);
        continue;
      }
    }

    const md = fs.readFileSync(mdPath, 'utf-8');
    const parsed = parseDraft(md);
    const html = buildHtml(id, meta, parsed);

    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`  ✅ ${id}.html`);
    count++;
  }

  console.log(`\n✨ Done! ${count} file(s) generated in /docs/`);
}

build();
