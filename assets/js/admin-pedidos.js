let pedidosGestion = [];

const CLAVE_PEDIDOS_ADMIN =
    "sodaSlothPedidosAdmin";


/* =========================================================
   CARGAR PEDIDOS
========================================================= */

function cargarPedidosAdmin() {

    try {

        const pedidosGuardados =
            localStorage.getItem(
                CLAVE_PEDIDOS_ADMIN
            );


        if (pedidosGuardados) {

            const datos =
                JSON.parse(pedidosGuardados);


            pedidosGestion =
                Array.isArray(datos)
                    ? datos
                    : [];

        } else {

            /*
                No creamos pedidos ficticios.

                Los pedidos se cargarán cuando sean
                registrados por el sistema y posteriormente
                desde la base de datos correspondiente.
            */

            pedidosGestion = [];

            guardarPedidosAdmin();
        }


        renderizarPedidosAdmin();


    } catch (error) {

        console.error(
            "Error cargando pedidos:",
            error
        );


        pedidosGestion = [];


        mostrarNotificacionAdmin(

            "No fue posible cargar los pedidos.",

            "error"

        );


        renderizarPedidosAdmin();
    }
}


/* =========================================================
   GUARDAR PEDIDOS
========================================================= */

function guardarPedidosAdmin() {

    localStorage.setItem(

        CLAVE_PEDIDOS_ADMIN,

        JSON.stringify(pedidosGestion)

    );
}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecioPedido(precio) {

    return new Intl.NumberFormat(

        "es-CR",

        {
            style: "currency",

            currency: "CRC",

            maximumFractionDigits: 0
        }

    ).format(

        Number(precio) || 0

    );
}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFechaPedido(fecha) {

    if (!fecha) {

        return "Sin fecha";
    }


    const fechaPedido =
        new Date(fecha);


    if (
        Number.isNaN(
            fechaPedido.getTime()
        )
    ) {

        return fecha;
    }


    return new Intl.DateTimeFormat(

        "es-CR",

        {
            dateStyle: "medium",

            timeStyle: "short"
        }

    ).format(fechaPedido);
}


/* =========================================================
   OBTENER ESTADO
========================================================= */

function obtenerNombreEstadoPedido(estado) {

    const estados = {

        pendiente:
            "Pendiente",

        preparacion:
            "En preparación",

        completado:
            "Completado",

        cancelado:
            "Cancelado"

    };


    return (

        estados[estado] ||

        "Pendiente"

    );
}


/* =========================================================
   OBTENER CLASE DEL ESTADO
========================================================= */

function obtenerClaseEstadoPedido(estado) {

    const clases = {

        pendiente:
            "estado-pendiente",

        preparacion:
            "estado-preparacion",

        completado:
            "estado-completado",

        cancelado:
            "estado-cancelado"

    };


    return (

        clases[estado] ||

        "estado-pendiente"

    );
}


/* =========================================================
   CALCULAR TOTAL DEL PEDIDO
========================================================= */

function calcularTotalPedido(pedido) {

    if (
        pedido.total !== undefined &&
        pedido.total !== null
    ) {

        return Number(pedido.total) || 0;
    }


    if (
        !Array.isArray(pedido.productos)
    ) {

        return 0;
    }


    return pedido.productos.reduce(

        function (
            acumulador,
            producto
        ) {

            const precio =
                Number(producto.precio) || 0;


            const cantidad =
                Number(producto.cantidad) || 0;


            return (

                acumulador +

                precio * cantidad

            );
        },

        0

    );
}


/* =========================================================
   OBTENER PEDIDOS FILTRADOS
========================================================= */

function obtenerPedidosFiltrados() {

    const buscador =

        document.getElementById(

            "buscar-pedido"

        );


    const filtroEstado =

        document.getElementById(

            "filtro-estado-pedido"

        );


    const busqueda =

        buscador

            ? buscador.value
                .trim()
                .toLowerCase()

            : "";


    const estadoSeleccionado =

        filtroEstado

            ? filtroEstado.value

            : "todos";


    return pedidosGestion.filter(

        function (pedido) {

            const identificador =

                String(

                    pedido.id || ""

                ).toLowerCase();


            const cliente =

                String(

                    pedido.cliente || ""

                ).toLowerCase();


            const telefono =

                String(

                    pedido.telefono || ""

                ).toLowerCase();


            const coincideBusqueda =

                identificador.includes(busqueda) ||

                cliente.includes(busqueda) ||

                telefono.includes(busqueda);


            const coincideEstado =

                estadoSeleccionado === "todos" ||

                pedido.estado ===
                estadoSeleccionado;


            return (

                coincideBusqueda &&

                coincideEstado

            );
        }

    );
}


/* =========================================================
   ACTUALIZAR ESTADÍSTICAS
========================================================= */

function actualizarEstadisticasPedidos() {

    const totalPedidos =

        document.getElementById(

            "total-pedidos"

        );


    const totalPendientes =

        document.getElementById(

            "total-pedidos-pendientes"

        );


    const totalPreparacion =

        document.getElementById(

            "total-pedidos-preparacion"

        );


    const totalCompletados =

        document.getElementById(

            "total-pedidos-completados"

        );


    const pendientes =

        pedidosGestion.filter(

            function (pedido) {

                return (

                    pedido.estado ===
                    "pendiente"

                );
            }

        ).length;


    const preparacion =

        pedidosGestion.filter(

            function (pedido) {

                return (

                    pedido.estado ===
                    "preparacion"

                );
            }

        ).length;


    const completados =

        pedidosGestion.filter(

            function (pedido) {

                return (

                    pedido.estado ===
                    "completado"

                );
            }

        ).length;


    if (totalPedidos) {

        totalPedidos.textContent =

            pedidosGestion.length;
    }


    if (totalPendientes) {

        totalPendientes.textContent =

            pendientes;
    }


    if (totalPreparacion) {

        totalPreparacion.textContent =

            preparacion;
    }


    if (totalCompletados) {

        totalCompletados.textContent =

            completados;
    }
}


/* =========================================================
   RENDERIZAR PEDIDOS
========================================================= */

function renderizarPedidosAdmin() {

    const tabla =

        document.getElementById(

            "tabla-pedidos"

        );


    const mensajeVacio =

        document.getElementById(

            "mensaje-sin-pedidos"

        );


    if (!tabla) {

        return;
    }


    tabla.innerHTML = "";


    const pedidosFiltrados =

        obtenerPedidosFiltrados();


    actualizarEstadisticasPedidos();


    if (
        pedidosFiltrados.length === 0
    ) {

        if (mensajeVacio) {

            mensajeVacio.classList.remove(

                "oculto"

            );
        }


        return;
    }


    if (mensajeVacio) {

        mensajeVacio.classList.add(

            "oculto"

        );
    }


    pedidosFiltrados.forEach(

        function (pedido) {

            const fila =

                document.createElement("tr");


            const estado =

                pedido.estado ||

                "pendiente";


            const total =

                calcularTotalPedido(pedido);


            fila.innerHTML = `

                <td>

                    <div class="admin-pedido-identificador">

                        <strong>

                            #${pedido.id}

                        </strong>


                        <span>

                            ${
                                Array.isArray(
                                    pedido.productos
                                )

                                    ? pedido.productos.length

                                    : 0

                            } producto(s)

                        </span>

                    </div>

                </td>


                <td>

                    <strong>

                        ${
                            pedido.cliente ||
                            "Sin nombre"
                        }

                    </strong>


                    <br>


                    <small>

                        ${
                            pedido.telefono ||
                            ""
                        }

                    </small>

                </td>


                <td>

                    ${formatearFechaPedido(
                        pedido.fecha
                    )}

                </td>


                <td>

                    <strong>

                        ${formatearPrecioPedido(
                            total
                        )}

                    </strong>

                </td>


                <td>

                    <select
                        class="
                            admin-select-estado
                            ${obtenerClaseEstadoPedido(
                                estado
                            )}
                        "
                        data-estado-pedido="${pedido.id}"
                    >

                        <option
                            value="pendiente"
                            ${
                                estado === "pendiente"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pendiente
                        </option>


                        <option
                            value="preparacion"
                            ${
                                estado === "preparacion"
                                    ? "selected"
                                    : ""
                            }
                        >
                            En preparación
                        </option>


                        <option
                            value="completado"
                            ${
                                estado === "completado"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completado
                        </option>


                        <option
                            value="cancelado"
                            ${
                                estado === "cancelado"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Cancelado
                        </option>

                    </select>

                </td>


                <td>

                    <div class="admin-acciones">


                        <button
                            type="button"
                            class="
                                boton-admin-accion
                                boton-editar
                            "
                            data-ver-pedido="${pedido.id}"
                            title="Ver pedido"
                        >

                            👁️

                        </button>


                    </div>

                </td>

            `;


            tabla.appendChild(fila);

        }

    );


    configurarEventosTablaPedidos();
}


/* =========================================================
   CAMBIAR ESTADO DEL PEDIDO
========================================================= */

function cambiarEstadoPedido(
    pedidoId,
    nuevoEstado
) {

    const pedido =

        pedidosGestion.find(

            function (pedido) {

                return (

                    String(pedido.id) ===

                    String(pedidoId)

                );
            }

        );


    if (!pedido) {

        return;
    }


    pedido.estado = nuevoEstado;


    guardarPedidosAdmin();


    renderizarPedidosAdmin();


    mostrarNotificacionAdmin(

        `Pedido actualizado a "${obtenerNombreEstadoPedido(
            nuevoEstado
        )}".`,

        "exito"

    );
}


/* =========================================================
   ABRIR DETALLE DEL PEDIDO
========================================================= */

function abrirDetallePedido(
    pedidoId
) {

    const pedido =

        pedidosGestion.find(

            function (pedido) {

                return (

                    String(pedido.id) ===

                    String(pedidoId)

                );
            }

        );


    if (!pedido) {

        return;
    }


    const fondoModal =

        document.getElementById(

            "fondo-modal-pedido"

        );


    const tituloModal =

        document.getElementById(

            "titulo-modal-pedido"

        );


    const contenido =

        document.getElementById(

            "contenido-detalle-pedido"

        );


    if (
        !fondoModal ||
        !contenido
    ) {

        return;
    }


    if (tituloModal) {

        tituloModal.textContent =

            `Pedido #${pedido.id}`;
    }


    const productos =

        Array.isArray(pedido.productos)

            ? pedido.productos

            : [];


    const productosHTML =

        productos.length > 0

            ? productos.map(

                function (producto) {

                    const precio =

                        Number(
                            producto.precio
                        ) || 0;


                    const cantidad =

                        Number(
                            producto.cantidad
                        ) || 0;


                    const subtotal =

                        precio * cantidad;


                    return `

                        <div class="detalle-producto-pedido">

                            <div>

                                <strong>

                                    ${
                                        producto.nombre_es ||
                                        producto.nombre ||
                                        "Producto"
                                    }

                                </strong>


                                <span>

                                    ${cantidad}
                                    x
                                    ${formatearPrecioPedido(
                                        precio
                                    )}

                                </span>

                            </div>


                            <div class="detalle-producto-subtotal">

                                ${formatearPrecioPedido(
                                    subtotal
                                )}

                            </div>

                        </div>

                    `;

                }

            ).join("")

            : `

                <p>

                    Este pedido no tiene productos registrados.

                </p>

            `;


    contenido.innerHTML = `

        <div class="detalle-pedido-informacion">


            <div class="detalle-pedido-dato">

                <span>

                    Cliente

                </span>

                <strong>

                    ${
                        pedido.cliente ||
                        "Sin nombre"
                    }

                </strong>

            </div>


            <div class="detalle-pedido-dato">

                <span>

                    Teléfono

                </span>

                <strong>

                    ${
                        pedido.telefono ||
                        "No registrado"
                    }

                </strong>

            </div>


            <div class="detalle-pedido-dato">

                <span>

                    Fecha

                </span>

                <strong>

                    ${formatearFechaPedido(
                        pedido.fecha
                    )}

                </strong>

            </div>


            <div class="detalle-pedido-dato">

                <span>

                    Estado

                </span>

                <strong>

                    ${obtenerNombreEstadoPedido(
                        pedido.estado
                    )}

                </strong>

            </div>


        </div>


        <div class="detalle-pedido-productos">

            <h3>

                Productos del pedido

            </h3>


            ${productosHTML}


        </div>


        <div class="detalle-pedido-total">

            <span>

                Total del pedido

            </span>

            <strong>

                ${formatearPrecioPedido(
                    calcularTotalPedido(pedido)
                )}

            </strong>

        </div>

    `;


    fondoModal.classList.add("activo");


    document.body.style.overflow =

        "hidden";
}


/* =========================================================
   CERRAR DETALLE
========================================================= */

function cerrarDetallePedido() {

    const fondoModal =

        document.getElementById(

            "fondo-modal-pedido"

        );


    if (fondoModal) {

        fondoModal.classList.remove(

            "activo"

        );
    }


    document.body.style.overflow = "";
}


/* =========================================================
   EVENTOS DE TABLA
========================================================= */

function configurarEventosTablaPedidos() {

    document

        .querySelectorAll(

            "[data-estado-pedido]"

        )

        .forEach(

            function (select) {

                select.addEventListener(

                    "change",

                    function () {

                        cambiarEstadoPedido(

                            select.dataset.estadoPedido,

                            select.value

                        );
                    }

                );
            }

        );


    document

        .querySelectorAll(

            "[data-ver-pedido]"

        )

        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        abrirDetallePedido(

                            boton.dataset.verPedido

                        );
                    }

                );
            }

        );
}


/* =========================================================
   CONFIGURAR EVENTOS GENERALES
========================================================= */

function configurarEventosPedidosAdmin() {

    const buscador =

        document.getElementById(

            "buscar-pedido"

        );


    const filtroEstado =

        document.getElementById(

            "filtro-estado-pedido"

        );


    const cerrarModal =

        document.getElementById(

            "cerrar-modal-pedido"

        );


    const cerrarDetalle =

        document.getElementById(

            "cerrar-detalle-pedido"

        );


    const fondoModal =

        document.getElementById(

            "fondo-modal-pedido"

        );


    if (buscador) {

        buscador.addEventListener(

            "input",

            renderizarPedidosAdmin

        );
    }


    if (filtroEstado) {

        filtroEstado.addEventListener(

            "change",

            renderizarPedidosAdmin

        );
    }


    if (cerrarModal) {

        cerrarModal.addEventListener(

            "click",

            cerrarDetallePedido

        );
    }


    if (cerrarDetalle) {

        cerrarDetalle.addEventListener(

            "click",

            cerrarDetallePedido

        );
    }


    if (fondoModal) {

        fondoModal.addEventListener(

            "click",

            function (evento) {

                if (
                    evento.target ===
                    fondoModal
                ) {

                    cerrarDetallePedido();
                }
            }

        );
    }


    document.addEventListener(

        "keydown",

        function (evento) {

            if (
                evento.key === "Escape"
            ) {

                cerrarDetallePedido();
            }
        }

    );
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        configurarEventosPedidosAdmin();

        cargarPedidosAdmin();

    }

);