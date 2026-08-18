let productosAdmin = [];
let categoriasAdmin = [];
let productoEditandoId = null;

const CLAVE_PRODUCTOS_ADMIN =
    "sodaSlothProductosAdmin";

const CLAVE_CATEGORIAS_PRODUCTOS_ADMIN =
    "sodaSlothCategoriasAdmin";


/* =========================================================
   LEER DATOS DE LOCALSTORAGE
========================================================= */

function obtenerDatosLocalesAdmin(clave) {

    const datosGuardados =
        localStorage.getItem(clave);


    if (!datosGuardados) {

        return null;
    }


    try {

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


/* =========================================================
   CARGAR DATOS
========================================================= */

async function cargarDatosProductosAdmin() {

    try {

        const productosLocales =
            obtenerDatosLocalesAdmin(
                CLAVE_PRODUCTOS_ADMIN
            );


        const categoriasLocales =
            obtenerDatosLocalesAdmin(
                CLAVE_CATEGORIAS_PRODUCTOS_ADMIN
            );


        /* =============================================
           PRODUCTOS
        ============================================== */

        if (productosLocales) {

            productosAdmin =
                productosLocales;

        } else {

            const respuestaProductos =
                await fetch(
                    "../assets/data/productos.json"
                );


            if (!respuestaProductos.ok) {

                throw new Error(
                    "No fue posible cargar los productos."
                );
            }


            const productosJSON =
                await respuestaProductos.json();


            productosAdmin =
                Array.isArray(productosJSON)
                    ? productosJSON
                    : [];


            guardarProductosAdmin();
        }


        /* =============================================
           CATEGORÍAS
        ============================================== */

        if (categoriasLocales) {

            categoriasAdmin =
                categoriasLocales;

        } else {

            const respuestaCategorias =
                await fetch(
                    "../assets/data/categorias.json"
                );


            if (!respuestaCategorias.ok) {

                throw new Error(
                    "No fue posible cargar las categorías."
                );
            }


            const categoriasJSON =
                await respuestaCategorias.json();


            categoriasAdmin =
                Array.isArray(categoriasJSON)
                    ? categoriasJSON
                    : [];


            guardarCategoriasDesdeProductos();
        }


        cargarCategoriasEnSelects();

        renderizarProductosAdmin();


    } catch (error) {

        console.error(
            "Error cargando productos:",
            error
        );


        mostrarNotificacionAdmin(
            "No fue posible cargar los productos.",
            "error"
        );
    }
}


/* =========================================================
   GUARDAR PRODUCTOS
========================================================= */

function guardarProductosAdmin() {

    localStorage.setItem(

        CLAVE_PRODUCTOS_ADMIN,

        JSON.stringify(productosAdmin)

    );
}


/* =========================================================
   GUARDAR CATEGORÍAS
========================================================= */

function guardarCategoriasDesdeProductos() {

    localStorage.setItem(

        CLAVE_CATEGORIAS_PRODUCTOS_ADMIN,

        JSON.stringify(categoriasAdmin)

    );
}


/* =========================================================
   DISPONIBILIDAD
========================================================= */

function productoAdminDisponible(producto) {

    return (

        producto.disponible === true ||

        producto.disponible === 1 ||

        producto.disponible === "1"

    );
}


/* =========================================================
   OBTENER CATEGORÍA
========================================================= */

function obtenerCategoriaAdmin(categoriaId) {

    return categoriasAdmin.find(

        function (categoria) {

            return (

                String(categoria.id) ===

                String(categoriaId)

            );
        }

    );
}


/* =========================================================
   CARGAR CATEGORÍAS EN SELECTS
========================================================= */

function cargarCategoriasEnSelects() {

    const filtroCategoria =

        document.getElementById(
            "filtro-categoria"
        );


    const productoCategoria =

        document.getElementById(
            "producto-categoria"
        );


    if (filtroCategoria) {

        const valorActual =
            filtroCategoria.value;


        filtroCategoria.innerHTML = `

            <option value="todos">

                Todas las categorías

            </option>

        `;


        categoriasAdmin.forEach(

            function (categoria) {

                const opcion =

                    document.createElement(
                        "option"
                    );


                opcion.value =
                    categoria.id;


                opcion.textContent =

                    categoria.nombre_es ||

                    categoria.nombre_en ||

                    "Categoría";


                filtroCategoria.appendChild(
                    opcion
                );
            }

        );


        const opcionExiste =

            Array.from(
                filtroCategoria.options
            ).some(

                function (opcion) {

                    return (

                        String(opcion.value) ===

                        String(valorActual)

                    );
                }
            );


        filtroCategoria.value =

            opcionExiste

                ? valorActual

                : "todos";
    }


    if (productoCategoria) {

        productoCategoria.innerHTML = `

            <option value="">

                Selecciona una categoría

            </option>

        `;


        categoriasAdmin.forEach(

            function (categoria) {

                const opcion =

                    document.createElement(
                        "option"
                    );


                opcion.value =
                    categoria.id;


                opcion.textContent =

                    categoria.nombre_es ||

                    categoria.nombre_en ||

                    "Categoría";


                productoCategoria.appendChild(
                    opcion
                );
            }

        );
    }
}


/* =========================================================
   OBTENER PRODUCTOS FILTRADOS
========================================================= */

function obtenerProductosAdminFiltrados() {

    const campoBusqueda =

        document.getElementById(
            "buscar-producto"
        );


    const filtroCategoria =

        document.getElementById(
            "filtro-categoria"
        );


    const filtroDisponibilidad =

        document.getElementById(
            "filtro-disponibilidad"
        );


    const busqueda =

        campoBusqueda

            ? campoBusqueda.value
                .trim()
                .toLowerCase()

            : "";


    const categoriaSeleccionada =

        filtroCategoria

            ? filtroCategoria.value

            : "todos";


    const disponibilidadSeleccionada =

        filtroDisponibilidad

            ? filtroDisponibilidad.value

            : "todos";


    return productosAdmin.filter(

        function (producto) {

            const nombreEs =

                String(
                    producto.nombre_es || ""
                ).toLowerCase();


            const nombreEn =

                String(
                    producto.nombre_en || ""
                ).toLowerCase();


            const descripcionEs =

                String(
                    producto.descripcion_es || ""
                ).toLowerCase();


            const descripcionEn =

                String(
                    producto.descripcion_en || ""
                ).toLowerCase();


            const coincideBusqueda =

                nombreEs.includes(busqueda) ||

                nombreEn.includes(busqueda) ||

                descripcionEs.includes(busqueda) ||

                descripcionEn.includes(busqueda);


            const coincideCategoria =

                categoriaSeleccionada === "todos" ||

                String(producto.categoria_id) ===

                String(categoriaSeleccionada);


            let coincideDisponibilidad = true;


            if (

                disponibilidadSeleccionada ===
                "disponible"

            ) {

                coincideDisponibilidad =

                    productoAdminDisponible(
                        producto
                    );
            }


            if (

                disponibilidadSeleccionada ===
                "no-disponible"

            ) {

                coincideDisponibilidad =

                    !productoAdminDisponible(
                        producto
                    );
            }


            return (

                coincideBusqueda &&

                coincideCategoria &&

                coincideDisponibilidad

            );
        }

    );
}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecioAdmin(precio) {

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
   ACTUALIZAR ESTADÍSTICAS
========================================================= */

function actualizarEstadisticasProductos() {

    const totalProductos =

        document.getElementById(
            "total-productos"
        );


    const totalDisponibles =

        document.getElementById(
            "total-disponibles"
        );


    const totalNoDisponibles =

        document.getElementById(
            "total-no-disponibles"
        );


    const disponibles =

        productosAdmin.filter(

            productoAdminDisponible

        ).length;


    const noDisponibles =

        productosAdmin.length -

        disponibles;


    if (totalProductos) {

        totalProductos.textContent =

            productosAdmin.length;
    }


    if (totalDisponibles) {

        totalDisponibles.textContent =

            disponibles;
    }


    if (totalNoDisponibles) {

        totalNoDisponibles.textContent =

            noDisponibles;
    }
}


/* =========================================================
   CREAR IMAGEN SEGURA
========================================================= */

function obtenerRutaImagenAdmin(producto) {

    const imagen =

        String(
            producto.imagen || ""
        ).trim();


    if (!imagen) {

        return "../assets/imagenes/restaurante.png";
    }


    if (

        imagen.startsWith("http://") ||

        imagen.startsWith("https://") ||

        imagen.startsWith("data:")

    ) {

        return imagen;
    }


    if (imagen.startsWith("../")) {

        return imagen;
    }


    return `../${imagen}`;
}


/* =========================================================
   RENDERIZAR PRODUCTOS
========================================================= */

function renderizarProductosAdmin() {

    const tabla =

        document.getElementById(
            "tabla-productos"
        );


    const mensajeVacio =

        document.getElementById(
            "mensaje-sin-productos-admin"
        );


    if (!tabla) {

        return;
    }


    tabla.innerHTML = "";


    const productosFiltrados =

        obtenerProductosAdminFiltrados();


    actualizarEstadisticasProductos();


    if (productosFiltrados.length === 0) {

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


    productosFiltrados.forEach(

        function (producto) {

            const categoria =

                obtenerCategoriaAdmin(
                    producto.categoria_id
                );


            const nombreCategoria =

                categoria

                    ? categoria.nombre_es

                    : "Sin categoría";


            const disponible =

                productoAdminDisponible(
                    producto
                );


            const fila =

                document.createElement("tr");


            fila.innerHTML = `

                <td>

                    <div class="admin-producto-datos">

                        <img
                            src="${obtenerRutaImagenAdmin(producto)}"
                            alt="${producto.nombre_es || "Producto"}"
                            class="admin-producto-imagen"
                        >

                        <div>

                            <strong>

                                ${producto.nombre_es || "Sin nombre"}

                            </strong>

                            <span>

                                ${producto.descripcion_es || ""}

                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    ${nombreCategoria}

                </td>


                <td>

                    <strong>

                        ${formatearPrecioAdmin(
                            producto.precio
                        )}

                    </strong>

                </td>


                <td>

                    <button
                        type="button"
                        class="estado ${
                            disponible
                                ? "estado-activo"
                                : "estado-inactivo"
                        }"
                        data-disponibilidad="${producto.id}"
                    >

                        ${
                            disponible
                                ? "Disponible"
                                : "No disponible"
                        }

                    </button>

                </td>


                <td>

                    <div class="admin-acciones">

                        <button
                            type="button"
                            class="boton-admin-accion boton-editar"
                            data-editar="${producto.id}"
                            title="Editar producto"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="boton-admin-accion boton-eliminar"
                            data-eliminar="${producto.id}"
                            title="Eliminar producto"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            const imagen =

                fila.querySelector(
                    ".admin-producto-imagen"
                );


            if (imagen) {

                imagen.addEventListener(

                    "error",

                    function () {

                        this.src =

                            "../assets/imagenes/restaurante.png";

                    },

                    {
                        once: true
                    }
                );
            }


            tabla.appendChild(fila);
        }

    );


    configurarEventosTablaProductos();
}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModalProducto(producto = null) {

    const fondoModal =

        document.getElementById(
            "fondo-modal-producto"
        );


    const titulo =

        document.getElementById(
            "titulo-modal-producto"
        );


    const formulario =

        document.getElementById(
            "formulario-producto"
        );


    if (
        !fondoModal ||
        !formulario
    ) {

        return;
    }


    formulario.reset();


    productoEditandoId = null;


    document.getElementById(
        "producto-id"
    ).value = "";


    document.getElementById(
        "producto-disponible"
    ).checked = true;


    if (producto) {

        productoEditandoId =
            producto.id;


        titulo.textContent =
            "Editar producto";


        document.getElementById(
            "producto-id"
        ).value = producto.id;


        document.getElementById(
            "producto-nombre-es"
        ).value =

            producto.nombre_es || "";


        document.getElementById(
            "producto-nombre-en"
        ).value =

            producto.nombre_en || "";


        document.getElementById(
            "producto-categoria"
        ).value =

            producto.categoria_id;


        document.getElementById(
            "producto-precio"
        ).value =

            producto.precio ?? "";


        document.getElementById(
            "producto-descripcion-es"
        ).value =

            producto.descripcion_es || "";


        document.getElementById(
            "producto-descripcion-en"
        ).value =

            producto.descripcion_en || "";


        document.getElementById(
            "producto-imagen"
        ).value =

            producto.imagen || "";


        document.getElementById(
            "producto-disponible"
        ).checked =

            productoAdminDisponible(
                producto
            );


    } else {

        titulo.textContent =
            "Nuevo producto";
    }


    fondoModal.classList.add(
        "activo"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModalProducto() {

    const fondoModal =

        document.getElementById(
            "fondo-modal-producto"
        );


    if (fondoModal) {

        fondoModal.classList.remove(
            "activo"
        );
    }


    document.body.style.overflow = "";


    productoEditandoId = null;
}


/* =========================================================
   GENERAR ID
========================================================= */

function generarNuevoIdProducto() {

    if (productosAdmin.length === 0) {

        return 1;
    }


    return (

        Math.max(

            ...productosAdmin.map(

                function (producto) {

                    return (

                        Number(producto.id) || 0

                    );
                }
            )

        ) + 1
    );
}


/* =========================================================
   VALIDAR PRODUCTO REPETIDO
========================================================= */

function existeProductoConNombre(
    nombreEs,
    productoIdIgnorado = null
) {

    return productosAdmin.some(

        function (producto) {

            if (

                productoIdIgnorado !== null &&

                String(producto.id) ===

                String(productoIdIgnorado)

            ) {

                return false;
            }


            return (

                String(
                    producto.nombre_es || ""
                )
                    .trim()
                    .toLowerCase() ===

                nombreEs
                    .trim()
                    .toLowerCase()

            );
        }
    );
}


/* =========================================================
   GUARDAR PRODUCTO
========================================================= */

function guardarProductoFormulario(evento) {

    evento.preventDefault();


    const nombreEs =

        document.getElementById(
            "producto-nombre-es"
        ).value.trim();


    const nombreEn =

        document.getElementById(
            "producto-nombre-en"
        ).value.trim();


    const categoriaId =

        document.getElementById(
            "producto-categoria"
        ).value;


    const precio =

        Number(

            document.getElementById(
                "producto-precio"
            ).value

        );


    const descripcionEs =

        document.getElementById(
            "producto-descripcion-es"
        ).value.trim();


    const descripcionEn =

        document.getElementById(
            "producto-descripcion-en"
        ).value.trim();


    const imagen =

        document.getElementById(
            "producto-imagen"
        ).value.trim();


    const disponible =

        document.getElementById(
            "producto-disponible"
        ).checked;


    if (

        !nombreEs ||

        !nombreEn ||

        !categoriaId ||

        !descripcionEs ||

        !descripcionEn ||

        !imagen ||

        Number.isNaN(precio) ||

        precio < 0

    ) {

        mostrarNotificacionAdmin(

            "Completa correctamente todos los campos.",

            "advertencia"

        );


        return;
    }


    if (

        existeProductoConNombre(

            nombreEs,

            productoEditandoId

        )

    ) {

        mostrarNotificacionAdmin(

            "Ya existe un producto con ese nombre.",

            "advertencia"

        );


        return;
    }


    if (productoEditandoId !== null) {

        const indice =

            productosAdmin.findIndex(

                function (producto) {

                    return (

                        String(producto.id) ===

                        String(productoEditandoId)

                    );
                }
            );


        if (indice === -1) {

            return;
        }


        productosAdmin[indice] = {

            ...productosAdmin[indice],

            nombre_es: nombreEs,

            nombre_en: nombreEn,

            categoria_id:
                Number(categoriaId),

            precio: precio,

            descripcion_es:
                descripcionEs,

            descripcion_en:
                descripcionEn,

            imagen: imagen,

            disponible: disponible

        };


        mostrarNotificacionAdmin(

            "Producto actualizado correctamente.",

            "exito"

        );


    } else {

        const nuevoProducto = {

            id:
                generarNuevoIdProducto(),

            categoria_id:
                Number(categoriaId),

            nombre_es:
                nombreEs,

            nombre_en:
                nombreEn,

            descripcion_es:
                descripcionEs,

            descripcion_en:
                descripcionEn,

            precio:
                precio,

            imagen:
                imagen,

            disponible:
                disponible

        };


        productosAdmin.push(
            nuevoProducto
        );


        mostrarNotificacionAdmin(

            "Producto creado correctamente.",

            "exito"

        );
    }


    guardarProductosAdmin();


    renderizarProductosAdmin();


    cerrarModalProducto();
}


/* =========================================================
   EDITAR PRODUCTO
========================================================= */

function editarProducto(productoId) {

    const producto =

        productosAdmin.find(

            function (producto) {

                return (

                    String(producto.id) ===

                    String(productoId)

                );
            }
        );


    if (!producto) {

        return;
    }


    abrirModalProducto(producto);
}


/* =========================================================
   ELIMINAR PRODUCTO
========================================================= */

function eliminarProducto(productoId) {

    const producto =

        productosAdmin.find(

            function (producto) {

                return (

                    String(producto.id) ===

                    String(productoId)

                );
            }
        );


    if (!producto) {

        return;
    }


    const confirmar =

        window.confirm(

            `¿Deseas eliminar el producto "${producto.nombre_es}"?`

        );


    if (!confirmar) {

        return;
    }


    productosAdmin =

        productosAdmin.filter(

            function (producto) {

                return (

                    String(producto.id) !==

                    String(productoId)

                );
            }
        );


    guardarProductosAdmin();


    renderizarProductosAdmin();


    mostrarNotificacionAdmin(

        "Producto eliminado correctamente.",

        "exito"

    );
}


/* =========================================================
   CAMBIAR DISPONIBILIDAD
========================================================= */

function cambiarDisponibilidadProducto(
    productoId
) {

    const producto =

        productosAdmin.find(

            function (producto) {

                return (

                    String(producto.id) ===

                    String(productoId)

                );
            }
        );


    if (!producto) {

        return;
    }


    producto.disponible =

        !productoAdminDisponible(
            producto
        );


    guardarProductosAdmin();


    renderizarProductosAdmin();


    mostrarNotificacionAdmin(

        producto.disponible

            ? "Producto disponible en el menú."

            : "Producto retirado temporalmente del menú.",

        "exito"

    );
}


/* =========================================================
   EVENTOS DE LA TABLA
========================================================= */

function configurarEventosTablaProductos() {

    document
        .querySelectorAll(
            "[data-editar]"
        )
        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        editarProducto(

                            boton.dataset.editar

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

                        eliminarProducto(

                            boton.dataset.eliminar

                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-disponibilidad]"
        )
        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        cambiarDisponibilidadProducto(

                            boton.dataset.disponibilidad

                        );
                    }
                );
            }
        );
}


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventosProductosAdmin() {

    const botonNuevo =

        document.getElementById(
            "boton-nuevo-producto"
        );


    const cerrarModal =

        document.getElementById(
            "cerrar-modal-producto"
        );


    const cancelar =

        document.getElementById(
            "cancelar-producto"
        );


    const fondoModal =

        document.getElementById(
            "fondo-modal-producto"
        );


    const formulario =

        document.getElementById(
            "formulario-producto"
        );


    const buscar =

        document.getElementById(
            "buscar-producto"
        );


    const filtroCategoria =

        document.getElementById(
            "filtro-categoria"
        );


    const filtroDisponibilidad =

        document.getElementById(
            "filtro-disponibilidad"
        );


    if (botonNuevo) {

        botonNuevo.addEventListener(

            "click",

            function () {

                cargarCategoriasEnSelects();

                abrirModalProducto();
            }
        );
    }


    if (cerrarModal) {

        cerrarModal.addEventListener(

            "click",

            cerrarModalProducto

        );
    }


    if (cancelar) {

        cancelar.addEventListener(

            "click",

            cerrarModalProducto

        );
    }


    if (formulario) {

        formulario.addEventListener(

            "submit",

            guardarProductoFormulario

        );
    }


    if (buscar) {

        buscar.addEventListener(

            "input",

            renderizarProductosAdmin

        );
    }


    if (filtroCategoria) {

        filtroCategoria.addEventListener(

            "change",

            renderizarProductosAdmin

        );
    }


    if (filtroDisponibilidad) {

        filtroDisponibilidad.addEventListener(

            "change",

            renderizarProductosAdmin

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

                    cerrarModalProducto();
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

                cerrarModalProducto();
            }
        }
    );
}


/* =========================================================
   DETECTAR CAMBIOS DE CATEGORÍAS
========================================================= */

window.addEventListener(

    "storage",

    function (evento) {

        if (

            evento.key ===

            CLAVE_CATEGORIAS_PRODUCTOS_ADMIN

        ) {

            const categoriasActualizadas =

                obtenerDatosLocalesAdmin(

                    CLAVE_CATEGORIAS_PRODUCTOS_ADMIN

                );


            if (categoriasActualizadas) {

                categoriasAdmin =

                    categoriasActualizadas;


                cargarCategoriasEnSelects();


                renderizarProductosAdmin();
            }
        }
    }
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        configurarEventosProductosAdmin();

        cargarDatosProductosAdmin();

    }
);