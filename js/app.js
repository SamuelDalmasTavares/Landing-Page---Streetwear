/* =========================================================
   ALTOSCORRE — app.js
   Catálogo, carrinho, filtros, modal, newsletter
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. CATÁLOGO DE PRODUTOS
  --------------------------------------------------------- */
  const PRODUCTS = [
    {
      id: "p1",
      name: "Tee Classic Split Branca",
      color: "white",
      category: ["white", "new"],
      price: 189.9,
      oldPrice: null,
      desc: "Camiseta branca oversized com estampa frontal minimalista e wordmark bicolor nas costas. Algodão 100% premium.",
      front: "assets/products/p1-front.jpg",
      back: "assets/products/p1-back.jpg",
      tags: ["NOVO"],
      sizes: { P: true, M: true, G: true, GG: true },
    },
    {
      id: "p2",
      name: "Tee Aurora Branca",
      color: "white",
      category: ["white", "limited"],
      price: 219.9,
      oldPrice: 249.9,
      desc: "Estampa gráfica em degradê pastel nas costas, inspirada nos murais da cena urbana ao amanhecer. Edição limitada.",
      front: "assets/products/p2-front.jpg",
      back: "assets/products/p2-back.jpg",
      tags: ["LIMITED EDITION"],
      sizes: { P: true, M: true, G: true, GG: false },
    },
    {
      id: "p3",
      name: "Tee Splash Preta",
      color: "black",
      category: ["black", "new"],
      price: 199.9,
      oldPrice: null,
      desc: "Base preta com respingos de cor nas costas — arte autoral em estilo graffiti splash. Caimento oversized.",
      front: "assets/products/p3-front.jpg",
      back: "assets/products/p3-back.jpg",
      tags: ["NOVO"],
      sizes: { P: true, M: true, G: true, GG: true },
    },
    {
      id: "p4",
      name: "Tee Bubble Branca Preta",
      color: "black",
      category: ["black"],
      price: 189.9,
      oldPrice: null,
      desc: "Wordmark bubble branco nas costas sobre base preta. Peça essencial pro dia a dia com atitude de rua.",
      front: "assets/products/p4-front.jpg",
      back: "assets/products/p4-back.jpg",
      tags: [],
      sizes: { P: true, M: false, G: true, GG: true },
    },
    {
      id: "p5",
      name: "Tee Aurora Preta",
      color: "black",
      category: ["black", "limited"],
      price: 229.9,
      oldPrice: 259.9,
      desc: "Versão preta da estampa Aurora, com tag exclusiva na manga. Produção limitada e numerada.",
      front: "assets/products/p5-front.jpg",
      back: "assets/products/p5-back.jpg",
      tags: ["LIMITED EDITION"],
      sizes: { P: true, M: true, G: false, GG: true },
    },
    {
      id: "p6",
      name: "Tee Concrete Drip Preta",
      color: "black",
      category: ["black", "limited", "new"],
      price: 239.9,
      oldPrice: null,
      desc: "Arte 3D estilo tijolo com efeito de tinta escorrendo. A peça mais icônica do Drop 01.",
      front: "assets/products/p6-front.jpg",
      back: "assets/products/p6-back.jpg",
      tags: ["NOVO", "LIMITED EDITION"],
      sizes: { P: true, M: true, G: true, GG: true },
    },
    {
      id: "p7",
      name: "Tee Splash Preta Signature",
      color: "black",
      category: ["black"],
      price: 199.9,
      oldPrice: null,
      desc: "Versão signature da Splash, com detalhes na manga e cabide autoral. Estoque reduzido.",
      front: "assets/products/p7-front.jpg",
      back: "assets/products/p7-back.jpg",
      tags: ["ESGOTADO"],
      sizes: { P: false, M: false, G: false, GG: false },
    },
    {
      id: "p8",
      name: "Tee Tricolor Branca",
      color: "white",
      category: ["white", "limited"],
      price: 219.9,
      oldPrice: null,
      desc: "Wordmark tricolor com contorno vermelho nas costas. Inspirada nas raízes da cultura de rua. Peça premium.",
      front: "assets/products/p8-front.jpg",
      back: "assets/products/p8-back.jpg",
      tags: ["LIMITED EDITION"],
      sizes: { P: true, M: true, G: true, GG: true },
    },
    {
      id: "p9",
      name: "Tee Bubble Black Branca",
      color: "white",
      category: ["white", "new"],
      price: 199.9,
      oldPrice: null,
      desc: "Base branca com estampa bubble preta e detalhe de smiley nas costas. Corte oversized premium.",
      front: "assets/products/p9-front.jpg",
      back: "assets/products/p9-back.jpg",
      tags: ["NOVO"],
      sizes: { P: true, M: true, G: true, GG: true },
    },
  ];

  const WHATSAPP_NUMBER = "555497032536";
  const SHIPPING_FLAT = 24.9;
  const FREE_SHIPPING_THRESHOLD = 350;

  const money = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  /* ---------------------------------------------------------
     2. ESTADO DO CARRINHO (localStorage)
  --------------------------------------------------------- */
  const CART_KEY = "altoscorre_cart_v1";

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      // Valida cada item contra o catálogo real — protege o innerHTML do
      // carrinho caso o localStorage seja adulterado (extensão maliciosa,
      // edição manual via devtools, etc.).
      return parsed.filter((line) => {
        if (!line || typeof line !== "object") return false;
        const product = PRODUCTS.find((p) => p.id === line.productId);
        if (!product || !product.sizes[line.size]) return false;
        return Number.isInteger(line.qty) && line.qty > 0 && line.qty <= 99;
      });
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      /* storage indisponível — segue sem persistir */
    }
  }

  let cart = loadCart();

  function findCartLine(productId, size) {
    return cart.find((l) => l.productId === productId && l.size === size);
  }

  function addToCart(productId, size, qty = 1) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product || !product.sizes[size]) return;

    const existing = findCartLine(productId, size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, size, qty });
    }
    saveCart(cart);
    renderCart();
    openCart();
    bumpBadge();
    showToast(`${product.name} (${size}) adicionado ao carrinho`);
  }

  function updateQty(productId, size, delta) {
    const line = findCartLine(productId, size);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
      cart = cart.filter((l) => l !== line);
    }
    saveCart(cart);
    renderCart();
  }

  function removeLine(productId, size) {
    cart = cart.filter((l) => !(l.productId === productId && l.size === size));
    saveCart(cart);
    renderCart();
  }

  function cartTotals() {
    let subtotal = 0;
    let count = 0;
    cart.forEach((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return;
      subtotal += product.price * line.qty;
      count += line.qty;
    });
    const shipping = count === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    return { subtotal, shipping, total: subtotal + shipping, count };
  }

  /* ---------------------------------------------------------
     3. RENDER — GRID DE PRODUTOS
  --------------------------------------------------------- */
  const productGrid = document.getElementById("productGrid");
  let activeFilter = "all";
  let searchQuery = "";
  const selectedSizes = {}; // productId -> size

  function tagClass(tag) {
    if (tag === "NOVO") return "tag--new";
    if (tag === "LIMITED EDITION") return "tag--limited";
    if (tag === "ESGOTADO") return "tag--soldout";
    return "";
  }

  function renderProducts() {
    const list = PRODUCTS.filter((p) => {
      const matchesFilter = activeFilter === "all" || p.category.includes(activeFilter);
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    });

    if (list.length === 0) {
      productGrid.innerHTML = `<p style="grid-column:1/-1;padding:60px 0;text-align:center;color:var(--gray-2);">Nenhum produto encontrado.</p>`;
      return;
    }

    productGrid.innerHTML = list
      .map((p, i) => {
        const isSoldOut = p.tags.includes("ESGOTADO");
        const selected = selectedSizes[p.id] || null;

        const sizesHtml = ["P", "M", "G", "GG"]
          .map((s) => {
            const available = p.sizes[s] && !isSoldOut;
            const isSel = selected === s;
            return `<button class="size-btn ${isSel ? "is-selected" : ""}"
                      data-size="${s}" data-product="${p.id}"
                      ${available ? "" : "disabled"}>${s}</button>`;
          })
          .join("");

        const tagsHtml = p.tags
          .map((t) => `<span class="tag ${tagClass(t)}">${t}</span>`)
          .join("");

        return `
        <article class="card" data-id="${p.id}" data-reveal style="--i:${i}">
          <div class="card__media" data-quickview="${p.id}" data-tilt>
            <div class="card__tags">${tagsHtml}</div>
            ${isSoldOut ? `<div class="card__soldout-overlay"><span>ESGOTADO</span></div>` : ""}
            <div class="card__tilt">
              <img class="card__img card__img--front" src="${p.front}" alt="${p.name} - frente" loading="lazy">
              <img class="card__img card__img--back" src="${p.back}" alt="${p.name} - verso" loading="lazy">
            </div>
            <button class="card__quickview" aria-label="Ver detalhes" data-quickview-btn="${p.id}">
              <svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
            </button>
          </div>
          <div class="card__body">
            <h3 class="card__name">${p.name}</h3>
            <p class="card__desc">${p.desc}</p>
            <div class="card__sizes">${sizesHtml}</div>
            <div class="card__footer">
              <div class="card__price">
                ${money(p.price)}
                ${p.oldPrice ? `<small>${money(p.oldPrice)}</small>` : ""}
              </div>
              <button class="add-to-cart-btn" data-add="${p.id}" ${isSoldOut ? "disabled" : ""}>
                ${isSoldOut ? "ESGOTADO" : "ADICIONAR"}
              </button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    observeReveals();
  }

  productGrid.addEventListener("click", (e) => {
    const sizeBtn = e.target.closest(".size-btn");
    if (sizeBtn && !sizeBtn.disabled) {
      selectedSizes[sizeBtn.dataset.product] = sizeBtn.dataset.size;
      renderProducts();
      return;
    }

    const addBtn = e.target.closest(".add-to-cart-btn");
    if (addBtn && !addBtn.disabled) {
      const pid = addBtn.dataset.add;
      const size = selectedSizes[pid];
      if (!size) {
        showToast("Selecione um tamanho antes de adicionar");
        return;
      }
      addToCart(pid, size, 1);
      addBtn.classList.add("is-added");
      addBtn.textContent = "ADICIONADO ✓";
      setTimeout(() => {
        addBtn.classList.remove("is-added");
        addBtn.textContent = "ADICIONAR";
      }, 1400);
      return;
    }

    const quickviewBtn = e.target.closest("[data-quickview-btn]");
    const mediaClick = e.target.closest(".card__media");
    if (quickviewBtn) {
      openModal(quickviewBtn.dataset.quickviewBtn);
    } else if (mediaClick && !e.target.closest(".size-btn")) {
      openModal(mediaClick.dataset.quickview);
    }
  });

  document.getElementById("filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    renderProducts();
    updateFiltersIndicator();
  });

  /* ---------------------------------------------------------
     4. QUICK VIEW MODAL
  --------------------------------------------------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");

  function openModal(productId) {
    const p = PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    const isSoldOut = p.tags.includes("ESGOTADO");
    const selected = selectedSizes[p.id] || null;

    const sizesHtml = ["P", "M", "G", "GG"]
      .map((s) => {
        const available = p.sizes[s] && !isSoldOut;
        const isSel = selected === s;
        return `<button class="size-btn ${isSel ? "is-selected" : ""}"
                  data-size="${s}" data-product="${p.id}"
                  ${available ? "" : "disabled"}>${s}</button>`;
      })
      .join("");

    modalContent.innerHTML = `
      <div class="modal-media">
        <img class="is-front" src="${p.front}" alt="${p.name} - frente">
        <img class="is-back" src="${p.back}" alt="${p.name} - verso">
      </div>
      <div class="modal-details">
        <span class="section-eyebrow">ALTOSCORRE</span>
        <h2>${p.name}</h2>
        <div class="modal-details__price">
          ${money(p.price)} ${p.oldPrice ? `<small style="text-decoration:line-through;color:var(--gray-2);font-size:16px;">${money(p.oldPrice)}</small>` : ""}
        </div>
        <p class="modal-details__desc">${p.desc}</p>
        <div>
          <div class="modal-details__label">TAMANHO</div>
          <div class="card__sizes" style="margin-top:8px;">${sizesHtml}</div>
        </div>
        <button class="btn btn--full" data-add="${p.id}" ${isSoldOut ? "disabled" : ""} style="margin-top:10px;">
          ${isSoldOut ? "ESGOTADO" : "ADICIONAR AO CARRINHO"}
        </button>
      </div>
    `;
    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  modalContent.addEventListener("click", (e) => {
    const sizeBtn = e.target.closest(".size-btn");
    if (sizeBtn && !sizeBtn.disabled) {
      selectedSizes[sizeBtn.dataset.product] = sizeBtn.dataset.size;
      openModal(sizeBtn.dataset.product);
      renderProducts();
      return;
    }
    const addBtn = e.target.closest("[data-add]");
    if (addBtn && !addBtn.disabled) {
      const pid = addBtn.dataset.add;
      const size = selectedSizes[pid];
      if (!size) {
        showToast("Selecione um tamanho antes de adicionar");
        return;
      }
      addToCart(pid, size, 1);
      closeModal();
    }
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* ---------------------------------------------------------
     5. CART DRAWER
  --------------------------------------------------------- */
  const cartDrawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");
  const cartItemsEl = document.getElementById("cartItems");
  const cartBadge = document.getElementById("cartBadge");

  function openCart() {
    cartDrawer.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartDrawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function bumpBadge() {
    cartBadge.classList.add("bump");
    setTimeout(() => cartBadge.classList.remove("bump"), 250);
  }

  function renderCart() {
    const { subtotal, shipping, total, count } = cartTotals();

    cartBadge.textContent = `[ ${count} ]`;
    cartDrawer.classList.toggle("is-empty", cart.length === 0);

    cartItemsEl.innerHTML = cart
      .map((line) => {
        const p = PRODUCTS.find((x) => x.id === line.productId);
        if (!p) return "";
        return `
        <div class="cart-item" data-product="${p.id}" data-size="${line.size}">
          <img class="cart-item__img" src="${p.front}" alt="${p.name}">
          <div class="cart-item__info">
            <div class="cart-item__name">${p.name}</div>
            <div class="cart-item__meta">Tamanho: ${line.size}</div>
            <div class="cart-item__price">${money(p.price * line.qty)}</div>
            <div class="cart-item__qty">
              <button class="qty-btn" data-qty="-1">−</button>
              <span>${line.qty}</span>
              <button class="qty-btn" data-qty="1">+</button>
            </div>
          </div>
          <div class="cart-item__actions">
            <button class="remove-btn" data-remove>REMOVER</button>
          </div>
        </div>`;
      })
      .join("");

    document.getElementById("cartSubtotal").textContent = money(subtotal);
    document.getElementById("cartShipping").textContent =
      cart.length === 0 ? money(0) : shipping === 0 ? "GRÁTIS" : money(shipping);
    document.getElementById("cartTotal").textContent = money(total);
  }

  cartItemsEl.addEventListener("click", (e) => {
    const item = e.target.closest(".cart-item");
    if (!item) return;
    const pid = item.dataset.product;
    const size = item.dataset.size;

    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      updateQty(pid, size, parseInt(qtyBtn.dataset.qty, 10));
      return;
    }
    if (e.target.closest("[data-remove]")) {
      removeLine(pid, size);
    }
  });

  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    const { subtotal, shipping, total } = cartTotals();
    const lines = cart
      .map((line) => {
        const p = PRODUCTS.find((x) => x.id === line.productId);
        return `• ${p.name} (Tam. ${line.size}) x${line.qty} — ${money(p.price * line.qty)}`;
      })
      .join("\n");

    const message =
      `PEDIDO ALTOSCORRE\n\n${lines}\n\n` +
      `Subtotal: ${money(subtotal)}\n` +
      `Frete: ${shipping === 0 ? "Grátis" : money(shipping)}\n` +
      `Total: ${money(total)}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });

  /* ---------------------------------------------------------
     6. HEADER — scroll behavior + search
  --------------------------------------------------------- */
  const header = document.getElementById("header");
  let lastScroll = 0;

  const scrollProgress = document.getElementById("scrollProgress");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("header--scrolled", y > 10);
    if (y > lastScroll && y > 200) {
      header.classList.add("header--hidden");
    } else {
      header.classList.remove("header--hidden");
    }
    lastScroll = y;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + "%";
  });

  const searchBar = document.getElementById("searchBar");
  const searchInput = document.getElementById("searchInput");

  document.getElementById("searchBtn").addEventListener("click", () => {
    searchBar.classList.toggle("is-open");
    if (searchBar.classList.contains("is-open")) {
      setTimeout(() => searchInput.focus(), 200);
    }
  });
  document.getElementById("searchClose").addEventListener("click", () => {
    searchBar.classList.remove("is-open");
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderProducts();
  });

  /* ---------------------------------------------------------
     7. MOBILE NAV
  --------------------------------------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("is-active");
    mobileNav.classList.toggle("is-open");
    document.body.style.overflow = mobileNav.classList.contains("is-open") ? "hidden" : "";
  });

  document.querySelectorAll(".mobile-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("is-active");
      mobileNav.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  /* ---------------------------------------------------------
     8. NEWSLETTER
  --------------------------------------------------------- */
  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value.trim();
    const msg = document.getElementById("newsletterMsg");
    if (!email) return;
    msg.textContent = "Você entrou pra lista VIP. Fique de olho no seu e-mail! 🔥";
    document.getElementById("newsletterEmail").value = "";
    setTimeout(() => (msg.textContent = ""), 5000);
  });

  /* ---------------------------------------------------------
     9. TOAST
  --------------------------------------------------------- */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  /* ---------------------------------------------------------
     10. PRELOADER
  --------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  const preloaderFill = document.getElementById("preloaderFill");
  const preloaderPct = document.getElementById("preloaderPct");

  document.body.classList.add("is-loading");
  let loadProgress = 0;
  const progressTimer = setInterval(() => {
    loadProgress = Math.min(loadProgress + Math.random() * 22, 92);
    preloaderFill.style.width = loadProgress + "%";
    preloaderPct.textContent = Math.round(loadProgress) + "%";
  }, 150);

  window.addEventListener("load", () => {
    clearInterval(progressTimer);
    preloaderFill.style.width = "100%";
    preloaderPct.textContent = "100%";
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, 350);
  });

  /* ---------------------------------------------------------
     11. CUSTOM CURSOR
  --------------------------------------------------------- */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isFinePointer) {
    document.documentElement.classList.add("has-custom-cursor");
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    })();

    const hoverSelector = "a, button, input, .card__media, .size-btn, [data-tilt]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSelector)) cursorRing.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelector)) cursorRing.classList.remove("is-hover");
    });
    document.addEventListener("mousedown", () => cursorRing.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursorRing.classList.remove("is-down"));
  }

  /* ---------------------------------------------------------
     12. SCROLL REVEAL
  --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  function observeReveals() {
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Fallback: alguns navegadores/telas atrasam o primeiro tick do IntersectionObserver.
  // Este check por scroll garante que o conteúdo sempre apareça.
  function checkRevealsFallback() {
    const vh = window.innerHeight;
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        el.classList.add("is-visible");
      }
    });
  }
  window.addEventListener("scroll", checkRevealsFallback, { passive: true });
  window.addEventListener("load", checkRevealsFallback);

  /* ---------------------------------------------------------
     13. MAGNETIC BUTTONS
  --------------------------------------------------------- */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

  /* ---------------------------------------------------------
     14. ANIMATED STAT COUNTERS
  --------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!("noAnimate" in entry.target.dataset)) animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-counter]").forEach((el) => counterObserver.observe(el));

  /* ---------------------------------------------------------
     15. HERO SPOTLIGHT
  --------------------------------------------------------- */
  const heroSection = document.getElementById("hero");
  const heroSpotlight = document.getElementById("heroSpotlight");
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSpotlight.style.setProperty("--x", x + "%");
    heroSpotlight.style.setProperty("--y", y + "%");
  });

  /* ---------------------------------------------------------
     16. PRODUCT CARD 3D TILT
  --------------------------------------------------------- */
  productGrid.addEventListener("mousemove", (e) => {
    const media = e.target.closest("[data-tilt]");
    if (!media) return;
    const tilt = media.querySelector(".card__tilt");
    if (!tilt) return;
    const rect = media.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-py * 14).toFixed(2);
    const ry = (px * 14).toFixed(2);
    tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  productGrid.addEventListener("mouseout", (e) => {
    const media = e.target.closest("[data-tilt]");
    if (!media || media.contains(e.relatedTarget)) return;
    const tilt = media.querySelector(".card__tilt");
    if (!tilt) return;
    tilt.style.transform = "";
  });

  /* ---------------------------------------------------------
     17. FILTER PILL INDICATOR
  --------------------------------------------------------- */
  const filtersIndicator = document.getElementById("filtersIndicator");
  function updateFiltersIndicator() {
    const activeBtn = document.querySelector(".filter-btn.is-active");
    if (!activeBtn || !filtersIndicator) return;
    filtersIndicator.style.width = activeBtn.offsetWidth + "px";
    filtersIndicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
  }
  window.addEventListener("resize", updateFiltersIndicator);

  /* ---------------------------------------------------------
     18. INIT
  --------------------------------------------------------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  renderProducts();
  renderCart();
  updateFiltersIndicator();
})();
