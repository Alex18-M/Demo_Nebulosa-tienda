var CONFIG = {
  name: "Tu Negocio",
  initials: "TN",
  tagline: "Todo lo que buscas, en un solo lugar",
  heroText:
    "Elige tus productos y haz tu pedido por WhatsApp en un minuto. Envíos a todo el país.",
  heroButton: "Ver productos",
  whatsapp: "50557344053",
  currency: "C$",
  brand: "#6d4cff",
  brand2: "#3d7bff",
  demoBar:
    "Demo creada por Quark Studio · Paquete Nebulosa · Los productos y precios son de ejemplo",
  features: [
    ["Envíos a todo el país", "Recíbelo donde estés"],
    ["Pago fácil", "Transferencia o efectivo"],
    ["Atención por WhatsApp", "Respuesta rápida"],
  ],
  categories: ["Ropa", "Calzado", "Accesorios"],
  products: [
    {
      name: "Camisa Oxford",
      cat: "Ropa",
      price: 650,
      emoji: "👔",
      tag: "Nuevo",
    },
    { name: "Jeans slim", cat: "Ropa", price: 890, emoji: "👖" },
    { name: "Camiseta básica", cat: "Ropa", price: 320, emoji: "👕" },
    {
      name: "Zapatilla urbana",
      cat: "Calzado",
      price: 1450,
      emoji: "👟",
      tag: "Nuevo",
    },
    {
      name: "Sandalia verano",
      cat: "Calzado",
      price: 560,
      emoji: "🩴",
      tag: "Oferta",
    },
    { name: "Gorra clásica", cat: "Accesorios", price: 280, emoji: "🧢" },
    { name: "Bolso mini", cat: "Accesorios", price: 720, emoji: "👜" },
    {
      name: "Reloj minimal",
      cat: "Accesorios",
      price: 1200,
      emoji: "⌚",
      tag: "Oferta",
    },
  ],
};
/* ===== Fin de la configuración ===== */
var $ = function (i) {
    return document.getElementById(i);
  },
  cat = "Todo",
  term = "",
  cart = {},
  P = CONFIG.products.map(function (p, i) {
    p.id = i;
    p.on = true;
    return p;
  });
var TINTS = [
  ["#e9e4ff", "#cfe0ff"],
  ["#ffe4ec", "#ffd9c7"],
  ["#dcf5ec", "#d3e8ff"],
  ["#fff2cf", "#ffe0e6"],
];
document.documentElement.style.setProperty("--brand", CONFIG.brand);
document.documentElement.style.setProperty("--brand2", CONFIG.brand2);
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c];
  });
}
function money(n) {
  return CONFIG.currency + " " + n.toLocaleString("en-US");
}
function toast(t) {
  var e = $("toast");
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(function () {
    e.classList.remove("show");
  }, 1600);
}
$("bar").textContent = CONFIG.demoBar;
if (!CONFIG.demoBar) $("bar").style.display = "none";
document.title = CONFIG.name + " · Tienda en línea";
$("logo").innerHTML = "<i>" + esc(CONFIG.initials) + "</i>" + esc(CONFIG.name);
$("ht").textContent = CONFIG.tagline;
$("hp").textContent = CONFIG.heroText;
$("hc").textContent = CONFIG.heroButton;
$("fn").textContent = "© 2026 " + CONFIG.name;
$("feat").innerHTML = CONFIG.features
  .map(function (f) {
    return "<div><b>" + esc(f[0]) + "</b><span>" + esc(f[1]) + "</span></div>";
  })
  .join("");
function cats() {
  return ["Todo"].concat(CONFIG.categories);
}
function renderChips() {
  $("chips").innerHTML = cats()
    .map(function (c) {
      return (
        '<button role="tab" aria-selected="' +
        (c === cat) +
        '" class="' +
        (c === cat ? "on" : "") +
        '" data-c="' +
        esc(c) +
        '">' +
        esc(c) +
        "</button>"
      );
    })
    .join("");
}
function renderGrid() {
  var list = P.filter(function (p) {
    return (
      p.on &&
      (cat === "Todo" || p.cat === cat) &&
      p.name.toLowerCase().indexOf(term) > -1
    );
  });
  $("catalogo").innerHTML = list.length
    ? list
        .map(function (p) {
          var t =
            TINTS[
              CONFIG.categories.indexOf(p.cat) % 4 < 0
                ? 0
                : CONFIG.categories.indexOf(p.cat) % 4
            ];
          return (
            '<article class="p"><div class="img" style="--a:' +
            t[0] +
            ";--b:" +
            t[1] +
            '">' +
            (p.tag ? '<span class="tag">' + esc(p.tag) + "</span>" : "") +
            (p.emoji || "🛍️") +
            '</div><div class="pi"><small>' +
            esc(p.cat) +
            "</small><h3>" +
            esc(p.name) +
            '</h3><div class="pr"><b>' +
            money(p.price) +
            '</b><button class="add" data-id="' +
            p.id +
            '">Agregar</button></div></div></article>'
          );
        })
        .join("")
    : '<p class="empty">No encontramos productos con esa búsqueda.</p>';
}
function renderCart() {
  var ids = Object.keys(cart).filter(function (i) {
      return cart[i] > 0;
    }),
    sum = 0,
    n = 0;
  $("items").innerHTML = ids.length
    ? ids
        .map(function (i) {
          var p = P[i];
          sum += p.price * cart[i];
          n += cart[i];
          return (
            '<div class="it"><div class="e">' +
            (p.emoji || "🛍️") +
            "</div><div><b>" +
            esc(p.name) +
            "</b><br><small>" +
            money(p.price) +
            '</small></div><div class="q"><button data-m="' +
            i +
            '" aria-label="Quitar uno">−</button><span>' +
            cart[i] +
            '</span><button data-a="' +
            i +
            '" aria-label="Agregar uno">+</button></div></div>'
          );
        })
        .join("")
    : '<p class="empty">Tu carrito está vacío.</p>';
  $("total").textContent = money(sum);
  $("cnt").textContent = n;
  $("k2").textContent = n;
  $("send").disabled = !ids.length;
  $("send").style.opacity = ids.length ? 1 : 0.5;
}
function renderPanel() {
  $("tb").innerHTML = P.map(function (p) {
    return (
      "<tr><td>" +
      (p.emoji || "🛍️") +
      " " +
      esc(p.name) +
      "</td><td>" +
      esc(p.cat) +
      '</td><td><input type="number" min="1" value="' +
      p.price +
      '" data-p="' +
      p.id +
      '" aria-label="Precio de ' +
      esc(p.name) +
      '"></td><td><input class="sw" type="checkbox" ' +
      (p.on ? "checked" : "") +
      ' data-v="' +
      p.id +
      '" aria-label="Mostrar ' +
      esc(p.name) +
      '"></td></tr>'
    );
  }).join("");
  $("k1").textContent = P.filter(function (p) {
    return p.on;
  }).length;
  $("k3").textContent = CONFIG.categories.length;
  $("nc").innerHTML = CONFIG.categories
    .map(function (c) {
      return "<option>" + esc(c) + "</option>";
    })
    .join("");
}
function all() {
  renderChips();
  renderGrid();
  renderCart();
  renderPanel();
}
$("chips").onclick = function (e) {
  var b = e.target.closest("button");
  if (b) {
    cat = b.dataset.c;
    renderChips();
    renderGrid();
  }
};
$("q").oninput = function (e) {
  term = e.target.value.toLowerCase().trim();
  renderGrid();
};
$("catalogo").onclick = function (e) {
  var b = e.target.closest(".add");
  if (b) {
    cart[b.dataset.id] = (cart[b.dataset.id] || 0) + 1;
    renderCart();
    toast("Agregado al carrito");
  }
};
$("items").onclick = function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.a != null) cart[b.dataset.a]++;
  if (b.dataset.m != null) cart[b.dataset.m]--;
  renderCart();
};
function open_(v) {
  document.body.classList.toggle("open", v);
}
$("cartbtn").onclick = function () {
  open_(true);
};
$("cx").onclick = $("ov").onclick = function () {
  open_(false);
};
$("send").onclick = function () {
  var ids = Object.keys(cart).filter(function (i) {
      return cart[i] > 0;
    }),
    sum = 0;
  var l = ids.map(function (i) {
    var p = P[i];
    sum += p.price * cart[i];
    return "• " + cart[i] + " × " + p.name + " — " + money(p.price * cart[i]);
  });
  var m =
    "Hola " +
    CONFIG.name +
    " 👋 Quiero hacer este pedido:\n" +
    l.join("\n") +
    "\nTotal: " +
    money(sum);
  window.open(
    "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(m),
    "_blank",
    "noopener",
  );
};
$("tb").onchange = function (e) {
  var t = e.target;
  if (t.dataset.p != null) {
    var v = +t.value;
    if (v > 0) P[t.dataset.p].price = v;
  }
  if (t.dataset.v != null) P[t.dataset.v].on = t.checked;
  renderGrid();
  renderCart();
  renderPanel();
};
$("nf").onsubmit = function (e) {
  e.preventDefault();
  var id = P.length;
  P.push({
    id: id,
    name: $("nn").value.trim(),
    cat: $("nc").value,
    price: +$("np").value,
    emoji: "🛍️",
    tag: "Nuevo",
    on: true,
  });
  $("nf").reset();
  all();
  toast("Producto agregado a la tienda");
};
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") open_(false);
});
function route() {
  var p = location.hash === "#panel";
  $("shop").style.display = p ? "none" : "";
  $("panel").style.display = p ? "block" : "none";
  open_(false);
  if (p) scrollTo(0, 0);
}
addEventListener("hashchange", route);
all();
route();
