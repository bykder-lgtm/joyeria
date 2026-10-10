/* ============================================================
   Guía interactiva del sistema de joyería
   ============================================================ */
var APRENDIDOS = {};
try { APRENDIDOS = JSON.parse(localStorage.getItem('joyeria_guia_aprendidos') || '{}'); } catch (e) { APRENDIDOS = {}; }
var SIM_TAB = 'pieza';
var ULTIMO = null;

var estado = {
  piezas: [
    {cod: 1001, nombre: 'Anillo oro 18k', metal: 'ORO', ley: 750, peso: 4.2, precio: 850000, tipo: 'PIEZA', stock: 1, estado: 'DISPONIBLE', ubi: 'VITRINA'},
    {cod: 1002, nombre: 'Cadena plata 925', metal: 'PLATA', ley: 925, peso: 12, precio: 220000, tipo: 'PIEZA', stock: 1, estado: 'DISPONIBLE', ubi: 'VITRINA'},
    {cod: 1003, nombre: 'Dije oro 14k', metal: 'ORO', ley: 585, peso: 2.1, precio: 410000, tipo: 'PIEZA', stock: 1, estado: 'DISPONIBLE', ubi: 'CAJA_FUERTE'},
    {cod: 1004, nombre: 'Argollas plata (par)', metal: 'PLATA', ley: 925, peso: 6, precio: 180000, tipo: 'SKU', stock: 6, estado: 'DISPONIBLE', ubi: 'VITRINA'}
  ],
  clientes: [
    {cod: 1, nombre: 'Ana María Pérez', doc: '12345678', puntos: 1200},
    {cod: 2, nombre: 'Carlos Gómez', doc: '87654321', puntos: 300}
  ],
  carrito: {},
  cliente: 0,
  tipo: '1',
  forma: 'Efectivo',
  descuento: 0,
  forma2: 'Ninguna',
  valor2: 0,
  puntos: 0,
  recibido: '',
  ventas: [],
  cartera: [],
  notas: [],
  cierres: [],
  numeros: {factura: 1021, cartera: 501, nota: 1, cierre: 1},
  caja: {base: 200000, movimientos: [], denominaciones: {}},
  config: {puntos_valor: 1, puntos_ptj: 1, iva: 19}
};

function $(id) { return document.getElementById(id); }
function fmt(n) { return '$' + Math.round(Number(n) || 0).toLocaleString('es-CO'); }
function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function pieza(cod) { for (var i = 0; i < estado.piezas.length; i++) { if (estado.piezas[i].cod === cod) { return estado.piezas[i]; } } return null; }
function cliente(cod) { for (var i = 0; i < estado.clientes.length; i++) { if (estado.clientes[i].cod === cod) { return estado.clientes[i]; } } return null; }
function grupoColor(g) { for (var i = 0; i < MODULOS.length; i++) { if (MODULOS[i].grupo === g) { return MODULOS[i].color; } } return '#c9a227'; }
function mod(id) { for (var i = 0; i < MODULOS.length; i++) { if (MODULOS[i].id === id) { return MODULOS[i]; } } return null; }
function guardarAprendidos() { try { localStorage.setItem('joyeria_guia_aprendidos', JSON.stringify(APRENDIDOS)); } catch (e) {} }
function totalAprendidos() { var n = 0; for (var k in APRENDIDOS) { if (APRENDIDOS[k]) { n++; } } return n; }

/* ---------------- modo ---------------- */
function aplicarModo(m) {
  document.documentElement.setAttribute('data-modo', m);
  try { localStorage.setItem('joyeria_guia_modo', m); } catch (e) {}
}
try { var gm = localStorage.getItem('joyeria_guia_modo'); if (gm) { aplicarModo(gm); } } catch (e) {}

/* ---------------- navegación ---------------- */
function renderNav(filtro) {
  filtro = (filtro || '').toLowerCase();
  var grupos = [];
  for (var i = 0; i < MODULOS.length; i++) {
    if (grupos.indexOf(MODULOS[i].grupo) < 0) { grupos.push(MODULOS[i].grupo); }
  }
  var html = '';
  html += '<button class="g-nav-item" onclick="mostrar(\'inicio\')"><span class="g-punto" style="background:#c9a227"></span>Inicio</button>';
  html += '<button class="g-nav-item" onclick="mostrar(\'simuladores\')"><span class="g-punto" style="background:#2fbf71"></span>Practicar (simuladores)</button>';
  for (var g = 0; g < grupos.length; g++) {
    var enGrupo = [];
    for (var j = 0; j < MODULOS.length; j++) {
      if (MODULOS[j].grupo === grupos[g]) {
        var texto = (MODULOS[j].titulo + ' ' + MODULOS[j].resumen).toLowerCase();
        if (filtro === '' || texto.indexOf(filtro) >= 0) { enGrupo.push(MODULOS[j]); }
      }
    }
    if (enGrupo.length === 0) { continue; }
    html += '<div class="g-nav-grupo"><b>' + esc(grupos[g]) + '</b>';
    for (var k = 0; k < enGrupo.length; k++) {
      html += '<button class="g-nav-item" id="nav_' + enGrupo[k].id + '" onclick="abrirModulo(\'' + enGrupo[k].id + '\')">' +
        '<span class="g-punto" style="background:' + enGrupo[k].color + '"></span>' + esc(enGrupo[k].titulo) +
        (APRENDIDOS[enGrupo[k].id] ? '<span class="g-check">OK</span>' : '') + '</button>';
    }
    html += '</div>';
  }
  html += '<div class="g-nav-especial">' +
    '<button class="g-nav-item" onclick="mostrar(\'checklist\')"><span class="g-punto" style="background:#9b59b6"></span>Mi progreso</button>' +
    '<button class="g-nav-item" onclick="mostrar(\'glosario\')"><span class="g-punto" style="background:#4aa3df"></span>Glosario</button>' +
    '</div>';
  $('g_nav').innerHTML = html;
  actualizarProgreso();
}

function actualizarProgreso() {
  var total = MODULOS.length;
  var n = totalAprendidos();
  var pct = total > 0 ? Math.round((n / total) * 100) : 0;
  $('g_progreso').style.width = pct + '%';
  $('g_progreso_txt').textContent = pct + '% (' + n + '/' + total + ')';
}

function mostrar(vista) {
  $('g_vista_inicio').hidden = vista !== 'inicio';
  $('g_vista_modulo').hidden = vista !== 'modulo';
  $('g_vista_simuladores').hidden = vista !== 'simuladores';
  $('g_vista_glosario').hidden = vista !== 'glosario';
  $('g_vista_checklist').hidden = vista !== 'checklist';
  $('g_panel').className = 'g-panel';
  window.scrollTo(0, 0);
  if (vista === 'inicio') { renderInicio(); }
  if (vista === 'simuladores') { renderSimuladores(); }
  if (vista === 'glosario') { renderGlosario(); }
  if (vista === 'checklist') { renderChecklist(); }
}

function abrirModulo(id) {
  var m = mod(id);
  if (!m) { return; }
  ULTIMO = id;
  var i = MODULOS.indexOf(m);
  var anterior = i > 0 ? MODULOS[i - 1] : null;
  var siguiente = i < MODULOS.length - 1 ? MODULOS[i + 1] : null;
  var html = '';
  html += '<div class="g-pills"><span class="g-badge g-etiqueta" style="background:' + m.color + '22;color:' + m.color + '">' + esc(m.grupo) + '</span>' +
    '<span class="g-etiqueta">Módulo ' + (i + 1) + ' de ' + MODULOS.length + '</span>' +
    (APRENDIDOS[id] ? '<span class="g-etiqueta verde">Aprendido</span>' : '') + '</div>';
  html += '<h1>' + esc(m.titulo) + '</h1><p>' + esc(m.resumen) + '</p>';
  html += '<div class="g-guia-dos"><div>';
  html += '<div class="g-panel-caja"><h2>¿Qué hace?</h2><ul>';
  for (var a = 0; a < m.que_hace.length; a++) { html += '<li>' + esc(m.que_hace[a]) + '</li>'; }
  html += '</ul><h2>¿Cómo funciona?</h2><ul>';
  for (var b = 0; b < m.como_funciona.length; b++) { html += '<li>' + esc(m.como_funciona[b]) + '</li>'; }
  html += '</ul></div>';
  html += '<div class="g-panel-caja"><h2>Paso a paso</h2><ol class="g-pasos">';
  for (var p = 0; p < m.pasos.length; p++) { html += '<li>' + esc(m.pasos[p]) + '</li>'; }
  html += '</ol>';
  if (m.tip) { html += '<div class="g-tip"><b>Consejo:</b> ' + esc(m.tip) + '</div>'; }
  html += '</div></div><div>';
  html += '<div class="g-panel-caja"><h2>Así se ve</h2>' + mockHTML(m.mock) + '</div>';
  html += '</div></div>';
  html += '<div class="g-pills">';
  if (anterior) { html += '<button class="g-btn-suave" onclick="abrirModulo(\'' + anterior.id + '\')">&larr; ' + esc(anterior.titulo) + '</button>'; }
  if (siguiente) { html += '<button class="g-btn" onclick="abrirModulo(\'' + siguiente.id + '\')">' + esc(siguiente.titulo) + ' &rarr;</button>'; }
  html += '<button class="g-btn-suave" onclick="alternarAprendido(\'' + id + '\')">' + (APRENDIDOS[id] ? 'Quitar de aprendidos' : 'Marcar como aprendido') + '</button>';
  if (m.simulador) { html += '<button class="g-btn-suave" onclick="mostrar(\'simuladores\')">Ir al simulador</button>'; }
  html += '</div>';
  $('g_vista_modulo').innerHTML = html;
  mostrar('modulo');
  renderNav($('g_buscar').value);
  var nav = $('nav_' + id);
  if (nav) { nav.className = 'g-nav-item activo'; }
}

function alternarAprendido(id) {
  APRENDIDOS[id] = !APRENDIDOS[id];
  guardarAprendidos();
  abrirModulo(id);
}

function marcarCheck(id, on) {
  APRENDIDOS[id] = !!on;
  guardarAprendidos();
  renderNav($('g_buscar').value);
  actualizarProgreso();
}

/* ---------------- ventanas simuladas ---------------- */
function mockHTML(m) {
  if (!m) { return ''; }
  var html = '<div class="g-ventana"><div class="g-ventana-barra"><i></i><i></i><i></i><b>' + esc(m.titulo) + '</b></div><div class="g-ventana-cuerpo">';
  if (m.tipo === 'kpis') {
    html += '<div class="g-kpis">';
    for (var i = 0; i < m.items.length; i++) { html += '<div class="g-kpi"><span>' + esc(m.items[i][0]) + '</span><b>' + esc(m.items[i][1]) + '</b></div>'; }
    html += '</div>';
  } else if (m.tipo === 'tabla') {
    html += '<table class="g-tabla"><tr>';
    for (var c = 0; c < m.columnas.length; c++) { html += '<th>' + esc(m.columnas[c]) + '</th>'; }
    html += '</tr>';
    for (var f = 0; f < m.filas.length; f++) {
      html += '<tr>';
      for (var d = 0; d < m.filas[f].length; d++) { html += '<td' + (d >= m.columnas.length - 2 ? ' class="num"' : '') + '>' + esc(m.filas[f][d]) + '</td>'; }
      html += '</tr>';
    }
    html += '</table>';
  } else if (m.tipo === 'form') {
    html += '<div class="g-campos">';
    for (var e = 0; e < m.campos.length; e++) {
      var ancho = (m.campos[e][0].length > 14) ? ' g-ancho' : '';
      html += '<div class="g-campo' + ancho + '"><label>' + esc(m.campos[e][0]) + '</label><input class="g-input" value="' + esc(m.campos[e][1]) + '" readonly></div>';
    }
    html += '</div><div class="g-pills">';
    for (var bt = 0; bt < m.botones.length; bt++) { html += '<button class="g-btn' + (bt > 0 ? '-suave' : '') + '" type="button">' + esc(m.botones[bt]) + '</button>'; }
    html += '</div>';
  } else if (m.tipo === 'doc') {
    html += '<div class="g-recibo"><h3>' + esc(m.titulo) + '</h3><hr>';
    for (var l = 0; l < m.lineas.length; l++) { html += '<div>' + esc(m.lineas[l]) + '</div>'; }
    html += '<hr><div style="text-align:center">Gracias por su compra</div></div>';
  }
  html += '</div></div>';
  return html;
}

/* ---------------- inicio ---------------- */
function renderInicio() {
  var html = '';
  html += '<div class="g-panel-caja" style="background:linear-gradient(135deg,rgba(201,162,39,.18),rgba(201,162,39,0)),var(--superficie)">';
  html += '<h1>Bienvenido a la guía del sistema de joyería</h1>';
  html += '<p>Aprende a usar el sistema desde cero. Cada módulo te explica <b>qué hace</b>, <b>cómo funciona</b> y <b>cómo se usa</b>, y al final puedes practicar en los <b>simuladores</b> sin miedo a dañar datos reales.</p>';
  html += '<div class="g-pills"><button class="g-btn" onclick="mostrar(\'simuladores\')">Empezar a practicar</button>' +
    '<button class="g-btn-suave" onclick="abrirModulo(\'acceso\')">Ver el primer módulo</button>' +
    '<button class="g-btn-suave" onclick="mostrar(\'checklist\')">Mi progreso: ' + totalAprendidos() + '/' + MODULOS.length + '</button></div>';
  html += '</div>';
  html += '<h2>Ruta de aprendizaje recomendada</h2><div class="g-tarjetas">';
  for (var r = 0; r < RUTA.length; r++) {
    html += '<div class="g-tarjeta"><span class="g-badge">Paso ' + (r + 1) + '</span><b>' + esc(RUTA[r].titulo) + '</b><small>' + esc(RUTA[r].texto) + '</small><div class="g-pills" style="margin:10px 0 0">';
    for (var mm = 0; mm < RUTA[r].modulos.length; mm++) {
      var md = mod(RUTA[r].modulos[mm]);
      if (md) { html += '<button class="g-btn-suave" style="padding:5px 10px;font-size:12px" onclick="abrirModulo(\'' + md.id + '\')">' + esc(md.titulo) + '</button>'; }
    }
    html += '</div></div>';
  }
  html += '</div>';
  html += '<h2 style="margin-top:20px">Todos los módulos</h2><div class="g-tarjetas" id="g_cards"></div>';
  $('g_vista_inicio').innerHTML = html;
  pintarTarjetas('');
}

function pintarTarjetas(filtro) {
  filtro = (filtro || '').toLowerCase();
  var cont = $('g_cards');
  if (!cont) { return; }
  var html = '';
  for (var i = 0; i < MODULOS.length; i++) {
    var m = MODULOS[i];
    var texto = (m.titulo + ' ' + m.resumen + ' ' + m.grupo).toLowerCase();
    if (filtro !== '' && texto.indexOf(filtro) < 0) { continue; }
    html += '<button class="g-tarjeta" onclick="abrirModulo(\'' + m.id + '\')">' +
      '<span class="g-ico" style="background:' + m.color + '22;color:' + m.color + '">' + (i + 1) + '</span>' +
      '<b>' + esc(m.titulo) + '</b><small>' + esc(m.resumen) + '</small>' +
      '<div style="margin-top:8px"><span class="g-badge">' + esc(m.grupo) + '</span> ' +
      (APRENDIDOS[m.id] ? '<span class="g-etiqueta verde">Aprendido</span>' : '') + '</div></button>';
  }
  cont.innerHTML = html || '<div class="g-vacio">No se encontraron módulos con esa búsqueda.</div>';
}

/* ---------------- glosario y checklist ---------------- */
function renderGlosario() {
  var html = '<h1>Glosario</h1><p>Palabras que verás dentro del sistema y qué significan.</p>';
  for (var i = 0; i < GLOSARIO.length; i++) {
    html += '<div class="g-panel-caja"><b>' + esc(GLOSARIO[i][0]) + '</b><p style="margin:6px 0 0">' + esc(GLOSARIO[i][1]) + '</p></div>';
  }
  $('g_vista_glosario').innerHTML = html;
}

function renderChecklist() {
  var html = '<h1>Mi progreso</h1><p>Marca cada módulo cuando lo entiendas. Tu avance se guarda en este equipo.</p>';
  html += '<div class="g-progreso" style="max-width:420px;margin-bottom:12px"><div class="g-progreso-barra"><span style="width:' + (MODULOS.length ? Math.round(totalAprendidos() / MODULOS.length * 100) : 0) + '%"></span></div><small>' + totalAprendidos() + ' de ' + MODULOS.length + ' módulos</small></div>';
  html += '<div class="g-panel-caja">';
  for (var i = 0; i < MODULOS.length; i++) {
    var m = MODULOS[i];
    html += '<div class="g-check-fila"><input type="checkbox" ' + (APRENDIDOS[m.id] ? 'checked' : '') + ' onchange="marcarCheck(\'' + m.id + '\', this.checked)" id="chk_' + m.id + '"><span>' + esc(m.titulo) + ' <small>· ' + esc(m.grupo) + '</small></span><button class="g-btn-suave" onclick="abrirModulo(\'' + m.id + '\')">Abrir</button></div>';
  }
  html += '</div>';
  $('g_vista_checklist').innerHTML = html;
}

/* ============================================================
   SIMULADORES
   ============================================================ */
function renderSimuladores() {
  var tabs = [
    ['pieza', '1. Crear una pieza'],
    ['venta', '2. Vender y cobrar'],
    ['cartera', '3. Cartera y abonos'],
    ['devolucion', '4. Devolución'],
    ['cierre', '5. Cierre de caja']
  ];
  var html = '<h1>Practica sin miedo</h1><p>Estos simuladores funcionan como el sistema real (con datos de ejemplo). Nada de lo que hagas aquí toca la información de verdad.</p>';
  html += '<div class="g-pills">';
  for (var i = 0; i < tabs.length; i++) {
    html += '<button class="' + (SIM_TAB === tabs[i][0] ? 'g-btn' : 'g-btn-suave') + '" onclick="SIM.ir(\'' + tabs[i][0] + '\')">' + tabs[i][1] + '</button>';
  }
  html += '<button class="g-btn-suave" onclick="SIM.reiniciar()">Reiniciar práctica</button></div>';
  html += '<div id="g_sim_cuerpo"></div>';
  $('g_vista_simuladores').innerHTML = html;
  SIM.pintar();
}

var SIM = {
  ir: function (t) { SIM_TAB = t; renderSimuladores(); },
  reiniciar: function () {
    estado.carrito = {};
    estado.ventas = []; estado.cartera = []; estado.notas = []; estado.cierres = [];
    estado.numeros = {factura: 1021, cartera: 501, nota: 1, cierre: 1};
    estado.caja = {base: 200000, movimientos: [], denominaciones: {}};
    estado.piezas = [
      {cod: 1001, nombre: 'Anillo oro 18k', metal: 'ORO', ley: 750, peso: 4.2, precio: 850000, tipo: 'PIEZA', stock: 1, estado: 'DISPONIBLE', ubi: 'VITRINA'},
      {cod: 1002, nombre: 'Cadena plata 925', metal: 'PLATA', ley: 925, peso: 12, precio: 220000, tipo: 'PIEZA', stock: 1, estado: 'DISPONIBLE', ubi: 'VITRINA'},
      {cod: 1003, nombre: 'Dije oro 14k', metal: 'ORO', ley: 585, peso: 2.1, precio: 410000, tipo: 'PIEZA', stock: 1, estado: 'DISPONIBLE', ubi: 'CAJA_FUERTE'},
      {cod: 1004, nombre: 'Argollas plata (par)', metal: 'PLATA', ley: 925, peso: 6, precio: 180000, tipo: 'SKU', stock: 6, estado: 'DISPONIBLE', ubi: 'VITRINA'}
    ];
    estado.clientes = [
      {cod: 1, nombre: 'Ana María Pérez', doc: '12345678', puntos: 1200},
      {cod: 2, nombre: 'Carlos Gómez', doc: '87654321', puntos: 300}
    ];
    SIM.pintar();
  },
  pintar: function () {
    var c = $('g_sim_cuerpo');
    if (!c) { return; }
    if (SIM_TAB === 'pieza') { c.innerHTML = SIM.htmlPieza(); }
    if (SIM_TAB === 'venta') { c.innerHTML = SIM.htmlVenta(); }
    if (SIM_TAB === 'cartera') { c.innerHTML = SIM.htmlCartera(); }
    if (SIM_TAB === 'devolucion') { c.innerHTML = SIM.htmlDevolucion(); }
    if (SIM_TAB === 'cierre') { c.innerHTML = SIM.htmlCierre(); }
  },

  /* ---------- 1. crear pieza ---------- */
  htmlPieza: function () {
    return '<div class="g-sim"><div class="g-panel-caja"><h2>Nueva pieza</h2>' +
      '<div class="g-campos">' +
      '<div class="g-campo g-ancho"><label>Nombre</label><input class="g-input" id="sp_nombre" value="Anillo sello oro"></div>' +
      '<div class="g-campo"><label>Tipo</label><select class="g-select" id="sp_tipo"><option value="PIEZA">Pieza única</option><option value="SKU">SKU (varias iguales)</option></select></div>' +
      '<div class="g-campo"><label>Metal</label><select class="g-select" id="sp_metal"><option>ORO</option><option>PLATA</option><option>PLATINO</option></select></div>' +
      '<div class="g-campo"><label>Ley (milesimas)</label><input class="g-input" id="sp_ley" value="750"></div>' +
      '<div class="g-campo"><label>Peso (g)</label><input class="g-input" id="sp_peso" value="3.5"></div>' +
      '<div class="g-campo"><label>Precio de venta</label><input class="g-input" id="sp_precio" value="980000"></div>' +
      '<div class="g-campo"><label>Cantidad (si es SKU)</label><input class="g-input" id="sp_stock" value="1"></div>' +
      '<div class="g-campo"><label>Ubicación</label><select class="g-select" id="sp_ubi"><option>VITRINA</option><option>CAJA_FUERTE</option><option>APARTADO</option></select></div>' +
      '</div><div class="g-pills"><button class="g-btn" onclick="SIM.guardarPieza()">Guardar pieza</button></div>' +
      '<div id="sp_msg"></div></div>' +
      '<div><div class="g-panel-caja"><h2>Inventario actual</h2>' + SIM.tablaPiezas() + '</div></div></div>';
  },
  tablaPiezas: function () {
    var html = '<table class="g-tabla"><tr><th>Pieza</th><th>Tipo</th><th>Estado</th><th class="num">Stock</th><th class="num">Precio</th></tr>';
    for (var i = 0; i < estado.piezas.length; i++) {
      var p = estado.piezas[i];
      html += '<tr><td>' + esc(p.nombre) + '</td><td>' + esc(p.tipo) + '</td><td>' + esc(p.estado) + '</td><td class="num">' + p.stock + '</td><td class="num">' + fmt(p.precio) + '</td></tr>';
    }
    html += '</table>';
    return html;
  },
  guardarPieza: function () {
    var nombre = $('sp_nombre').value.trim();
    if (nombre === '') { $('sp_msg').innerHTML = '<div class="g-error">Escribe el nombre de la pieza.</div>'; return; }
    var cod = 1000 + estado.piezas.length + 1;
    var tipo = $('sp_tipo').value;
    estado.piezas.push({
      cod: cod, nombre: nombre, metal: $('sp_metal').value, ley: parseInt($('sp_ley').value || '0', 10),
      peso: parseFloat($('sp_peso').value || '0'), precio: parseFloat($('sp_precio').value || '0'),
      tipo: tipo, stock: (tipo === 'PIEZA' ? 1 : parseInt($('sp_stock').value || '1', 10)),
      estado: 'DISPONIBLE', ubi: $('sp_ubi').value
    });
    $('sp_msg').innerHTML = '<div class="g-ok">Pieza guardada con código ' + cod + '. Ya aparece en la vitrina y se puede vender.</div>';
    SIM.pintar();
  },

  /* ---------- 2. vender y cobrar ---------- */
  totalesVenta: function () {
    var subtotal = 0;
    for (var cod in estado.carrito) {
      var p = pieza(parseInt(cod, 10));
      if (p) { subtotal += p.precio * estado.carrito[cod]; }
    }
    var descuento = subtotal * ((parseFloat(estado.descuento) || 0) / 100);
    var cli = cliente(estado.cliente);
    var puntosUsados = 0;
    if (cli && parseFloat(estado.puntos) > 0) {
      puntosUsados = parseFloat(estado.puntos);
      if (puntosUsados > cli.puntos) { puntosUsados = cli.puntos; }
      if (puntosUsados * estado.config.puntos_valor > subtotal - descuento) {
        puntosUsados = Math.floor((subtotal - descuento) / estado.config.puntos_valor);
      }
    }
    var puntosDinero = puntosUsados * estado.config.puntos_valor;
    var total = Math.max(0, subtotal - descuento - puntosDinero);
    var recibido = parseFloat(estado.recibido);
    if (isNaN(recibido)) { recibido = 0; }
    return {subtotal: subtotal, descuento: descuento, puntos: puntosUsados, puntosDinero: puntosDinero, total: total, recibido: recibido, cliente: cli};
  },
  htmlVenta: function () {
    var html = '<div class="g-sim"><div class="g-panel-caja"><h2>1. Marca las piezas</h2><div class="g-sim-piezas">';
    for (var i = 0; i < estado.piezas.length; i++) {
      var p = estado.piezas[i];
      if (p.estado !== 'DISPONIBLE' || (p.tipo !== 'PIEZA' && p.stock <= 0)) { continue; }
      var en = estado.carrito[p.cod] ? 'checked' : '';
      html += '<div class="g-sim-fila"><input type="checkbox" ' + en + ' onchange="SIM.marcar(' + p.cod + ', this.checked)">' +
        '<span class="nombre">' + esc(p.nombre) + '<br><small>' + esc(p.metal) + ' ' + p.ley + ' · ' + p.peso + ' g · ' + esc(p.ubi) + '</small></span>' +
        '<span>' + fmt(p.precio) + '</span>';
      if (p.tipo !== 'PIEZA') { html += '<input class="g-input" style="width:70px" onchange="SIM.cantidad(' + p.cod + ', this.value)" value="' + (estado.carrito[p.cod] || 1) + '">'; }
      html += '</div>';
    }
    html += '</div></div>';
    html += '<div><div class="g-panel-caja"><h2>2. Cliente y pago</h2>';
    html += '<div class="g-campos">';
    html += '<div class="g-campo g-ancho"><label>Cliente</label><select class="g-select" onchange="SIM.cliente(this.value)"><option value="0">Mostrador, sin nombre</option>';
    for (var c = 0; c < estado.clientes.length; c++) {
      var sel = (estado.cliente === estado.clientes[c].cod) ? ' selected' : '';
      html += '<option value="' + estado.clientes[c].cod + '"' + sel + '>' + esc(estado.clientes[c].nombre) + ' · ' + esc(estado.clientes[c].doc) + ' · ' + estado.clientes[c].puntos + ' pts</option>';
    }
    html += '</select></div>';
    html += '<div class="g-campo"><label>Modalidad</label><select class="g-select" onchange="SIM.tipo(this.value)"><option value="1"' + (estado.tipo === '1' ? ' selected' : '') + '>Contado</option><option value="2"' + (estado.tipo === '2' ? ' selected' : '') + '>Crédito</option></select></div>';
    html += '<div class="g-campo"><label>Forma de pago</label><select class="g-select" onchange="SIM.forma(this.value)"><option>Efectivo</option><option>Tarjeta crédito</option><option>Transferencia</option></select></div>';
    html += '<div class="g-campo"><label>Descuento %</label><input class="g-input" value="' + estado.descuento + '" onchange="SIM.descuento(this.value)"></div>';
    html += '<div class="g-campo"><label>Puntos a redimir</label><input class="g-input" value="' + estado.puntos + '" onchange="SIM.puntos(this.value)"></div>';
    html += '<div class="g-campo"><label>Recibido / abono inicial</label><input class="g-input" value="' + esc(estado.recibido) + '" onchange="SIM.recibido(this.value)"></div>';
    html += '</div>';
    var t = SIM.totalesVenta();
    html += '<table class="g-sim-totales"><tbody>' +
      '<tr><td>Subtotal</td><td class="num">' + fmt(t.subtotal) + '</td></tr>' +
      (t.descuento > 0 ? '<tr><td>Descuento</td><td class="num">- ' + fmt(t.descuento) + '</td></tr>' : '') +
      (t.puntosDinero > 0 ? '<tr><td>Puntos (' + t.puntos + ')</td><td class="num">- ' + fmt(t.puntosDinero) + '</td></tr>' : '') +
      '<tr class="total"><td>' + (estado.tipo === '2' ? 'Saldo a cartera' : 'Total') + '</td><td class="num">' + fmt(t.total) + '</td></tr>' +
      '<tr><td>' + (estado.tipo === '2' ? 'Abono inicial' : 'Recibido') + '</td><td class="num">' + fmt(t.recibido) + '</td></tr>' +
      '</table>';
    if (estado.tipo === '2') {
      var ab = t.recibido > t.total ? t.total : t.recibido;
      html += '<div class="g-aviso">Quedará en cartera: <b>' + fmt(t.total - ab) + '</b></div>';
    } else if (t.recibido > t.total) {
      html += '<div class="g-aviso">Cambio a devolver: <b>' + fmt(t.recibido - t.total) + '</b></div>';
    }
    html += '<div class="g-pills"><button class="g-btn" onclick="SIM.cobrar()">Cobrar y cerrar factura</button></div>';
    html += '<div id="sv_msg"></div></div>';
    html += '<div class="g-panel-caja"><h2>3. Resultado</h2><div id="sv_resultado"><div class="g-vacio">Aún no has cobrado. Marca piezas y pulsa Cobrar.</div></div></div>';
    html += '</div></div>';
    return html;
  },
  marcar: function (cod, on) { if (on) { estado.carrito[cod] = estado.carrito[cod] || 1; } else { delete estado.carrito[cod]; } SIM.actualizarVenta(); },
  cantidad: function (cod, v) { estado.carrito[cod] = Math.max(1, parseInt(v || '1', 10)); SIM.actualizarVenta(); },
  cliente: function (v) { estado.cliente = parseInt(v, 10); SIM.actualizarVenta(); },
  tipo: function (v) { estado.tipo = v; if (v === '2' && !estado.recibido) { estado.recibido = '0'; } SIM.actualizarVenta(); },
  forma: function (v) { estado.forma = v; SIM.actualizarVenta(); },
  descuento: function (v) { estado.descuento = parseFloat(v) || 0; SIM.actualizarVenta(); },
  puntos: function (v) { estado.puntos = parseFloat(v) || 0; SIM.actualizarVenta(); },
  recibido: function (v) { estado.recibido = v; SIM.actualizarVenta(); },
  actualizarVenta: function () { $('g_sim_cuerpo').innerHTML = SIM.htmlVenta(); },
  cobrar: function () {
    var t = SIM.totalesVenta();
    if (t.subtotal <= 0) { $('sv_msg').innerHTML = '<div class="g-error">Marca al menos una pieza.</div>'; return; }
    var recibido = t.recibido;
    var tipo = estado.tipo;
    if (tipo === '1' && recibido < t.total) { tipo = '2'; }
    if (tipo === '2' && recibido > t.total) { recibido = t.total; }
    var vuelto = (tipo === '1' && recibido > t.total) ? recibido - t.total : 0;
    var lineas = [];
    for (var cod in estado.carrito) {
      var p = pieza(parseInt(cod, 10));
      if (p) { lineas.push({pieza: p, cant: estado.carrito[cod]}); }
    }
    var venta = {
      id: estado.numeros.factura++, fecha: new Date().toISOString().slice(0, 10), cliente: t.cliente,
      lineas: lineas, subtotal: t.subtotal, descuento: t.descuento, puntos: t.puntos, puntosDinero: t.puntosDinero,
      total: t.total, forma: estado.forma, tipo: (tipo === '2' ? 'CREDITO' : 'CONTADO'), recibido: recibido, vuelto: vuelto,
      saldo: (tipo === '2' ? t.total - recibido : 0), estado: 'CERRADA', cierre: 0
    };
    for (var i = 0; i < lineas.length; i++) {
      if (lineas[i].pieza.tipo === 'PIEZA') { lineas[i].pieza.estado = 'VENDIDO'; lineas[i].pieza.stock = 0; }
      else { lineas[i].pieza.stock = Math.max(0, lineas[i].pieza.stock - lineas[i].cant); }
    }
    estado.ventas.push(venta);
    var cambios = '';
    if (venta.tipo === 'CREDITO') {
      var cta = {id: estado.numeros.cartera++, venta: venta.id, cliente: t.cliente, monto: t.total, abonado: recibido, saldo: t.total - recibido, abonos: [], vence: '2026-11-09'};
      estado.cartera.push(cta);
      cambios += '<div class="g-etiqueta oro">Cartera</div> Se creó la cuenta por cobrar con saldo ' + fmt(cta.saldo) + '.<br>';
    } else {
      var efectivo = (estado.forma === 'Efectivo') ? venta.total : 0;
      if (efectivo > 0) { estado.caja.movimientos.push({concepto: 'VENTA EFECTIVO ' + venta.id, valor: efectivo, tipo: 'INGRESO'}); }
      cambios += '<div class="g-etiqueta verde">Caja</div> Entró a caja ' + fmt(efectivo) + '.<br>';
    }
    if (t.puntos > 0 && t.cliente) {
      t.cliente.puntos -= t.puntos;
      cambios += '<div class="g-etiqueta">Puntos</div> Se redimieron ' + t.puntos + ' puntos (quedan ' + t.cliente.puntos + ').<br>';
    } else if (t.cliente) {
      var ganados = Math.floor(venta.total * (estado.config.puntos_ptj / 100));
      t.cliente.puntos += ganados;
      cambios += '<div class="g-etiqueta">Puntos</div> El cliente ganó ' + ganados + ' puntos (tiene ' + t.cliente.puntos + ').<br>';
    }
    cambios += '<div class="g-etiqueta">Inventario</div> Las piezas vendidas quedaron fuera de la vitrina.<br>';
    $('sv_resultado').innerHTML = SIM.recibo(venta) + '<div class="g-ok">Venta cerrada. Qué pasó en el sistema:<br>' + cambios + '</div>';
    estado.carrito = {};
    estado.puntos = 0; estado.descuento = 0; estado.recibido = ''; estado.tipo = '1';
  },
  recibo: function (v) {
    var html = '<div class="g-recibo"><h3>JOYERÍA</h3><div>Factura FVE ' + v.id + '</div><div>' + v.fecha + ' · ' + (v.cliente ? esc(v.cliente.nombre) : 'Consumidor final') + '</div><hr><table>';
    for (var i = 0; i < v.lineas.length; i++) {
      html += '<tr><td>' + esc(v.lineas[i].pieza.nombre) + ' x' + v.lineas[i].cant + '</td><td class="num">' + fmt(v.lineas[i].pieza.precio * v.lineas[i].cant) + '</td></tr>';
    }
    html += '</table><hr>';
    html += '<table><tr><td>Subtotal</td><td class="num">' + fmt(v.subtotal) + '</td></tr>';
    if (v.descuento > 0) { html += '<tr><td>Descuento</td><td class="num">- ' + fmt(v.descuento) + '</td></tr>'; }
    if (v.puntosDinero > 0) { html += '<tr><td>Puntos (' + v.puntos + ')</td><td class="num">- ' + fmt(v.puntosDinero) + '</td></tr>'; }
    html += '<tr><td><b>TOTAL</b></td><td class="num"><b>' + fmt(v.total) + '</b></td></tr>';
    html += '<tr><td>' + esc(v.forma) + ' (' + v.tipo + ')</td><td class="num">' + fmt(v.recibido) + '</td></tr>';
    if (v.vuelto > 0) { html += '<tr><td>Cambio</td><td class="num">' + fmt(v.vuelto) + '</td></tr>'; }
    if (v.tipo === 'CREDITO') { html += '<tr><td>Saldo</td><td class="num">' + fmt(v.saldo) + '</td></tr>'; }
    html += '</table><hr><div style="text-align:center">Gracias por su compra</div></div>';
    return html;
  },

  /* ---------- 3. cartera ---------- */
  htmlCartera: function () {
    var html = '<div class="g-sim"><div class="g-panel-caja"><h2>Cuentas por cobrar</h2>';
    if (estado.cartera.length === 0) {
      html += '<div class="g-vacio">Todavía no hay créditos. Ve al simulador "Vender y cobrar", elige Crédito y cobra una venta.</div>' +
        '<div class="g-pills"><button class="g-btn-suave" onclick="SIM.ventaCreditoRapida()">Crear un crédito de ejemplo</button></div>';
    } else {
      html += '<table class="g-tabla"><tr><th>Factura</th><th>Cliente</th><th class="num">Deuda</th><th class="num">Abonado</th><th class="num">Saldo</th><th>Estado</th></tr>';
      for (var i = 0; i < estado.cartera.length; i++) {
        var c = estado.cartera[i];
        html += '<tr><td>FVE ' + c.venta + '</td><td>' + (c.cliente ? esc(c.cliente.nombre) : 'Consumidor final') + '</td><td class="num">' + fmt(c.monto) + '</td><td class="num">' + fmt(c.abonado) + '</td><td class="num">' + fmt(c.saldo) + '</td><td>' + (c.saldo <= 0 ? '<span class="g-etiqueta verde">PAGADA</span>' : '<span class="g-etiqueta rojo">PENDIENTE</span>') + '</td></tr>';
      }
      html += '</table>';
    }
    html += '</div><div class="g-panel-caja"><h2>Registrar abono</h2>';
    var pendientes = [];
    for (var j = 0; j < estado.cartera.length; j++) { if (estado.cartera[j].saldo > 0) { pendientes.push(estado.cartera[j]); } }
    if (pendientes.length === 0) {
      html += '<div class="g-vacio">No hay cuentas pendientes. Si acabas de pagar todo, verás el estado PAGADA en la tabla.</div>';
    } else {
      html += '<div class="g-campo"><label>Cuenta</label><select class="g-select" id="sc_cuenta">';
      for (var k = 0; k < pendientes.length; k++) { html += '<option value="' + pendientes[k].id + '">FVE ' + pendientes[k].venta + ' · saldo ' + fmt(pendientes[k].saldo) + '</option>'; }
      html += '</select></div>';
      html += '<div class="g-campo" style="margin-top:10px"><label>Valor del abono</label><input class="g-input" id="sc_valor" value="100000"></div>';
      html += '<div class="g-pills"><button class="g-btn" onclick="SIM.abonar()">Registrar abono</button></div>';
    }
    html += '<div id="sc_msg"></div><div id="sc_comp"></div></div></div>';
    return html;
  },
  ventaCreditoRapida: function () {
    var p = pieza(1003);
    if (!p || p.estado !== 'DISPONIBLE') { p = pieza(1001); }
    if (!p) { return; }
    p.estado = 'VENDIDO'; p.stock = 0;
    var v = {id: estado.numeros.factura++, fecha: new Date().toISOString().slice(0, 10), cliente: estado.clientes[0], lineas: [{pieza: p, cant: 1}], subtotal: p.precio, descuento: 0, puntos: 0, puntosDinero: 0, total: p.precio, forma: 'Efectivo', tipo: 'CREDITO', recibido: 0, vuelto: 0, saldo: p.precio, estado: 'CERRADA', cierre: 0};
    estado.ventas.push(v);
    estado.cartera.push({id: estado.numeros.cartera++, venta: v.id, cliente: estado.clientes[0], monto: p.precio, abonado: 0, saldo: p.precio, abonos: [], vence: '2026-11-09'});
    SIM.pintar();
  },
  abonar: function () {
    var id = parseInt($('sc_cuenta').value, 10);
    var valor = parseFloat($('sc_valor').value || '0');
    if (valor <= 0) { $('sc_msg').innerHTML = '<div class="g-error">El abono debe ser mayor que cero.</div>'; return; }
    for (var i = 0; i < estado.cartera.length; i++) {
      if (estado.cartera[i].id === id) {
        var c = estado.cartera[i];
        if (valor > c.saldo) { valor = c.saldo; }
        c.abonado += valor; c.saldo -= valor;
        c.abonos.push({valor: valor, fecha: new Date().toISOString().slice(0, 10)});
        SIM.pintar();
        $('sc_comp').innerHTML = '<div class="g-ok">Abono registrado.</div>' + SIM.comprobante(c, valor);
        return;
      }
    }
  },
  comprobante: function (c, valor) {
    return '<div class="g-recibo" style="margin-top:12px"><h3>COMPROBANTE DE ABONO</h3><hr>' +
      '<div>Cliente: ' + (c.cliente ? esc(c.cliente.nombre) : '—') + '</div>' +
      '<div>Factura: FVE ' + c.venta + '</div><hr>' +
      '<table><tr><td>Abono</td><td class="num"><b>' + fmt(valor) + '</b></td></tr><tr><td>Saldo pendiente</td><td class="num">' + fmt(c.saldo) + '</td></tr></table>' +
      '<hr><div style="text-align:center">Gracias</div></div>';
  },

  /* ---------- 4. devolución ---------- */
  htmlDevolucion: function () {
    var html = '<div class="g-sim"><div class="g-panel-caja"><h2>Elige la factura a devolver</h2>';
    var cerradas = [];
    for (var i = 0; i < estado.ventas.length; i++) { if (estado.ventas[i].estado === 'CERRADA') { cerradas.push(estado.ventas[i]); } }
    if (cerradas.length === 0) {
      html += '<div class="g-vacio">No hay facturas. Primero vende algo en "Vender y cobrar".</div>';
    } else {
      html += '<div class="g-campo"><label>Factura</label><select class="g-select" id="sd_venta" onchange="SIM.pintar()">';
      for (var j = 0; j < cerradas.length; j++) {
        html += '<option value="' + cerradas[j].id + '">FVE ' + cerradas[j].id + ' · ' + (cerradas[j].cliente ? esc(cerradas[j].cliente.nombre) : 'Consumidor final') + ' · ' + fmt(cerradas[j].total) + ' · ' + cerradas[j].tipo + '</option>';
      }
      html += '</select></div>';
      var v = null;
      var sel = $('sd_venta') ? parseInt($('sd_venta').value, 10) : cerradas[0].id;
      for (var k = 0; k < estado.ventas.length; k++) { if (estado.ventas[k].id === sel) { v = estado.ventas[k]; } }
      if (v) {
        html += '<table class="g-tabla" style="margin-top:12px"><tr><th>Pieza</th><th class="num">Vendido</th><th class="num">Devuelto</th><th>Cantidad a devolver</th></tr>';
        for (var l = 0; l < v.lineas.length; l++) {
          var dev = v.lineas[l].devuelto || 0;
          var pend = v.lineas[l].cant - dev;
          html += '<tr><td>' + esc(v.lineas[l].pieza.nombre) + '</td><td class="num">' + v.lineas[l].cant + '</td><td class="num">' + dev + '</td><td>' +
            (pend > 0 ? '<input class="g-input" style="width:90px" id="sd_cant_' + l + '" value="0">' : 'Completa') + '</td></tr>';
        }
        html += '</table>';
        html += '<div class="g-campo"><label>Motivo</label><input class="g-input" id="sd_motivo" value="cambio de talla"></div>';
        html += '<div class="g-pills"><button class="g-btn-peligro" onclick="SIM.devolver()">Generar nota crédito</button></div>';
      }
    }
    html += '<div id="sd_msg"></div></div>';
    html += '<div class="g-panel-caja"><h2>Nota crédito</h2><div id="sd_doc"><div class="g-vacio">Aquí verás la nota al generarla.</div></div></div></div>';
    return html;
  },
  devolver: function () {
    var sel = parseInt($('sd_venta').value, 10);
    var v = null;
    for (var i = 0; i < estado.ventas.length; i++) { if (estado.ventas[i].id === sel) { v = estado.ventas[i]; } }
    if (!v) { return; }
    var total = 0; var detalle = []; var devueltas = 0;
    for (var l = 0; l < v.lineas.length; l++) {
      var inp = $('sd_cant_' + l);
      if (!inp) { continue; }
      var cant = parseFloat(inp.value || '0');
      var dev = v.lineas[l].devuelto || 0;
      var pend = v.lineas[l].cant - dev;
      if (cant <= 0) { continue; }
      if (cant > pend) { cant = pend; }
      v.lineas[l].devuelto = dev + cant;
      total += cant * v.lineas[l].pieza.precio;
      detalle.push(v.lineas[l].pieza.nombre + ' x' + cant + ' — ' + fmt(cant * v.lineas[l].pieza.precio));
      if (v.lineas[l].pieza.tipo === 'PIEZA') { v.lineas[l].pieza.estado = 'DISPONIBLE'; v.lineas[l].pieza.stock = 1; }
      else { v.lineas[l].pieza.stock += cant; }
      if (v.lineas[l].devuelto >= v.lineas[l].cant) { devueltas++; }
    }
    if (total <= 0) { $('sd_msg').innerHTML = '<div class="g-error">Escribe una cantidad a devolver.</div>'; return; }
    var nota = {id: estado.numeros.nota++, venta: v.id, total: total, motivo: $('sd_motivo').value, detalle: detalle};
    estado.notas.push(nota);
    if (v.tipo === 'CREDITO') {
      for (var c = 0; c < estado.cartera.length; c++) {
        if (estado.cartera[c].venta === v.id) {
          var saldoAntes = estado.cartera[c].saldo;
          estado.cartera[c].monto = Math.max(0, estado.cartera[c].monto - total);
          estado.cartera[c].saldo = Math.max(0, estado.cartera[c].monto - estado.cartera[c].abonado);
          nota.cartera = 'Saldo ' + fmt(saldoAntes) + ' -> ' + fmt(estado.cartera[c].saldo);
        }
      }
    }
    var doc = '<div class="g-recibo"><h3>NOTA CRÉDITO NC ' + nota.id + '</h3><hr>' +
      '<div>Factura original: FVE ' + v.id + '</div><div>Motivo: ' + esc(nota.motivo) + '</div><hr>';
    for (var d = 0; d < detalle.length; d++) { doc += '<div>' + esc(detalle[d]) + '</div>'; }
    doc += '<hr><table><tr><td><b>TOTAL DEVUELTO</b></td><td class="num"><b>' + fmt(total) + '</b></td></tr></table><hr>' +
      '<div>Inventario repuesto' + (nota.cartera ? ' · ' + esc(nota.cartera) : '') + '</div></div>';
    $('sd_doc').innerHTML = doc;
    $('sd_msg').innerHTML = '<div class="g-ok">Nota crédito generada. Se repuso el inventario' + (nota.cartera ? ' y se ajustó la cartera.' : '.') + '</div>';
    SIM.pintar();
    $('sd_doc').innerHTML = doc;
  },

  /* ---------- 5. cierre ---------- */
  resumenDia: function () {
    var ventas = 0, efectivo = 0, otras = 0, credito = 0, abonosEf = 0;
    for (var i = 0; i < estado.ventas.length; i++) {
      var v = estado.ventas[i];
      if (v.estado !== 'CERRADA' || v.cierre > 0) { continue; }
      ventas += v.total;
      if (v.tipo === 'CREDITO') { credito += v.total; } else if (v.forma === 'Efectivo') { efectivo += v.total; } else { otras += v.total; }
    }
    for (var c = 0; c < estado.cartera.length; c++) {
      for (var a = 0; a < estado.cartera[c].abonos.length; a++) { abonosEf += estado.cartera[c].abonos[a].valor; }
    }
    var ingresos = 0, egresos = 0;
    for (var m = 0; m < estado.caja.movimientos.length; m++) {
      if (estado.caja.movimientos[m].valor > 0) { ingresos += estado.caja.movimientos[m].valor; } else { egresos += -estado.caja.movimientos[m].valor; }
    }
    return {ventas: ventas, efectivo: efectivo, otras: otras, credito: credito, abonos: abonosEf, ingresos: ingresos, egresos: egresos};
  },
  htmlCierre: function () {
    var r = SIM.resumenDia();
    var esperado = estado.caja.base + r.efectivo + r.abonos + r.ingresos - r.egresos;
    var fisico = 0;
    for (var d in estado.caja.denominaciones) { fisico += parseInt(d, 10) * estado.caja.denominaciones[d]; }
    var html = '<div class="g-sim"><div class="g-panel-caja"><h2>Resumen del día</h2><div class="g-kpis">' +
      '<div class="g-kpi"><span>Ventas</span><b>' + fmt(r.ventas) + '</b></div>' +
      '<div class="g-kpi"><span>Contado efectivo</span><b>' + fmt(r.efectivo) + '</b></div>' +
      '<div class="g-kpi"><span>Otras formas</span><b>' + fmt(r.otras) + '</b></div>' +
      '<div class="g-kpi"><span>Crédito</span><b>' + fmt(r.credito) + '</b></div>' +
      '<div class="g-kpi"><span>Abonos</span><b>' + fmt(r.abonos) + '</b></div>' +
      '<div class="g-kpi"><span>Ingresos / egresos</span><b>' + fmt(r.ingresos) + ' / ' + fmt(r.egresos) + '</b></div>' +
      '</div>';
    html += '<div class="g-campos"><div class="g-campo"><label>Base de caja</label><input class="g-input" value="' + estado.caja.base + '" onchange="SIM.base(this.value)"></div>';
    html += '<div class="g-campo"><label>Egreso rápido (opcional)</label><input class="g-input" id="sx_egreso" value="0"></div></div>';
    html += '<div class="g-pills"><button class="g-btn-suave" onclick="SIM.egreso()">Registrar egreso</button></div>';
    var esperado2 = estado.caja.base + r.efectivo + r.abonos + r.ingresos - r.egresos;
    html += '<div class="g-aviso">Efectivo que el sistema espera: <b>' + fmt(esperado2) + '</b></div></div>';
    html += '<div class="g-panel-caja"><h2>Arqueo por denominaciones</h2><div class="g-den">';
    var dens = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];
    for (var i = 0; i < dens.length; i++) {
      var v = dens[i];
      var cant = estado.caja.denominaciones[v] || 0;
      html += '<div class="g-campo"><label>' + fmt(v) + '</label><input class="g-input" value="' + cant + '" onchange="SIM.denominacion(' + v + ', this.value)"></div>';
    }
    html += '</div>';
    var dif = fisico - esperado2;
    html += '<div class="g-kpis" style="margin-top:12px"><div class="g-kpi"><span>Contado físico</span><b>' + fmt(fisico) + '</b></div>' +
      '<div class="g-kpi"><span>Diferencia</span><b style="color:' + (dif === 0 ? 'var(--verde)' : 'var(--rojo)') + '">' + fmt(dif) + '</b></div></div>';
    html += '<div class="g-pills"><button class="g-btn" onclick="SIM.cerrar()">Guardar cierre</button></div>';
    html += '<div id="sx_msg"></div>';
    if (estado.cierres.length > 0) {
      html += '<h2 style="margin-top:16px">Cierres guardados</h2><table class="g-tabla"><tr><th>Cierre</th><th>Fecha</th><th class="num">Sistema</th><th class="num">Físico</th><th class="num">Diferencia</th></tr>';
      for (var c = 0; c < estado.cierres.length; c++) {
        var ci = estado.cierres[c];
        html += '<tr><td>#' + ci.id + '</td><td>' + ci.fecha + '</td><td class="num">' + fmt(ci.sistema) + '</td><td class="num">' + fmt(ci.fisico) + '</td><td class="num">' + fmt(ci.diferencia) + '</td></tr>';
      }
      html += '</table>';
    }
    html += '</div></div>';
    return html;
  },
  base: function (v) { estado.caja.base = parseFloat(v) || 0; SIM.pintar(); },
  denominacion: function (v, c) { estado.caja.denominaciones[v] = Math.max(0, parseInt(c || '0', 10)); SIM.pintar(); },
  egreso: function () {
    var v = parseFloat($('sx_egreso').value || '0');
    if (v > 0) { estado.caja.movimientos.push({concepto: 'EGRESO PRÁCTICA', valor: -v, tipo: 'EGRESO'}); }
    SIM.pintar();
  },
  cerrar: function () {
    var r = SIM.resumenDia();
    var fisico = 0;
    for (var d in estado.caja.denominaciones) { fisico += parseInt(d, 10) * estado.caja.denominaciones[d]; }
    var sistema = r.efectivo + r.abonos + r.ingresos - r.egresos;
    var cierre = {id: estado.numeros.cierre++, fecha: new Date().toISOString().slice(0, 10), sistema: sistema, fisico: fisico, diferencia: fisico - (estado.caja.base + sistema)};
    for (var i = 0; i < estado.ventas.length; i++) { if (estado.ventas[i].cierre === 0) { estado.ventas[i].cierre = cierre.id; } }
    estado.cierres.push(cierre);
    estado.caja.movimientos = [];
    estado.caja.denominaciones = {};
    SIM.pintar();
    $('sx_msg').innerHTML = '<div class="g-ok">Cierre #' + cierre.id + ' guardado. Las ventas del día quedaron marcadas con este cierre y no volverán a contar en el próximo.</div>';
  }
};

/* ============================================================
   eventos generales
   ============================================================ */
$('g_buscar').addEventListener('input', function () {
  renderNav(this.value);
  if (!$('g_vista_inicio').hidden) { pintarTarjetas(this.value); }
  if (!$('g_vista_modulo').hidden) { /* búsqueda no afecta el detalle */ }
});
$('g_modo').addEventListener('click', function () {
  var actual = document.documentElement.getAttribute('data-modo');
  aplicarModo(actual === 'claro' ? 'oscuro' : 'claro');
});
$('g_imprimir').addEventListener('click', function () { window.print(); });
$('g_menu_btn').addEventListener('click', function () { $('g_panel').classList.toggle('abierto'); });

/* arranque */
renderNav('');
mostrar('inicio');
