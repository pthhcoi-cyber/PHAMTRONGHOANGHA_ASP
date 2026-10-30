/* =========================================================
   GAMEVERSE.JS  –  Ultimate Interactive Gaming Platform
   ========================================================= */

'use strict';

/* ── 1. LOADING SCREEN ───────────────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loader-bar');
  const loaderTx = document.getElementById('loader-text');
  const messages = ['Đang kết nối máy chủ GameVerse...', 'Tải thư viện 500+ game...', 'Đồng bộ hóa hiệu ứng âm thanh...', 'Sẵn sàng chiến!'];
  let progress = 0, msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 25 + 10;
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
      }, 300);
    }
  }, 90);
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
    const delay = i * 450;
    setTimeout(() => {
      const ti = setInterval(() => {
        el.textContent += txt[j++];
        if (j >= txt.length) clearInterval(ti);
      }, 50);
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
function scrollToGamesSection() {
  const el = document.getElementById('games-section');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

(function initNavigationSystem() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    item.addEventListener('click', e => {
      if (window.innerWidth < 900) {
        e.stopPropagation();
        item.classList.toggle('open');
      }
    });
  });

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

    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
    }
  }

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

  document.querySelectorAll('[data-genre-nav]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const genre = item.dataset.genreNav;
      applyGenreFilter(genre);
    });
  });

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

  const navPlayBtn = document.getElementById('btn-nav-play');
  if (navPlayBtn) {
    navPlayBtn.addEventListener('click', () => {
      launchGamePlayer(1);
    });
  }

  const heroExplore = document.getElementById('btn-hero-explore');
  if (heroExplore) {
    heroExplore.addEventListener('click', () => {
      scrollToSection('#games-section');
    });
  }

  const sections = [
    { id: 'hero' },
    { id: 'genres-section' },
    { id: 'spotlight-section' },
    { id: 'trending-section' },
    { id: 'esports-section' },
    { id: 'news-section' },
    { id: 'games-section' },
    { id: 'reviews-section' },
    { id: 'cta-section' },
    { id: 'contact-section' }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
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

  notifBtn.addEventListener('click', e => {
    e.stopPropagation();
    notifDrop.classList.toggle('active');
  });

  document.addEventListener('click', e => {
    if (!notifDrop.contains(e.target) && !notifBtn.contains(e.target)) {
      notifDrop.classList.remove('active');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') notifDrop.classList.remove('active');
  });

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      notifCards.forEach(c => c.classList.add('read'));
      if (notifBadge) notifBadge.style.display = 'none';
      if (notifPill) notifPill.textContent = '0 Mới';
      showToast('✅ Đã đánh dấu tất cả thông báo là đã đọc!');
    });
  }

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

/* ── 6. SHOPPING CART SYSTEM ─────────────────────────────── */
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
        <p style="font-size:0.85rem;margin-top:6px;color:var(--text-3);">Khám phá 500+ tựa game đỉnh cao và thêm vào giỏ nhé!</p>
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
  if (appliedPromo === 'VIP50' || appliedPromo === 'SALE50') {
    discount = subtotal * 0.5;
    if (discountRow) discountRow.style.display = 'flex';
    if (discountEl) discountEl.textContent = '-' + formatVND(discount);
  } else if (appliedPromo === 'NEWS20') {
    discount = subtotal * 0.2;
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

function addToCart(gameId, customPrice) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;

  const price = customPrice !== undefined ? customPrice : (game.price || 499000);
  const existing = cartItems.find(i => i.id === gameId);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: game.id,
      title: game.title,
      genre: game.genre.toUpperCase(),
      price: price,
      img: game.img,
      qty: 1
    });
  }
  renderCartDrawer();
  openCartDrawer();
  showToast('🛒 Đã thêm "' + game.title + '" vào giỏ hàng!');
}

function buyDiscountedGame(gameId, discountRate) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;
  const discountedPrice = Math.round(game.price * (1 - discountRate));
  addToCart(gameId, discountedPrice);
  showToast('⚡ Flash Sale: Đã áp dụng giảm giá 70% cho ' + game.title + '!');
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

function openFlashSale() {
  appliedPromo = 'SALE50';
  const promoInput = document.getElementById('cart-promo-input');
  if (promoInput) promoInput.value = 'SALE50';
  renderCartDrawer();
  openCartDrawer();
  showToast('⚡ FLASH SALE 50%: Đã tự động kích hoạt mã giảm 50% trong giỏ hàng!');
}

(function initCartEvents() {
  const cartBtn     = document.getElementById('btn-cart');
  const overlay     = document.getElementById('cart-drawer-overlay');
  const closeBtn    = document.getElementById('cart-drawer-close');
  const continueBtn = document.getElementById('btn-cart-continue');
  const checkoutBtn = document.getElementById('btn-cart-checkout');
  const promoBtn    = document.getElementById('btn-apply-promo');
  const promoInput  = document.getElementById('cart-promo-input');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (continueBtn) continueBtn.addEventListener('click', closeCartDrawer);

  if (promoBtn && promoInput) {
    promoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'VIP50' || code === 'SALE50') {
        appliedPromo = code;
        renderCartDrawer();
        showToast('🎉 Áp dụng mã ' + code + ' thành công: Giảm ngay 50%!');
      } else if (code === 'NEWS20') {
        appliedPromo = 'NEWS20';
        renderCartDrawer();
        showToast('🎉 Áp dụng mã NEWS20 thành công: Giảm ngay 20%!');
      } else if (code) {
        showToast('⚠️ Mã không hợp lệ. Hãy thử: VIP50 hoặc NEWS20');
      }
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        showToast('⚠️ Giỏ hàng của bạn đang trống!');
        return;
      }
      showToast('🚀 Thanh toán thành công! Mã kích hoạt bản quyền đã được gửi qua email.', 5000);
      cartItems = [];
      appliedPromo = null;
      renderCartDrawer();
      setTimeout(closeCartDrawer, 1200);
    });
  }

  renderCartDrawer();
})();

/* ── 7. WISHLIST SYSTEM ──────────────────────────────────── */
let wishlistItems = [
  { id: 1, title: 'Dragon Realm Chronicles', genre: 'RPG', price: 599000, img: '/images/game_rpg_cover.jpg' }
];

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-badge');
  const countEl = document.getElementById('wishlist-drawer-count');
  const count = wishlistItems.length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  if (countEl) countEl.textContent = count;
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishlist-items-container');
  if (!container) return;

  if (wishlistItems.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">💜</span>
        <h4>Danh sách yêu thích trống</h4>
        <p style="font-size:0.85rem;margin-top:6px;color:var(--text-3);">Nhấn biểu tượng trái tim ♡ trên các tựa game bạn yêu thích để lưu vào đây nhé!</p>
      </div>
    `;
    updateWishlistBadge();
    return;
  }

  container.innerHTML = wishlistItems.map(item => `
    <div class="wishlist-item" data-id="${item.id}">
      <img src="${item.img}" alt="${item.title}" class="wishlist-item-img" />
      <div class="wishlist-item-info">
        <div>
          <span style="font-size:0.72rem;color:var(--accent-pink);font-weight:700;text-transform:uppercase;">${item.genre}</span>
          <h4 class="wishlist-item-title">${item.title}</h4>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
          <span style="font-family:var(--font-d);font-size:0.95rem;font-weight:700;color:#fbbf24;">${formatVND(item.price)}</span>
          <div style="display:flex;gap:6px;">
            <button onclick="addToCart(${item.id})" style="padding:4px 12px;background:var(--grad-main);border-radius:100px;color:#fff;font-size:0.75rem;font-weight:700;">+ Giỏ</button>
            <button onclick="removeFromWishlist(${item.id})" style="padding:4px 8px;background:rgba(255,255,255,0.06);border-radius:100px;color:var(--text-3);font-size:0.75rem;">✕</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  updateWishlistBadge();
}

function toggleWishlist(gameId, el) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;

  const idx = wishlistItems.findIndex(i => i.id === gameId);
  if (idx !== -1) {
    wishlistItems.splice(idx, 1);
    if (el) {
      el.classList.remove('wishlisted');
      el.textContent = '♡';
    }
    showToast('💔 Đã xóa "' + game.title + '" khỏi danh sách ước');
  } else {
    wishlistItems.push({
      id: game.id,
      title: game.title,
      genre: game.genre.toUpperCase(),
      price: game.price || 499000,
      img: game.img
    });
    if (el) {
      el.classList.add('wishlisted');
      el.textContent = '❤️';
    }
    showToast('💜 Đã thêm "' + game.title + '" vào danh sách ước!');
  }
  renderWishlistDrawer();
}

function removeFromWishlist(gameId) {
  wishlistItems = wishlistItems.filter(i => i.id !== gameId);
  renderWishlistDrawer();
  showToast('🗑️ Đã xóa khỏi danh sách ước');
}

function openWishlistDrawer() {
  const overlay = document.getElementById('wishlist-drawer-overlay');
  const drawer  = document.getElementById('wishlist-drawer');
  if (overlay && drawer) {
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeWishlistDrawer() {
  const overlay = document.getElementById('wishlist-drawer-overlay');
  const drawer  = document.getElementById('wishlist-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function addAllWishlistToCart() {
  if (wishlistItems.length === 0) {
    showToast('⚠️ Danh sách ước đang trống!');
    return;
  }
  wishlistItems.forEach(item => {
    addToCart(item.id, item.price);
  });
  closeWishlistDrawer();
  showToast('🛒 Đã chuyển toàn bộ game yêu thích vào giỏ hàng!');
}

const wishlistBtn = document.getElementById('btn-wishlist');
if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlistDrawer);
renderWishlistDrawer();

/* ── 8. CINEMATIC TRAILER MODAL ──────────────────────────── */
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

    function render() {
      if (!overlay.classList.contains('active')) return;
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, 'rgba(168,85,247,0.12)');
      grad.addColorStop(0.5, 'rgba(6,182,212,0.18)');
      grad.addColorStop(1, 'rgba(236,72,153,0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(render);
    }
    render();
  }
})();

/* ── 9. SEARCH BAR & SUGGESTIONS ─────────────────────────── */
(function initSearch() {
  const input = document.getElementById('search-input');
  const suggestions = document.getElementById('search-suggestions');
  if (!input || !suggestions) return;

  const GAME_NAMES = [
    'Dragon Realm Chronicles', 'Void Strike Ops', 'Kingdom Fall',
    'Shadow Hospital', 'FIFA Ultimate 25', 'Cyber Drift Racing',
    'Elden Forge', 'Tactical Warzone', 'Haunted Manor',
    'Speed Legends 2026', 'Dark Souls: Reborn', 'Mecha Warfare'
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
            <p style="color: var(--text-2); font-size: 0.9rem; margin-bottom: 20px;">Hãy thử tìm kiếm với RPG, Bắn Súng, Đua Xe hoặc xem toàn bộ kho game.</p>
            <button onclick="currentGenre='all';renderGames();" style="padding: 10px 24px; background: var(--grad-main); border-radius: 100px; color: #fff; font-weight: 700; cursor:pointer;">Xem Tất Cả Game</button>
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

/* ── 10. SPOTLIGHT TABS ──────────────────────────────────── */
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

/* ── 11. TRENDING HORIZONTAL SCROLL ──────────────────────── */
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

/* ── 12. ESPORTS REGISTRATION & TEAMS SYSTEM ─────────────── */
const TEAMS_DATA = {
  'GX': { name: 'Gaming X', region: 'TP. Hồ Chí Minh', captain: 'Đức Khoa (DK)', winrate: 84, titles: 'Vô địch Quốc Gia 2025', members: ['DK (Captain/IGL)', 'Minh Anh (Fragger)', 'Tuấn Vũ (Sniper)', 'Bảo Nam (Support)', 'Hoàng Huy (Coach)'], logoBg: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' },
  'VS': { name: 'Void Strikers', region: 'Hà Nội', captain: 'Hoàng Nam (HN)', winrate: 79, titles: 'Á Quân VWC 2025', members: ['HN (Captain)', 'Quốc Cường (Assault)', 'Hải Đăng (Lurker)', 'Văn Lâm (Support)', 'Anh Tuấn (Sub)'], logoBg: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  'DT': { name: 'Dragon Titans', region: 'Đà Nẵng', captain: 'Minh Tuấn (MT)', winrate: 76, titles: 'Vô địch Miền Trung 2025', members: ['MT (Captain)', 'Gia Huy (Duelist)', 'Khánh Toàn (Flex)', 'Trọng Phúc (Support)', 'Bình An (Coach)'], logoBg: 'linear-gradient(135deg,#22c55e,#06b6d4)' },
  'NR': { name: 'Night Raiders', region: 'Cần Thơ', captain: 'Hùng Trần (HT)', winrate: 75, titles: 'Hạng 3 Đông Nam Á', members: ['HT (Captain)', 'Việt Dũng (Entry)', 'Thành Long (Recon)', 'Ngọc Sơn (Anchor)', 'Hồng Quân (Analyst)'], logoBg: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
  'SK': { name: 'Shadow Knights', region: 'Hải Phòng', captain: 'Bảo Long (BL)', winrate: 82, titles: 'Ngựa Ô Mùa Giải 2026', members: ['BL (Captain)', 'Thế Hưng (Sniper)', 'Tiến Dũng (Fragger)', 'Gia Bảo (Support)', 'Duy Khánh (Strategist)'], logoBg: 'linear-gradient(135deg,#ef4444,#f59e0b)' }
};

function openEsportsModal() {
  const overlay = document.getElementById('esports-modal-overlay');
  const formWrap = document.getElementById('esports-form-container');
  const ticketWrap = document.getElementById('esports-ticket-container');
  if (overlay) {
    if (formWrap) formWrap.style.display = 'block';
    if (ticketWrap) ticketWrap.style.display = 'none';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeEsportsModal() {
  const overlay = document.getElementById('esports-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleEsportsSubmit(e) {
  e.preventDefault();
  const team = document.getElementById('esp-team-name').value;
  const captain = document.getElementById('esp-captain').value;
  const game = document.getElementById('esp-game').value;
  const region = document.getElementById('esp-region').value;

  const formWrap = document.getElementById('esports-form-container');
  const ticketWrap = document.getElementById('esports-ticket-container');

  const randomTicketId = 'GV26-' + Math.floor(100000 + Math.random() * 900000);

  if (formWrap && ticketWrap) {
    formWrap.style.display = 'none';
    ticketWrap.style.display = 'block';
    ticketWrap.innerHTML = `
      <div class="esports-ticket">
        <div style="font-size:3rem;margin-bottom:8px;">🎉</div>
        <span class="section-tag" style="background:rgba(34,197,94,0.2);color:#22c55e;border-color:rgba(34,197,94,0.4);">ĐĂNG KÝ THÀNH CÔNG</span>
        <h3 style="font-family:var(--font-h);font-size:1.8rem;margin:12px 0 6px;">VÉ THI ĐẤU CHÍNH THỨC</h3>
        <p style="color:var(--text-2);font-size:0.9rem;">Chúc mừng đội tuyển <strong>${team}</strong> đã chính thức có mặt tại Vòng Loại!</p>
        
        <div class="ticket-barcode">${randomTicketId}</div>

        <div style="background:rgba(0,0,0,0.4);border-radius:var(--r-md);padding:16px;text-align:left;font-size:0.88rem;color:var(--text-2);line-height:1.7;margin-bottom:20px;">
          <div>👤 <strong>Đội trưởng:</strong> ${captain}</div>
          <div>🎮 <strong>Bộ môn:</strong> ${game}</div>
          <div>📍 <strong>Cụm thi đấu:</strong> ${region}</div>
          <div>📅 <strong>Lịch check-in:</strong> 08:00 AM, Ngày 28/11/2026</div>
        </div>

        <button class="btn-primary" onclick="showToast('📥 Đã tải vé điện tử về máy!');closeEsportsModal();" style="width:100%;margin-bottom:10px;">💾 TẢI VÉ THI ĐẤU PDF / QR CODE</button>
        <button class="btn-secondary" onclick="closeEsportsModal()" style="width:100%;">Đóng Cửa Sổ</button>
      </div>
    `;
  }

  showToast('🏆 Chúc mừng ' + team + ' đã đăng ký thành công Grand Championship 2026!', 4500);
}

function openTeamModal(teamKey) {
  const team = TEAMS_DATA[teamKey];
  if (!team) return;
  const overlay = document.getElementById('team-modal-overlay');
  const content = document.getElementById('team-modal-content');
  if (!overlay || !content) return;

  content.innerHTML = `
    <button class="modal-close-btn" onclick="closeTeamModal()">&times;</button>
    <div class="team-header-card">
      <div class="team-avatar-lg" style="background:${team.logoBg}">${teamKey}</div>
      <div>
        <span class="section-tag" style="margin-bottom:4px;">${team.titles}</span>
        <h3 style="font-family:var(--font-h);font-size:1.6rem;font-weight:700;">${team.name}</h3>
        <p style="color:var(--text-3);font-size:0.82rem;">Khu vực: ${team.region}</p>
      </div>
    </div>

    <div style="background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.88rem;">
        <span>Tỷ lệ thắng mùa giải 2025-2026:</span>
        <strong style="color:#22c55e;font-family:var(--font-d);">${team.winrate}%</strong>
      </div>
      <div style="height:6px;background:rgba(255,255,255,0.08);border-radius:100px;overflow:hidden;">
        <div style="width:${team.winrate}%;height:100%;background:var(--grad-main);border-radius:100px;"></div>
      </div>
    </div>

    <h4 style="font-family:var(--font-h);font-size:1.1rem;margin-bottom:10px;">Danh Sách Đội Hình (Roster):</h4>
    <div class="team-roster-list">
      ${team.members.map(m => `
        <div class="team-member-row">
          <span>⚡ ${m}</span>
          <span style="color:var(--accent-cyan);font-weight:700;font-size:0.75rem;">CHÍNH THỨC</span>
        </div>
      `).join('')}
    </div>

    <button class="btn-primary" style="width:100%;margin-top:16px;" onclick="cheerTeam('${team.name}')">👏 CỔ VŨ ĐỘI ${team.name.toUpperCase()} (1.2K Đã Cổ Vũ)</button>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTeamModal() {
  const overlay = document.getElementById('team-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function cheerTeam(teamName) {
  showToast('📣 Bạn vừa cổ vũ cho đội ' + teamName + '! Hãy cùng đón xem trận đấu sắp tới nhé.');
}

(function initEsportsCountdown() {
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

/* ── 13. FULL NEWS ARTICLE READER SYSTEM ─────────────────── */
const NEWS_DATA = [
  {
    id: 1,
    title: 'Dragon Realm Chronicles Phát Hành DLC Khổng Lồ – Thêm 50 Giờ Chơi',
    date: '16/10/2026',
    author: 'Tuấn Vũ - GameVerse Editor',
    category: 'RPG',
    img: '/images/game_rpg_cover.jpg',
    likes: 1420,
    comments: [
      { user: 'Bảo Khánh', text: 'DLC này đồ họa đỉnh thực sự, hóng ngày ra mắt quá!', time: '10 phút trước' },
      { user: 'Hoàng Long', text: 'Hệ thống công đoàn rồng nghe bánh cuốn thế, lập team thôi anh em!', time: '1 giờ trước' }
    ],
    content: `
      <p>Studio Crimson Forge vừa chính thức phát hành bản mở rộng lớn nhất trong lịch sử tựa game Dragon Realm Chronicles mang tên <strong>"The Eternal Rift"</strong>. Bản cập nhật hứa hẹn nâng tầm trải nghiệm của game thủ lên một đẳng cấp hoàn toàn mới.</p>
      <h4>Những Điểm Nổi Bật Trong Bản Mở Rộng:</h4>
      <ul>
        <li>✨ <strong>Vùng Đất Mới Valyria:</strong> Bản đồ thế giới mở rộng thêm 45% với các thung lũng dung nham và pháo đài băng giá cổ đại.</li>
        <li>🐲 <strong>5 Boss Rồng Huyền Thoại Mới:</strong> Mỗi con rồng sở hữu cơ chế chiến đấu đa giai đoạn và trí tuệ nhân tạo thế hệ mới.</li>
        <li>⚔️ <strong>Hệ Thống Bang Hội Chiến (Guild Wars):</strong> Cho phép hàng trăm người chơi cùng tham gia công thành chiến giành lãnh địa.</li>
        <li>🛠️ <strong>Đồ Họa Nâng Cấp Unreal Engine 5.4:</strong> Tối ưu hóa hiệu năng và tích hợp đầy đủ công nghệ Ray Tracing thời gian thực.</li>
      </ul>
      <p>Bản mở rộng đã sẵn sàng để tải xuống ngay hôm nay. Người chơi sở hữu gói GameVerse VIP sẽ được nhận DLC này hoàn toàn miễn phí!</p>
    `
  },
  {
    id: 2,
    title: 'Void Strike World Cup 2026 – Đội Tuyển Việt Nam Lọt Vào Tứ Kết',
    date: '15/10/2026',
    author: 'Đức Khoa - Esports Analyst',
    category: 'Esports',
    img: '/images/game_shooter_cover.jpg',
    likes: 3105,
    comments: [
      { user: 'Minh Tuấn', text: 'Việt Nam vô địch! Trận gặp Hàn Quốc bắn cháy quá!', time: '20 phút trước' },
      { user: 'Hùng Trần', text: 'Cú clutch 1v3 của đội trưởng DK quá đẳng cấp!', time: '3 giờ trước' }
    ],
    content: `
      <p>Đêm qua, tại sân vận động Mercedes-Benz Arena, đội tuyển Void Strike Việt Nam (VN Legends) đã tạo nên cơn địa chấn khi đánh bại đương kim vô địch Hàn Quốc với tỉ số nghẹt thở 2-1 để chính thức bước chân vào Tứ Kết giải vô địch thế giới <strong>VWC 2026</strong>.</p>
      <h4>Khoảnh Khắc Quyết Định:</h4>
      <p>Trong map thi đấu quyết định tại Cyber Docks, tuyển thủ đội trưởng Đức Khoa đã có pha xử lý clutch 1 cân 3 xuất thần ở round 24, gỡ bom thành công chỉ còn 0.4 giây. Toàn bộ khán phòng hơn 15.000 khán giả đã đứng dậy hò reo cổ vũ.</p>
      <p>Trận Tứ Kết của Việt Nam sẽ diễn ra vào lúc 20:00 ngày Chủ Nhật tới, được phát sóng trực tiếp độc quyền trên GameVerse Esports TV.</p>
    `
  },
  {
    id: 3,
    title: 'Kingdom Fall: Empire Wars – Bản Cập Nhật 3.0 Công Thành Chiến Ra Mắt',
    date: '14/10/2026',
    author: 'Lan Minh - Strategy Specialist',
    category: 'Chiến Thuật',
    img: '/images/game_strategy_cover.jpg',
    likes: 890,
    comments: [
      { user: 'Văn Hậu', text: 'Chế độ công thành chiến 100vs100 mượt bất ngờ, game quá đỉnh!', time: '40 phút trước' }
    ],
    content: `
      <p>Nhà phát hành Iron Crown vừa chính thức tung ra bản cập nhật 3.0 cho siêu phẩm chiến thuật trung cổ <strong>Kingdom Fall: Empire Wars</strong>. Đây được xem là bước ngoặt đưa dòng game RTS lên tầm cao mới.</p>
      <h4>Tính Năng Mới Hấp Dẫn:</h4>
      <p>Tính năng được mong chờ nhất chính là chế độ <em>Siege Warfare 100 vs 100</em>, nơi các đế chế có thể phối hợp điều binh, chế tạo tháp công thành, máy bắn đá thời gian thực và phá hủy thành trì theo vật lý thực tế.</p>
      <p>Ngoài ra, game cũng bổ sung nhánh công nghệ Thủy Chiến và 12 danh tướng lịch sử mới.</p>
    `
  },
  {
    id: 4,
    title: 'Shadow Hospital 2 Chính Thức Được Công Bố – Trailer Kinh Dị Gây Sốt',
    date: '13/10/2026',
    author: 'Hồng Quân - Horror Reviewer',
    category: 'Kinh Dị',
    img: '/images/game_horror_cover.jpg',
    likes: 2450,
    comments: [
      { user: 'Thanh Hằng', text: 'Xem trailer nửa đêm nổi hết da gà, âm thanh quá ám ảnh!', time: '15 phút trước' }
    ],
    content: `
      <p>Sau thành công vang dội của phần đầu tiên với hơn 2 triệu lượt tải, studio Dark Lantern đã chính thức tung ra trailer đầu tiên của <strong>Shadow Hospital 2: The Asylum</strong>. Đoạn trailer dài 3 phút đã nhanh chóng leo lên top thịnh hành toàn cầu.</p>
      <h4>Trải Nghiệm Rùng Rợn Thế Hệ Mới:</h4>
      <p>Phần 2 đưa người chơi vào một trại tâm thần bị bỏ hoang trên một hòn đảo biệt lập. Hệ thống âm thanh vòm 3D Binaural Audio sẽ khiến bạn nghe thấy tiếng bước chân rón rén ngay sau gáy. Cơ chế sinh tồn mới đòi hỏi người chơi phải kiểm soát nhịp tim và hơi thở của nhân vật khi trốn tránh quái vật.</p>
      <p>Game dự kiến ra mắt vào mùa Halloween 2026 và sẽ hỗ trợ kính thực tế ảo VR.</p>
    `
  }
];

function openNewsModal(id) {
  const item = NEWS_DATA.find(n => n.id === id) || NEWS_DATA[0];
  const overlay = document.getElementById('news-modal-overlay');
  const content = document.getElementById('news-modal-content');
  if (!overlay || !content) return;

  content.innerHTML = `
    <button class="modal-close-btn" onclick="closeNewsModal()" style="top:16px;right:16px;z-index:10;background:rgba(0,0,0,0.6);">&times;</button>
    <img src="${item.img}" alt="${item.title}" class="news-modal-banner" />
    <div class="news-modal-body">
      <div class="news-meta-row">
        <span class="news-tag" style="position:static;display:inline-block;">${item.category}</span>
        <span>📅 ${item.date}</span>
        <span>✍️ ${item.author}</span>
        <span>⏱️ 5 phút đọc</span>
      </div>
      <h2 style="font-family:var(--font-h);font-size:1.85rem;line-height:1.35;margin-bottom:16px;">${item.title}</h2>
      
      <div class="news-content-text">
        ${item.content}
      </div>

      <div class="news-actions-bar">
        <button class="btn-news-like" onclick="likeArticle(${item.id}, this)">
          ❤️ <span id="like-count-${item.id}">${item.likes}</span> Thích
        </button>
        <div style="display:flex;gap:10px;">
          <button class="btn-secondary" onclick="shareNewsArticle('${item.title}')" style="padding:8px 18px;font-size:0.85rem;">🔗 Chia Sẻ Bài Viết</button>
          <button class="btn-primary" onclick="closeNewsModal();scrollToGamesSection();" style="padding:8px 18px;font-size:0.85rem;">🎮 Chơi Game Này</button>
        </div>
      </div>

      <div class="news-comments-section">
        <h4 style="font-family:var(--font-h);font-size:1.2rem;margin-bottom:14px;">Bình Luận Cộng Đồng (<span id="comment-count-${item.id}">${item.comments.length}</span>):</h4>
        <div id="comment-list-${item.id}">
          ${item.comments.map(c => `
            <div class="news-comment-item">
              <div class="comment-avatar">${c.user.charAt(0)}</div>
              <div class="comment-bubble">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                  <strong style="font-size:0.88rem;color:var(--text-1);">${c.user}</strong>
                  <span style="font-size:0.75rem;color:var(--text-3);">${c.time}</span>
                </div>
                <p style="font-size:0.85rem;color:var(--text-2);margin:0;">${c.text}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <form onsubmit="handleNewsComment(event, ${item.id})" style="display:flex;gap:10px;margin-top:16px;">
          <input type="text" id="comment-input-${item.id}" placeholder="Viết bình luận của bạn..." required style="flex:1;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:100px;padding:10px 18px;color:#fff;font-size:0.88rem;" />
          <button type="submit" class="btn-primary" style="padding:10px 22px;border-radius:100px;font-size:0.85rem;font-weight:700;">Gửi</button>
        </form>
      </div>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
  const overlay = document.getElementById('news-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function likeArticle(id, btn) {
  const item = NEWS_DATA.find(n => n.id === id);
  if (!item) return;
  item.likes += 1;
  const countEl = document.getElementById('like-count-' + id);
  if (countEl) countEl.textContent = item.likes;
  if (btn) btn.style.background = 'rgba(236,72,153,0.35)';
  showToast('❤️ Cảm ơn bạn đã thích bài viết này!');
}

function handleNewsComment(e, id) {
  e.preventDefault();
  const input = document.getElementById('comment-input-' + id);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const item = NEWS_DATA.find(n => n.id === id);
  if (item) {
    item.comments.unshift({ user: 'Bạn (Gamer)', text: text, time: 'Vừa xong' });
    const listEl = document.getElementById('comment-list-' + id);
    const countEl = document.getElementById('comment-count-' + id);
    if (countEl) countEl.textContent = item.comments.length;

    if (listEl) {
      const newCommentDiv = document.createElement('div');
      newCommentDiv.className = 'news-comment-item';
      newCommentDiv.innerHTML = `
        <div class="comment-avatar" style="background:var(--grad-gold);color:#000;">B</div>
        <div class="comment-bubble" style="border-color:rgba(168,85,247,0.4);">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <strong style="font-size:0.88rem;color:var(--accent-purple);">Bạn (Gamer)</strong>
            <span style="font-size:0.75rem;color:var(--text-3);">Vừa xong</span>
          </div>
          <p style="font-size:0.85rem;color:var(--text-1);margin:0;">${text}</p>
        </div>
      `;
      listEl.prepend(newCommentDiv);
    }
  }
  input.value = '';
  showToast('💬 Bình luận của bạn đã được đăng tải thành công!');
}

function shareNewsArticle(title) {
  navigator.clipboard.writeText(window.location.href);
  showToast('🔗 Đã sao chép liên kết bài viết: ' + title);
}

/* ── 14. REVIEWS SUBMISSION SYSTEM ───────────────────────── */
let currentStarRating = 5;

function openReviewModal() {
  const overlay = document.getElementById('review-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    initStarPicker();
  }
}

function closeReviewModal() {
  const overlay = document.getElementById('review-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initStarPicker() {
  const stars = document.querySelectorAll('.star-pick');
  const starText = document.getElementById('star-val-text');
  const labels = {
    1: '1.0 / 5.0 - Rất tệ',
    2: '2.0 / 5.0 - Tạm được',
    3: '3.0 / 5.0 - Khá ổn',
    4: '4.0 / 5.0 - Rất hay',
    5: '5.0 / 5.0 - Tuyệt phẩm xuất sắc'
  };

  stars.forEach(s => {
    s.addEventListener('click', () => {
      const val = parseInt(s.dataset.val);
      currentStarRating = val;
      stars.forEach(other => {
        other.classList.toggle('active', parseInt(other.dataset.val) <= val);
      });
      if (starText) starText.textContent = labels[val] || (val + ' sao');
    });
  });
}

function handleReviewSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('rev-name').value.trim();
  const game = document.getElementById('rev-game').value;
  const text = document.getElementById('rev-text').value.trim();

  if (!name || !text) {
    showToast('⚠️ Vui lòng điền đầy đủ họ tên và nhận xét!');
    return;
  }

  const track = document.querySelector('.reviews-track');
  if (track) {
    const starString = '★'.repeat(currentStarRating) + '☆'.repeat(5 - currentStarRating);
    const newCard = document.createElement('div');
    newCard.className = 'rev-card';
    newCard.style.borderColor = 'rgba(168,85,247,0.6)';
    newCard.style.boxShadow = '0 0 25px rgba(168,85,247,0.3)';
    newCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div class="rev-stars">${starString}</div>
        <span style="font-size:0.7rem;background:rgba(34,197,94,0.15);color:#22c55e;padding:2px 8px;border-radius:100px;font-weight:700;">VỪA ĐĂNG</span>
      </div>
      <p>"[${game}] ${text}"</p>
      <div class="rev-author">
        <div class="rev-av" style="background:var(--grad-main);">${name.charAt(0).toUpperCase()}</div>
        <div>
          <strong>${name}</strong>
          <span>Game Thủ GameVerse</span>
        </div>
      </div>
    `;
    track.prepend(newCard);
  }

  closeReviewModal();
  showToast('🌟 Cảm ơn ' + name + ' đã gửi đánh giá! Nhận xét của bạn đã xuất hiện trên trang chủ.', 5000);
}

/* ── 15. VIP MEMBERSHIP SYSTEM ───────────────────────────── */
function openVipModal() {
  const overlay = document.getElementById('vip-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVipModal() {
  const overlay = document.getElementById('vip-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function activateVip() {
  closeVipModal();
  const vipTag = document.getElementById('user-vip-tag');
  if (vipTag) vipTag.style.display = 'inline-flex';
  showToast('👑 Chúc mừng! Bạn đã kích hoạt thành công 30 NGÀY VIP PRO MIỄN PHÍ!', 6000);
}

/* ── 16. CLOUD GAMING PLAYER SIMULATION ──────────────────── */
let activeGamePlayerId = null;
let playerProgressInterval = null;
let isLauncherAudioOn = true;

function launchGamePlayer(gameId) {
  const g = GAMES.find(x => x.id === gameId) || GAMES[0];
  activeGamePlayerId = g.id;

  const overlay = document.getElementById('launcher-modal-overlay');
  const titleEl = document.getElementById('launcher-game-title');
  const genreEl = document.getElementById('launcher-genre-badge');
  const barEl   = document.getElementById('launcher-bar');
  const pctEl   = document.getElementById('launcher-percent');
  const tipEl   = document.getElementById('launcher-tip');
  const btnWrap = document.getElementById('launcher-start-btn-wrap');

  if (!overlay) return;

  if (titleEl) titleEl.textContent = g.title;
  if (genreEl) genreEl.textContent = g.genre.toUpperCase() + ' • CLOUD GAMING';
  if (btnWrap) btnWrap.style.display = 'none';

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const tips = [
    'Đang tải kết cấu 4K Ultra HD và đổ bóng Ray Tracing...',
    'Đang đồng bộ hóa dữ liệu lưu đám mây Cloud Save...',
    'Mẹo: Nhấn nút né đòn để giảm 50% sát thương của quái vật!',
    'Đang kết nối đường truyền siêu tốc độ thấp 12ms...',
    'Khởi động trình giả lập GameVerse Cloud Engine v3.0...'
  ];

  let p = 0;
  if (barEl) barEl.style.width = '0%';
  if (pctEl) pctEl.textContent = '0%';

  clearInterval(playerProgressInterval);
  playerProgressInterval = setInterval(() => {
    p += Math.floor(Math.random() * 12 + 6);
    if (p > 100) p = 100;
    if (barEl) barEl.style.width = p + '%';
    if (pctEl) pctEl.textContent = p + '%';

    const tipIdx = Math.floor((p / 100) * (tips.length - 1));
    if (tipEl) tipEl.textContent = tips[tipIdx];

    if (p >= 100) {
      clearInterval(playerProgressInterval);
      if (tipEl) tipEl.textContent = '🚀 Máy chủ đã sẵn sàng! Chúc bạn có những giây phút chiến game đỉnh cao.';
      if (btnWrap) btnWrap.style.display = 'block';
    }
  }, 120);

  startLauncherCanvas();
}

function startPlayGame() {
  showToast('🎮 Đang truyền phát trực tiếp game qua Cloud... Chúc bạn chơi vui vẻ!', 4000);
}

function toggleLauncherAudio() {
  isLauncherAudioOn = !isLauncherAudioOn;
  showToast(isLauncherAudioOn ? '🔊 Âm thanh đã bật' : '🔇 Đã tắt âm thanh');
}

function toggleLauncherFullscreen() {
  const elem = document.getElementById('launcher-modal-overlay');
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) elem.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

function closeGamePlayer() {
  const overlay = document.getElementById('launcher-modal-overlay');
  clearInterval(playerProgressInterval);
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function startLauncherCanvas() {
  const canvas = document.getElementById('launcher-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;
  let t = 0;

  function anim() {
    const overlay = document.getElementById('launcher-modal-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    t += 0.03;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < W; x += 10) {
      const y = H / 2 + Math.sin(x * 0.02 + t) * 35 * Math.cos(t * 0.5);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    requestAnimationFrame(anim);
  }
  anim();
}

/* ── 17. FAQ ACCORDION SYSTEM ────────────────────────────── */
const FAQ_DATA = [
  { q: 'Làm thế nào để tải và trải nghiệm game trên GameVerse?', a: 'Bạn chỉ cần chọn tựa game bất kỳ trong Kho Game hoặc Thư Viện, nhấn nút "🎮 Chơi Ngay" để chơi tức thì qua công nghệ Cloud Gaming không cần cài đặt, hoặc nhấn "Tải Bộ Cài Đặt PC" để tải file cài đặt dung lượng cao về máy tính.' },
  { q: 'Cấu hình máy tính tối thiểu để trải nghiệm game mượt mà là gì?', a: 'Với tính năng Cloud Gaming của GameVerse, bạn chỉ cần một máy tính hoặc laptop văn phòng có kết nối Internet ổn định từ 15 Mbps trở lên. Đối với việc cài đặt trực tiếp bản PC offline: Cấu hình tối thiểu đề xuất là CPU Intel Core i5 / AMD Ryzen 5, RAM 8GB và Card đồ họa GTX 1060 trở lên.' },
  { q: 'Phương thức thanh toán và mua game bản quyền như thế nào?', a: 'GameVerse hỗ trợ đa dạng mọi phương thức thanh toán phổ biến tại Việt Nam bao gồm: Chuyển khoản ngân hàng qua mã VietQR, Ví điện tử MoMo, ZaloPay, Thẻ ATM nội địa, Thẻ Visa/Mastercard và nạp thẻ game trực tiếp.' },
  { q: 'Chính sách hoàn tiền (Refund) của GameVerse quy định ra sao?', a: 'GameVerse cam kết chính sách hoàn tiền 100% trong vòng 14 ngày kể từ ngày mua, với điều kiện thời gian bạn đã chơi trò chơi đó dưới 2 giờ đồng hồ. Tiền sẽ được hoàn trả về tài khoản gốc trong vòng 24 - 48 giờ làm việc.' },
  { q: 'Làm thế nào để đăng ký tham gia các giải đấu Esports có giải thưởng?', a: 'Bạn chỉ cần truy cập vào mục "Esports" trên thanh menu, kéo xuống phần giải đấu Grand Championship và nhấn nút "🏆 Đăng Ký Tham Gia". Điền đầy đủ thông tin đội tuyển, đội trưởng để nhận vé thi đấu và lịch đấu chính thức.' }
];

function openFaqModal() {
  const overlay = document.getElementById('faq-modal-overlay');
  const container = document.getElementById('faq-accordion-list');
  if (!overlay || !container) return;

  container.innerHTML = FAQ_DATA.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'active' : ''}" onclick="toggleFaq(${idx})">
      <div class="faq-question">
        <span>${item.q}</span>
        <span class="faq-chevron">▾</span>
      </div>
      <div class="faq-answer">${item.a}</div>
    </div>
  `).join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function toggleFaq(idx) {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((it, i) => {
    if (i === idx) it.classList.toggle('active');
    else it.classList.remove('active');
  });
}

function closeFaqModal() {
  const overlay = document.getElementById('faq-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ── 18. ABOUT, CAREERS & PARTNERS MODAL ─────────────────── */
function openAboutModal(tab = 'about') {
  const overlay = document.getElementById('about-modal-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchAboutTab(tab);
  }
}

function closeAboutModal() {
  const overlay = document.getElementById('about-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchAboutTab(tab) {
  document.querySelectorAll('.about-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });

  const content = document.getElementById('about-tab-content');
  if (!content) return;

  if (tab === 'about') {
    content.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <span class="section-tag">VỀ CHÚNG TÔI</span>
        <h3 style="font-family:var(--font-h);font-size:1.8rem;margin:8px 0;">Sứ Mệnh Kết Nối Game Thủ Việt</h3>
      </div>
      <p style="color:var(--text-2);line-height:1.8;font-size:0.95rem;margin-bottom:16px;">
        Được thành lập vào năm 2024, <strong>GameVerse</strong> tự hào là nền tảng phân phối, trải nghiệm game bản quyền và tổ chức giải đấu thể thao điện tử tiên phong số 1 tại Việt Nam.
      </p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0;text-align:center;">
        <div style="background:rgba(255,255,255,0.04);padding:18px;border-radius:var(--r-md);border:1px solid var(--border);">
          <div style="font-family:var(--font-d);font-size:1.8rem;color:var(--accent-purple);font-weight:700;">500+</div>
          <div style="font-size:0.8rem;color:var(--text-3);margin-top:4px;">Tựa Game Bản Quyền</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:18px;border-radius:var(--r-md);border:1px solid var(--border);">
          <div style="font-family:var(--font-d);font-size:1.8rem;color:var(--accent-cyan);font-weight:700;">2.1M+</div>
          <div style="font-size:0.8rem;color:var(--text-3);margin-top:4px;">Thành Viên Hoạt Động</div>
        </div>
        <div style="background:rgba(255,255,255,0.04);padding:18px;border-radius:var(--r-md);border:1px solid var(--border);">
          <div style="font-family:var(--font-d);font-size:1.8rem;color:#fbbf24;font-weight:700;">100%</div>
          <div style="font-size:0.8rem;color:var(--text-3);margin-top:4px;">Hài Lòng & Bảo Mật</div>
        </div>
      </div>
    `;
  } else if (tab === 'careers') {
    content.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <span class="section-tag" style="background:rgba(34,197,94,0.15);color:#22c55e;">GIA NHẬP ĐỘI NGŨ</span>
        <h3 style="font-family:var(--font-h);font-size:1.8rem;margin:8px 0;">Cơ Hội Nghề Nghiệp Tại GameVerse</h3>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;margin:20px 0;">
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h4 style="font-family:var(--font-h);font-size:1.1rem;margin-bottom:4px;">Senior Frontend Game Developer (React/WebGL)</h4>
            <span style="font-size:0.8rem;color:var(--text-3);">Địa điểm: TP.HCM / Hybrid • Lương: $1,800 - $3,000</span>
          </div>
          <button class="btn-primary" style="padding:8px 18px;font-size:0.82rem;" onclick="showToast('📩 Vui lòng gửi CV đến hr@gameverse.vn')">Ứng Tuyển</button>
        </div>
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h4 style="font-family:var(--font-h);font-size:1.1rem;margin-bottom:4px;">Bình Luận Viên Esports (Esports Caster)</h4>
            <span style="font-size:0.8rem;color:var(--text-3);">Bộ môn: Void Strike & FIFA • Lương: Thỏa thuận theo giải</span>
          </div>
          <button class="btn-primary" style="padding:8px 18px;font-size:0.82rem;" onclick="showToast('📩 Vui lòng gửi CV đến hr@gameverse.vn')">Ứng Tuyển</button>
        </div>
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);padding:16px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h4 style="font-family:var(--font-h);font-size:1.1rem;margin-bottom:4px;">Game Content Reviewer & Community Lead</h4>
            <span style="font-size:0.8rem;color:var(--text-3);">Địa điểm: Toàn quốc (Remote) • Thu nhập hấp dẫn</span>
          </div>
          <button class="btn-primary" style="padding:8px 18px;font-size:0.82rem;" onclick="showToast('📩 Vui lòng gửi CV đến hr@gameverse.vn')">Ứng Tuyển</button>
        </div>
      </div>
    `;
  } else if (tab === 'partners') {
    content.innerHTML = `
      <div style="text-align:center;margin-bottom:20px;">
        <span class="section-tag">HỢP TÁC KINH DOANH</span>
        <h3 style="font-family:var(--font-h);font-size:1.8rem;margin:8px 0;">Đối Tác & Nhà Phát Triển Game</h3>
      </div>
      <p style="color:var(--text-2);line-height:1.8;font-size:0.95rem;text-align:center;margin-bottom:20px;">
        Bạn là Studio phát triển game độc lập (Indie Game) hay Nhà phát hành toàn cầu muốn đưa game tiếp cận hàng triệu game thủ Việt Nam?
      </p>
      <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:var(--r-lg);padding:24px;text-align:center;">
        <h4 style="font-family:var(--font-h);font-size:1.25rem;margin-bottom:8px;">Liên Hệ Bộ Phận Đối Tác Chiến Lược</h4>
        <p style="font-size:0.9rem;color:var(--text-2);margin-bottom:16px;">Email: <strong>partners@gameverse.vn</strong> • Hotline: 1800-GAMEVERSE</p>
        <button class="btn-primary" onclick="showToast('📋 Đã mở form kết nối đối tác');closeAboutModal();">GỬI ĐỀ XUẤT HỢP TÁC</button>
      </div>
    `;
  }
}

/* ── 19. POLICY & TERMS MODAL ────────────────────────────── */
function openPolicyModal(type = 'privacy') {
  const overlay = document.getElementById('policy-modal-overlay');
  const titleEl = document.getElementById('policy-modal-title');
  const bodyEl  = document.getElementById('policy-modal-body');

  if (!overlay) return;

  const policies = {
    'privacy': {
      title: 'Chính Sách Bảo Mật Thông Tin (Privacy Policy)',
      content: '<p>GameVerse cam kết bảo mật tuyệt đối 100% dữ liệu cá nhân của người dùng bằng chuẩn mã hóa đầu cuối AES-256 bit. Chúng tôi không bao giờ chia sẻ dữ liệu thẻ ngân hàng, mật khẩu hay lịch sử chơi game cho bất kỳ bên thứ ba nào.</p><p>Dữ liệu đăng nhập chỉ dùng để phục vụ quá trình lưu trữ tiến độ game trên Cloud Save và bảng xếp hạng giải đấu.</p>'
    },
    'terms': {
      title: 'Điều Khoản Sử Dụng Dịch Vụ (Terms of Service)',
      content: '<p>Bằng việc đăng ký tài khoản và trải nghiệm các tựa game trên nền tảng GameVerse, người chơi cam kết không sử dụng phần mềm gian lận, hack/cheat hoặc các hành vi xúc phạm người chơi khác trong phòng chat và các trận đấu Esports chính thức.</p><p>Mọi hành vi vi phạm sẽ bị khóa tài khoản vĩnh viễn không hoàn lại tiền.</p>'
    },
    'cookies': {
      title: 'Chính Sách Sử Dụng Cookies (Cookie Policy)',
      content: '<p>GameVerse sử dụng cookies kỹ thuật nhằm tối ưu hóa tốc độ tải trang, ghi nhớ tùy chọn tay cầm chơi game và giữ phiên đăng nhập an toàn của bạn. Bạn hoàn toàn có thể tùy chỉnh cài đặt cookies trong trình duyệt bất kỳ lúc nào.</p>'
    }
  };

  const pol = policies[type] || policies['privacy'];
  if (titleEl) titleEl.textContent = pol.title;
  if (bodyEl) bodyEl.innerHTML = pol.content;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePolicyModal() {
  const overlay = document.getElementById('policy-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ── 20. SOCIAL & UTILITY MODALS ─────────────────────────── */
function openSocialModal(platform) {
  showToast('🌐 Đang chuyển hướng bạn đến kênh ' + platform + ' chính thức của GameVerse!');
}

function openDiscordModal() {
  showToast('💬 Đã sao chép link mời Discord: discord.gg/gameverse (Hơn 120.000 thành viên đang online)!');
}

function openMapModal() {
  showToast('📍 Tòa nhà GameVerse Tower: 123 Đại lộ Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.');
}

function openBugReportModal() {
  showToast('🐞 Vui lòng mô tả lỗi bạn gặp phải trong form liên hệ bên dưới để đội ngũ kỹ thuật xử lý ngay nhé!');
  const el = document.getElementById('contact-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text);
  showToast('📋 Đã sao chép ' + label + ': ' + text);
}

function callHotline() {
  showToast('📞 Đang kết nối tổng đài miễn cước 1800-GAMEVERSE...');
}

function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletter-email');
  if (!input) return;
  const email = input.value.trim();
  if (email) {
    showToast('🎉 Cảm ơn bạn! Mã giảm giá 20% (NEWS20) đã được gửi đến email ' + email, 5000);
    input.value = '';
  }
}

/* ── 21. EXPANDED GAMES DATA & GRID ──────────────────────── */
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
          <div style="display:flex;gap:6px;">
            <button onclick="toggleWishlist(${g.id})" style="padding: 6px 10px; background: rgba(236,72,153,0.15); border: 1px solid rgba(236,72,153,0.35); border-radius: 100px; font-size: 0.85rem; color: #ec4899; cursor:pointer;" title="Thêm vào danh sách ước">♡</button>
            <button onclick="addToCart(${g.id})" style="padding: 6px 14px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.35); border-radius: 100px; font-size: 0.78rem; font-weight: 700; color: #c084fc; cursor:pointer; transition: all 0.2s ease;">+ Giỏ Hàng</button>
          </div>
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

function loadMoreGames() {
  const extraGames = [
    { id: 11, title: 'Mecha Cyber Strike', genre: 'shooter', price: 380000, rating: 9.1, players: '1.4M', year: 2025, img: '/images/game_shooter_cover.jpg', tags: ['Mecha', 'Sci-Fi', 'PvP'], desc: 'Điều khiển những cỗ máy chiến đấu khổng lồ bảo vệ thuộc địa vũ trụ cuối cùng.' },
    { id: 12, title: 'Gothic Manor: Requiem', genre: 'horror', price: 290000, rating: 9.3, players: '0.9M', year: 2025, img: '/images/game_horror_cover.jpg', tags: ['Horror', 'Psychological', 'Story'], desc: 'Khám phá bí mật gia tộc bị nguyền rủa trong trang viên u tối thế kỷ 19.' }
  ];

  extraGames.forEach(eg => {
    if (!GAMES.some(g => g.id === eg.id)) {
      GAMES.push(eg);
    }
  });

  renderGames();
  const btn = document.getElementById('btn-load-more-games');
  if (btn) btn.style.display = 'none';
  showToast('⚡ Đã tải thêm 2 tựa game độc quyền mới vào kho game!');
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
          <button class="btn-modal-primary" onclick="closeModal();launchGamePlayer(${g.id})">🎮 Chơi Ngay</button>
          <button class="btn-modal-primary" style="background:var(--grad-gold);" onclick="addToCart(${g.id})">🛒 Thêm Vào Giỏ</button>
          <button class="btn-modal-secondary" onclick="toggleWishlist(${g.id}, this)">♡ Yêu Thích</button>
        </div>
      </div>
    </div>
  `;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
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
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  renderGames();
})();

/* ── 22. TOAST NOTIFICATION ──────────────────────────────── */
function showToast(msg, duration = 3200) {
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
    padding: 0.95rem 1.45rem;
    border-radius: 14px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 10px 35px rgba(0,0,0,0.6), 0 0 20px rgba(168,85,247,0.3);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.2);
    transform: translateX(120%);
    transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.35s ease;
    opacity: 0;
    max-width: 380px;
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

/* ── 23. CONTACT FORM ────────────────────────────────────── */
(function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    if (!name || !email) { showToast('⚠️ Vui lòng điền đầy đủ thông tin!'); return; }
    showToast('✅ Cảm ơn ' + name + '! Đội ngũ GameVerse sẽ liên hệ bạn qua email ' + email + ' sớm nhất.', 4500);
    form.reset();
  });
})();

/* ── 24. BACK TO TOP ─────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.opacity   = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

console.log('%cGameVerse Interactive Suite Fully Active ✅', 'color:#8b5cf6;font-size:14px;font-weight:bold;');


/* ══════════════════════════════════════════════════════════════
   NEXT LEVEL JS: CYBER AUDIO, AI CHATBOT, LOOT WHEEL, BENCHMARK, COMPARE
   ══════════════════════════════════════════════════════════════ */

/* ── 1. CYBER AUDIO SYNTHESIZER (WEB AUDIO API) ───────────── */
let cyberAudioCtx = null;
let cyberAudioEnabled = true;

function getAudioContext() {
    if (!cyberAudioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) cyberAudioCtx = new AudioCtx();
    }
    if (cyberAudioCtx && cyberAudioCtx.state === 'suspended') {
        cyberAudioCtx.resume();
    }
    return cyberAudioCtx;
}

function playCyberSfx(type) {
    if (!cyberAudioEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        if (type === 'hover') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'click') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'success' || type === 'win') {
            const notes = type === 'win' ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                gain.gain.setValueAtTime(0.08, now + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.08);
                osc.stop(now + idx * 0.08 + 0.25);
            });
        }
    } catch (e) {
        // AudioContext not allowed or unsupported
    }
}

function toggleCyberAudioSystem() {
    cyberAudioEnabled = !cyberAudioEnabled;
    const toggleEl = document.getElementById('cyber-audio-toggle');
    const labelEl = document.getElementById('audio-label');
    if (toggleEl && labelEl) {
        if (cyberAudioEnabled) {
            toggleEl.classList.add('active');
            labelEl.textContent = 'SFX: BẬT';
            playCyberSfx('success');
            showToast('🔊 Đã bật âm thanh Cyberpunk SFX');
        } else {
            toggleEl.classList.remove('active');
            labelEl.textContent = 'SFX: TẮT';
            showToast('🔇 Đã tắt âm thanh');
        }
    }
}

/* ── 2. CYBER AI CHATBOT (CYBER-BOT 9000) ──────────────────── */
const cyberAiHistory = [
    { sender: 'bot', text: 'Xin chào chiến hữu! Tôi là CYBER-BOT 9000 – Trợ lý AI của GameVerse. Tôi có thể giúp bạn tìm game hay, tư vấn cấu hình, hướng dẫn nạp quà hoặc tặng mã giảm giá. Bạn cần tôi hỗ trợ gì?' }
];

function toggleCyberChat() {
    const win = document.getElementById('cyber-chat-window');
    if (!win) return;
    const isOpen = win.classList.toggle('open');
    playCyberSfx(isOpen ? 'success' : 'click');
    if (isOpen) {
        renderCyberMessages();
        const input = document.getElementById('cyber-chat-input');
        if (input) input.focus();
    }
}

function clearCyberChat() {
    cyberAiHistory.length = 0;
    cyberAiHistory.push({ sender: 'bot', text: 'Đoạn chat đã được đặt lại. Hãy hỏi tôi bất cứ điều gì về game bạn muốn!' });
    renderCyberMessages();
    playCyberSfx('click');
}

function renderCyberMessages() {
    const body = document.getElementById('cyber-chat-body');
    if (!body) return;
    body.innerHTML = cyberAiHistory.map(msg => {
        if (msg.sender === 'user') {
            return '<div class="chat-msg user">' + escapeHtml(msg.text) + '</div>';
        } else {
            let cardHtml = '';
            if (msg.card) {
                cardHtml = `
                    <div class="chat-msg-card">
                        <div class="chat-msg-card-title">${escapeHtml(msg.card.title)}</div>
                        <div style="font-size:0.75rem; color:var(--text-2);">${escapeHtml(msg.card.desc)}</div>
                        <div class="chat-msg-card-actions">
                            <button class="chat-msg-card-btn chat-btn-view" onclick="openGameModal(${msg.card.id})">🔍 Xem Chi Tiết</button>
                            <button class="chat-msg-card-btn chat-btn-cart" onclick="addToCart(${msg.card.id})">🛒 Mua Ngay (${msg.card.price})</button>
                        </div>
                    </div>
                `;
            }
            return '<div class="chat-msg bot">' + msg.text + cardHtml + '</div>';
        }
    }).join('');
    body.scrollTop = body.scrollHeight;
}

function askCyberAI(query) {
    const input = document.getElementById('cyber-chat-input');
    if (input) input.value = query;
    handleCyberSubmit(new Event('submit'));
}

function handleCyberSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('cyber-chat-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    cyberAiHistory.push({ sender: 'user', text: text });
    input.value = '';
    renderCyberMessages();
    playCyberSfx('click');

    // Show typing dots
    const body = document.getElementById('cyber-chat-body');
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot typing-dots';
    typingEl.id = 'bot-typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typingEl);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
        const ind = document.getElementById('bot-typing-indicator');
        if (ind) ind.remove();

        const lower = text.toLowerCase();
        let reply = '';
        let card = null;

        if (lower.includes('gợi ý') || lower.includes('hay nhất') || lower.includes('top game') || lower.includes('tư vấn')) {
            reply = 'Dựa trên xu hướng game thủ tuần này, đây là siêu phẩm bom tấn được đánh giá cao nhất 98% tích cực:';
            card = { id: 1, title: 'Dragon Realm Chronicles (Siêu Phẩm 2026)', desc: 'Thế giới mở kỳ ảo đồ họa Unreal Engine 5.4, cốt truyện 80 giờ chơi đỉnh cao.', price: '1.250.000₫' };
        } else if (lower.includes('khuyến mãi') || lower.includes('giảm giá') || lower.includes('sale') || lower.includes('hot')) {
            reply = 'Hôm nay đang có sự kiện ⚡ <strong>Cyber Flash Sale</strong> lên đến 70%! Đặc biệt tựa game Shadow Hospital 2 đang giảm sốc chỉ 285.000₫:';
            card = { id: 3, title: 'Shadow Hospital 2 (-70% Sale)', desc: 'Game kinh dị sinh tồn xuất sắc, đồ họa Ray Tracing chân thực.', price: '285.000₫' };
        } else if (lower.includes('cấu hình') || lower.includes('pc') || lower.includes('fps') || lower.includes('wukong') || lower.includes('cyberpunk')) {
            reply = 'Để chiến mượt các game thế giới mở ở thiết lập <strong>2K 60-120 FPS</strong>, cấu hình chuẩn nhất hiện tại là: CPU Core i5-13600K hoặc Ryzen 5 7600X, GPU RTX 4060 hoặc RX 7700XT, và 32GB RAM.<br><br>💡 Bạn có thể bấm vào mục <strong>⚡ Đo Cấu Hình</strong> trên thanh menu để test máy bạn nhé!';
        } else if (lower.includes('mã') || lower.includes('giảm') || lower.includes('giftcode') || lower.includes('voucher') || lower.includes('quà')) {
            reply = 'Dành riêng cho bạn! Hãy dùng mã <strong>CYBER-AI50</strong> tại bước thanh toán để được giảm ngay 50.000₫ hoặc quay ngay <strong>🎁 Vòng Quay May Mắn</strong> trên menu để trúng quà to hơn!';
        } else if (lower.includes('giải đấu') || lower.includes('major') || lower.includes('esports')) {
            reply = 'Giải đấu <strong>CYBER MAJOR 2026</strong> đang mở cổng đăng ký với tổng giải thưởng 1.000.000$! Bạn có thể cuộn xuống mục Esports để đăng ký và nhận Vé Thi Đấu Điện Tử nhé.';
        } else {
            reply = 'Tôi đã ghi nhận câu hỏi của bạn. GameVerse có hơn 500+ tựa game bản quyền, bảo hành trọn đời và dịch vụ Cloud Gaming 60 FPS. Bạn muốn tìm game thể loại gì (Hành Động, RPG, Bắn Súng hay Kinh Dị)?';
        }

        cyberAiHistory.push({ sender: 'bot', text: reply, card: card });
        renderCyberMessages();
        playCyberSfx('success');
    }, 550);
}

/* ── 3. DAILY LUCKY LOOT WHEEL ────────────────────────────── */
const lootPrizes = [
    { label: '🎟️ VIP50', title: 'Voucher Giảm 50% VIP Pass', desc: 'Giảm 50% khi đăng ký gói VIP Pass 1 năm.', code: 'VIPPASS50', color: '#8b5cf6' },
    { label: '🎮 FREE GAME', title: 'Mã Kích Hoạt Game Random', desc: 'Tặng 1 key game bản quyền ngẫu nhiên trên Steam/Epic.', code: 'FREEGAME2026', color: '#06b6d4' },
    { label: '💎 500 COINS', title: 'Cộng 500 Cyber Coins', desc: '500 điểm tích lũy dùng đổi quà hoặc mua skin game.', code: 'COIN500P', color: '#10b981' },
    { label: '🎁 VOUCHER 100K', title: 'Voucher Mua Game 100.000₫', desc: 'Áp dụng cho mọi đơn hàng từ 300.000₫ trở lên.', code: 'GAME100K', color: '#f59e0b' },
    { label: '⚡ SPEED 20%', title: 'Tăng 20% Tốc Độ Tải Cloud', desc: 'Kích hoạt băng thông ưu tiên Cloud Gaming không giật lag.', code: 'SPEED20X', color: '#ec4899' },
    { label: '👑 VIP 7 NGÀY', title: 'Trải Nghiệm VIP Pro 7 Ngày', desc: 'Miễn phí chơi thử toàn bộ kho 100+ tựa game VIP.', code: 'VIP7FREE', color: '#6366f1' },
    { label: '🎧 TAI NGHE RGB', title: 'Voucher Phụ Kiện Gaming', desc: 'Giảm 200.000₫ khi mua chuột, phím cơ hoặc tai nghe RGB.', code: 'GEAR200K', color: '#3b82f6' },
    { label: '🍀 +100 EXP', title: 'Chúc Bạn May Mắn Lần Sau', desc: 'Tặng bạn 100 Điểm Danh Dự Game Thủ GameVerse.', code: 'LUCKY100', color: '#64748b' }
];

let wheelAngle = 0;
let isSpinningWheel = false;

function openLootWheelModal() {
    const modal = document.getElementById('loot-modal-overlay');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playCyberSfx('click');
    drawLootWheel(wheelAngle);
}

function closeLootWheelModal() {
    const modal = document.getElementById('loot-modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function drawLootWheel(currentAngle) {
    const canvas = document.getElementById('loot-wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numSlices = lootPrizes.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
        const angle = currentAngle + i * sliceAngle;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, angle, angle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = lootPrizes[i].color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0f172a';
        ctx.stroke();

        // Slice text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Rajdhani, Orbitron, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(lootPrizes[i].label, radius - 20, 4);
        ctx.restore();
    }

    // Outer neon glow ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#06b6d4';
    ctx.stroke();
}

function spinLootWheel() {
    if (isSpinningWheel) return;
    isSpinningWheel = true;
    playCyberSfx('click');

    const resultBox = document.getElementById('loot-result-box');
    if (resultBox) resultBox.style.display = 'none';

    const spinBtn = document.getElementById('loot-spin-btn');
    if (spinBtn) spinBtn.disabled = true;

    // Random rotation between 5 and 8 full turns
    const totalRotation = Math.PI * 2 * (5 + Math.random() * 3);
    const startAngle = wheelAngle;
    const targetAngle = startAngle + totalRotation;
    const duration = 4000;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        wheelAngle = startAngle + totalRotation * ease;
        drawLootWheel(wheelAngle);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinningWheel = false;
            if (spinBtn) spinBtn.disabled = false;

            // Determine prize based on top pointer (-PI/2)
            const numSlices = lootPrizes.length;
            const sliceAngle = (2 * Math.PI) / numSlices;
            const normalizedAngle = (wheelAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            const pointerAngle = (3 * Math.PI / 2 - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);
            const prizeIndex = Math.floor(pointerAngle / sliceAngle) % numSlices;
            const prize = lootPrizes[prizeIndex];

            // Show result
            if (resultBox) {
                resultBox.style.display = 'block';
                document.getElementById('loot-result-title').textContent = prize.title;
                document.getElementById('loot-result-desc').textContent = prize.desc;
                document.getElementById('loot-code-text').textContent = prize.code;
            }
            playCyberSfx('win');
            launchConfetti();
            showToast('🎉 Chúc mừng bạn đã trúng: ' + prize.title);
        }
    }
    requestAnimationFrame(animate);
}

function copyLootCode() {
    const codeEl = document.getElementById('loot-code-text');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
        showToast('📋 Đã sao chép mã quà tặng: ' + codeEl.textContent.trim());
        playCyberSfx('success');
    }).catch(() => {
        showToast('📋 Mã quà tặng của bạn: ' + codeEl.textContent.trim());
    });
}

function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const particles = [];
    const colors = ['#06b6d4', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#fff'];
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.7) * 14,
            size: Math.random() * 7 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    let frame = 0;
    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // gravity
            p.rotation += p.vRot;
            p.opacity -= 0.012;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
        frame++;
        if (frame < 90) {
            requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    requestAnimationFrame(renderConfetti);
}

/* ── 4. PC BENCHMARK LAB & FPS METER ──────────────────────── */
const benchmarkGames = [
    { id: 1, name: 'Dragon Realm Chronicles (Unreal Engine 5.4)', baseReq: 7, recFps: 95 },
    { id: 2, name: 'Cyber Hunter 2077 (Ray Tracing Overdrive)', baseReq: 8, recFps: 85 },
    { id: 3, name: 'Shadow Hospital 2 (Lumen GI & DLSS 3.5)', baseReq: 6, recFps: 105 },
    { id: 4, name: 'Speed Storm Horizon (4K 120 FPS Ready)', baseReq: 5, recFps: 120 },
    { id: 5, name: 'Apex Predator Online (Esports Shooter)', baseReq: 4, recFps: 165 },
    { id: 6, name: 'Phantom Assassin: Neo Tokyo (Stealth Action)', baseReq: 6, recFps: 90 }
];

function openBenchmarkModal() {
    const modal = document.getElementById('benchmark-modal-overlay');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playCyberSfx('click');

    // Populate game select if empty
    const select = document.getElementById('bench-game-select');
    if (select && select.children.length === 0) {
        select.innerHTML = benchmarkGames.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    }
    runBenchmarkCalc();
}

function closeBenchmarkModal() {
    const modal = document.getElementById('benchmark-modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function runBenchmarkCalc() {
    const gameId = parseInt(document.getElementById('bench-game-select')?.value || '1');
    const cpuScore = parseInt(document.getElementById('bench-cpu-select')?.value || '7');
    const gpuScore = parseInt(document.getElementById('bench-gpu-select')?.value || '6');
    const ramScore = parseInt(document.getElementById('bench-ram-select')?.value || '3');
    const resId = parseInt(document.getElementById('bench-res-select')?.value || '2');

    const game = benchmarkGames.find(g => g.id === gameId) || benchmarkGames[0];

    // Hardware composite formula (GPU 55%, CPU 30%, RAM 15%)
    const rawPower = gpuScore * 5.5 + cpuScore * 3.0 + ramScore * 3.75; // max ~ 100
    // Resolution penalty
    const resFactor = resId === 1 ? 1.25 : (resId === 2 ? 1.0 : 0.65);
    // Calculated score out of 100
    const finalScore = Math.min(100, Math.max(15, Math.round(rawPower * (8 / game.baseReq) * 0.95)));

    // FPS prediction
    const baseFps = game.recFps * (finalScore / 75) * resFactor;
    const estFps = Math.max(22, Math.round(baseFps));

    // Update Score Circle & Gauge Bar
    const scoreNumEl = document.getElementById('bench-score-num');
    if (scoreNumEl) scoreNumEl.textContent = finalScore;

    const gaugeBar = document.getElementById('bench-gauge-bar');
    if (gaugeBar) {
        // Circumference for r=42 is ~264
        const offset = 264 - (264 * (finalScore / 100));
        gaugeBar.style.strokeDashoffset = offset;
        gaugeBar.style.stroke = finalScore >= 75 ? '#10b981' : (finalScore >= 50 ? '#f59e0b' : '#ef4444');
    }

    // Update FPS & Presets
    const fpsNumEl = document.getElementById('bench-fps-num');
    if (fpsNumEl) fpsNumEl.innerHTML = '~' + estFps + ' <span>FPS</span>';

    const presetEl = document.getElementById('bench-fps-preset');
    const verdictTag = document.getElementById('bench-verdict-tag');
    const verdictDesc = document.getElementById('bench-verdict-desc');
    const verdictBox = document.getElementById('bench-verdict-box');

    let verdictColor = '#10b981';
    if (finalScore >= 80) {
        if (presetEl) presetEl.textContent = 'Thiết lập: Ultra High / Max Ray Tracing';
        if (verdictTag) verdictTag.textContent = '🟢 CHIẾN CỰC MƯỢT (SIÊU PHẨM)';
        if (verdictDesc) verdictDesc.textContent = 'Cấu hình của bạn quá mạnh mẽ, đáp ứng hoàn hảo đồ họa cao cấp nhất, hình ảnh mượt mà trên 90 FPS không lo giật lag!';
        verdictColor = '#10b981';
    } else if (finalScore >= 60) {
        if (presetEl) presetEl.textContent = 'Thiết lập: High Settings (DLSS / FSR Bật)';
        if (verdictTag) verdictTag.textContent = '🟡 CHIẾN RẤT TỐT (CHUẨN GAMING)';
        if (verdictDesc) verdictDesc.textContent = 'Máy bạn hoàn toàn đủ sức chiến tựa game này ở mức thiết lập đồ họa Đẹp, tốc độ khung hình ổn định từ 60-80 FPS.';
        verdictColor = '#f59e0b';
    } else if (finalScore >= 40) {
        if (presetEl) presetEl.textContent = 'Thiết lập: Medium / Low Settings';
        if (verdictTag) verdictTag.textContent = '🟠 CẤU HÌNH TỐI THIỂU (35-50 FPS)';
        if (verdictDesc) verdictDesc.textContent = 'Game có thể chơi được nhưng bạn nên hạ độ phân giải hoặc bật công nghệ nâng khung hình DLSS/FSR Performance để mượt hơn.';
        verdictColor = '#f97316';
    } else {
        if (presetEl) presetEl.textContent = 'Thiết lập: Cần Nâng Cấp Card Đồ Họa';
        if (verdictTag) verdictTag.textContent = '🔴 KHUYÊN DÙNG CLOUD GAMING';
        if (verdictDesc) verdictDesc.textContent = 'Cấu hình hiện tại có thể bị giật lag dưới 30 FPS. Bạn hãy trải nghiệm tính năng "Chơi Ngay" bằng Cloud Gaming của GameVerse hoàn toàn không cần card xịn!';
        verdictColor = '#ef4444';
    }

    if (verdictBox) verdictBox.style.borderLeftColor = verdictColor;
    if (verdictTag) verdictTag.style.color = verdictColor;
    playCyberSfx('hover');
}

/* ── 5. GAME COMPARISON TOOL ──────────────────────────────── */
const compareCatalog = [
    { id: 1, name: 'Dragon Realm Chronicles', price: '1.250.000₫', genre: 'RPG / Thế Giới Mở', meta: '96/100', size: '85 GB', time: '80+ Giờ', engine: 'Unreal Engine 5.4', dlss: 'DLSS 3.5 & Ray Tracing', dev: 'Mythic Forge Studios', img: '/images/game-rpg.jpg' },
    { id: 2, name: 'Cyber Hunter 2077', price: '980.000₫', genre: 'Hành Động / Cyberpunk', meta: '93/100', size: '72 GB', time: '45 Giờ', engine: 'REDengine Next', dlss: 'Path Tracing & Frame Gen', dev: 'Neon Matrix Labs', img: '/images/game-shooter.jpg' },
    { id: 3, name: 'Shadow Hospital 2', price: '285.000₫', genre: 'Kinh Dị / Sinh Tồn', meta: '89/100', size: '42 GB', time: '20 Giờ', engine: 'Unreal Engine 5.2', dlss: 'Lumen & TSR Support', dev: 'Dark Lantern Games', img: '/images/game-horror.jpg' },
    { id: 4, name: 'Speed Storm Horizon', price: '850.000₫', genre: 'Đua Xe / Tốc Độ', meta: '91/100', size: '95 GB', time: '100+ Giờ', engine: 'ForzaTech Dynamic', dlss: 'FSR 3.1 & 120 FPS HDR', dev: 'Apex Velocity', img: '/images/game-racing.jpg' },
    { id: 5, name: 'Apex Predator Online', price: '450.000₫', genre: 'FPS / Esports Chiến Thuật', meta: '90/100', size: '55 GB', time: 'Vô Hạn (Multiplayer)', engine: 'Source 2 Pro', dlss: 'NVIDIA Reflex 1ms Latency', dev: 'Vanguard Interactive', img: '/images/game-sports.jpg' },
    { id: 6, name: 'Total Conquest: Empires', price: '690.000₫', genre: 'Chiến Thuật / Xây Dựng', meta: '88/100', size: '38 GB', time: '60 Giờ', engine: 'WarEngine DX12', dlss: 'Multi-Core CPU Enhanced', dev: 'Imperium Strategy', img: '/images/game-strategy.jpg' }
];

function openCompareModal() {
    const modal = document.getElementById('compare-modal-overlay');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playCyberSfx('click');

    const s1 = document.getElementById('compare-game-1');
    const s2 = document.getElementById('compare-game-2');
    if (s1 && s2 && s1.children.length === 0) {
        s1.innerHTML = compareCatalog.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
        s2.innerHTML = compareCatalog.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
        s1.value = '1';
        s2.value = '2';
    }
    renderComparisonTable();
}

function closeCompareModal() {
    const modal = document.getElementById('compare-modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderComparisonTable() {
    const id1 = parseInt(document.getElementById('compare-game-1')?.value || '1');
    const id2 = parseInt(document.getElementById('compare-game-2')?.value || '2');

    const g1 = compareCatalog.find(g => g.id === id1) || compareCatalog[0];
    const g2 = compareCatalog.find(g => g.id === id2) || compareCatalog[1];

    const content = document.getElementById('compare-table-content');
    if (!content) return;

    content.innerHTML = `
        <table class="compare-matrix-table">
            <tr class="compare-hero-row">
                <th>TỰA GAME</th>
                <td>
                    <div class="compare-game-card">
                        <img src="${g1.img}" class="compare-game-img" alt="${g1.name}" onerror="this.src='/images/game-rpg.jpg'" />
                        <div class="compare-game-name">${g1.name}</div>
                        <div class="compare-game-price">${g1.price}</div>
                        <button class="chat-msg-card-btn chat-btn-cart" onclick="addToCart(${g1.id})">🛒 Mua Game Này</button>
                    </div>
                </td>
                <td>
                    <div class="compare-game-card">
                        <img src="${g2.img}" class="compare-game-img" alt="${g2.name}" onerror="this.src='/images/game-shooter.jpg'" />
                        <div class="compare-game-name">${g2.name}</div>
                        <div class="compare-game-price">${g2.price}</div>
                        <button class="chat-msg-card-btn chat-btn-cart" onclick="addToCart(${g2.id})">🛒 Mua Game Này</button>
                    </div>
                </td>
            </tr>
            <tr>
                <th>Thể Loại</th>
                <td>${g1.genre}</td>
                <td>${g2.genre}</td>
            </tr>
            <tr>
                <th>Điểm Metacritic</th>
                <td class="spec-winner">${g1.meta}</td>
                <td class="spec-winner">${g2.meta}</td>
            </tr>
            <tr>
                <th>Thời Lượng Chơi</th>
                <td>${g1.time}</td>
                <td>${g2.time}</td>
            </tr>
            <tr>
                <th>Dung Lượng Ổ Cứng</th>
                <td>${g1.size}</td>
                <td>${g2.size}</td>
            </tr>
            <tr>
                <th>Công Nghệ & Đồ Họa</th>
                <td>${g1.dlss}</td>
                <td>${g2.dlss}</td>
            </tr>
            <tr>
                <th>Game Engine</th>
                <td>${g1.engine}</td>
                <td>${g2.engine}</td>
            </tr>
            <tr>
                <th>Nhà Phát Triển</th>
                <td>${g1.dev}</td>
                <td>${g2.dev}</td>
            </tr>
        </table>
    `;
    playCyberSfx('hover');
}


/* ══════════════════════════════════════════════════════════════
   POLISH & FIXES: GLOBAL ESCAPE, GAMER PROFILE, CODE REDEMPTION
   ══════════════════════════════════════════════════════════════ */

// Fix image paths in compareCatalog
if (typeof compareCatalog !== 'undefined') {
    compareCatalog.forEach(g => {
        if (g.id === 1) g.img = '/images/game_rpg_cover.jpg';
        if (g.id === 2) g.img = '/images/game_shooter_cover.jpg';
        if (g.id === 3) g.img = '/images/game_horror_cover.jpg';
        if (g.id === 4) g.img = '/images/game_sports_cover.jpg';
        if (g.id === 5) g.img = '/images/game_shooter_cover.jpg';
        if (g.id === 6) g.img = '/images/game_strategy_cover.jpg';
    });
}

// Global Escape Key Listener for all active modals and windows
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active, .custom-modal-overlay.active, .trailer-modal-overlay.active, .quick-view-overlay.active').forEach(m => {
            m.classList.remove('active');
        });
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer) cartDrawer.classList.remove('active');
        const wishDrawer = document.getElementById('wishlist-drawer');
        if (wishDrawer) wishDrawer.classList.remove('active');
        const chatWin = document.getElementById('cyber-chat-window');
        if (chatWin) chatWin.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// Gamer Profile & Redeem System
let userCoins = 1250;
const userOwnedGames = [
    { id: 1, title: 'Dragon Realm Chronicles', hours: '48.5 Giờ', img: '/images/game_rpg_cover.jpg' },
    { id: 2, title: 'Void Strike: Cyber Hunter', hours: '12.0 Giờ', img: '/images/game_shooter_cover.jpg' },
    { id: 3, title: 'Shadow Hospital 2', hours: '6.2 Giờ', img: '/images/game_horror_cover.jpg' },
    { id: 5, title: 'Speed Storm Horizon', hours: '25.4 Giờ', img: '/images/game_sports_cover.jpg' }
];

function openGamerProfileModal() {
    const modal = document.getElementById('gamer-profile-modal-overlay');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof playCyberSfx === 'function') playCyberSfx('click');
    switchProfileTab('library');
}

function closeGamerProfileModal() {
    const modal = document.getElementById('gamer-profile-modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function switchProfileTab(tabName) {
    document.querySelectorAll('.profile-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-ptab') === tabName);
    });

    const content = document.getElementById('profile-tab-content');
    if (!content) return;

    if (tabName === 'library') {
        content.innerHTML = userOwnedGames.map(g => `
            <div class="user-game-row">
                <img src="${g.img}" class="user-game-thumb" alt="${g.title}" onerror="this.src='/images/game_rpg_cover.jpg'" />
                <div class="user-game-info">
                    <h4>${g.title}</h4>
                    <p>Đã chơi: <span style="color:var(--neon-cyan)">${g.hours}</span> • Trạng thái: Sẵn sàng</p>
                </div>
                <button class="btn-launch-game" onclick="closeGamerProfileModal(); launchGamePlayer('${g.title}', 'Chơi Ngay (Bản Quyền Đã Sở Hữu)')">▶ Chơi Ngay</button>
            </div>
        `).join('');
    } else if (tabName === 'redeem') {
        content.innerHTML = `
            <div class="redeem-box">
                <h3 style="color:#fff; margin-bottom: 6px;">Kích Hoạt Giftcode / Thẻ Quà Tặng</h3>
                <p style="color:var(--text-2); font-size: 0.85rem;">Nhập mã nhận được từ sự kiện, Vòng quay may mắn hoặc Chatbot AI.</p>
                <div class="redeem-input-row">
                    <input type="text" id="giftcode-input" placeholder="Ví dụ: CYBER50, FREEGAME2026..." />
                    <button class="btn-redeem-submit" onclick="submitGiftcode()">KÍCH HOẠT</button>
                </div>
                <div class="redeem-hints">
                    💡 <strong>Gợi ý mã có sẵn:</strong><br>
                    • <code>CYBER50</code>: Giảm 50% Gói VIP<br>
                    • <code>COIN500P</code>: Cộng 500 Cyber Coins vào ví<br>
                    • <code>VIPPASS50</code> / <code>VIP7FREE</code>: Nhận 7 ngày VIP Pro miễn phí<br>
                    • <code>GAME100K</code>: Voucher giảm giá 100.000₫
                </div>
            </div>
        `;
    } else if (tabName === 'badges') {
        content.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; text-align:center;">
                    <div style="font-size:28px;">🏆</div>
                    <strong style="font-size:0.8rem; color:#fff; display:block; margin-top:4px;">Chung Kết Cyber</strong>
                    <span style="font-size:0.7rem; color:var(--neon-cyan)">Hạng 3 Toàn Quốc</span>
                </div>
                <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; text-align:center;">
                    <div style="font-size:28px;">⚡</div>
                    <strong style="font-size:0.8rem; color:#fff; display:block; margin-top:4px;">Beta Tester</strong>
                    <span style="font-size:0.7rem; color:#10b981">Gia nhập sớm</span>
                </div>
                <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; text-align:center;">
                    <div style="font-size:28px;">🔥</div>
                    <strong style="font-size:0.8rem; color:#fff; display:block; margin-top:4px;">Fan Cuồng RPG</strong>
                    <span style="font-size:0.7rem; color:#f59e0b">100+ Giờ chơi</span>
                </div>
                <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; text-align:center;">
                    <div style="font-size:28px;">👑</div>
                    <strong style="font-size:0.8rem; color:#fff; display:block; margin-top:4px;">VIP Subscriber</strong>
                    <span style="font-size:0.7rem; color:#fbbf24">Tài khoản Pro</span>
                </div>
            </div>
        `;
    }
}

function submitGiftcode() {
    const input = document.getElementById('giftcode-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast('⚠️ Vui lòng nhập mã quà tặng!');
        return;
    }

    const validCodes = {
        'CYBER50': 'Voucher giảm 50% Gói VIP',
        'VIPPASS50': 'Voucher giảm 50% Gói VIP',
        'FREEGAME2026': 'Key game bản quyền Random đã gửi vào kho',
        'COIN500P': 'Đã cộng +500 Cyber Coins vào ví!',
        'GAME100K': 'Voucher 100.000₫ áp dụng thành công',
        'VIP7FREE': 'Đã kích hoạt 7 ngày VIP Pro miễn phí!',
        'CYBER-AI50': 'Mã giảm giá 50.000₫ từ Cyber AI Bot',
        'GAMEVERSE-VIP20': 'Mã giảm 20% cho đơn hàng đầu tiên'
    };

    if (validCodes[code]) {
        if (code === 'COIN500P') {
            userCoins += 500;
            const bal = document.getElementById('user-coin-balance');
            if (bal) bal.textContent = userCoins.toLocaleString();
        }
        if (typeof playCyberSfx === 'function') playCyberSfx('win');
        showToast('🎉 KÍCH HOẠT THÀNH CÔNG: ' + validCodes[code]);
        input.value = '';
    } else {
        if (typeof playCyberSfx === 'function') playCyberSfx('click');
        showToast('❌ Mã "' + code + '" không tồn tại hoặc đã hết hạn.');
    }
}
