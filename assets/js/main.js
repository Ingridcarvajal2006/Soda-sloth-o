/* =========================================================
   VARIABLES GLOBALES
========================================================= */

let categorias = [];
let productos = [];
let categoriaSeleccionada = "todos";

const RUTA_CATEGORIAS =
    "assets/data/categorias.json";

const RUTA_PRODUCTOS =
    "assets/data/productos.json";

const CLAVE_CATEGORIAS_ADMIN =
    "sodaSlothCategoriasAdmin";

const CLAVE_PRODUCTOS_ADMIN =
    "sodaSlothProductosAdmin";


/* =========================================================
   LEER DATOS LOCALES
========================================================= */

function obtenerDatosLocales(clave) {

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

async function cargarDatos() {

    const estadoCarga =
        document.getElementById(
            "estado-carga"
        );

    try {

        if (estadoCarga) {

            estadoCarga.classList.remove(
                "oculto"
            );
        }

        const categoriasLocales =
            obtenerDatosLocales(
                CLAVE_CATEGORIAS_ADMIN
            );

        const productosLocales =
            obtenerDatosLocales(
                CLAVE_PRODUCTOS_ADMIN
            );

        if (
            categoriasLocales &&
            productosLocales
        ) {

            categorias = categoriasLocales;
            productos = productosLocales;

        } else {

            const [
                respuestaCategorias,
                respuestaProductos
            ] = await Promise.all([

                fetch(RUTA_CATEGORIAS),

                fetch(RUTA_PRODUCTOS)

            ]);

            if (!respuestaCategorias.ok) {

                throw new Error(
                    "No se pudieron cargar las categorías."
                );
            }

            if (!respuestaProductos.ok) {

                throw new Error(
                    "No se pudieron cargar los productos."
                );
            }

            categorias =
                await respuestaCategorias.json();

            productos =
                await respuestaProductos.json();

            if (!Array.isArray(categorias)) {

                categorias = [];
            }

            if (!Array.isArray(productos)) {

                productos = [];
            }

        }

        renderizarCategorias();

        renderizarProductos();

    } catch (error) {

        console.error(error);

        mostrarErrorCarga();

    } finally {

        if (estadoCarga) {

            estadoCarga.classList.add(
                "oculto"
            );
        }
    }

}


/* =========================================================
   DISPONIBILIDAD
========================================================= */

function productoEstaDisponible(producto) {

    return (

        producto.disponible === true ||

        producto.disponible === 1 ||

        producto.disponible === "1"

    );

}


/* =========================================================
   OBTENER CATEGORÍA
========================================================= */

function obtenerCategoriaProducto(producto) {

    return (

        producto.categoria_id ??

        producto.categoriaId ??

        producto.categoria ??

        ""

    );

}


/* =========================================================
   BUSCAR CATEGORÍA
========================================================= */

function buscarCategoriaPorId(idCategoria) {

    return categorias.find(

        function (categoria) {

            return (

                String(categoria.id) ===

                String(idCategoria)

            );

        }

    );

}


/* =========================================================
   OBTENER NOMBRE CATEGORÍA
========================================================= */

function obtenerNombreCategoria(categoria) {

    if (!categoria) {

        return traducirTexto(
            "Sin categoría",
            "No category"
        );

    }

    if (

        typeof obtenerIdiomaActual ===
        "function"

    ) {

        if (
            obtenerIdiomaActual() === "en"
        ) {

            return (

                categoria.nombre_en ||

                categoria.nombre_es ||

                ""

            );

        }

    }

    return (

        categoria.nombre_es ||

        categoria.nombre_en ||

        ""

    );

}


/* =========================================================
   OBTENER NOMBRE PRODUCTO
========================================================= */

function obtenerNombreProducto(producto) {

    if (

        typeof obtenerIdiomaActual ===
        "function"

    ) {

        if (
            obtenerIdiomaActual() === "en"
        ) {

            return (

                producto.nombre_en ||

                producto.nombre_es ||

                ""

            );

        }

    }

    return (

        producto.nombre_es ||

        producto.nombre_en ||

        ""

    );

}


/* =========================================================
   OBTENER DESCRIPCIÓN
========================================================= */

function obtenerDescripcionProducto(producto) {

    if (

        typeof obtenerIdiomaActual ===
        "function"

    ) {

        if (
            obtenerIdiomaActual() === "en"
        ) {

            return (

                producto.descripcion_en ||

                producto.descripcion_es ||

                ""

            );

        }

    }

    return (

        producto.descripcion_es ||

        producto.descripcion_en ||

        ""

    );

}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(precio) {

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
   RENDERIZAR CATEGORÍAS
========================================================= */

function renderizarCategorias() {

    const contenedor =

        document.getElementById(
            "contenedor-categorias"
        );

    if (!contenedor) {

        return;

    }

    contenedor.innerHTML = "";

    const botonTodos =
        document.createElement(
            "button"
        );

    botonTodos.type = "button";

    botonTodos.className =
        "boton-categoria";

    botonTodos.dataset.categoria =
        "todos";

    botonTodos.textContent =
        traducirTexto(
            "Todos",
            "All"
        );

    if (
        categoriaSeleccionada ===
        "todos"
    ) {

        botonTodos.classList.add(
            "activo"
        );

    }

    botonTodos.addEventListener(

        "click",

        function () {

            seleccionarCategoria(
                "todos"
            );

        }

    );

    contenedor.appendChild(
        botonTodos
    );

    categorias.forEach(

        function (categoria) {

            const boton =
                document.createElement(
                    "button"
                );

            boton.type = "button";

            boton.className =
                "boton-categoria";

            boton.dataset.categoria =
                categoria.id;

            boton.textContent =
                obtenerNombreCategoria(
                    categoria
                );

            if (

                String(
                    categoria.id
                ) ===

                String(
                    categoriaSeleccionada
                )

            ) {

                boton.classList.add(
                    "activo"
                );

            }

            boton.addEventListener(

                "click",

                function () {

                    seleccionarCategoria(
                        categoria.id
                    );

                }

            );

            contenedor.appendChild(
                boton
            );

        }

    );

}

/* =========================================================
   SELECCIONAR CATEGORÍA
========================================================= */

function seleccionarCategoria(categoriaId) {

    categoriaSeleccionada =
        categoriaId;

    renderizarCategorias();

    renderizarProductos();

}


/* =========================================================
   FILTRAR PRODUCTOS
========================================================= */

function obtenerProductosFiltrados() {

    const productosDisponibles =

        productos.filter(
            productoEstaDisponible
        );


    if (
        categoriaSeleccionada ===
        "todos"
    ) {

        return productosDisponibles;

    }


    return productosDisponibles.filter(

        function (producto) {

            return (

                String(

                    obtenerCategoriaProducto(
                        producto
                    )

                ) ===

                String(
                    categoriaSeleccionada
                )

            );

        }

    );

}


/* =========================================================
   OBTENER IMAGEN
========================================================= */

function obtenerImagenProducto(producto) {

    if (

        producto.imagen &&

        String(producto.imagen)
            .trim() !== ""

    ) {

        return producto.imagen;

    }


    return "assets/imagenes/restaurante.png";

}


/* =========================================================
   RENDERIZAR PRODUCTOS
========================================================= */

function renderizarProductos() {

    const contenedor =

        document.getElementById(
            "contenedor-productos"
        );


    const mensajeSinProductos =

        document.getElementById(
            "mensaje-sin-productos"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    const productosFiltrados =

        obtenerProductosFiltrados();


    if (

        productosFiltrados.length === 0

    ) {

        if (
            mensajeSinProductos
        ) {

            mensajeSinProductos
                .classList
                .remove(
                    "oculto"
                );

        }

        return;

    }


    if (
        mensajeSinProductos
    ) {

        mensajeSinProductos
            .classList
            .add(
                "oculto"
            );

    }


    productosFiltrados.forEach(

        function (producto) {

            const tarjeta =

                crearTarjetaProducto(
                    producto
                );

            contenedor.appendChild(
                tarjeta
            );

        }

    );

}


/* =========================================================
   CREAR TARJETA
========================================================= */

function crearTarjetaProducto(producto) {

    const articulo =

        document.createElement(
            "article"
        );


    articulo.className =
        "tarjeta-producto animar-entrada";


    const categoria =

        buscarCategoriaPorId(

            obtenerCategoriaProducto(
                producto
            )

        );


    const nombreCategoria =

        categoria

            ? obtenerNombreCategoria(
                categoria
            )

            : traducirTexto(

                "Producto",

                "Product"

            );


    const nombre =

        obtenerNombreProducto(
            producto
        );


    const descripcion =

        obtenerDescripcionProducto(
            producto
        );


    const imagen =

        obtenerImagenProducto(
            producto
        );


    articulo.innerHTML = `

<div class="producto-imagen-contenedor">

<img

src="${imagen}"

alt="${nombre}"

class="producto-imagen"

>

<span class="producto-categoria">

${nombreCategoria}

</span>

</div>

<div class="producto-contenido">

<h3>

${nombre}

</h3>

<p class="producto-descripcion">

${descripcion}

</p>

<div class="producto-pie">

<span class="producto-precio">

${formatearPrecio(

producto.precio

)}

</span>

<button

type="button"

class="boton-agregar"

>

<span>

+

</span>

<span>

${traducirTexto(

"Agregar",

"Add"

)}

</span>

</button>

</div>

</div>

`;


    const imagenElemento =

        articulo.querySelector(
            ".producto-imagen"
        );


    if (

        imagenElemento

    ) {

        imagenElemento.addEventListener(

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


    const botonAgregar =

        articulo.querySelector(
            ".boton-agregar"
        );


    if (

        botonAgregar

    ) {

        botonAgregar.addEventListener(

            "click",

            function () {

                agregarAlCarrito(
                    producto
                );

            }

        );

    }


    return articulo;

}

/* =========================================================
   MOSTRAR ERROR
========================================================= */

function mostrarErrorCarga() {

    const contenedor =

        document.getElementById(
            "contenedor-productos"
        );

    if (!contenedor) {

        return;

    }

    contenedor.innerHTML = `

        <div class="mensaje-sin-productos">

            <span>
                🦥
            </span>

            <h3>

                ${traducirTexto(

                    "No pudimos cargar el menú",

                    "We could not load the menu"

                )}

            </h3>

            <p>

                ${traducirTexto(

                    "Verifica los datos del menú e inténtalo nuevamente.",

                    "Check the menu data and try again."

                )}

            </p>

        </div>

    `;

}


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function configurarMenuMovil() {

    const boton =

        document.getElementById(
            "boton-menu-movil"
        );


    const navegacion =

        document.querySelector(
            ".navegacion-principal"
        );


    if (
        !boton ||
        !navegacion
    ) {

        return;

    }


    boton.addEventListener(

        "click",

        function () {

            navegacion.classList.toggle(
                "activo"
            );

            boton.textContent =

                navegacion.classList.contains(
                    "activo"
                )

                    ? "×"

                    : "☰";

        }

    );


    navegacion
        .querySelectorAll("a")
        .forEach(

            function (enlace) {

                enlace.addEventListener(

                    "click",

                    function () {

                        navegacion.classList.remove(
                            "activo"
                        );

                        boton.textContent =
                            "☰";

                    }

                );

            }

        );

}


/* =========================================================
   ACTUALIZAR SI CAMBIA LOCALSTORAGE
========================================================= */

window.addEventListener(

    "storage",

    function (evento) {

        if (

            evento.key ===
            CLAVE_PRODUCTOS_ADMIN ||

            evento.key ===
            CLAVE_CATEGORIAS_ADMIN

        ) {

            cargarDatos();

        }

    }

);


/* =========================================================
   CAMBIO DE IDIOMA
========================================================= */

document.addEventListener(

    "sodaSlothCambioIdioma",

    function () {

        renderizarCategorias();

        renderizarProductos();

    }

);


/* =========================================================
   RECARGAR DESPUÉS DE EDITAR
========================================================= */

window.addEventListener(

    "focus",

    function () {

        cargarDatos();

    }

);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        configurarMenuMovil();

        cargarDatos();

    }

);