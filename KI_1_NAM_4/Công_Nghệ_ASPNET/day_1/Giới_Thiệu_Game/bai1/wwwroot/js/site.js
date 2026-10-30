/* ============================================================
   GAMEVERSE v2 – script.js
   Premium Interactive Layer
   ============================================================ */

"use strict";

/* ============================================================
   DATA
   ============================================================ */
const GAMES = [
    { id: 1, title: "Dragon Realm: Age of Legends", genre: "rpg", genreLabel: "RPG", rating: 9.8, platform: "PC · PS5 · Xbox", img: "game_rpg_cover.jpg", hot: true, year: 2026 },
    { id: 2, title: "Void Strike: Galactic War", genre: "shooter", genreLabel: "Bắn Súng", rating: 9.5, platform: "PC · Xbox · PS5", img: "game_shooter_cover.jpg", hot: true, year: 2026 },
    { id: 3, title: "Kingdom Fall: Empire Wars", genre: "strategy", genreLabel: "Chiến Thuật", rating: 9.3, platform: "PC · Mobile", img: "game_strategy_cover.jpg", hot: false, year: 2025 },
    { id: 4, title: "World Cup Glory 2026", genre: "sports", genreLabel: "Thể Thao", rating: 9.0, platform: "PC · PS5 · Xbox", img: "game_sports_cover.jpg", hot: false, year: 2026 },
    { id: 5, title: "Shadow Hospital: Awakening", genre: "horror", genreLabel: "Kinh Dị", rating: 8.9, platform: "PC · PS5", img: "game_horror_cover.jpg", hot: true, year: 2026 },
    { id: 6, title: "Arcane Legends Online", genre: "rpg", genreLabel: "RPG", rating: 8.7, platform: "PC · Mobile", img: "game_rpg_cover.jpg", hot: false, year: 2025 },
    { id: 7, title: "Nova Rangers: Strike Force", genre: "shooter", genreLabel: "Bắn Súng", rating: 8.5, platform: "PC", img: "game_shooter_cover.jpg", hot: false, year: 2025 },
    { id: 8, title: "Grand Conquest: Online", genre: "strategy", genreLabel: "Chiến Thuật", rating: 8.8, platform: "PC · Mobile", img: "game_strategy_cover.jpg", hot: false, year: 2025 },
    { id: 9, title: "Basketball Stars 2026", genre: "sports", genreLabel: "Thể Thao", rating: 8.6, platform: "PC · PS5", img: "game_sports_cover.jpg", hot: false, year: 2026 },
    { id: 10, title: "Dread Woods", genre: "horror", genreLabel: "Kinh Dị", rating: 9.1, platform: "PC · PS5", img: "game_horror_cover.jpg", hot: true, year: 2025 },
    { id: 11, title: "Mythborn Chronicles", genre: "rpg", genreLabel: "RPG", rating: 9.0, platform: "PC · PS5", img: "game_rpg_cover.jpg", hot: false, year: 2025 },
    { id: 12, title: "Cyber Assault X", genre: "shooter", genreLabel: "Bắn Súng", rating: 8.4, platform: "PC · Xbox", img: "game_shooter_cover.jpg", hot: false, year: 2024 },
];

/* ============================================================
   LOADING SCREEN
   ============================================================ */
(function initLoader() {
    const loader = document.getElementById("loader");
    const bar = document.getElementById("loader-bar");
    const text = document.getElementById("loader-text");
    if (!loader) return;

    const messages = ["Đang tải dữ liệu...", "Khởi tạo game universe...", "Sẵn sàng!"];
    let progress = 0;
    let msgIdx = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 5;
        if (progress >= 100) { progress = 100; clearInterval(interval); }
        bar.style.width = progress + "%";
        if (progress > 30 && msgIdx === 0) { text.textContent = messages[1]; msgIdx = 1; }
        if (progress > 80 && msgIdx === 1) { text.textContent = messages[2]; msgIdx = 2; }
        if (progress >= 100) {
            setTimeout(() => loader.classList.add("hidden"), 400);
        }
    }, 80);
})();

/* ============================================================
   PARTICLES
   ============================================================ */
(function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];
    const HUES = [270, 245, 190, 320];

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.r = Math.random() * 1.4 + 0.3;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25 - 0.08;
            this.a = Math.random() * 0.45 + 0.05;
            this.hue = HUES[Math.floor(Math.random() * HUES.length)];
        }
        update() { this.x += this.vx; this.y += this.vy; if (this.y < -5 || this.x < -5 || this.x > w + 5) this.reset(); }
        draw() {
            ctx.save(); ctx.globalAlpha = this.a; ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue},90%,70%)`; ctx.fill(); ctx.restore();
        }
    }

    function init() {
        resize(); particles = [];
        const n = Math.min(Math.floor((w * h) / 7500), 150);
        for (let i = 0; i < n; i++) particles.push(new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 90) {
                    ctx.save(); ctx.globalAlpha = (1 - d / 90) * 0.07;
                    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); ctx.restore();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    init(); draw();
    window.addEventListener("resize", init);
})();

/* ============================================================
   NAVBAR
   ============================================================ */
(function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    const allLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });

    hamburger?.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        hamburger.classList.toggle("open");
    });

    window.addEventListener("scroll", () => {
        const mid = window.scrollY + window.innerHeight / 3;
        sections.forEach(s => {
            if (mid >= s.offsetTop && mid < s.offsetTop + s.offsetHeight) {
                allLinks.forEach(l => l.classList.remove("active"));
                document.querySelector(`.nav-link[href="#${s.id}"]`)?.classList.add("active");
            }
        });
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            const target = document.querySelector(a.getAttribute("href"));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); navLinks.classList.remove("open"); }
        });
    });
})();

/* ============================================================
   SEARCH BAR
   ============================================================ */
(function initSearch() {
    const btn = document.getElementById("btn-search");
    const bar = document.getElementById("search-bar");
    const input = document.getElementById("search-input");
    const suggests = document.getElementById("search-suggestions");
    if (!btn || !bar || !input) return;

    function open() { bar.classList.add("open"); setTimeout(() => input.focus(), 100); }
    function close() { bar.classList.remove("open"); input.value = ""; suggests.classList.remove("has-results"); suggests.innerHTML = ""; }

    btn.addEventListener("click", open);
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") close();
        if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); open(); }
    });

    input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { suggests.classList.remove("has-results"); suggests.innerHTML = ""; return; }
        const results = GAMES.filter(g => g.title.toLowerCase().includes(q) || g.genreLabel.toLowerCase().includes(q)).slice(0, 5);
        if (!results.length) { suggests.classList.remove("has-results"); suggests.innerHTML = ""; return; }
        suggests.innerHTML = results.map(g => `
      <div class="suggestion-item" onclick="openGameModal(${g.id})">
        <img src="${g.img}" alt="${g.title}" />
        <div><strong>${g.title}</strong><span>${g.genreLabel} · ★${g.rating}</span></div>
      </div>
    `).join("");
        suggests.classList.add("has-results");
    });
})();

/* ============================================================
   HERO TYPEWRITER
   ============================================================ */
(function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    const phrases = ["Mọi Thế Giới Game", "Vũ Trụ RPG", "Chiến Trường Bắn Súng", "Sàn Đấu Esports", "Kinh Dị Tột Cùng"];
    let pi = 0, ci = 0, deleting = false;

    function type() {
        const word = phrases[pi];
        if (!deleting) {
            el.textContent = word.slice(0, ++ci);
            if (ci === word.length) { deleting = true; setTimeout(type, 2200); return; }
        } else {
            el.textContent = word.slice(0, --ci);
            if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 300); return; }
        }
        setTimeout(type, deleting ? 55 : 90);
    }
    setTimeout(type, 1000);
})();

/* ============================================================
   HERO PARALLAX
   ============================================================ */
(function initParallax() {
    const img = document.querySelector(".hero-bg-img");
    if (!img) return;
    document.addEventListener("mousemove", e => {
        const xp = (e.clientX / window.innerWidth - 0.5) * 2;
        const yp = (e.clientY / window.innerHeight - 0.5) * 2;
        img.style.transform = `scale(1.06) translate(${xp * 7}px, ${yp * 7}px)`;
    });
})();

/* ============================================================
   STAT COUNTERS
   ============================================================ */
(function initCounters() {
    const nums = document.querySelectorAll(".stat-number");
    let done = false;
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !done) {
            done = true;
            nums.forEach(el => {
                const target = +el.dataset.target;
                let cur = 0;
                const step = Math.max(1, Math.ceil(target / 70));
                const t = setInterval(() => {
                    cur = Math.min(cur + step, target);
                    el.textContent = cur;
                    if (cur >= target) clearInterval(t);
                }, 20);
            });
        }
    }, { threshold: 0.5 });
    document.querySelector(".hero-stats") && io.observe(document.querySelector(".hero-stats"));
})();

/* ============================================================
   GENRE PILLS
   ============================================================ */
document.querySelectorAll(".genre-pill").forEach(pill => {
    pill.addEventListener("click", () => {
        document.querySelectorAll(".genre-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const genre = pill.dataset.genre;
        // Sync with filter buttons
        document.querySelectorAll(".filter-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.filter === genre);
        });
        if (genre !== "all") {
            document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
            filterGames(genre);
        } else {
            filterGames("all");
        }
    });
});

/* ============================================================
   SPOTLIGHT TABS
   ============================================================ */
(function initSpotlight() {
    const tabs = document.querySelectorAll(".spotlight-tab");
    const panels = document.querySelectorAll(".spotlight-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const idx = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.querySelector(`.spotlight-panel[data-panel="${idx}"]`)?.classList.add("active");
        });
    });

    // Wishlist toggle
    document.querySelectorAll(".btn-spotlight-wish").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("wishlisted");
            showToast(btn.classList.contains("wishlisted") ? "❤️ Đã thêm vào Wishlist!" : "💔 Đã xóa khỏi Wishlist!", btn.classList.contains("wishlisted") ? "success" : "");
        });
    });

    // Play buttons
    document.querySelectorAll(".spotlight-play-btn").forEach(btn => {
        btn.addEventListener("click", () => showVideoModal());
    });
})();

/* ============================================================
   TRENDING TRACK
   ============================================================ */
(function initTrending() {
    const track = document.getElementById("trending-track");
    if (!track) return;

    // Render trending cards
    const sorted = [...GAMES].sort((a, b) => b.rating - a.rating);
    track.innerHTML = sorted.map((g, i) => {
        const ranks = ["gold", "silver", "bronze"];
        const rankClass = i < 3 ? ranks[i] : "";
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1;
        return `
      <div class="trend-card" onclick="openGameModal(${g.id})">
        <div class="trend-card-img">
          <img src="${g.img}" alt="${g.title}" loading="lazy" />
          <div class="trend-rank ${rankClass}">${medal}</div>
        </div>
        <div class="trend-card-body">
          <div class="trend-genre">${g.genreLabel}</div>
          <div class="trend-title">${g.title}</div>
          <div class="trend-footer">
            <span class="trend-rating">★ ${g.rating}</span>
            <span class="trend-platform">${g.platform.split("·")[0].trim()}</span>
          </div>
        </div>
      </div>
    `;
    }).join("");

    let scrollPos = 0;
    const CARD_W = 220 + 16;

    document.getElementById("trend-next")?.addEventListener("click", () => {
        scrollPos = Math.min(scrollPos + CARD_W * 3, track.scrollWidth - track.parentElement.clientWidth);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });
    document.getElementById("trend-prev")?.addEventListener("click", () => {
        scrollPos = Math.max(scrollPos - CARD_W * 3, 0);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    // Touch/drag
    let startX, isDragging = false;
    track.addEventListener("mousedown", e => { startX = e.pageX; isDragging = true; });
    track.addEventListener("mousemove", e => {
        if (!isDragging) return;
        const diff = startX - e.pageX;
        track.style.transform = `translateX(-${Math.max(0, scrollPos + diff)}px)`;
    });
    track.addEventListener("mouseup", e => {
        if (!isDragging) return;
        scrollPos = Math.max(0, scrollPos + (startX - e.pageX));
        isDragging = false;
    });
    track.addEventListener("mouseleave", () => { isDragging = false; });
})();

/* ============================================================
   ESPORTS COUNTDOWN
   ============================================================ */
(function initCountdown() {
    const target = new Date();
    target.setDate(target.getDate() + 12);
    target.setHours(target.getHours() + 8, target.getMinutes() + 45, 0, 0);

    function update() {
        const now = new Date();
        const diff = Math.max(0, target - now);
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const pad = n => String(n).padStart(2, "0");
        const el = id => document.getElementById(id);
        el("cd-days") && (el("cd-days").textContent = pad(d));
        el("cd-hours") && (el("cd-hours").textContent = pad(h));
        el("cd-mins") && (el("cd-mins").textContent = pad(m));
        el("cd-secs") && (el("cd-secs").textContent = pad(s));
    }
    update();
    setInterval(update, 1000);
})();

/* ============================================================
   GAMES GRID
   ============================================================ */
let currentFilter = "all";
let currentSort = "rating";
let showCount = 8;
let viewMode = "grid";

function filterGames(filter) { currentFilter = filter; showCount = 8; renderGames(); }
function sortGames(sort) { currentSort = sort; renderGames(); }

function renderGames() {
    const grid = document.getElementById("games-grid");
    if (!grid) return;

    let list = currentFilter === "all"
        ? [...GAMES]
        : GAMES.filter(g => g.genre === currentFilter);

    if (currentSort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (currentSort === "newest") list.sort((a, b) => b.year - a.year || b.rating - a.rating);
    else if (currentSort === "name") list.sort((a, b) => a.title.localeCompare(b.title));

    const shown = list.slice(0, showCount);

    if (viewMode === "list") grid.classList.add("list-view");
    else grid.classList.remove("list-view");

    grid.innerHTML = shown.map(g => `
    <div class="game-card reveal" data-genre="${g.genre}" onclick="openGameModal(${g.id})">
      ${g.hot ? '<span class="game-card-hot">HOT</span>' : ""}
      <div class="game-card-img">
        <img src="${g.img}" alt="${g.title}" loading="lazy" />
        <div class="game-card-overlay">
          <div class="card-overlay-btn">🎮 Chơi Ngay</div>
        </div>
      </div>
      <div class="game-card-body">
        <div class="game-card-genre">${g.genreLabel}</div>
        <div class="game-card-title">${g.title}</div>
        <div class="game-card-footer">
          <div class="game-card-rating">★ ${g.rating}</div>
          <div class="game-card-platform">${g.platform}</div>
        </div>
      </div>
    </div>
  `).join("");

    // Stagger reveal
    setTimeout(() => {
        grid.querySelectorAll(".game-card.reveal").forEach((el, i) => {
            setTimeout(() => el.classList.add("visible"), i * 55);
        });
    }, 30);

    const loadBtn = document.getElementById("load-more");
    if (loadBtn) loadBtn.style.display = list.length <= showCount ? "none" : "inline-flex";
}

(function initGames() {
    renderGames();

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterGames(btn.dataset.filter);
        });
    });

    document.getElementById("sort-select")?.addEventListener("change", e => sortGames(e.target.value));

    document.getElementById("load-more")?.addEventListener("click", () => { showCount += 4; renderGames(); });

    document.getElementById("view-grid")?.addEventListener("click", () => {
        viewMode = "grid";
        document.getElementById("view-grid").classList.add("active");
        document.getElementById("view-list").classList.remove("active");
        renderGames();
    });

    document.getElementById("view-list")?.addEventListener("click", () => {
        viewMode = "list";
        document.getElementById("view-list").classList.add("active");
        document.getElementById("view-grid").classList.remove("active");
        renderGames();
    });
})();

/* ============================================================
   GAME MODAL
   ============================================================ */
function openGameModal(id) {
    const g = GAMES.find(g => g.id === id);
    if (!g) return;
    const content = document.getElementById("modal-content");
    content.innerHTML = `
    <img src="${g.img}" alt="${g.title}" style="width:100%;height:200px;object-fit:cover;border-radius:12px;margin-bottom:20px;" />
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      <span class="stag stag-${g.genre}">${g.genreLabel}</span>
      ${g.hot ? '<span class="stag stag-hot">🔥 HOT</span>' : ""}
      <span style="font-size:0.78rem;color:var(--text-3);align-self:center;">${g.year}</span>
    </div>
    <h3 style="font-family:var(--font-h);font-size:1.5rem;font-weight:700;margin-bottom:10px;">${g.title}</h3>
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;flex-wrap:wrap;">
      <span style="color:#fbbf24;font-weight:700;font-size:1rem;">★ ${g.rating} / 10</span>
      <span style="color:var(--text-3);font-size:0.85rem;">${g.platform}</span>
    </div>
    <p style="color:var(--text-2);font-size:0.9rem;line-height:1.75;margin-bottom:24px;">Trải nghiệm tựa game đỉnh cao với đồ họa ấn tượng và lối chơi hấp dẫn. Khám phá thế giới game phong phú, chinh phục những thử thách mới và kết nối cùng hàng triệu game thủ khắp Việt Nam!</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <a href="#" class="btn-spotlight-primary" style="flex:1;justify-content:center;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Tải Về Ngay
      </a>
      <button onclick="closeModal()" class="btn-spotlight-secondary">Đóng</button>
    </div>
  `;
    document.getElementById("modal-overlay").classList.add("open");
    document.body.style.overflow = "hidden";
}

function showVideoModal() {
    const content = document.getElementById("modal-content");
    content.innerHTML = `
    <div style="text-align:center;padding:40px 0;">
      <div style="font-size:4rem;margin-bottom:20px;animation:float 3s ease-in-out infinite">🎬</div>
      <h3 style="font-family:var(--font-h);font-size:1.4rem;font-weight:700;margin-bottom:12px;">Trailer đang tải...</h3>
      <p style="color:var(--text-2);font-size:0.9rem;margin-bottom:24px;">Tính năng xem trailer sẽ sớm được cập nhật!</p>
      <button onclick="closeModal()" class="btn-spotlight-primary" style="justify-content:center;">Đóng</button>
    </div>
  `;
    document.getElementById("modal-overlay").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("modal-overlay").classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("modal-close")?.addEventListener("click", closeModal);
document.getElementById("modal-overlay")?.addEventListener("click", function (e) { if (e.target === this) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = "") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type ? "toast-" + type : ""}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add("hide"); setTimeout(() => toast.remove(), 400); }, 3000);
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
(function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 400), { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ============================================================
   INTERSECTION OBSERVER – REVEAL
   ============================================================ */
(function initReveal() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });

    function tag(sel, cls) {
        document.querySelectorAll(sel).forEach(el => { el.classList.add(cls); io.observe(el); });
    }

    tag(".section-header", "reveal");
    tag(".bento-card", "reveal");
    tag(".genre-pill", "reveal");
    tag(".news-feature", "reveal");
    tag(".news-mini", "reveal");
    tag(".rev-card", "reveal");

    // Already tagged in HTML – just observe
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => io.observe(el));
})();

/* ============================================================
   FORMS
   ============================================================ */
document.getElementById("contact-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = document.getElementById("submit-btn");
    btn.innerHTML = "✓ Đã Gửi!";
    btn.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
    btn.disabled = true;
    showToast("✅ Tin nhắn đã gửi thành công! Chúng tôi sẽ phản hồi sớm.", "success");
    setTimeout(() => {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Gửi Tin Nhắn`;
        btn.style.background = "";
        btn.disabled = false;
        this.reset();
    }, 3500);
});

document.getElementById("newsletter-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const btn = this.querySelector("button");
    btn.innerHTML = "✓";
    btn.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
    showToast("🎉 Đăng ký newsletter thành công!", "success");
    this.querySelector("input").value = "";
    setTimeout(() => {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
        btn.style.background = "";
    }, 2500);
});

/* ============================================================
   NOTIFICATION BUTTON
   ============================================================ */
document.getElementById("btn-notify")?.addEventListener("click", () => {
    showToast("🔔 Bạn có 3 thông báo mới: Dragon Realm cập nhật, Giải đấu sắp bắt đầu, Voucher mới!", "");
});

/* ============================================================
   ESPORTS BG FALLBACK (if image not loaded)
   ============================================================ */
const esBg = document.getElementById("esports-bg-img");
if (esBg) {
    esBg.onerror = () => {
        esBg.parentElement.style.background = "linear-gradient(135deg,#1a0533,#0d1a3a,#001a2c)";
        esBg.style.display = "none";
    };
    // Use a gradient fallback image URL if the local file doesn't exist
    esBg.src = "esports_banner.jpg";
}

/* ============================================================
   RIPPLE EFFECT on buttons
   ============================================================ */
document.addEventListener("click", function (e) {
    const target = e.target.closest(".btn-hero-primary, .btn-cta-primary, .btn-spotlight-primary, .btn-esports-primary");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    Object.assign(ripple.style, {
        position: "absolute", borderRadius: "50%",
        background: "rgba(255,255,255,0.25)", pointerEvents: "none",
        left: (e.clientX - rect.left) + "px", top: (e.clientY - rect.top) + "px",
        width: "0", height: "0", transform: "translate(-50%,-50%)",
        animation: "ripple-expand 0.6s ease-out forwards"
    });
    if (!target.style.position || target.style.position === "static") target.style.position = "relative";
    target.style.overflow = "hidden";
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
});

const rippleCSS = document.createElement("style");
rippleCSS.textContent = `@keyframes ripple-expand{to{width:200px;height:200px;opacity:0}}`;
document.head.appendChild(rippleCSS);

/* ============================================================
   CTA PARTICLE EFFECT
   ============================================================ */
(function initCtaParticles() {
    const container = document.getElementById("cta-particles");
    if (!container) return;
    for (let i = 0; i < 12; i++) {
        const dot = document.createElement("div");
        const size = Math.random() * 120 + 40;
        Object.assign(dot.style, {
            position: "absolute",
            width: size + "px", height: size + "px",
            borderRadius: "50%",
            background: `radial-gradient(circle,rgba(168,85,247,${Math.random() * 0.08 + 0.03}),transparent)`,
            left: Math.random() * 100 + "%", top: Math.random() * 100 + "%",
            transform: "translate(-50%,-50%)",
            animation: `float ${5 + Math.random() * 6}s ${Math.random() * 4}s ease-in-out infinite`,
            pointerEvents: "none"
        });
        container.appendChild(dot);
    }
})();

console.log("%c🎮 GameVerse v2.0 loaded!", "color:#a855f7;font-size:18px;font-weight:bold;");
