/* =========================================================
   GAMEVERSE.JS  –  Interactive Gaming Platform Script
   ========================================================= */

'use strict';

/* ── 1. LOADING SCREEN ───────────────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loader-bar');
  const loaderTx = document.getElementById('loader-text');
  const messages = ['Đang tải GameVerse...', 'Kết nối máy chủ gaming...', 'Tải thư viện 500+ game...', 'Sẵn sàng chiến!'];
  let progress = 0, msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 20 + 8;
    if (progress > 100) progress = 100;
    if (bar) bar.style.width = progress + '%';

    const newIdx = Math.floor((progress / 100) * (messages.length - 1));
    if (newIdx !== msgIdx && loaderTx) {
      msgIdx = newIdx;
      loaderTx.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          loader.style.pointerEvents = 'none';
          setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
        initTypewriter();
        initParticles();
      }, 350);
    }
  }, 100);
})();

/* ── 2. TYPEWRITER EFFECT ────────────────────────────────── */
function initTypewriter() {
  const lines = [
    document.querySelector('.hero-line-1'),
    document.querySelector('.hero-line-2'),
    document.querySelector('.hero-line-3'),
  ];
  const texts = ['Khám Phá', 'Thế Giới Game', 'Đỉnh Cao'];

  lines.forEach((el, i) => {
    if (!el) return;
    const txt = texts[i];
    el.textContent = '';
    el.style.opacity = '1';
    let j = 0;
    const delay = i * 500;
    setTimeout(() => {
      const ti = setInterval(() => {
        el.textContent += txt[j++];
        if (j >= txt.length) clearInterval(ti);
      }, 55);
    }, delay);
  });
}

/* ── 3. PARTICLE CANVAS ──────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 75;
  const COLORS = ['rgba(139,92,246,', 'rgba(6,182,212,', 'rgba(99,102,241,', 'rgba(236,72,153,'];

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * (W || 1920),
      y: Math.random() * (H || 1080),
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(139,92,246,' + (0.12 * (1 - dist / 110)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 4. NAVIGATION, SCROLLSPY & GENRE FILTERS ─────────────── */
(function initNavigationSystem() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Mobile dropdown tap
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    item.addEventListener('click', e => {
      if (window.innerWidth < 900) {
        e.stopPropagation();
        item.classList.toggle('open');
      }
    });
  });

  // Smooth scroll helper
  function scrollToSection(targetId) {
    const el = document.querySelector(targetId);
    if (!el) return;
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Close mobile menu if open
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
    }
  }

  // Handle all general navbar link clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // Handle Genre selection from Navbar Dropdown & Footer
  document.querySelectorAll('[data-genre-nav]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const genre = item.dataset.genreNav;
      applyGenreFilter(genre);
    });
  });

  // Handle Genre selection from Bento Cards
  document.querySelectorAll('[data-genre-card]').forEach(card => {
    card.addEventListener('click', () => {
      const genre = card.dataset.genreCard;
      applyGenreFilter(genre);
    });
  });

  function applyGenreFilter(genre) {
    currentGenre = genre;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.genre === genre);
    });
    renderGames();
    scrollToSection('#games-section');
    const genreNames = {
      'rpg': '🗡️ Nhập Vai (RPG)',
      'shooter': '🎯 Bắn Súng (Shooter)',
      'strategy': '♟️ Chiến Thuật (Strategy)',
      'racing': '🚗 Đua Xe Tốc Độ',
      'sports': '🌍 Thể Thao',
      'horror': '👻 Kinh Dị Sinh Tồn',
      'all': 'Tất Cả Thể Loại'
    };
    showToast('🎮 Đang hiển thị: ' + (genreNames[genre] || genre.toUpperCase()));
  }

  // Navbar CTA button "Chơi Ngay ▶"
  const navPlayBtn = document.getElementById('btn-nav-play');
  if (navPlayBtn) {
    navPlayBtn.addEventListener('click', () => {
      scrollToSection('#games-section');
      showToast('🎮 Khám phá và chọn tựa game bạn yêu thích!');
    });
  }

  // Hero Explore Button
  const heroExplore = document.getElementById('btn-hero-explore');
  if (heroExplore) {
    heroExplore.addEventListener('click', () => {
      scrollToSection('#games-section');
    });
  }

  // Scrollspy: automatically update active nav item
  const sections = [
    { id: 'hero', nav: 'hero' },
    { id: 'genres-section', nav: 'genres-section' },
    { id: 'spotlight-section', nav: 'spotlight-section' },
    { id: 'esports-section', nav: 'esports-section' },
    { id: 'news-section', nav: 'news-section' },
    { id: 'games-section', nav: 'games-section' }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = document.getElementById(sections[i].id);
      if (sec && sec.offsetTop <= scrollPos) {
        document.querySelectorAll('.nav-link').forEach(l => {
          const match = l.getAttribute('href') === '#' + sections[i].id;
          l.classList.toggle('active', match);
        });
        break;
      }
    }
  });
})();

/* ── 5. NOTIFICATION DROPDOWN SYSTEM ─────────────────────── */
(function initNotifications() {
  const notifBtn   = document.getElementById('btn-notif');
  const notifDrop  = document.getElementById('notif-dropdown');
  const notifBadge = document.getElementById('notif-badge');
  const notifPill  = document.getElementById('notif-pill');
  const markAllBtn = document.getElementById('btn-mark-all-read');
  const notifCards = document.querySelectorAll('.notif-card');

  if (!notifBtn || !notifDrop) return;

  // Toggle dropdown
  notifBtn.addEventListener('click', e => {
    e.stopPropagation();
    notifDrop.classList.toggle('active');
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!notifDrop.contains(e.target) && !notifBtn.contains(e.target)) {
      notifDrop.classList.remove('active');
    }
  });

  // Close with Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') notifDrop.classList.remove('active');
  });

  // Mark all as read
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      notifCards.forEach(c => c.classList.add('read'));
      if (notifBadge) notifBadge.style.display = 'none';
      if (notifPill) notifPill.textContent = '0 Mới';
      showToast('✅ Đã đánh dấu tất cả thông báo là đã đọc!');
    });
  }

  // Click on a notification item
  notifCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.add('read');
      const target = card.dataset.target;
      if (target) {
        notifDrop.classList.remove('active');
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── 6. SHOPPING CART DRAWER SYSTEM ──────────────────────── */
let cartItems = [
  { id: 1, title: 'Dragon Realm Chronicles', genre: 'RPG', price: 599000, img: '/images/game_rpg_cover.jpg', qty: 1 },
  { id: 2, title: 'Void Strike: Battle Pass S3', genre: 'Shooter', price: 250000, img: '/images/game_shooter_cover.jpg', qty: 1 }
];
let appliedPromo = null;

function formatVND(amount) {
  return amount.toLocaleString('vi-VN') + '₫';
}

function updateCartBadges() {
  const badge = document.getElementById('cart-badge');
  const drawerCount = document.getElementById('cart-drawer-count');
  const count = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  if (drawerCount) drawerCount.textContent = count;
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('discount-row');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');

  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <h4>Giỏ hàng của bạn đang trống</h4>
        <p style="font-size:0.85rem;margin-top:6px;">Hãy khám phá kho game và thêm tựa game bạn yêu thích!</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '0₫';
    if (discountRow) discountRow.style.display = 'none';
    if (totalEl) totalEl.textContent = '0₫';
    updateCartBadges();
    return;
  }

  container.innerHTML = cartItems.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.img}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <div>
          <span class="cart-item-genre">${item.genre}</span>
          <h4 class="cart-item-title">${item.title}</h4>
        </div>
        <div class="cart-item-bottom">
          <span class="cart-item-price">${formatVND(item.price)}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕ Xóa</button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;
  if (appliedPromo === 'VIP50') {
    discount = subtotal * 0.5;
    if (discountRow) discountRow.style.display = 'flex';
    if (discountEl) discountEl.textContent = '-' + formatVND(discount);
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }

  const total = subtotal - discount;
  if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
  if (totalEl) totalEl.textContent = formatVND(total);
  updateCartBadges();
}

function addToCart(gameId) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;

  const existing = cartItems.find(i => i.id === gameId);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: game.id,
      title: game.title,
      genre: game.genre.toUpperCase(),
      price: game.price || 499000,
      img: game.img,
      qty: 1
    });
  }
  renderCartDrawer();
  openCartDrawer();
  showToast('🛒 Đã thêm "' + game.title + '" vào giỏ hàng!');
}

function removeFromCart(gameId) {
  cartItems = cartItems.filter(i => i.id !== gameId);
  renderCartDrawer();
  showToast('🗑️ Đã xóa game khỏi giỏ hàng');
}

function openCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer  = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer  = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

(function initCartEvents() {
  const cartBtn   = document.getElementById('btn-cart');
  const overlay   = document.getElementById('cart-drawer-overlay');
  const closeBtn  = document.getElementById('cart-drawer-close');
  const continueBtn = document.getElementById('btn-cart-continue');
  const checkoutBtn = document.getElementById('btn-cart-checkout');
  const promoBtn  = document.getElementById('btn-apply-promo');
  const promoInput = document.getElementById('cart-promo-input');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (continueBtn) continueBtn.addEventListener('click', closeCartDrawer);

  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'VIP50') {
        appliedPromo = 'VIP50';
        renderCartDrawer();
        showToast('🎉 Áp dụng mã VIP50 thành công: Giảm 50%!');
      } else if (code) {
        showToast('⚠️ Mã giảm giá không hợp lệ. Hãy thử: VIP50');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        showToast('⚠️ Giỏ hàng của bạn đang trống!');
        return;
      }
      showToast('🚀 Đặt hàng thành công! Trò chơi đã được kích hoạt vào tài khoản của bạn.', 4500);
      cartItems = [];
      appliedPromo = null;
      renderCartDrawer();
      setTimeout(closeCartDrawer, 1200);
    });
  }

  renderCartDrawer();
})();

/* ── 7. CINEMATIC TRAILER MODAL ──────────────────────────── */
(function initTrailerSystem() {
  const btn = document.getElementById('btn-hero-trailer');
  const overlay = document.getElementById('trailer-modal-overlay');
  const closeBtn = document.getElementById('trailer-modal-close');
  const playIcon = document.getElementById('trailer-play-btn');

  function openTrailer() {
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    startTrailerCanvas();
  }

  function closeTrailer() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btn) btn.addEventListener('click', openTrailer);
  if (closeBtn) closeBtn.addEventListener('click', closeTrailer);
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeTrailer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay) closeTrailer(); });

  if (playIcon) {
    playIcon.addEventListener('click', () => {
      showToast('🎬 Đang phát trailer 4K Dragon Realm: The Eternal Rift...');
    });
  }

  function startTrailerCanvas() {
    const canvas = document.getElementById('trailer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let frame = 0;

    function render() {
      if (!overlay.classList.contains('active')) return;
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Sci-fi grid
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Moving light beams
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, 'rgba(168,85,247,0.1)');
      grad.addColorStop(0.5, 'rgba(6,182,212,0.2)');
      grad.addColorStop(1, 'rgba(236,72,153,0.1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(render);
    }
    render();
  }
})();

/* ── 8. SEARCH BAR & SUGGESTIONS ─────────────────────────── */
(function initSearch() {
  const input = document.getElementById('search-input');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

  const GAME_NAMES = [
    'Dragon Realm Chronicles', 'Void Strike Ops', 'Kingdom Fall',
    'Shadow Hospital', 'FIFA Ultimate 25', 'Cyber Drift Racing',
    'Elden Forge', 'Tactical Warzone', 'Haunted Manor',
    'Speed Legends 2026'
  ];

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!q) { suggestions.classList.remove('visible'); return; }

    const matches = GAME_NAMES.filter(n => n.toLowerCase().includes(q));
    if (!matches.length) { suggestions.classList.remove('visible'); return; }

    matches.slice(0, 6).forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      li.addEventListener('click', () => {
        input.value = name;
        suggestions.classList.remove('visible');
        performSearch(name);
      });
      suggestions.appendChild(li);
    });
    suggestions.classList.add('visible');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) performSearch(q);
    }
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.classList.remove('visible');
    }
  });

  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) performSearch(q);
    });
  }

  function performSearch(query) {
    suggestions.classList.remove('visible');
    const q = query.toLowerCase();
    const list = GAMES.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q))
    );

    const container = document.getElementById('games-grid');
    const gridSec = document.getElementById('games-section');
    if (gridSec) {
      gridSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (list.length === 0) {
      if (container) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding: 48px 16px; background: var(--bg-card); border-radius: var(--r-xl); border: 1px solid var(--border);">
            <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
            <h3 style="font-family: var(--font-h); font-size: 1.4rem; margin-bottom: 8px;">Không tìm thấy tựa game nào với "${query}"</h3>
            <p style="color: var(--text-2); font-size: 0.9rem; margin-bottom: 20px;">Hãy thử tìm kiếm với thể loại RPG, Shooter, Racing hoặc tên game khác.</p>
            <button onclick="currentGenre='all';renderGames();" style="padding: 10px 24px; background: var(--grad-main); border-radius: 100px; color: #fff; font-weight: 700;">Xem Tất Cả Game</button>
          </div>
        `;
      }
      showToast('⚠️ Không tìm thấy kết quả cho: ' + query);
    } else {
      renderGameList(list);
      showToast('🔍 Tìm thấy ' + list.length + ' tựa game phù hợp!');
    }
  }
})();

/* ── 9. SPOTLIGHT TABS ───────────────────────────────────── */
(function initSpotlight() {
  const tabs    = document.querySelectorAll('.spotlight-tab');
  const panels  = document.querySelectorAll('.spotlight-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('panel-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
})();

/* ── 10. TRENDING HORIZONTAL SCROLL ──────────────────────── */
(function initTrending() {
  const track = document.querySelector('.trending-track');
  const btnL  = document.querySelector('.trend-btn-left');
  const btnR  = document.querySelector('.trend-btn-right');
  if (!track) return;

  const STEP = 320;
  if (btnL) btnL.addEventListener('click', () => { track.scrollBy({ left: -STEP, behavior: 'smooth' }); });
  if (btnR) btnR.addEventListener('click', () => { track.scrollBy({ left: STEP, behavior: 'smooth' }); });

  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',   () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
})();

/* ── 11. ESPORTS COUNTDOWN ───────────────────────────────── */
(function initCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 12);
  target.setHours(20, 0, 0, 0);

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = target - now;
    if (diff <= 0) return;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const el = id => document.getElementById(id);
    if (el('cd-days'))    el('cd-days').textContent    = pad(d);
    if (el('cd-hours'))   el('cd-hours').textContent   = pad(h);
    if (el('cd-minutes')) el('cd-minutes').textContent = pad(m);
    if (el('cd-seconds')) el('cd-seconds').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── 12. GAMES DATA & GRID ───────────────────────────────── */
const GAMES = [
  { id: 1, title: 'Dragon Realm Chronicles', genre: 'rpg',      price: 599000, rating: 9.4, players: '2.1M', year: 2024, img: '/images/game_rpg_cover.jpg',      tags: ['Open World', 'Fantasy', 'Multiplayer'], desc: 'Phiêu lưu sử thi trong vương quốc rồng huyền bí với hệ thống chiến đấu đột phá và thế giới mở rộng lớn.' },
  { id: 2, title: 'Void Strike Ops',         genre: 'shooter',  price: 349000, rating: 9.1, players: '5.3M', year: 2024, img: '/images/game_shooter_cover.jpg',   tags: ['FPS', 'Tactical', 'Online'],          desc: 'Game bắn súng chiến thuật đỉnh cao với lối chơi 5v5 cực kỳ kịch tính, vũ khí phong phú.' },
  { id: 3, title: 'Kingdom Fall',            genre: 'strategy', price: 420000, rating: 8.8, players: '1.2M', year: 2023, img: '/images/game_strategy_cover.jpg',  tags: ['RTS', 'Medieval', 'PvP'],             desc: 'Xây dựng đế chế hùng mạnh và chinh phục các vương quốc trong thời đại trung cổ rực lửa.' },
  { id: 4, title: 'FIFA Ultimate 25',        genre: 'sports',   price: 799000, rating: 8.5, players: '8.9M', year: 2024, img: '/images/game_sports_cover.jpg',    tags: ['Football', 'Career', 'Online'],       desc: 'Trải nghiệm bóng đá đỉnh cao với đội hình mơ ước và các giải đấu danh giá toàn cầu.' },
  { id: 5, title: 'Shadow Hospital',         genre: 'horror',   price: 299000, rating: 9.2, players: '0.8M', year: 2024, img: '/images/game_horror_cover.jpg',    tags: ['Horror', 'Survival', 'Puzzle'],       desc: 'Khám phá bệnh viện ma ám đầy bí ẩn trong đêm tối với những câu đố hóc búa và sinh tồn rùng rợn.' },
  { id: 6, title: 'Elden Forge',             genre: 'rpg',      price: 649000, rating: 9.6, players: '3.4M', year: 2024, img: '/images/game_rpg_cover.jpg',       tags: ['Souls-like', 'Action', 'RPG'],        desc: 'Hành trình vào vùng đất đen tối đầy thử thách với gameplay cực kỳ khó và thỏa mãn.' },
  { id: 7, title: 'Tactical Warzone',        genre: 'shooter',  price: 0,      rating: 8.7, players: '6.1M', year: 2023, img: '/images/game_shooter_cover.jpg',   tags: ['Battle Royale', 'Free2Play'],         desc: 'Battle Royale 100 người miễn phí với bản đồ khổng lồ và vô số sự kiện theo mùa.' },
  { id: 8, title: 'Haunted Manor',           genre: 'horror',   price: 199000, rating: 8.9, players: '0.5M', year: 2024, img: '/images/game_horror_cover.jpg',    tags: ['Gothic', 'Mystery', 'Single-player'], desc: 'Câu chuyện kinh dị Gothic đậm chất văn học với không khí u ám và cốt truyện bất ngờ.' },
  { id: 9, title: 'Cyber Drift Racing',      genre: 'racing',   price: 450000, rating: 9.3, players: '1.7M', year: 2024, img: '/images/gaming_hero_banner.jpg',  tags: ['Racing', 'Cyberpunk', 'Drift'],       desc: 'Những chặng đua xe tốc độ cao trên đường cao tốc ngập tràn ánh đèn neon tương lai.' },
  { id: 10, title: 'Speed Legends 2026',     genre: 'racing',   price: 520000, rating: 9.0, players: '2.5M', year: 2024, img: '/images/game_sports_cover.jpg',    tags: ['Supercars', 'Multiplayer', 'Nitro'],  desc: 'Cầm lái những siêu xe mạnh mẽ nhất hành tinh và thống trị bảng xếp hạng tốc độ quốc tế.' }
];

let currentGenre  = 'all';
let currentSort   = 'rating';
let currentView   = 'grid';

function renderGameList(list) {
  const container = document.getElementById('games-grid');
  if (!container) return;

  container.className = 'games-grid ' + (currentView === 'list' ? 'list-view' : '');

  container.innerHTML = list.map(g => `
    <div class="game-card" data-id="${g.id}">
      <div class="game-card-img-wrap" onclick="openGameModal(${g.id})">
        <img src="${g.img}" alt="${g.title}" loading="lazy" />
        <div class="game-card-overlay">
          <button class="btn-play-now">▶ Xem Chi Tiết</button>
        </div>
        <div class="game-card-badge">${g.genre.toUpperCase()}</div>
      </div>
      <div class="game-card-body">
        <h3 class="game-card-title" onclick="openGameModal(${g.id})">${g.title}</h3>
        <div class="game-card-meta">
          <span class="game-rating">⭐ ${g.rating}</span>
          <span class="game-players">👥 ${g.players}</span>
          <span class="game-year">${g.year}</span>
        </div>
        <div class="game-card-tags">
          ${g.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}
        </div>
        <div style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 10px;">
          <span style="font-family: var(--font-d); font-size: 0.95rem; font-weight: 700; color: #fbbf24;">${g.price === 0 ? 'Miễn Phí' : formatVND(g.price)}</span>
          <button onclick="addToCart(${g.id})" style="padding: 6px 14px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.35); border-radius: 100px; font-size: 0.78rem; font-weight: 700; color: #c084fc; transition: all 0.2s ease;">+ Giỏ Hàng</button>
        </div>
      </div>
    </div>
  `).join('');

  const count = document.getElementById('games-count');
  if (count) count.textContent = list.length + ' game';
}

function renderGames() {
  let list = currentGenre === 'all' ? [...GAMES] : GAMES.filter(g => g.genre === currentGenre);

  if (currentSort === 'rating')  list.sort((a, b) => b.rating - a.rating);
  if (currentSort === 'players') list.sort((a, b) => parseFloat(b.players) - parseFloat(a.players));
  if (currentSort === 'newest')  list.sort((a, b) => b.year - a.year);

  renderGameList(list);
}

function openGameModal(id) {
  const g = GAMES.find(x => x.id === id);
  if (!g) return;
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  if (!overlay || !content) return;

  content.innerHTML = `
    <div class="modal-game">
      <div class="modal-game-img">
        <img src="${g.img}" alt="${g.title}" />
        <div class="modal-game-badge">${g.genre.toUpperCase()}</div>
      </div>
      <div class="modal-game-info">
        <h2 class="modal-game-title">${g.title}</h2>
        <div class="modal-game-meta">
          <span>⭐ ${g.rating}/10</span>
          <span>👥 ${g.players} người chơi</span>
          <span>📅 ${g.year}</span>
          <span style="color:#fbbf24;font-weight:700;">💰 ${g.price === 0 ? 'Miễn Phí' : formatVND(g.price)}</span>
        </div>
        <p class="modal-game-desc">${g.desc}</p>
        <div class="modal-game-tags">
          ${g.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}
        </div>
        <div class="modal-game-actions">
          <button class="btn-modal-primary" onclick="showToast('🎮 Đang khởi động ${g.title}... Chúc bạn chơi vui vẻ!');">🎮 Chơi Ngay</button>
          <button class="btn-modal-primary" style="background:var(--grad-gold);" onclick="addToCart(${g.id})">🛒 Thêm Vào Giỏ</button>
          <button class="btn-modal-secondary" onclick="showToast('❤️ Đã thêm ${g.title} vào danh sách ước!')">♡ Yêu Thích</button>
        </div>
      </div>
    </div>
  `;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

(function initGamesSection() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGenre = btn.dataset.genre;
      renderGames();
    });
  });

  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      currentSort = sortSel.value;
      renderGames();
    });
  }

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      renderGames();
    });
  });

  const overlay  = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  function closeModal() {
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  renderGames();
})();

/* ── 13. TOAST NOTIFICATION ──────────────────────────────── */
function showToast(msg, duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:99999;display:flex;flex-direction:column;gap:0.75rem;pointer-events:none;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.textContent = msg;
  toast.style.cssText = `
    background: linear-gradient(135deg, rgba(139,92,246,0.95), rgba(6,182,212,0.95));
    color: #fff;
    padding: 0.9rem 1.4rem;
    border-radius: 14px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 10px 35px rgba(0,0,0,0.5), 0 0 20px rgba(168,85,247,0.3);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.2);
    transform: translateX(120%);
    transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.35s ease;
    opacity: 0;
    max-width: 360px;
    pointer-events: auto;
    cursor: pointer;
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
    toast.style.opacity   = '1';
  });

  const remove = () => {
    toast.style.transform = 'translateX(120%)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 400);
  };
  toast.addEventListener('click', remove);
  setTimeout(remove, duration);
}

/* ── 14. CONTACT FORM ────────────────────────────────────── */
(function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    if (!name || !email) { showToast('⚠️ Vui lòng điền đầy đủ thông tin!'); return; }
    showToast('✅ Cảm ơn ' + name + '! GameVerse sẽ liên hệ bạn qua email ' + email + ' sớm nhất.', 4500);
    form.reset();
  });
})();

/* ── 15. CTA & MISC BUTTONS ──────────────────────────────── */
(function initCTA() {
  document.querySelectorAll('.btn-cta-primary, .btn-cta-secondary').forEach(btn => {
    btn.addEventListener('click', () => {
      const grid = document.getElementById('games-section');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.btn-spotlight-wish').forEach(btn => {
    btn.addEventListener('click', () => showToast('💜 Đã thêm vào Danh Sách Ước!'));
  });

  const btnEsports = document.querySelector('.btn-esports-register');
  if (btnEsports) {
    btnEsports.addEventListener('click', () => {
      showToast('🏆 Chúc mừng bạn đã đăng ký tham gia Grand Championship 2026 thành công!');
    });
  }
})();

/* ── 16. BACK TO TOP ─────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.opacity   = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

console.log('%cGameVerse Interactive Features Loaded ✅', 'color:#8b5cf6;font-size:14px;font-weight:bold;');
