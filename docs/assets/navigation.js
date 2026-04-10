/**
 * navigation.js — Dynamic Sidebar Navigation for Telat Belajar MTK
 * Reads curriculum structure and injects a responsive sidebar into every page.
 */

const CURRICULUM = {
  sd: {
    label: 'SD (Kelas 1-6)',
    color: 'indigo',
    classes: {
      1: { title: 'Kelas 1', chapters: [
        { id: '1-1', title: 'Pengenalan & Operasi Bilangan' },
        { id: '1-2', title: 'Pengukuran Waktu, Panjang, Berat' },
        { id: '1-3', title: 'Bangun Datar & Bangun Ruang' },
      ]},
      2: { title: 'Kelas 2', chapters: [
        { id: '2-1', title: 'Bilangan Cacah & Operasi Hitung' },
        { id: '2-2', title: 'Perkalian dan Pembagian' },
        { id: '2-3', title: 'Pengukuran (Panjang, Berat, Waktu)' },
        { id: '2-4', title: 'Bangun Datar' },
      ]},
      3: { title: 'Kelas 3', chapters: [
        { id: '3-1', title: 'Bilangan, Uang, & Operasi Hitung' },
        { id: '3-2', title: 'Pecahan Sederhana' },
        { id: '3-3', title: 'Pengukuran Baku' },
        { id: '3-4', title: 'Bangun Datar, Keliling, & Luas' },
      ]},
      4: { title: 'Kelas 4', chapters: [
        { id: '4-1', title: 'Operasi Hitung & Bilangan Bulat' },
        { id: '4-2', title: 'Kelipatan, Faktor, Bil. Romawi' },
        { id: '4-3', title: 'Pecahan Lanjutan' },
        { id: '4-4', title: 'Pengukuran (Sudut, Waktu, dll)' },
        { id: '4-5', title: 'Bangun Datar & Bangun Ruang' },
      ]},
      5: { title: 'Kelas 5', chapters: [
        { id: '5-1', title: 'Operasi Bilangan, Pangkat, Akar' },
        { id: '5-2', title: 'Pengukuran Lanjutan' },
        { id: '5-3', title: 'Pecahan, Persen, & Skala' },
        { id: '5-4', title: 'Bangun Datar & Bangun Ruang' },
      ]},
      6: { title: 'Kelas 6', chapters: [
        { id: '6-1', title: 'Operasi Bilangan Bulat & Pecahan' },
        { id: '6-2', title: 'Pengukuran (Volume, Waktu, Debit)' },
        { id: '6-3', title: 'Geometri (Luas & Volume)' },
        { id: '6-4', title: 'Sistem Koordinat' },
        { id: '6-5', title: 'Pengolahan & Penyajian Data' },
      ]},
    }
  },
  smp: {
    label: 'SMP (Kelas 7-9)',
    color: 'emerald',
    classes: {
      7: { title: 'Kelas 7', chapters: [
        { id: '7-1', title: 'Bilangan' },
        { id: '7-2', title: 'Bentuk Aljabar' },
        { id: '7-3', title: 'Segiempat dan Segitiga' },
        { id: '7-4', title: 'Persamaan & Pertidaksamaan Linear' },
        { id: '7-5', title: 'Penyajian Data' },
        { id: '7-6', title: 'Aritmetika Sosial' },
        { id: '7-7', title: 'Perbandingan' },
        { id: '7-8', title: 'Garis dan Sudut' },
      ]},
      8: { title: 'Kelas 8', chapters: [
        { id: '8-1', title: 'Persamaan Garis Lurus' },
        { id: '8-2', title: 'Persamaan Linear Dua Variabel' },
        { id: '8-3', title: 'Teorema Pythagoras' },
        { id: '8-4', title: 'Statistika' },
        { id: '8-5', title: 'Lingkaran' },
        { id: '8-6', title: 'Peluang' },
        { id: '8-7', title: 'Bidang Kartesius' },
        { id: '8-8', title: 'Bilangan Berpangkat & Bentuk Akar' },
      ]},
      9: { title: 'Kelas 9', chapters: [
        { id: '9-1', title: 'Kesebangunan & Kekongruenan' },
        { id: '9-2', title: 'Bangun Ruang Sisi Datar' },
        { id: '9-3', title: 'Bangun Ruang Sisi Lengkung' },
        { id: '9-4', title: 'Pola Bilangan' },
        { id: '9-5', title: 'Persamaan Kuadrat' },
        { id: '9-6', title: 'Relasi dan Fungsi' },
      ]},
    }
  },
  sma: {
    label: 'SMA (Kelas 10-12)',
    color: 'violet',
    classes: {
      10: { title: 'Kelas 10', chapters: [
        { id: '10-1', title: 'Pangkat, Akar, & Logaritma' },
        { id: '10-2', title: 'Persamaan & Fungsi Kuadrat' },
        { id: '10-3', title: 'Sistem Persamaan Linear & Kuadrat' },
        { id: '10-4', title: 'Pertidaksamaan' },
        { id: '10-5', title: 'Logika Matematika' },
        { id: '10-6', title: 'Trigonometri Dasar' },
        { id: '10-7', title: 'Ruang Dimensi Tiga' },
      ]},
      11: { title: 'Kelas 11', chapters: [
        { id: '11-1', title: 'Statistika' },
        { id: '11-2', title: 'Peluang' },
        { id: '11-3', title: 'Trigonometri Lanjutan' },
        { id: '11-4', title: 'Lingkaran' },
        { id: '11-5', title: 'Suku Banyak (Polinomial)' },
        { id: '11-6', title: 'Fungsi Komposisi & Invers' },
        { id: '11-7', title: 'Limit Fungsi' },
        { id: '11-8', title: 'Turunan (Diferensial)' },
      ]},
      12: { title: 'Kelas 12', chapters: [
        { id: '12-1', title: 'Integral' },
        { id: '12-2', title: 'Program Linear' },
        { id: '12-3', title: 'Matriks' },
        { id: '12-4', title: 'Barisan, Deret, & Notasi Sigma' },
        { id: '12-5', title: 'Eksponen dan Logaritma' },
      ]},
    }
  }
};

/* Color maps for each grade level */
const COLOR_MAP = {
  indigo: {
    bg: '#eef2ff', bgHover: '#e0e7ff', text: '#3730a3', accent: '#6366f1',
    badgeBg: '#e0e7ff', badgeText: '#4338ca', activeBg: '#6366f1', activeText: '#ffffff',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
  },
  emerald: {
    bg: '#ecfdf5', bgHover: '#d1fae5', text: '#065f46', accent: '#10b981',
    badgeBg: '#d1fae5', badgeText: '#047857', activeBg: '#10b981', activeText: '#ffffff',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  violet: {
    bg: '#f5f3ff', bgHover: '#ede9fe', text: '#4c1d95', accent: '#8b5cf6',
    badgeBg: '#ede9fe', badgeText: '#6d28d9', activeBg: '#8b5cf6', activeText: '#ffffff',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
};

/**
 * Determine the current page ID from the filename
 */
function getCurrentPageId() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  return filename;
}

/**
 * Determine the grade level (sd/smp/sma) from a page ID
 */
function getGradeLevel(pageId) {
  const classNum = parseInt(pageId.split('-')[0]);
  if (classNum >= 1 && classNum <= 6) return 'sd';
  if (classNum >= 7 && classNum <= 9) return 'smp';
  if (classNum >= 10 && classNum <= 12) return 'sma';
  return 'sd';
}

/**
 * Get adjacent chapter info for prev/next navigation
 */
function getAdjacentChapters(currentId) {
  const allChapters = [];
  for (const level of Object.values(CURRICULUM)) {
    for (const cls of Object.values(level.classes)) {
      for (const ch of cls.chapters) {
        allChapters.push({ ...ch, color: level.color });
      }
    }
  }
  const idx = allChapters.findIndex(c => c.id === currentId);
  return {
    prev: idx > 0 ? allChapters[idx - 1] : null,
    next: idx < allChapters.length - 1 ? allChapters[idx + 1] : null,
  };
}

/**
 * Build and inject the sidebar navigation
 */
function initNavigation() {
  const currentId = getCurrentPageId();
  const currentGrade = getGradeLevel(currentId);

  // Create sidebar container
  const sidebar = document.getElementById('nav-sidebar');
  if (!sidebar) return;

  let html = '';
  html += `<div class="sidebar-header">
    <a href="index.html" class="sidebar-logo">
      <span class="logo-icon">🧮</span>
      <span class="logo-text">Telat Belajar MTK</span>
    </a>
  </div>`;

  for (const [levelKey, level] of Object.entries(CURRICULUM)) {
    const colors = COLOR_MAP[level.color];
    const isCurrentLevel = levelKey === currentGrade;

    html += `<div class="nav-level ${isCurrentLevel ? 'nav-level--active' : ''}">
      <div class="nav-level-header" style="background:${colors.badgeBg};color:${colors.badgeText}" onclick="this.parentElement.classList.toggle('nav-level--expanded')">
        <span class="nav-level-label">${level.label}</span>
        <svg class="nav-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <div class="nav-level-body">`;

    for (const [clsNum, cls] of Object.entries(level.classes)) {
      html += `<div class="nav-class-group">
        <div class="nav-class-title" style="color:${colors.text}">${cls.title}</div>
        <ul class="nav-chapter-list">`;

      for (const ch of cls.chapters) {
        const isActive = ch.id === currentId;
        const activeStyle = isActive
          ? `background:${colors.activeBg};color:${colors.activeText};font-weight:600;`
          : '';
        html += `<li>
          <a href="${ch.id}.html" class="nav-chapter-link ${isActive ? 'nav-chapter-link--active' : ''}" style="${activeStyle}">
            <span class="chapter-number">${ch.id}</span>
            <span class="chapter-title">${ch.title}</span>
          </a>
        </li>`;
      }

      html += `</ul></div>`;
    }

    html += `</div></div>`;
  }

  sidebar.innerHTML = html;

  // Auto-expand current level
  const activeLevel = sidebar.querySelector('.nav-level--active');
  if (activeLevel) activeLevel.classList.add('nav-level--expanded');

  // Scroll active link into view
  requestAnimationFrame(() => {
    const activeLink = sidebar.querySelector('.nav-chapter-link--active');
    if (activeLink) activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  // Setup mobile toggle
  const hamburger = document.getElementById('nav-hamburger');
  const overlay = document.getElementById('nav-overlay');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar--open');
      overlay.classList.toggle('overlay--visible');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('overlay--visible');
    });
  }

  // Build prev/next bar
  const adj = getAdjacentChapters(currentId);
  const prevNextBar = document.getElementById('prev-next-bar');
  if (prevNextBar) {
    let pnHtml = '';
    if (adj.prev) {
      pnHtml += `<a href="${adj.prev.id}.html" class="pn-link pn-prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        <div><small>Sebelumnya</small><span>${adj.prev.id}: ${adj.prev.title}</span></div>
      </a>`;
    } else {
      pnHtml += '<div></div>';
    }
    if (adj.next) {
      pnHtml += `<a href="${adj.next.id}.html" class="pn-link pn-next">
        <div><small>Selanjutnya</small><span>${adj.next.id}: ${adj.next.title}</span></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>`;
    }
    prevNextBar.innerHTML = pnHtml;
  }
}

document.addEventListener('DOMContentLoaded', initNavigation);
