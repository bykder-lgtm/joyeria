var RUTA = [
  {titulo: 'Día 1 · Conoce lo básico', texto: 'Entra al sistema, mira el Panel y aprende a crear una pieza y un cliente.', modulos: ['acceso', 'panel', 'ajustes', 'pieza', 'vender']},
  {titulo: 'Día 2 · Aprende a vender', texto: 'Practica con el simulador: vende, cobra en efectivo, a crédito y con descuento.', modulos: ['vender', 'cobrar', 'ventas', 'puntos']},
  {titulo: 'Día 3 · Maneja el dinero', texto: 'Registra abonos, revisa la cartera, haz movimientos de caja y cierra el día.', modulos: ['cartera', 'pagar', 'caja', 'cierre', 'cajas']},
  {titulo: 'Día 4 · Inventario y servicios', texto: 'Ajusta inventario, gestiona taller, apartados, compras de oro y avalúos.', modulos: ['inventario', 'vitrina', 'taller', 'apartados', 'compras', 'avaluos', 'cotizacion', 'cotizaciones', 'garantias', 'devoluciones']},
  {titulo: 'Día 5 · Administración', texto: 'Interpreta informes, emite factura electrónica y administra las resoluciones.', modulos: ['informes', 'dian', 'resoluciones', 'tema']}
];

var GLOSARIO = [
  ['Pieza', 'Joya única en la vitrina. Tiene código propio, estado (disponible, reservada, apartada, vendida) y su ficha con metal, ley, peso y fotos.'],
  ['SKU o insumo', 'Producto con varias unidades iguales (por ejemplo, argollas o cadenas repetidas). Se vende por cantidad y descuenta stock.'],
  ['Temporal', 'Carrito de la venta. Las piezas se marcan y pasan a la factura abierta antes de cobrar.'],
  ['Factura abierta', 'Venta en curso. Se cierra desde Cobrar y solo entonces baja el inventario y se registra el dinero.'],
  ['Crédito', 'Venta que queda debiendo el cliente. Se crea una cuenta por cobrar (cartera) con el saldo pendiente.'],
  ['Abono', 'Pago parcial del cliente sobre una cuenta por cobrar. Baja el saldo y genera comprobante.'],
  ['Arqueo', 'Conteo de billetes y monedas al cerrar la caja. Se compara con el efectivo que el sistema espera.'],
  ['Nota crédito', 'Documento de una devolución. Repone inventario y ajusta la cartera y la factura.'],
  ['Resolución', 'Numeración autorizada para facturar (prefijo y rango). La predeterminada es la que usa el POS.'],
  ['Puntos', 'Beneficio por compra. Se acumulan al vender y se redimen como descuento en la siguiente venta.'],
  ['Garantía', 'Cobertura de la pieza vendida. Se calcula con los meses configurados y la fecha de la factura.']
];

var MODULOS = [
/* ================= PRIMEROS PASOS ================= */
{
  id:'acceso', grupo:'Primeros pasos', titulo:'Acceder al sistema', color:'#c9a227',
  resumen:'Entrar con el usuario y la contraseña de la joyería.',
  que_hace:['Valida tu usuario y contraseña contra los usuarios autorizados.','Si ya tenías sesión en el sistema general, entra directo sin pedir datos otra vez.'],
  como_funciona:['Al entrar se guarda tu nombre, tu caja y un token de seguridad para el resto de la jornada.','Queda registrada la hora y el equipo desde el que ingresaste.'],
  pasos:['Abre la dirección del sistema de joyería.','Escribe tu usuario (la cuenta, no el correo).','Escribe tu contraseña y presiona Entrar.','Si los datos son correctos verás el Panel; si no, revisa mayúsculas y vuelve a intentar.'],
  tip:'Puedes usar el botón Salir de la barra superior para cerrar tu sesión cuando termines.',
  mock:{tipo:'form', titulo:'Joyería · Entrar', campos:[['Usuario','vendedor'],['Contraseña','••••••••']], botones:['Entrar']}
},
{
  id:'panel', grupo:'Primeros pasos', titulo:'Panel de inicio', color:'#c9a227',
  resumen:'El resumen del día en una sola pantalla.',
  que_hace:['Muestra las ventas y la utilidad del día, el efectivo esperado en caja y lo que hay en vitrina.','Avisa apartados vencidos, garantías por vencer, saldos de cartera y facturas pendientes de DIAN.'],
  como_funciona:['Toma los datos reales de la base de datos cada vez que abres o recargas la página.','Los accesos rápidos llevan al módulo correspondiente con un clic.'],
  pasos:['Entra al sistema.','Revisa los recuadros de arriba (ventas, utilidad, caja, cartera).','Mira las alertas: apartados vencidos, garantías, DIAN pendiente.','Usa los botones grandes para ir a Vender, Cobrar, Caja o Cierre.'],
  tip:'Empieza el día revisando el Panel: te dice exactamente qué requiere tu atención.',
  mock:{tipo:'kpis', titulo:'Panel de la joyería', items:[['Ventas de hoy','$1.250.000'],['Utilidad de hoy','$420.000'],['Efectivo esperado','$2.050.000'],['En vitrina','148 piezas'],['Cartera pendiente','$3.400.000'],['DIAN pendientes','2']]}
},
{
  id:'tema', grupo:'Primeros pasos', titulo:'Apariencia (paleta y modo)', color:'#c9a227',
  resumen:'Cambia los colores y el modo claro u oscuro a tu gusto.',
  que_hace:['Ofrece varias paletas de color y alterna entre modo claro y oscuro.'],
  como_funciona:['La elección se guarda en tu usuario, así que al volver a entrar conservas tu estilo.','Los puntos de color de la barra cambian la paleta al instante.'],
  pasos:['Haz clic en un punto de color de la barra superior.','Usa el botón Claro / Oscuro para alternar el modo.','Recarga la página: tu elección se mantiene.'],
  tip:'Usa el modo claro si trabajas con mucha luz y el oscuro para ambientes con poca luz.',
  mock:{tipo:'kpis', titulo:'Temas', items:[['Paleta actual','Oro'],['Modo','Oscuro'],['Paletas','4 disponibles']]}
},
{
  id:'ajustes', grupo:'Primeros pasos', titulo:'Ajustes y catálogos', color:'#c9a227',
  resumen:'Configura el IVA, garantías, márgenes y las listas desplegables.',
  que_hace:['Guarda reglas del negocio: IVA sugerido, meses de garantía, margen al comprar oro, redondeo, política de apartados y textos.','Administra las listas: metales, tipos de piedra, categorías, estados y demás catálogos.'],
  como_funciona:['Cada ajuste se aplica de inmediato en los módulos que lo usan (POS, compras, avalúos, garantías).','Si agregas una opción a un catálogo aparece en los formularios correspondientes.'],
  pasos:['Entra en Ajustes.','Edita el valor que necesites.','Pulsa Guardar cambios.','Para listas, escribe el nuevo valor y su etiqueta y guárdalo.'],
  tip:'Antes de empezar a vender revisa: IVA, garantías, margen de compra de oro y política de apartados.',
  mock:{tipo:'form', titulo:'Ajustes', campos:[['IVA sugerido %','19'],['Garantía pieza nueva (meses)','12'],['Garantía usada (meses)','3'],['Política de apartado','DEVOLVER']], botones:['Guardar cambios']}
},
/* ================= VENDER ================= */
{
  id:'vender', grupo:'Vender', titulo:'Vender (mostrador)', color:'#2fbf71',
  resumen:'Elegir las piezas y el cliente para iniciar la factura.',
  que_hace:['Muestra las piezas disponibles con buscador y precio.','Permite elegir el cliente de la venta o registrar uno nuevo completo sin salir de la página.'],
  como_funciona:['Al marcar piezas y pasar a cobrar, se abre la factura con esas líneas y las piezas quedan reservadas.','El buscador de piezas filtra por nombre, metal, talla o vitrina; el buscador de clientes está dentro de la lista desplegable.'],
  pasos:['Escribe en Buscar pieza para encontrarla rápido.','Marca la casilla de cada pieza a vender (si es SKU o insumo ajusta la cantidad).','Elige el cliente con el buscador integrado o pulsa Registrar cliente completo y llena el formulario.','Pulsa Pasar a cobrar.'],
  tip:'Puedes iniciar la venta seleccionando la pieza desde la Vitrina con el botón Vender fuera de línea.',
  mock:{tipo:'form', titulo:'Vender · Mostrador', campos:[['Buscar pieza','anillo oro'],['Cliente','Ana María Pérez 12345678'],['Piezas marcadas','Anillo oro 18k + Cadena plata 925']], botones:['Registrar cliente completo','Pasar a cobrar']},
  simulador:'venta'
},
{
  id:'cobrar', grupo:'Vender', titulo:'Cobrar (POS)', color:'#2fbf71',
  resumen:'Cerrar la venta, elegir forma de pago y calcular cambio o crédito.',
  que_hace:['Cobra la factura abierta: formas de pago, contado o crédito, descuento, pago mixto y puntos.','Calcula el cambio cuando el cliente paga de más y crea la cartera cuando queda debiendo.'],
  como_funciona:['Si eliges Contado, el sistema pide el recibido y calcula el cambio.','Si eliges Crédito, el valor de Recibido es el abono inicial y el saldo queda en Cartera.','Si el recibido es menor al total, la venta se registra como crédito automáticamente.'],
  pasos:['Revisa las líneas y ajusta precio o quita líneas si hace falta.','Elige la forma de pago y la modalidad (Contado o Crédito).','Si aplica, escribe el descuento, el segundo pago, los puntos a redimir y las retenciones.','Escribe lo recibido y pulsa Cobrar y cerrar factura.'],
  tip:'En crédito deja el abono inicial en 0 si el cliente no paga nada hoy.',
  mock:{tipo:'form', titulo:'Cobrar', campos:[['Total','$1.070.000'],['Modalidad','Crédito'],['Abono inicial','$200.000'],['Saldo a cartera','$870.000']], botones:['Cobrar y cerrar factura']},
  simulador:'venta'
},
{
  id:'ventas', grupo:'Vender', titulo:'Ventas (historial y anulación)', color:'#2fbf71',
  resumen:'Consultar las facturas, reimprimir y anular.',
  que_hace:['Lista las facturas cerradas y anuladas por rango de fechas, con cliente, forma de pago y total.','Permite abrir el detalle, reimprimir la factura y anular una venta.'],
  como_funciona:['Al anular, la pieza vuelve a vitrina, se devuelve el stock y se limpia la cartera si el cliente no había abonado.','La factura anulada queda registrada con su historial.'],
  pasos:['Elige el rango Desde / Hasta y pulsa Filtrar.','Pulsa Abrir en la factura que quieras revisar.','Reimprime con Reimprimir o anula con Anular factura.'],
  tip:'Si el cliente devuelve solo una parte, usa Devoluciones en lugar de anular toda la factura.',
  mock:{tipo:'tabla', titulo:'Ventas', columnas:['Factura','Fecha','Cliente','Estado','Total'], filas:[['FVE 1021','2026-10-09','Ana María Pérez','CERRADA','$1.070.000'],['FVE 1020','2026-10-08','Carlos Gómez','ANULADA','$410.000'],['FVE 1019','2026-10-08','Consumidor final','CERRADA','$220.000']]}
},
{
  id:'devoluciones', grupo:'Vender', titulo:'Devoluciones y nota crédito', color:'#2fbf71',
  resumen:'Registrar la devolución de una pieza y ajustar todo.',
  que_hace:['Devuelve total o parcialmente una factura cerrada y genera una nota crédito.','Repone el inventario (vitrina o unidades), ajusta la cartera y marca la línea devuelta.'],
  como_funciona:['Eliges la factura, marcas las cantidades a devolver y escribes el motivo.','El sistema calcula el valor devuelto y descuenta el saldo si era crédito.'],
  pasos:['Filtra por fecha y abre la factura.','Escribe la cantidad a devolver en cada línea.','Anota el motivo y pulsa Generar nota crédito.','Imprime el comprobante si el cliente lo necesita.'],
  tip:'Una línea ya devuelta por completo no se puede volver a devolver.',
  mock:{tipo:'doc', titulo:'Nota crédito', lineas:['Cliente: Ana María Pérez','Factura original: FVE 1021','Anillo oro 18k x1 — $850.000','TOTAL DEVUELTO: $850.000','Inventario repuesto y cartera ajustada']},
  simulador:'devolucion'
},
/* ================= CAJA Y DINERO ================= */
{
  id:'caja', grupo:'Caja y dinero', titulo:'Caja (movimientos y arqueo)', color:'#4aa3df',
  resumen:'Registrar ingresos y egresos y contar el efectivo.',
  que_hace:['Registra ingresos y egresos de la joyería con concepto, valor y forma de pago.','Muestra el resumen del día y permite guardar el arqueo por denominaciones.'],
  como_funciona:['Cada movimiento se guarda con su concepto y queda listado por fechas.','El arqueo se guarda para usarlo en el cierre del día.'],
  pasos:['Elige el concepto (por ejemplo, BASE CAJA o GASTOS CASA).','Escribe el valor, la forma de pago, la fecha y un comentario.','Pulsa Guardar movimiento.','Cuenta los billetes y monedas, escribe las cantidades y pulsa Guardar arqueo.'],
  tip:'El comentario ayuda a recordar después en qué se gastó el dinero.',
  mock:{tipo:'form', titulo:'Caja', campos:[['Concepto','GASTOS CASA'],['Valor','$80.000'],['Forma de pago','Efectivo'],['Comentario','aseo']], botones:['Guardar movimiento','Guardar arqueo']},
  simulador:'cierre'
},
{
  id:'cierre', grupo:'Caja y dinero', titulo:'Cierre de caja', color:'#4aa3df',
  resumen:'Cerrar el día y comparar lo contado con lo esperado.',
  que_hace:['Reúne las ventas del día, los abonos, los ingresos y los egresos.','Compara el efectivo esperado con el arqueo y guarda el cierre con su diferencia.'],
  como_funciona:['Las ventas cerradas quedan marcadas con el número de cierre y ya no entran en el siguiente.','La diferencia muestra si sobró o faltó dinero.'],
  pasos:['Elige la fecha (normalmente hoy) y si es solo tu caja o todas.','Revisa los totales: ventas, contado, crédito, abonos, base.','Escribe el conteo de billetes y monedas.','Pulsa Guardar cierre e imprime el recibo.'],
  tip:'Haz el cierre todos los días: es la mejor forma de detectar diferencias a tiempo.',
  mock:{tipo:'kpis', titulo:'Cierre de caja', items:[['Ventas','$1.250.000'],['Contado efectivo','$700.000'],['Crédito','$550.000'],['Base','$200.000'],['Físico','$900.000'],['Diferencia','$0']]},
  simulador:'cierre'
},
{
  id:'cajas', grupo:'Caja y dinero', titulo:'Cajas (multi-caja)', color:'#4aa3df',
  resumen:'Asignar cajas a los usuarios y elegir la caja activa.',
  que_hace:['Asigna un número de caja a cada usuario y permite elegir tu caja activa.','Define la base de caja con la que empiezas el día.'],
  como_funciona:['Cada venta y factura guarda la caja con la que se hizo.','Puedes cerrar por caja o consolidado (todas).'],
  pasos:['Revisa tu caja activa y la base.','Si necesitas cambiarla, edita el número y guarda.','Para asignar una caja a otra persona, elige el usuario y el número y pulsa Asignar caja.'],
  tip:'Usa bases distintas por caja para cuadrar el efectivo por separado.',
  mock:{tipo:'tabla', titulo:'Cajas', columnas:['Caja','Usuario','Cuenta','Base'], filas:[['1','Ana María','vendedor','$200.000'],['2','Carlos','vendedor2','$150.000']]}
},
{
  id:'cartera', grupo:'Caja y dinero', titulo:'Cartera (cuentas por cobrar)', color:'#4aa3df',
  resumen:'Controlar quién debe, abonar y cobrar.',
  que_hace:['Lista las cuentas por cobrar de las ventas a crédito con su saldo y vencimiento.','Registra abonos, imprime comprobantes y genera el estado de cuenta del cliente.'],
  como_funciona:['Cada abono baja el saldo y actualiza la deuda del cliente.','Las cuentas con fecha vencida se marcan para que las persigas.'],
  pasos:['Filtra por cliente, estado o fechas.','Abre la cuenta y revisa la deuda y los abonos.','Escribe el valor del abono, elige la forma de pago y pulsa Registrar abono.','Imprime el comprobante o el estado de cuenta.'],
  tip:'Guarda la fecha de compromiso de pago para saber cuáles están vencidas.',
  mock:{tipo:'tabla', titulo:'Cartera', columnas:['Factura','Cliente','Deuda','Abonado','Saldo','Vence'], filas:[['FVE 1021','Ana María Pérez','$1.070.000','$200.000','$870.000','2026-11-09'],['FVE 1015','Carlos Gómez','$410.000','$410.000','$0','—']]},
  simulador:'cartera'
},
{
  id:'pagar', grupo:'Caja y dinero', titulo:'Cuentas por pagar', color:'#4aa3df',
  resumen:'Debes a dueños de consignación o vendedores de oro usado.',
  que_hace:['Lista las deudas con dueños de piezas en consignación y con quienes te vendieron oro.','Registra pagos totales o parciales y genera comprobante.'],
  como_funciona:['Al vender una pieza en consignación se crea la deuda automáticamente.','El pago en efectivo también queda registrado como egreso de caja.'],
  pasos:['Abre la cuenta por pagar del dueño.','Escribe el valor del pago y la forma de pago.','Pulsa Registrar pago e imprime el comprobante.'],
  tip:'Paga solo desde aquí para que la deuda y la caja queden cuadradas.',
  mock:{tipo:'tabla', titulo:'Cuentas por pagar', columnas:['Pieza','Dueño','Deuda','Pagado','Saldo'], filas:[['Cadena oro 18k','Pedro Ruiz','$900.000','$300.000','$600.000']]}
},
{
  id:'puntos', grupo:'Caja y dinero', titulo:'Puntos de fidelización', color:'#4aa3df',
  resumen:'Premiar a los clientes que compran.',
  que_hace:['Acumula puntos por cada venta según el porcentaje configurado.','Muestra el saldo de cada cliente y permite redimir puntos.'],
  como_funciona:['Al vender, el cliente recibe puntos; los puedes usar como descuento en la siguiente venta (campo Puntos a redimir del POS).','Al redimir no se acumulan puntos nuevos en esa venta.'],
  pasos:['Configura el % de acumulación y el valor del punto en Ajustes.','Al vender, escribe los puntos a redimir si el cliente quiere usarlos.','Consulta saldos y redime manualmente desde Puntos.'],
  tip:'El valor del punto es el descuento en pesos que representa cada punto.',
  mock:{tipo:'kpis', titulo:'Puntos', items:[['Acumulación','1% del total'],['Valor de 1 punto','$1'],['Clientes con puntos','2']]}
},
/* ================= INVENTARIO ================= */
{
  id:'pieza', grupo:'Inventario', titulo:'Nueva pieza (ficha completa)', color:'#c9a227',
  resumen:'Registrar una joya con todos sus datos.',
  que_hace:['Crea la ficha de la pieza: nombre, metal, ley, peso, talla, precio, fotos, certificado y piedras montadas.','Genera un código de barras interno para encontrarla en el POS.'],
  como_funciona:['Puedes calcular el precio por peso y ley con el botón Calcular.','Las piedras se guardan como subproductos y al vender la pieza se descuentan del inventario.'],
  pasos:['Escribe el nombre y elige el tipo (Pieza o SKU).','Completa metal, ley, peso, talla y ubicación.','Si quieres, añade piedras con el botón Agregar piedra.','Fija el precio de venta y guarda.'],
  tip:'Toma una buena foto: ayuda a mostrar la pieza al cliente.',
  mock:{tipo:'form', titulo:'Nueva pieza', campos:[['Nombre','Anillo compromiso'],['Metal / ley','ORO 18k (750)'],['Peso','4.2 g'],['Precio de venta','$2.450.000'],['Piedra','DIAMANTE 0.5 ct']], botones:['Calcular precio','Guardar pieza']},
  simulador:'pieza'
},
{
  id:'vitrina', grupo:'Inventario', titulo:'Vitrina (listado de piezas)', color:'#c9a227',
  resumen:'Ver lo que está a la vista y abrir la ficha.',
  que_hace:['Lista las piezas disponibles con su precio, estado y ubicación.','Permite abrir la ficha o pasar directo a la venta.'],
  como_funciona:['Los filtros muestran por estado: disponibles, reservadas, apartadas o todas.','Cada pieza muestra su código y su ubicación (vitrina o caja fuerte).'],
  pasos:['Entra en Vitrina.','Usa el buscador o los filtros de estado.','Abre una pieza para ver su ficha o márcala para vender.'],
  tip:'Revisa la vitrina cada mañana para confirmar que todo está donde debe.',
  mock:{tipo:'tabla', titulo:'Vitrina', columnas:['Pieza','Metal','Peso','Estado','Precio'], filas:[['Anillo compromiso','ORO 750','4.2 g','DISPONIBLE','$2.450.000'],['Cadena plata 925','PLATA 925','12 g','DISPONIBLE','$320.000'],['Dije corazón','ORO 585','2.1 g','RESERVADA','$410.000']]}
},
{
  id:'inventario', grupo:'Inventario', titulo:'Inventario (ajustes y bajas)', color:'#c9a227',
  resumen:'Corregir cantidades, mover piezas, dar de baja y cambiar precios.',
  que_hace:['Ajusta cantidades cuando sobra o falta mercancía.','Traslada piezas de ubicación, da de baja y reactiva, y cambia precios.'],
  como_funciona:['Cada cambio queda en el historial de la pieza con fecha y motivo.','Los ajustes no borran información: siempre se puede consultar qué pasó.'],
  pasos:['Busca la pieza por nombre o código.','Escribe el ajuste (+ o −) y el motivo.','O usa Trasladar, Revalorizar, Dar de baja o Reactivar.','Revisa el historial de la pieza para confirmar el cambio.'],
  tip:'Haz el conteo físico al menos una vez al mes y ajusta desde aquí.',
  mock:{tipo:'form', titulo:'Inventario', campos:[['Pieza','Cadena plata 925'],['Cantidad actual','12'],['Ajuste','-2'],['Motivo','conteo físico']], botones:['Ajustar','Trasladar','Revalorizar','Dar de baja']}
},
/* ================= SERVICIOS ================= */
{
  id:'taller', grupo:'Servicios', titulo:'Taller (reparaciones)', color:'#e4572e',
  resumen:'Recibir arreglos y controlar su avance.',
  que_hace:['Registra la reparación con la pieza, el cliente, la descripción y la fecha de promesa.','Avanza la reparación por pasos (recibida, diagnóstico, en proceso, lista...) y permite cobrarla.'],
  como_funciona:['Cada paso queda registrado con su fecha.','Al cobrar, la mano de obra pasa a la factura para cerrarla en el POS.'],
  pasos:['Anota el cliente y la pieza o descripción del trabajo.','Fija la fecha de promesa y el valor de la mano de obra.','Pulsa Recibir reparación.','Avísale al cliente cuando esté lista y pulsa Cobrar taller.'],
  tip:'Toma fotos o anota detalles al recibir: evita reclamos después.',
  mock:{tipo:'form', titulo:'Taller', campos:[['Cliente','Ana María Pérez'],['Trabajo','soldar anillo'],['Promesa','2026-10-15'],['Mano de obra','$50.000'],['Estado','EN_PROCESO']], botones:['Recibir reparación','Avanzar paso','Cobrar taller']}
},
{
  id:'apartados', grupo:'Servicios', titulo:'Apartados', color:'#e4572e',
  resumen:'Guardar una pieza con abonos y entregarla al final.',
  que_hace:['Aparta una pieza con abono inicial y fecha límite.','Registra abonos, cancela con la política configurada o entrega pasando la venta al POS.'],
  como_funciona:['Mientras está apartada, la pieza no se puede vender a otra persona.','Al entregar, el saldo se cobra en la caja con el resto de la venta.'],
  pasos:['Elige la pieza, el cliente nuevo o existente y la fecha límite.','Escribe el abono inicial y pulsa Crear apartado.','A medida que el cliente paga, registra abonos.','Cuando pague todo, pulsa Entregar y termina la venta en el POS.'],
  tip:'Revisa el Panel: te avisa los apartados vencidos.',
  mock:{tipo:'tabla', titulo:'Apartados', columnas:['Pieza','Cliente','Abonado','Saldo','Límite'], filas:[['Anillo compromiso','Ana María','$500.000','$1.950.000','2026-11-30']]}
},
{
  id:'compras', grupo:'Servicios', titulo:'Comprar oro (usado)', color:'#e4572e',
  resumen:'Comprar oro usado calculando el valor por gramo.',
  que_hace:['Calcula cuánto pagar por oro o plata usados según el precio del día, el peso, la ley y el margen.','Guarda el recibo, deja la pieza en permanencia y controla la retroventa.'],
  como_funciona:['El valor se calcula con el precio del gramo fino registrado hoy.','Si el vendedor no reclama la pieza en el plazo, la compra queda en firme.'],
  pasos:['Anota el precio del metal del día (módulo Precio del día).','Elige metal, peso, ley y margen.','Revisa el valor calculado, anota al vendedor y guarda.','Imprime el recibo de compra.'],
  tip:'Compara el precio del día antes de comprar: puedes ajustar el margen.',
  mock:{tipo:'form', titulo:'Compra de oro usado', campos:[['Metal','ORO'],['Peso','8.5 g'],['Ley','750'],['Margen','15%'],['Valor a pagar','$2.760.000']], botones:['Guardar compra']}
},
{
  id:'avaluos', grupo:'Servicios', titulo:'Avalúos', color:'#e4572e',
  resumen:'Entregar un valor por escrito a un cliente.',
  que_hace:['Registra el avalúo de una pieza con su descripción, valor, finalidad y vigencia.','Genera el documento para imprimir o enviar.'],
  como_funciona:['No mueve inventario: es solo un documento de valor.','La finalidad puede ser venta, seguro o trámite.'],
  pasos:['Elige el cliente o anota uno nuevo.','Describe la pieza y escribe el valor.','Fija la vigencia y la finalidad.','Guarda e imprime el avalúo.'],
  tip:'Aclara en la descripción el estado de la pieza (nueva o usada).',
  mock:{tipo:'doc', titulo:'Avalúo', lineas:['Para: Carlos Gómez','Pieza: Anillo oro 18k','VALOR: $2.450.000','Finalidad: SEGURO','Vigente hasta: 2026-12-31']}
},
{
  id:'cotizacion', grupo:'Servicios', titulo:'Precio del metal (cotización)', color:'#e4572e',
  resumen:'Fijar el precio del gramo fino del día.',
  que_hace:['Guarda el precio diario del oro y la plata con la fuente.','El mostrador, las compras y las piezas por gramo usan ese valor.'],
  como_funciona:['Puedes anotar un precio por metal cada día.','El Panel muestra el precio vigente.'],
  pasos:['Entra en Precio del día.','Elige el metal y escribe el precio del gramo fino.','Anota la fuente y guarda.'],
  tip:'Anótalo en la mañana: los precios por gramo de la vitrina dependen de él.',
  mock:{tipo:'kpis', titulo:'Precio del día', items:[['ORO gramo fino','$310.000'],['PLATA gramo fino','$3.900'],['Fuente','Banco Joyero'],['Fecha','2026-10-09']]}
},
{
  id:'cotizaciones', grupo:'Servicios', titulo:'Cotizaciones de venta', color:'#e4572e',
  resumen:'Armar un presupuesto para el cliente.',
  que_hace:['Crea un presupuesto con piezas, precios, vigencia y nota.','Permite pasarlo a la caja tal cual cuando el cliente decide comprar.'],
  como_funciona:['La cotización no reserva la pieza ni baja inventario.','Al pasar a caja, las piezas se convierten en la venta.'],
  pasos:['Elige el cliente, la vigencia y una nota.','Marca las piezas y ajusta cantidades y precios.','Guarda la cotización e imprímela.','Si el cliente acepta, pulsa Pasar a la caja.'],
  tip:'Guarda una nota con las condiciones para dejar claro qué incluye.',
  mock:{tipo:'doc', titulo:'Cotización', lineas:['Cliente: Ana María Pérez','Anillo oro 18k x1 — $2.450.000','Argollas plata x2 — $360.000','TOTAL COTIZADO: $2.810.000','Vigente hasta: 2026-10-24']}
},
{
  id:'garantias', grupo:'Servicios', titulo:'Garantías', color:'#e4572e',
  resumen:'Saber qué piezas están en garantía y hasta cuándo.',
  que_hace:['Muestra las piezas vendidas y el tiempo de garantía que les queda.','Permite imprimir el certificado de garantía.'],
  como_funciona:['La garantía se calcula con la fecha de la factura y los meses configurados (nueva o usada).','El Panel avisa las garantías que están por vencer.'],
  pasos:['Entra en Garantías.','Busca el cliente o la pieza.','Imprime el certificado cuando el cliente lo necesite.'],
  tip:'Guarda el certificado con la factura: agiliza cualquier reclamo.',
  mock:{tipo:'tabla', titulo:'Garantías', columnas:['Pieza','Cliente','Venta','Vence','Días'], filas:[['Anillo compromiso','Ana María','2026-10-09','2027-10-09','365'],['Dije corazón','Carlos','2026-06-01','2026-10-15','6']]}
},
/* ================= ADMINISTRACIÓN ================= */
{
  id:'informes', grupo:'Administración', titulo:'Informes', color:'#9b59b6',
  resumen:'Ver cómo va el negocio con números.',
  que_hace:['Muestra ventas, utilidad, formas de pago, vendedores, inventario valorizado, cartera, cierres y garantías.','Permite exportar las ventas a un archivo CSV para Excel.'],
  como_funciona:['Eliges un rango de fechas y todo se recalcula al instante.','El informe compara ventas con costo para mostrar la utilidad.'],
  pasos:['Elige el rango Desde / Hasta.','Pulsa Ver informes.','Revisa los recuadros y las tablas.','Si necesitas Excel, pulsa Exportar ventas CSV.'],
  tip:'Revisa el informe de utilidad una vez por semana para ajustar precios.',
  mock:{tipo:'kpis', titulo:'Informes', items:[['Ventas','$12.450.000'],['Costo','$7.300.000'],['Utilidad','$5.150.000'],['Cartera','$3.400.000'],['Garantías por vencer','4']]}
},
{
  id:'dian', grupo:'Administración', titulo:'Factura electrónica DIAN', color:'#9b59b6',
  resumen:'Emitir o reintentar la factura electrónica.',
  que_hace:['Lista las facturas cerradas con su estado en la DIAN y su CUFE.','Permite emitir o reintentar la factura y las notas crédito de las devoluciones.'],
  como_funciona:['La emisión usa la configuración de la empresa (entorno, cuenta y token) y la resolución predeterminada.','Si todo sale bien, la factura queda DIAN ACEPTADO con su CUFE y PDF.'],
  pasos:['Elige el rango de fechas.','Abre la factura y revisa el estado.','Pulsa Emitir a la DIAN o Reintentar emisión.','Descarga el PDF o revisa los mensajes si hay un error.'],
  tip:'Si una factura queda pendiente, revisa la conexión a internet y reintenta; no la anules.',
  mock:{tipo:'tabla', titulo:'Factura electrónica', columnas:['Factura','Fecha','Estado DIAN','CUFE'], filas:[['FVE 1021','2026-10-09','DIAN ACEPTADO','abc123...'],['FVE 1020','2026-10-08','DATAICO RECIBIO','—'],['FVE 1019','2026-10-08','SIN ENVIAR','—']]}
},
{
  id:'resoluciones', grupo:'Administración', titulo:'Resoluciones de facturación', color:'#9b59b6',
  resumen:'Administrar la numeración autorizada para facturar.',
  que_hace:['Crea y edita resoluciones con prefijo, rango, fechas y vigencia.','Marca cuál es la predeterminada y activa o inactiva las demás.'],
  como_funciona:['El POS numera las facturas con la resolución predeterminada, respetando el rango.','Solo puede haber una resolución predeterminada a la vez.'],
  pasos:['Revisa las resoluciones y su rango usado.','Para crear una nueva, completa el formulario y guarda.','Pulsa Predeterminar en la resolución que usarás.'],
  tip:'Antes de activar una resolución nueva verifica el prefijo y el rango.',
  mock:{tipo:'tabla', titulo:'Resoluciones', columnas:['Tipo','Prefijo','Rango','Usado','Predeterminada'], filas:[['POS','FVE','1 - 5000','21','SI'],['ELECTRONICA','ELE','1 - 1000','0','']]}
}
];
