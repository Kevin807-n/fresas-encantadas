// --- Navegación de pantallas ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  if(id === 'menu') renderCatalogo();
  if(id === 'personaliza') renderCarrito();
  if(id === 'datos') {
    renderResumen();
    window.scrollTo(0,0);
  }
  if(id === 'landing') window.scrollTo(0,0);
}

function formatoCOP(num) {
  return '$' + num.toLocaleString('es-CO') + ' COP';
}

// --- Carrusel landing ---
(function(){
  const slides = document.querySelectorAll('.carrusel-slide');
  const dotsContainer = document.querySelector('.carrusel-dots');
  let currentSlide = 0;
  let carruselTimer;

  function showSlide(n) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === n);
      if (dotsContainer && dotsContainer.children[i])
        dotsContainer.children[i].classList.toggle('active', i === n);
    });
    currentSlide = n;
  }
  function nextSlide() { showSlide((currentSlide + 1) % slides.length);}
  function prevSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length);}
  if (dotsContainer) {
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('span');
      dot.onclick = () => { showSlide(i); resetTimer(); };
      dotsContainer.appendChild(dot);
    }
  }
  if (slides.length) showSlide(0);
  function resetTimer() {
    clearInterval(carruselTimer);
    carruselTimer = setInterval(nextSlide, 4200);
  }
  document.querySelector('.carrusel-btn.prev').onclick = () => { prevSlide(); resetTimer(); };
  document.querySelector('.carrusel-btn.next').onclick = () => { nextSlide(); resetTimer(); };
  resetTimer();
})();

// --- Configuración de productos --- 
const tamanos = {
  "Chico": { precio: 9000, img: "img/peque.jpg" },
  "Mediano": { precio: 12000, img: "img/media.jpg" },
  "Grande": { precio: 16000, img: "img/gran.jpeg" }
};
const toppings = [
  { nombre: "Chocolatina", precio: 1000 },
  { nombre: "Chocorramo", precio: 1000 },
  { nombre: "Maní", precio: 1000 },
  { nombre: "Queso", precio: 1000 },
  { nombre: "Oreo", precio: 1000 },
  { nombre: "Quipitos", precio: 1000 }
];
const salsas = [
  { nombre: "Salsa de Chocolate", precio: 0 },
  { nombre: "Leche condensada", precio: 0 },
  { nombre: "Salsa de Fresa", precio: 0 }
];
let carrito = [];

// --- Catálogo de productos prediseñados ---
const catalogo = [
  {
    nombre: "Fresas Opitas",
    descripcion: "Fresas con crema, queso rallado y leche condensada.",
    img: "img/vaso3.jpg"
  },
  {
    nombre: "Fresas Nevadas",
    descripcion: "Fresas con crema y quipito.",
    img: "img/vaso1.jpg"
  },
  {
    nombre: "Fresas Clásicas",
    descripcion: "Fresas con crema y chocolatina.",
    img: "img/vaso2.jpg"
  }
];

// --- Render catálogo ---
function renderCatalogo() {
  const lista = document.getElementById('catalogo-lista');
  if (!lista) return;
  lista.innerHTML = '';
  catalogo.forEach((producto, prodIdx) => {
    const div = document.createElement('div');
    div.className = 'producto-catalogo';
    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <div class="tamano-catalogo-btns">
        <button onclick="agregarCatalogoAlCarrito(${prodIdx}, 'Chico')">Chico<br><span>${formatoCOP(tamanos['Chico'].precio)}</span></button>
        <button onclick="agregarCatalogoAlCarrito(${prodIdx}, 'Mediano')">Mediano<br><span>${formatoCOP(tamanos['Mediano'].precio)}</span></button>
        <button onclick="agregarCatalogoAlCarrito(${prodIdx}, 'Grande')">Grande<br><span>${formatoCOP(tamanos['Grande'].precio)}</span></button>
      </div>
    `;
    lista.appendChild(div);
  });
}

// --- Agregar producto del catálogo al carrito ---
function agregarCatalogoAlCarrito(prodIdx, tamano) {
  const producto = catalogo[prodIdx];
  const precioU = tamanos[tamano].precio;
  const total = precioU;
  carrito.push({
    t: tamano,
    toppingsSel: [],
    salsasSel: [],
    cant: 1,
    precioU,
    total,
    toppingsDesglose: '',
    salsasDesglose: '',
    nombreCatalogo: producto.nombre
  });
  animFlyToCartMenu(producto.img);
  renderCarrito();
  actualizarContadorCarrito();
}

// --- Tamaño (Personaliza) ---
document.querySelectorAll('.tamano-btn').forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll('.tamano-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const t = this.getAttribute('data-tamano');
    document.getElementById('img-tamano').src = tamanos[t].img;
  };
});
document.querySelector('.tamano-btn[data-tamano="Chico"]').classList.add('active');
document.getElementById('img-tamano').src = 'img/peque.jpg';

// --- Render toppings con primero gratis --- 
function renderToppings() {
  const container = document.getElementById('toppings-list');
  container.innerHTML = '';
  toppings.forEach((t) => {
    const div = document.createElement('div');
    div.className = 'topping';
    div.innerHTML = `${t.nombre}<span class="costo">+ ${formatoCOP(t.precio)}</span>`;
    div.onclick = () => {
      div.classList.toggle('selected');
      actualizarToppingsGratis();
    };
    container.appendChild(div);
  });
}
function actualizarToppingsGratis() {
  const selected = Array.from(document.querySelectorAll('.topping.selected'));
  const toppingsDivs = Array.from(document.querySelectorAll('.topping'));
  toppingsDivs.forEach((div, i) => {
    const toppingName = toppings[i].nombre;
    const idx = selected.findIndex(sel => sel.textContent.includes(toppingName));
    const costoElem = div.querySelector('.costo');
    if (idx === 0 && selected.length) {
      costoElem.textContent = 'Gratis';
    } else {
      costoElem.textContent = '+ ' + formatoCOP(toppings[i].precio);
    }
  });
}
renderToppings();

// --- Render salsas ---
function renderSalsas() {
  const container = document.getElementById('salsas-list');
  container.innerHTML = '';
  salsas.forEach((s) => {
    const div = document.createElement('div');
    div.className = 'salsa';
    div.innerHTML = `${s.nombre}<span class="costo">Gratis</span>`;
    div.onclick = () => div.classList.toggle('selected');
    container.appendChild(div);
  });
}
renderSalsas();

// --- Agregar al carrito + Animación (Personaliza) ---
document.getElementById('agregar-carrito').onclick = function() {
  const activeTamano = document.querySelector('.tamano-btn.active');
  if (!activeTamano) {
    alert('Por favor selecciona un tamaño.');
    return;
  }
  const t = activeTamano.getAttribute('data-tamano');
  const cant = parseInt(document.getElementById('cantidad').value, 10) || 1;
  let toppingsSel = Array.from(document.querySelectorAll('.topping.selected')).map(d => d.childNodes[0].data.trim());
  let salsasSel = Array.from(document.querySelectorAll('.salsa.selected')).map(d => d.childNodes[0].data.trim());

  let precioToppings = 0;
  if (toppingsSel.length > 1) {
    precioToppings = (toppingsSel.length - 1) * 1000;
  }
  let precioSalsas = 0;
  const precioU = tamanos[t].precio + precioToppings + precioSalsas;
  const total = precioU * cant;

  let toppingsDesglose = '';
  if (toppingsSel.length) {
    toppingsDesglose = `<br><small>Toppings: <b>${toppingsSel[0]}</b> (gratis)${
      toppingsSel.length>1 ? ', ' + toppingsSel.slice(1).map(n=>`${n} (+${formatoCOP(1000)})`).join(', ') : ''
    }</small>`;
  }
  let salsasDesglose = '';
  if (salsasSel.length) {
    salsasDesglose = `<br><small>Salsas: ${salsasSel.map(n=>`${n} (Gratis)`).join(', ')}</small>`;
  }

  carrito.push({ t, toppingsSel, salsasSel, cant, precioU, total, toppingsDesglose, salsasDesglose });

  // --- Animación: fly to cart ---
  const img = document.getElementById('img-tamano');
  animFlyToCartPersonaliza(img);

  document.getElementById('cantidad').value = 1;
  document.querySelectorAll('.topping.selected, .salsa.selected').forEach(d=>d.classList.remove('selected'));
  actualizarToppingsGratis();
  document.getElementById('terminar-pedido').style.display = 'inline-block';

  renderCarrito();
  actualizarContadorCarrito();
};

// Animación fly-to-cart para personaliza
function animFlyToCartPersonaliza(img) {
  const fly = document.getElementById('fly-img');
  fly.innerHTML = '';
  fly.style.display = 'none';
  fly.style.transform = '';
  fly.style.transition = 'none';

  if (img && img.src) {
    fly.innerHTML = `<img src="${img.src}">`;
    const rect = img.getBoundingClientRect();
    fly.style.left = rect.left + 'px';
    fly.style.top = rect.top + 'px';
    fly.style.width = rect.width + 'px';
    fly.style.height = rect.height + 'px';
    fly.style.display = 'block';

    setTimeout(()=>{
      fly.style.transition = 'all 0.7s cubic-bezier(.4,2,.3,1)';
      const cartIcon = document.querySelector('.icon-cart') || document.getElementById('nav-carrito');
      const cartRect = cartIcon.getBoundingClientRect();
      fly.style.left = (cartRect.left + cartRect.width/2 - rect.width/2) + 'px';
      fly.style.top = (cartRect.top + cartRect.height/2 - rect.height/2) + 'px';
      fly.style.width = '28px';
      fly.style.height = '28px';
      fly.style.transform = 'scale(0.3)';
      setTimeout(()=>{
        fly.style.display = 'none';
        fly.innerHTML = '';
        fly.style.transform = '';
        fly.style.transition = 'none';
      }, 700);
    },10);
  }
}

// Animación fly-to-cart para agregar desde Menú
function animFlyToCartMenu(imgSrc) {
  const fly = document.getElementById('fly-img');
  fly.innerHTML = '';
  fly.style.display = 'none';
  fly.style.transform = '';
  fly.style.transition = 'none';

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    fly.appendChild(img);
    // Usamos el primer producto del menú para estimar posición
    const prod = document.querySelector('.producto-catalogo img[src="'+imgSrc+'"]');
    if (prod) {
      const rect = prod.getBoundingClientRect();
      fly.style.left = rect.left + 'px';
      fly.style.top = rect.top + 'px';
      fly.style.width = rect.width + 'px';
      fly.style.height = rect.height + 'px';
      fly.style.display = 'block';
      setTimeout(()=>{
        fly.style.transition = 'all 0.7s cubic-bezier(.4,2,.3,1)';
        const cartIcon = document.querySelector('.icon-cart') || document.getElementById('nav-carrito');
        const cartRect = cartIcon.getBoundingClientRect();
        fly.style.left = (cartRect.left + cartRect.width/2 - rect.width/2) + 'px';
        fly.style.top = (cartRect.top + cartRect.height/2 - rect.height/2) + 'px';
        fly.style.width = '28px';
        fly.style.height = '28px';
        fly.style.transform = 'scale(0.3)';
        setTimeout(()=>{
          fly.style.display = 'none';
          fly.innerHTML = '';
          fly.style.transform = '';
          fly.style.transition = 'none';
        }, 700);
      },10);
    }
  }
}

// --- Carrito modal (FUNCIONAL EN TODAS LAS PANTALLAS) ---
window.mostrarCarrito = function() {
  renderCarrito();
  document.getElementById('modal-carrito').style.display = 'flex';
};
window.cerrarCarrito = function() {
  document.getElementById('modal-carrito').style.display = 'none';
  limpiarFlyImg();
};
function limpiarFlyImg() {
  const fly = document.getElementById('fly-img');
  fly.style.display = 'none';
  fly.innerHTML = '';
  fly.style.transform = '';
  fly.style.transition = 'none';
}
function renderCarrito() {
  const list = document.getElementById('carrito-list');
  if(!list) return;
  list.innerHTML = '';
  if(!carrito.length) {
    list.innerHTML = '<p>Tu carrito está vacío.</p>';
    document.getElementById('carrito-total').innerHTML = '';
    return;
  }
  carrito.forEach((item, idx) => {
    const nombre = item.nombreCatalogo ? `<b>${item.nombreCatalogo}</b> (${item.t})` : `<b>${item.t}</b>`;
    list.innerHTML += `
      <div class="carrito-item">
        <span>
          ${nombre} x${item.cant}
          ${item.toppingsDesglose || ''}
          ${item.salsasDesglose || ''}
          <br><small>Subtotal: ${formatoCOP(item.total)}</small>
        </span>
        <button title="Eliminar" onclick="eliminarDelCarrito(${idx})">&times;</button>
      </div>
    `;
  });
  const total = carrito.reduce((acc, item) => acc+item.total, 0);
  document.getElementById('carrito-total').innerHTML = `Total: ${formatoCOP(total)}`;
}
window.eliminarDelCarrito = function(idx) {
  carrito.splice(idx,1);
  renderCarrito();
  actualizarContadorCarrito();
};

// --- Contador del carrito en nav ---
function actualizarContadorCarrito() {
  var count = carrito.reduce((sum, item) => sum + (item.cant || 1), 0);
  var el = document.getElementById('carrito-count');
  if(el) el.textContent = count;
}

// --- Resumen y formulario datos ---
function renderResumen() {
  const resumen = document.getElementById('resumen-pedido');
  if (!resumen) return;
  if (!carrito.length) {
    resumen.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }
  resumen.innerHTML = '';
  let total = 0;
  carrito.forEach(item => {
    const nombre = item.nombreCatalogo ? `<b>${item.nombreCatalogo}</b> (${item.t})` : `<b>${item.t}</b>`;
    resumen.innerHTML += `
      <div style="margin-bottom:1em;">
        ${nombre} x${item.cant}
        ${item.toppingsDesglose||''}
        ${item.salsasDesglose||''}
        <br><small>Subtotal: ${formatoCOP(item.total)}</small>
      </div>
    `;
    total += item.total;
  });
  resumen.innerHTML += `<div style="text-align:right;font-weight:bold;">Total: ${formatoCOP(total)}</div>`;
}

// Mostrar dirección solo si es a domicilio
document.getElementById('tipo-entrega').onchange = function() {
  document.getElementById('direccion-div').style.display = (this.value==="Domicilio") ? 'block' : 'none';
};

// Validar y enviar por WhatsApp
document.getElementById('form-datos').onsubmit = function(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const tipoEntrega = document.getElementById('tipo-entrega').value;
  const direccion = document.getElementById('direccion').value.trim();
  const fecha = document.getElementById('fecha').value;
  const notas = document.getElementById('notas').value.trim();

  if (!nombre || !telefono || !tipoEntrega || !fecha) {
    alert("Por favor llena todos los campos obligatorios.");
    return;
  }
  if (tipoEntrega === "Domicilio" && !direccion) {
    alert("Por favor ingresa tu dirección.");
    return;
  }

  let mensaje = "¡Hola! Quiero pedir:\n";
  carrito.forEach(item => {
    const nombre = item.nombreCatalogo ? `${item.nombreCatalogo} (${item.t})` : item.t;
    mensaje += `- ${nombre} x${item.cant}\n`;
    if(item.toppingsSel && item.toppingsSel.length) {
      mensaje += `  Toppings: ${item.toppingsSel[0]} (gratis)`;
      if(item.toppingsSel.length > 1) {
        mensaje += ', ' + item.toppingsSel.slice(1).map(n=>`${n} (+${formatoCOP(1000)})`).join(', ');
      }
      mensaje += `\n`;
    }
    if(item.salsasSel && item.salsasSel.length) {
      mensaje += `  Salsas: ${item.salsasSel.map(n=>`${n} (Gratis)`).join(', ')}\n`;
    }
    mensaje += `  Subtotal: ${formatoCOP(item.total)}\n`;
  });
  const total = carrito.reduce((acc, item) => acc+item.total, 0);
  mensaje += `Total: ${formatoCOP(total)}\n---\n`;
  mensaje += `Nombre: ${nombre}\n`;
  mensaje += `Teléfono: ${telefono}\n`;
  mensaje += `Entrega: ${tipoEntrega}`;
  if(tipoEntrega === "Domicilio") mensaje += ` - ${direccion}`;
  mensaje += `\nFecha/hora: ${fecha.replace('T',' ')}\n`;
  if (notas) mensaje += `Notas: ${notas}\n`;
  mensaje += "---\nPedido enviado desde la web 🍓";

  const numero = "573142915575";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,"_blank");

  carrito = [];
  actualizarContadorCarrito();
  setTimeout(()=>{ showScreen('landing'); }, 1000);
};

// Inicialización
showScreen('landing');
actualizarContadorCarrito();