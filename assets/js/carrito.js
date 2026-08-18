const CLAVE_CARRITO = "sodaSlothCarrito";

/*
    IMPORTANTE:
    CAMBIA ESTE NÚMERO POR EL WHATSAPP REAL
    DE SODA SLOTH.

    FORMATO:
    506 + 8 DÍGITOS

    SIN ESPACIOS NI GUIONES.
*/

const NUMERO_WHATSAPP_SODA_SLOTH = "50662202314";

let carrito = cargarCarrito();


/* =========================================================
   CARGAR CARRITO
========================================================= */

function cargarCarrito() {

    try {

        const carritoGuardado =
            localStorage.getItem(CLAVE_CARRITO);

        if (!carritoGuardado) {
            return [];
        }

        const datos =
            JSON.parse(carritoGuardado);

        return Array.isArray(datos)
            ? datos
            : [];

    } catch (error) {

        console.error(
            "Error al cargar el carrito:",
            error
        );

        return [];
    }
}


/* =========================================================
   GUARDAR CARRITO
========================================================= */

function guardarCarrito() {

    try {

        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify(carrito)
        );

        return true;

    } catch (error) {

        console.error(
            "Error al guardar el carrito:",
            error
        );

        return false;
    }
}


/* =========================================================
   VERIFICAR DISPONIBILIDAD
========================================================= */

function productoDisponibleCarrito(producto) {

    return !(
        producto.disponible === false ||
        producto.disponible === 0 ||
        producto.disponible === "0"
    );
}


/* =========================================================
   AGREGAR PRODUCTO
========================================================= */

function agregarAlCarrito(producto) {

    if (!producto) {
        return;
    }


    if (!productoDisponibleCarrito(producto)) {

        mostrarNotificacion(

            traducirTexto(
                "Este producto no está disponible.",
                "This product is not available."
            ),

            "advertencia"
        );

        return;
    }


    const productoExistente =
        carrito.find(

            function (item) {

                return (
                    String(item.id) ===
                    String(producto.id)
                );
            }
        );


    if (productoExistente) {

        productoExistente.cantidad += 1;

    } else {

        carrito.push({

            id:
                producto.id,

            nombre_es:
                producto.nombre_es || "",

            nombre_en:
                producto.nombre_en || "",

            precio:
                Number(producto.precio) || 0,

            imagen:
                producto.imagen || "",

            cantidad:
                1
        });
    }


    guardarCarrito();

    renderizarCarrito();


    mostrarNotificacion(

        traducirTexto(
            "Producto agregado al pedido.",
            "Product added to your order."
        ),

        "exito"
    );
}


/* =========================================================
   ELIMINAR PRODUCTO
========================================================= */

function eliminarDelCarrito(productoId) {

    carrito =
        carrito.filter(

            function (item) {

                return (
                    String(item.id) !==
                    String(productoId)
                );
            }
        );


    guardarCarrito();

    renderizarCarrito();


    mostrarNotificacion(

        traducirTexto(
            "Producto eliminado del pedido.",
            "Product removed from your order."
        ),

        "advertencia"
    );
}


/* =========================================================
   AUMENTAR CANTIDAD
========================================================= */

function aumentarCantidad(productoId) {

    const producto =
        carrito.find(

            function (item) {

                return (
                    String(item.id) ===
                    String(productoId)
                );
            }
        );


    if (!producto) {
        return;
    }


    producto.cantidad += 1;


    guardarCarrito();

    renderizarCarrito();
}


/* =========================================================
   DISMINUIR CANTIDAD
========================================================= */

function disminuirCantidad(productoId) {

    const producto =
        carrito.find(

            function (item) {

                return (
                    String(item.id) ===
                    String(productoId)
                );
            }
        );


    if (!producto) {
        return;
    }


    producto.cantidad -= 1;


    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(

                function (item) {

                    return (
                        String(item.id) !==
                        String(productoId)
                    );
                }
            );
    }


    guardarCarrito();

    renderizarCarrito();
}


/* =========================================================
   CANTIDAD TOTAL
========================================================= */

function calcularCantidadTotal() {

    return carrito.reduce(

        function (total, producto) {

            return (
                total +
                Number(producto.cantidad)
            );
        },

        0
    );
}


/* =========================================================
   TOTAL DEL CARRITO
========================================================= */

function calcularTotalCarrito() {

    return carrito.reduce(

        function (total, producto) {

            return (

                total +

                Number(producto.precio) *
                Number(producto.cantidad)

            );
        },

        0
    );
}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(precio) {

    const numero =
        Number(precio) || 0;


    return new Intl.NumberFormat(

        "es-CR",

        {
            style: "currency",
            currency: "CRC",
            maximumFractionDigits: 0
        }

    ).format(numero);
}


/* =========================================================
   NOMBRE DEL PRODUCTO
========================================================= */

function obtenerNombreProductoCarrito(producto) {

    if (
        typeof obtenerIdiomaActual === "function" &&
        obtenerIdiomaActual() === "en"
    ) {

        return (
            producto.nombre_en ||
            producto.nombre_es ||
            ""
        );
    }


    return (
        producto.nombre_es ||
        producto.nombre_en ||
        ""
    );
}


/* =========================================================
   IMAGEN DEL PRODUCTO
========================================================= */

function obtenerImagenCarrito(producto) {

    const imagen =
        String(
            producto.imagen || ""
        ).trim();


    if (!imagen) {

        return "assets/imagenes/restaurante.png";
    }


    return imagen;
}


/* =========================================================
   RENDERIZAR CARRITO
========================================================= */

function renderizarCarrito() {

    const listaCarrito =
        document.getElementById(
            "lista-carrito"
        );


    const carritoVacio =
        document.getElementById(
            "carrito-vacio"
        );


    const resumenCarrito =
        document.getElementById(
            "carrito-resumen"
        );


    const contadorCarrito =
        document.getElementById(
            "contador-carrito"
        );


    const totalCarrito =
        document.getElementById(
            "total-carrito"
        );


    const botonWhatsApp =
        document.getElementById(
            "boton-whatsapp"
        );


    if (contadorCarrito) {

        contadorCarrito.textContent =
            calcularCantidadTotal();
    }


    if (totalCarrito) {

        totalCarrito.textContent =
            formatearPrecio(
                calcularTotalCarrito()
            );
    }


    if (!listaCarrito) {
        return;
    }


    listaCarrito.innerHTML = "";


    if (carrito.length === 0) {

        if (carritoVacio) {

            carritoVacio.classList.remove(
                "oculto"
            );
        }


        if (resumenCarrito) {

            resumenCarrito.classList.add(
                "oculto"
            );
        }


        if (botonWhatsApp) {

            botonWhatsApp.disabled = true;
        }


        return;
    }


    if (carritoVacio) {

        carritoVacio.classList.add(
            "oculto"
        );
    }


    if (resumenCarrito) {

        resumenCarrito.classList.remove(
            "oculto"
        );
    }


    if (botonWhatsApp) {

        botonWhatsApp.disabled = false;
    }


    carrito.forEach(

        function (producto) {

            const subtotal =

                Number(producto.precio) *
                Number(producto.cantidad);


            const articulo =
                document.createElement(
                    "article"
                );


            articulo.className =
                "item-carrito";


            articulo.innerHTML = `

                <img
                    src="${obtenerImagenCarrito(producto)}"
                    alt="${obtenerNombreProductoCarrito(producto)}"
                    class="item-carrito-imagen"
                >


                <div class="item-carrito-informacion">


                    <div class="item-carrito-superior">


                        <span class="item-carrito-nombre">

                            ${obtenerNombreProductoCarrito(producto)}

                        </span>


                        <button
                            type="button"
                            class="boton-eliminar-carrito"
                            data-eliminar="${producto.id}"
                            aria-label="Eliminar producto"
                        >

                            ×

                        </button>


                    </div>


                    <span class="item-carrito-precio">

                        ${formatearPrecio(producto.precio)}

                    </span>


                    <div class="item-carrito-inferior">


                        <div class="control-cantidad">


                            <button
                                type="button"
                                data-disminuir="${producto.id}"
                            >

                                −

                            </button>


                            <span>

                                ${producto.cantidad}

                            </span>


                            <button
                                type="button"
                                data-aumentar="${producto.id}"
                            >

                                +

                            </button>


                        </div>


                        <span class="item-carrito-subtotal">

                            ${formatearPrecio(subtotal)}

                        </span>


                    </div>


                </div>
            `;


            const imagen =
                articulo.querySelector(
                    ".item-carrito-imagen"
                );


            if (imagen) {

                imagen.addEventListener(

                    "error",

                    function () {

                        this.src =
                            "assets/imagenes/restaurante.png";
                    },

                    {
                        once: true
                    }
                );
            }


            listaCarrito.appendChild(
                articulo
            );
        }
    );


    configurarEventosProductosCarrito();
}


/* =========================================================
   EVENTOS DE LOS PRODUCTOS
========================================================= */

function configurarEventosProductosCarrito() {

    document
        .querySelectorAll(
            "[data-aumentar]"
        )
        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        aumentarCantidad(
                            boton.dataset.aumentar
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-disminuir]"
        )
        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        disminuirCantidad(
                            boton.dataset.disminuir
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-eliminar]"
        )
        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        eliminarDelCarrito(
                            boton.dataset.eliminar
                        );
                    }
                );
            }
        );
}


/* =========================================================
   ABRIR CARRITO
========================================================= */

function abrirCarrito() {

    const panel =
        document.getElementById(
            "panel-carrito"
        );


    const fondo =
        document.getElementById(
            "fondo-carrito"
        );


    if (panel) {

        panel.classList.add(
            "activo"
        );
    }


    if (fondo) {

        fondo.classList.add(
            "activo"
        );
    }


    document.body.classList.add(
        "carrito-abierto"
    );
}


/* =========================================================
   CERRAR CARRITO
========================================================= */

function cerrarCarrito() {

    const panel =
        document.getElementById(
            "panel-carrito"
        );


    const fondo =
        document.getElementById(
            "fondo-carrito"
        );


    if (panel) {

        panel.classList.remove(
            "activo"
        );
    }


    if (fondo) {

        fondo.classList.remove(
            "activo"
        );
    }


    document.body.classList.remove(
        "carrito-abierto"
    );
}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function mostrarNotificacion(
    mensaje,
    tipo = "exito"
) {

    const contenedor =
        document.getElementById(
            "contenedor-notificaciones"
        );


    if (!contenedor) {

        console.log(mensaje);

        return;
    }


    const notificacion =
        document.createElement(
            "div"
        );


    notificacion.className =
        `notificacion notificacion-${tipo}`;


    let icono = "✓";


    if (tipo === "error") {
        icono = "×";
    }


    if (tipo === "advertencia") {
        icono = "!";
    }


    notificacion.innerHTML = `

        <strong>
            ${icono}
        </strong>

        <span>
            ${mensaje}
        </span>

    `;


    contenedor.appendChild(
        notificacion
    );


    setTimeout(

        function () {

            notificacion.remove();

        },

        3000
    );
}


/* =========================================================
   VACIAR CARRITO
========================================================= */

function vaciarCarrito() {

    carrito = [];

    guardarCarrito();

    renderizarCarrito();
}


/* =========================================================
   GENERAR MENSAJE WHATSAPP
========================================================= */

function generarMensajeWhatsApp(pedido) {

    let mensaje =
        "🦥 *NUEVO PEDIDO - SODA SLOTH*\n\n";


    mensaje +=
        `*Pedido:* #${pedido.id}\n`;


    mensaje +=
        `*Cliente:* ${pedido.cliente}\n`;


    mensaje +=
        `*Teléfono:* ${pedido.telefono}\n\n`;


    mensaje +=
        "🍽️ *PRODUCTOS*\n\n";


    pedido.productos.forEach(

        function (producto) {

            const subtotal =

                Number(producto.precio) *
                Number(producto.cantidad);


            mensaje +=
                `• ${producto.nombre_es}\n`;


            mensaje +=
                `  Cantidad: ${producto.cantidad}\n`;


            mensaje +=
                `  Precio: ${formatearPrecio(producto.precio)}\n`;


            mensaje +=
                `  Subtotal: ${formatearPrecio(subtotal)}\n\n`;
        }
    );


    mensaje +=
        `💰 *TOTAL: ${formatearPrecio(pedido.total)}*`;


    return mensaje;
}


/* =========================================================
   ABRIR WHATSAPP
========================================================= */

function enviarPedidoWhatsApp(pedido) {

    const mensaje =
        generarMensajeWhatsApp(
            pedido
        );


    const urlWhatsApp =

        `https://wa.me/${NUMERO_WHATSAPP_SODA_SLOTH}?text=${encodeURIComponent(mensaje)}`;


    /*
        Usamos location.href.

        Esto evita algunos problemas de bloqueo
        de ventanas emergentes con window.open.
    */

    window.location.href =
        urlWhatsApp;
}


/* =========================================================
   CONFIRMAR PEDIDO
========================================================= */

function confirmarPedido() {

    if (carrito.length === 0) {

        mostrarNotificacion(

            traducirTexto(
                "El carrito está vacío.",
                "The cart is empty."
            ),

            "advertencia"
        );

        return;
    }


    const nombreCliente =
        window.prompt(

            traducirTexto(
                "Ingresa tu nombre:",
                "Enter your name:"
            )
        );


    if (
        !nombreCliente ||
        nombreCliente.trim() === ""
    ) {

        return;
    }


    const telefonoCliente =
        window.prompt(

            traducirTexto(
                "Ingresa tu número de teléfono:",
                "Enter your phone number:"
            )
        );


    if (
        !telefonoCliente ||
        telefonoCliente.trim() === ""
    ) {

        return;
    }


    if (
        typeof crearPedido !== "function"
    ) {

        mostrarNotificacion(

            traducirTexto(
                "No fue posible registrar el pedido.",
                "The order could not be registered."
            ),

            "error"
        );

        return;
    }


    const resultado =
        crearPedido(

            nombreCliente,

            telefonoCliente,

            carrito
        );


    if (!resultado.exito) {

        mostrarNotificacion(

            resultado.mensaje,

            "error"
        );

        return;
    }


    /*
        GUARDAMOS LA REFERENCIA DEL PEDIDO
        ANTES DE REDIRIGIR A WHATSAPP.
    */

    const pedidoRegistrado =
        resultado.pedido;


    /*
        IMPORTANTE:

        NO VACIAMOS EL CARRITO ANTES DE ABRIR
        WHATSAPP.

        PRIMERO GENERAMOS Y ABRIMOS EL ENLACE.
    */

    enviarPedidoWhatsApp(
        pedidoRegistrado
    );
}


/* =========================================================
   CONFIGURAR EVENTOS GENERALES
========================================================= */

function configurarEventosCarrito() {

    const botonAbrir =
        document.getElementById(
            "boton-carrito"
        );


    const botonCerrar =
        document.getElementById(
            "cerrar-carrito"
        );


    const fondo =
        document.getElementById(
            "fondo-carrito"
        );


    const botonExplorar =
        document.getElementById(
            "boton-explorar-menu"
        );


    const botonWhatsApp =
        document.getElementById(
            "boton-whatsapp"
        );


    if (botonAbrir) {

        botonAbrir.addEventListener(
            "click",
            abrirCarrito
        );
    }


    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrarCarrito
        );
    }


    if (fondo) {

        fondo.addEventListener(
            "click",
            cerrarCarrito
        );
    }


    if (botonExplorar) {

        botonExplorar.addEventListener(

            "click",

            function () {

                cerrarCarrito();


                const menu =
                    document.getElementById(
                        "menu"
                    );


                if (menu) {

                    menu.scrollIntoView({

                        behavior: "smooth"
                    });
                }
            }
        );
    }


    if (botonWhatsApp) {

        botonWhatsApp.addEventListener(

            "click",

            confirmarPedido
        );
    }


    document.addEventListener(

        "keydown",

        function (evento) {

            if (evento.key === "Escape") {

                cerrarCarrito();
            }
        }
    );
}


/* =========================================================
   CAMBIO DE IDIOMA
========================================================= */

document.addEventListener(

    "sodaSlothCambioIdioma",

    function () {

        renderizarCarrito();
    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        configurarEventosCarrito();

        renderizarCarrito();
    }
);