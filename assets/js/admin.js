/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CLAVE_SESION_ADMIN = "sodaSlothSesionAdmin";

const CLAVE_DASHBOARD_CATEGORIAS =
    "sodaSlothCategoriasAdmin";

const CLAVE_DASHBOARD_PRODUCTOS =
    "sodaSlothProductosAdmin";

const CLAVE_DASHBOARD_PEDIDOS =
    "sodaSlothPedidosAdmin";

const RUTA_ADMIN_CATEGORIAS =
    "../assets/data/categorias.json";

const RUTA_ADMIN_PRODUCTOS =
    "../assets/data/productos.json";


/* =========================================================
   DATOS DEL ADMINISTRADOR
========================================================= */

let sesionAdministrador = null;

let adminCategorias = [];

let adminProductos = [];

let adminPedidos = [];


/* =========================================================
   OBTENER SESIÓN
========================================================= */

function obtenerSesionAdministrador() {

    const sesionGuardada =
        sessionStorage.getItem(
            CLAVE_SESION_ADMIN
        );


    if (!sesionGuardada) {

        return null;
    }


    try {

        const sesion =
            JSON.parse(sesionGuardada);


        if (
            !sesion ||
            sesion.autenticado !== true
        ) {

            return null;
        }


        return sesion;


    } catch (error) {

        console.error(
            "Error al leer la sesión:",
            error
        );


        sessionStorage.removeItem(
            CLAVE_SESION_ADMIN
        );


        return null;
    }
}


/* =========================================================
   PROTEGER PÁGINAS ADMINISTRATIVAS
========================================================= */

function verificarSesionAdministrador() {

    sesionAdministrador =
        obtenerSesionAdministrador();


    if (!sesionAdministrador) {

        window.location.replace(
            "login.html"
        );


        return false;
    }


    return true;
}


/* =========================================================
   MOSTRAR DATOS DEL ADMINISTRADOR
========================================================= */

function mostrarDatosAdministrador() {

    if (!sesionAdministrador) {

        return;
    }


    const correoElemento =
        document.getElementById(
            "correo-administrador"
        );


    if (correoElemento) {

        correoElemento.textContent =
            sesionAdministrador.correo ||
            "Administrador";
    }
}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

function cerrarSesionAdministrador() {

    sessionStorage.removeItem(
        CLAVE_SESION_ADMIN
    );


    window.location.replace(
        "login.html"
    );
}


/* =========================================================
   CONFIGURAR CIERRE DE SESIÓN
========================================================= */

function configurarCierreSesion() {

    const botonCerrarSesion =
        document.getElementById(
            "boton-cerrar-sesion"
        );


    if (!botonCerrarSesion) {

        return;
    }


    botonCerrarSesion.addEventListener(

        "click",

        function () {

            const confirmarSalida =
                window.confirm(
                    "¿Deseas cerrar la sesión administrativa?"
                );


            if (!confirmarSalida) {

                return;
            }


            cerrarSesionAdministrador();
        }
    );
}


/* =========================================================
   CARGAR ARCHIVO JSON
========================================================= */

async function cargarArchivoJSON(ruta) {

    const respuesta =
        await fetch(ruta);


    if (!respuesta.ok) {

        throw new Error(
            `No se pudo cargar el archivo: ${ruta}`
        );
    }


    return await respuesta.json();
}


/* =========================================================
   CARGAR DATOS DEL DASHBOARD
========================================================= */

function obtenerDatosLocalesDashboard(clave) {

    try {

        const datosGuardados =
            localStorage.getItem(clave);


        if (!datosGuardados) {

            return null;
        }


        const datos =
            JSON.parse(datosGuardados);


        return Array.isArray(datos)
            ? datos
            : null;


    } catch (error) {

        console.error(
            `Error leyendo ${clave}:`,
            error
        );


        return null;
    }
}


async function cargarDatosDashboard() {

    try {

        /* =============================================
           CATEGORÍAS Y PRODUCTOS
           (localStorage primero, JSON como respaldo)
        ============================================== */

        const categoriasLocales =
            obtenerDatosLocalesDashboard(
                CLAVE_DASHBOARD_CATEGORIAS
            );

        const productosLocales =
            obtenerDatosLocalesDashboard(
                CLAVE_DASHBOARD_PRODUCTOS
            );

        if (categoriasLocales && productosLocales) {

            adminCategorias = categoriasLocales;
            adminProductos = productosLocales;

        } else {

            const [
                categoriasCargadas,
                productosCargados
            ] = await Promise.all([

                cargarArchivoJSON(
                    RUTA_ADMIN_CATEGORIAS
                ),

                cargarArchivoJSON(
                    RUTA_ADMIN_PRODUCTOS
                )

            ]);


            adminCategorias =
                categoriasLocales ||
                (Array.isArray(categoriasCargadas)
                    ? categoriasCargadas
                    : []);


            adminProductos =
                productosLocales ||
                (Array.isArray(productosCargados)
                    ? productosCargados
                    : []);
        }


        /* =============================================
           PEDIDOS
           (registrados desde el menú digital)
        ============================================== */

        const pedidosLocales =
            obtenerDatosLocalesDashboard(
                CLAVE_DASHBOARD_PEDIDOS
            );

        adminPedidos =
            pedidosLocales || [];


        actualizarEstadisticasDashboard();


    } catch (error) {

        console.error(
            "Error cargando el dashboard:",
            error
        );


        mostrarNotificacionAdmin(
            "No fue posible cargar los datos del sistema.",
            "error"
        );
    }
}


/* =========================================================
   PRODUCTO DISPONIBLE
========================================================= */

function adminProductoDisponible(producto) {

    return (

        producto.disponible === true ||

        producto.disponible === 1 ||

        producto.disponible === "1"

    );
}


/* =========================================================
   ACTUALIZAR ESTADÍSTICAS
========================================================= */

function actualizarEstadisticasDashboard() {

    const estadisticaProductos =
        document.getElementById(
            "estadistica-productos"
        );


    const estadisticaCategorias =
        document.getElementById(
            "estadistica-categorias"
        );


    const estadisticaDisponibles =
        document.getElementById(
            "estadistica-disponibles"
        );


    const estadisticaPedidos =
        document.getElementById(
            "estadistica-pedidos"
        );


    const productosDisponibles =
        adminProductos.filter(
            adminProductoDisponible
        );


    if (estadisticaProductos) {

        estadisticaProductos.textContent =
            adminProductos.length;
    }


    if (estadisticaCategorias) {

        estadisticaCategorias.textContent =
            adminCategorias.length;
    }


    if (estadisticaDisponibles) {

        estadisticaDisponibles.textContent =
            productosDisponibles.length;
    }


    if (estadisticaPedidos) {

        estadisticaPedidos.textContent =
            adminPedidos.length;
    }
}


/* =========================================================
   MOSTRAR NOTIFICACIONES ADMINISTRATIVAS
========================================================= */

function mostrarNotificacionAdmin(
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
        document.createElement("div");


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
   CONTROLAR MENÚ LATERAL EN MÓVILES
========================================================= */

function configurarMenuAdminMovil() {

    const sidebar =
        document.getElementById(
            "admin-sidebar"
        );


    const botonMenu =
        document.getElementById(
            "boton-menu-admin"
        );


    if (
        !sidebar ||
        !botonMenu
    ) {

        return;
    }


    botonMenu.addEventListener(

        "click",

        function () {

            sidebar.classList.toggle(
                "activo"
            );
        }
    );
}


/* =========================================================
   CERRAR SIDEBAR AL HACER CLIC EN ENLACES
========================================================= */

function configurarEnlacesSidebar() {

    const sidebar =
        document.getElementById(
            "admin-sidebar"
        );


    if (!sidebar) {

        return;
    }


    const enlaces =
        sidebar.querySelectorAll("a");


    enlaces.forEach(

        function (enlace) {

            enlace.addEventListener(

                "click",

                function () {

                    if (
                        window.innerWidth <= 900
                    ) {

                        sidebar.classList.remove(
                            "activo"
                        );
                    }
                }
            );
        }
    );
}


/* =========================================================
   IDENTIFICAR PÁGINA ACTUAL
========================================================= */

function obtenerPaginaAdminActual() {

    const ruta =
        window.location.pathname;


    const partes =
        ruta.split("/");


    return partes[
        partes.length - 1
    ];
}


/* =========================================================
   MARCAR ENLACE ACTIVO
========================================================= */

function marcarEnlaceAdminActivo() {

    const paginaActual =
        obtenerPaginaAdminActual();


    const enlaces =
        document.querySelectorAll(
            ".admin-navegacion a"
        );


    enlaces.forEach(

        function (enlace) {

            enlace.classList.remove(
                "activo"
            );


            const destino =
                enlace.getAttribute(
                    "href"
                );


            if (
                destino === paginaActual
            ) {

                enlace.classList.add(
                    "activo"
                );
            }
        }
    );
}


/* =========================================================
   INICIALIZAR DASHBOARD
========================================================= */

function inicializarDashboard() {

    const paginaActual =
        obtenerPaginaAdminActual();


    if (
        paginaActual !==
        "dashboard.html"
    ) {

        return;
    }


    cargarDatosDashboard();
}


/* =========================================================
   INICIALIZACIÓN GENERAL
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        const sesionValida =
            verificarSesionAdministrador();


        if (!sesionValida) {

            return;
        }


        mostrarDatosAdministrador();

        configurarCierreSesion();

        configurarMenuAdminMovil();

        configurarEnlacesSidebar();

        marcarEnlaceAdminActivo();

        inicializarDashboard();

    }
);