const products = [
  { id: 1, name: "Apel Fuji Premium", category: "lokal", price: 35000, unit: "kg", rating: 4.8, reviews: 124, tag: "Terlaris",
    img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500",
    desc: "Apel Fuji segar langsung dari kebun pilihan. Manis, renyah, dan kaya vitamin C. Cocok untuk camilan sehat keluarga." },
  { id: 2, name: "Pisang Cavendish", category: "lokal", price: 25000, unit: "kg", rating: 4.7, reviews: 98, tag: "Promo",
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500",
    desc: "Pisang cavendish matang sempurna. Kaya kalium dan energi instan. Ideal untuk sarapan atau smoothie." },
  { id: 3, name: "Jeruk Mandarin", category: "impor", price: 45000, unit: "kg", rating: 4.9, reviews: 156, tag: "Premium",
    img: "https://images.unsplash.com/photo-1547514701-42782101795e?w=500",
    desc: "Jeruk mandarin impor dengan rasa manis segar tanpa biji. Kulit mudah dikupas, cocok untuk seluruh keluarga." },
  { id: 4, name: "Stroberi Segar", category: "lokal", price: 55000, unit: "pack", rating: 4.6, reviews: 87, tag: "Organik",
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500",
    desc: "Stroberi organik segar dipetik pagi hari. Aroma harum dan rasa asam-manis yang menyegarkan." },
  { id: 5, name: "Mangga Harum Manis", category: "lokal", price: 30000, unit: "kg", rating: 4.8, reviews: 203, tag: "Musiman",
    img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500",
    desc: "Mangga harum manis khas Indonesia. Daging tebal, manis, dan beraroma khas tropis." },
  { id: 6, name: "Anggur Red Globe", category: "impor", price: 75000, unit: "kg", rating: 4.7, reviews: 64, tag: "Impor",
    img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500",
    desc: "Anggur merah impor dengan biji, rasa manis dan segar. Kaya antioksidan untuk kesehatan jantung." },
  { id: 7, name: "Semangka Tanpa Biji", category: "lokal", price: 20000, unit: "kg", rating: 4.5, reviews: 142, tag: "Segar",
    img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500",
    desc: "Semangka tanpa biji yang menyegarkan. Kandungan air tinggi, cocok untuk cuaca panas." },
  { id: 8, name: "Nanas Madu", category: "lokal", price: 28000, unit: "buah", rating: 4.6, reviews: 76, tag: "Manis",
    img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500",
    desc: "Nanas madu dengan rasa manis alami. Kaya enzim bromelain untuk pencernaan." }
];

function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartBadge(); }

function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; } 
  else { cart.push({ ...product, qty }); }
  saveCart(cart);
  showToast(`${product.name} ditambahkan ke keranjang!`);
}

function removeFromCart(productId) {
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  if (document.querySelector('.cart-items')) renderCart();
}

function updateQty(productId, qty) {
  if (qty < 1) return removeFromCart(productId);
  const cart = getCart();  const item = cart.find(i => i.id === productId);
  if (item) { item.qty = qty; saveCart(cart); if (document.querySelector('.cart-items')) renderCart(); }
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = total);
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2500);
}

function rupiah(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

function renderProducts(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (list.length === 0) { container.innerHTML = '<p style="text-align:center;color:var(--muted);grid-column:1/-1;">Produk tidak ditemukan.</p>'; return; }
  container.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">
        <a href="detail-produk.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a>
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))}<span>(${p.reviews})</span></div>
        <div class="product-price">${rupiah(p.price)} <small>/ ${p.unit}</small></div>
        <div class="product-actions">
          <a href="detail-produk.html?id=${p.id}" class="btn btn-outline">Detail</a>
          <button class="btn btn-primary" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Beli</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.querySelector('.cart-items');
  const summaryEl = document.querySelector('.cart-summary');  if (!itemsEl) return;
  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-basket"></i><h3>Keranjang Kosong</h3><p>Yuk, mulai belanja buah segar!</p><a href="produk.html" class="btn btn-primary" style="margin-top:15px;">Belanja Sekarang</a></div>`;
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div><h4>${item.name}</h4><p class="item-price">${rupiah(item.price)} / ${item.unit}</p></div>
      <div class="qty-control">
        <button onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>
        <input type="number" value="${item.qty}" min="1" onchange="updateQty(${item.id}, parseInt(this.value))">
        <button onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
      </div>
      <div class="item-price">${rupiah(item.price * item.qty)}</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const ongkir = subtotal > 100000 ? 0 : 15000;
  const total = subtotal + ongkir;
  if (summaryEl) {
    summaryEl.style.display = 'block';
    summaryEl.innerHTML = `<h3>Ringkasan Belanja</h3><div class="summary-row"><span>Subtotal</span><span>${rupiah(subtotal)}</span></div><div class="summary-row"><span>Ongkos Kirim</span><span>${ongkir === 0 ? 'GRATIS' : rupiah(ongkir)}</span></div><div class="summary-row total"><span>Total</span><span>${rupiah(total)}</span></div><button class="btn btn-accent" onclick="checkout()"><i class="fas fa-credit-card"></i> Checkout</button>`;
  }
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;
  showToast('Pesanan berhasil! Terima kasih telah berbelanja.');
  localStorage.removeItem('cart');
  updateCartBadge();
  setTimeout(() => { window.location.href = 'index.html'; }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  const toggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');
  if (toggle) { toggle.addEventListener('click', () => navList.classList.toggle('show')); }
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => { if (a.getAttribute('href') === current) a.classList.add('active'); });
  if (document.getElementById('featured-products')) renderProducts('featured-products', products.slice(0, 4));
  if (document.getElementById('all-products')) renderProducts('all-products', products);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');      const cat = btn.dataset.cat;
      const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
      renderProducts('all-products', filtered);
    });
  });
  if (document.getElementById('detail-container')) {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const p = products.find(x => x.id === id);
    if (p) {
      document.getElementById('detail-container').innerHTML = `
        <div class="detail-img"><img src="${p.img}" alt="${p.name}"></div>
        <div class="detail-info">
          <span class="product-tag" style="display:inline-block;margin-bottom:10px;">${p.tag}</span>
          <h1>${p.name}</h1>
          <div class="product-rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5-Math.round(p.rating))}<span>(${p.reviews} ulasan)</span></div>
          <div class="price">${rupiah(p.price)} <small style="color:var(--muted);font-size:1rem;">/ ${p.unit}</small></div>
          <p class="desc">${p.desc}</p>
          <div class="qty-control">
            <span style="font-weight:500;">Jumlah:</span>
            <button onclick="changeDetailQty(-1)">−</button>
            <input type="number" id="detail-qty" value="1" min="1">
            <button onclick="changeDetailQty(1)">+</button>
          </div>
          <div class="detail-actions">
            <button class="btn btn-primary" onclick="addToCart(${p.id}, parseInt(document.getElementById('detail-qty').value))"><i class="fas fa-cart-plus"></i> Tambah ke Keranjang</button>
            <a href="keranjang.html" class="btn btn-accent"><i class="fas fa-shopping-bag"></i> Beli Sekarang</a>
          </div>
        </div>`;
    } else { document.getElementById('detail-container').innerHTML = '<p class="empty-state">Produk tidak ditemukan.</p>'; }
  }
  if (document.querySelector('.cart-items')) renderCart();
  const form = document.getElementById('contact-form');
  if (form) { form.addEventListener('submit', e => { e.preventDefault(); showToast('Pesan Anda telah terkirim!'); form.reset(); }); }
});

function changeDetailQty(delta) {
  const input = document.getElementById('detail-qty');
  const val = parseInt(input.value) + delta;
  if (val >= 1) input.value = val;
    }
