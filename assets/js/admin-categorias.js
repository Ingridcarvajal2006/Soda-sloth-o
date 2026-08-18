let categoriasGestion = [];
let productosGestion = [];
let categoriaEditandoId = null;

const CLAVE_CATEGORIAS_ADMIN =
    "sodaSlothCategoriasAdmin";

const CLAVE_PRODUCTOS_ADMIN_CATEGORIAS =
    "sodaSlothProductosAdmin";


/* =========================================================
   CARGAR DATOS
========================================================= */

async function cargarDatosCategoriasAdmin() {

    try {

        const [
            respuestaCategorias,
            respuestaProductos
        ] = await Promise.all([

            fetch("../assets/data/categorias.json"),

            fetch("../assets/data/productos.json")

        ]);


        if (
            !respuestaCategorias.ok ||
            !respuestaProductos.ok
        ) {

            throw new Error(
                "No fue posible cargar los datos."
            );
        }


        const categoriasJSON =
            await respuestaCategorias.json();


        const productosJSON =
            await respuestaProductos.json();


        /* =============================================
           CARGAR CATEGORÍAS
        ============================================== */

        const categoriasGuardadas =
            localStorage.getItem(
                CLAVE_CATEGORIAS_ADMIN
            );


        if (categoriasGuardadas) {

            categoriasGestion =
                JSON.parse(categoriasGuardadas);

        } else {

            categoriasGestion =
                Array.isArray(categoriasJSON)
                    ? categoriasJSON
                    : [];


            guardarCategoriasAdmin();
        }


        /* =============================================
           CARGAR PRODUCTOS
        ============================================== */

        const productosGuardados =
            localStorage.getItem(
                CLAVE_PRODUCTOS_ADMIN_CATEGORIAS
            );


        if (productosGuardados) {

            productosGestion =
                JSON.parse(productosGuardados);

        } else {

            productosGestion =
                Array.isArray(productosJSON)
                    ? productosJSON
                    : [];
        }


        renderizarCategoriasAdmin();


    } catch (error) {

        console.error(
            "Error cargando categorías:",
            error
        );


        mostrarNotificacionAdmin(

            "No fue posible cargar las categorías.",

            "error"

        );
    }
}


/* =========================================================
   GUARDAR CATEGORÍAS
========================================================= */

function guardarCategoriasAdmin() {

    localStorage.setItem(

        CLAVE_CATEGORIAS_ADMIN,

        JSON.stringify(categoriasGestion)

    );
}


/* =========================================================
   OBTENER CANTIDAD DE PRODUCTOS
========================================================= */

function obtenerCantidadProductosCategoria(
    categoriaId
) {

    return productosGestion.filter(

        function (producto) {

            return (

                String(producto.categoria_id) ===

                String(categoriaId)

            );
        }

    ).length;
}


/* =========================================================
   OBTENER CATEGORÍAS FILTRADAS
========================================================= */

function obtenerCategoriasFiltradas() {

    const campoBusqueda =

        document.getElementById(

            "buscar-categoria"

        );


    const busqueda =

        campoBusqueda

            ? campoBusqueda.value
                .trim()
                .toLowerCase()

            : "";


    return categoriasGestion.filter(

        function (categoria) {

            const nombreEs =

                (
                    categoria.nombre_es ||
                    ""
                ).toLowerCase();


            const nombreEn =

                (
                    categoria.nombre_en ||
                    ""
                ).toLowerCase();


            return (

                nombreEs.includes(busqueda) ||

                nombreEn.includes(busqueda)

            );
        }

    );
}


/* =========================================================
   ACTUALIZAR ESTADÍSTICAS
========================================================= */

function actualizarEstadisticasCategorias() {

    const totalCategorias =

        document.getElementById(

            "total-categorias"

        );


    const totalProductos =

        document.getElementById(

            "total-productos-categorias"

        );


    const totalUtilizadas =

        document.getElementById(

            "total-categorias-utilizadas"

        );


    const categoriasUtilizadas =

        categoriasGestion.filter(

            function (categoria) {

                return (

                    obtenerCantidadProductosCategoria(

                        categoria.id

                    ) > 0

                );
            }

        ).length;


    if (totalCategorias) {

        totalCategorias.textContent =

            categoriasGestion.length;
    }


    if (totalProductos) {

        totalProductos.textContent =

            productosGestion.length;
    }


    if (totalUtilizadas) {

        totalUtilizadas.textContent =

            categoriasUtilizadas;
    }
}


/* =========================================================
   RENDERIZAR CATEGORÍAS
========================================================= */

function renderizarCategoriasAdmin() {

    const tabla =

        document.getElementById(

            "tabla-categorias"

        );


    const mensajeVacio =

        document.getElementById(

            "mensaje-sin-categorias"

        );


    if (!tabla) {

        return;
    }


    tabla.innerHTML = "";


    const categoriasFiltradas =

        obtenerCategoriasFiltradas();


    actualizarEstadisticasCategorias();


    if (
        categoriasFiltradas.length === 0
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


    categoriasFiltradas.forEach(

        function (categoria) {

            const cantidadProductos =

                obtenerCantidadProductosCategoria(

                    categoria.id

                );


            const fila =

                document.createElement("tr");


            fila.innerHTML = `

                <td>

                    <div class="admin-categoria-datos">

                        <div class="admin-categoria-icono">

                            📁

                        </div>


                        <strong>

                            ${categoria.nombre_es}

                        </strong>

                    </div>

                </td>


                <td>

                    ${categoria.nombre_en}

                </td>


                <td>

                    <span class="admin-cantidad-productos">

                        ${cantidadProductos}

                    </span>

                </td>


                <td>

                    <div class="admin-acciones">


                        <button
                            type="button"
                            class="boton-admin-accion boton-editar"
                            data-editar-categoria="${categoria.id}"
                            title="Editar categoría"
                        >

                            ✏️

                        </button>


                        <button
                            type="button"
                            class="boton-admin-accion boton-eliminar"
                            data-eliminar-categoria="${categoria.id}"
                            title="Eliminar categoría"
                        >

                            🗑️

                        </button>


                    </div>

                </td>

            `;


            tabla.appendChild(fila);

        }

    );


    configurarEventosTablaCategorias();
}


/* =========================================================
   ABRIR MODAL
========================================================= */

function abrirModalCategoria(
    categoria = null
) {

    const fondoModal =

        document.getElementById(

            "fondo-modal-categoria"

        );


    const titulo =

        document.getElementById(

            "titulo-modal-categoria"

        );


    const formulario =

        document.getElementById(

            "formulario-categoria"

        );


    if (
        !fondoModal ||
        !formulario
    ) {

        return;
    }


    formulario.reset();


    categoriaEditandoId = null;


    document.getElementById(

        "categoria-id"

    ).value = "";


    if (categoria) {

        categoriaEditandoId =

            categoria.id;


        titulo.textContent =

            "Editar categoría";


        document.getElementById(

            "categoria-id"

        ).value = categoria.id;


        document.getElementById(

            "categoria-nombre-es"

        ).value =

            categoria.nombre_es || "";


        document.getElementById(

            "categoria-nombre-en"

        ).value =

            categoria.nombre_en || "";


    } else {

        titulo.textContent =

            "Nueva categoría";
    }


    fondoModal.classList.add("activo");


    document.body.style.overflow =

        "hidden";
}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModalCategoria() {

    const fondoModal =

        document.getElementById(

            "fondo-modal-categoria"

        );


    if (fondoModal) {

        fondoModal.classList.remove(

            "activo"

        );
    }


    document.body.style.overflow = "";


    categoriaEditandoId = null;
}


/* =========================================================
   GENERAR NUEVO ID
========================================================= */

function generarNuevoIdCategoria() {

    if (
        categoriasGestion.length === 0
    ) {

        return 1;
    }


    return (

        Math.max(

            ...categoriasGestion.map(

                function (categoria) {

                    return (

                        Number(categoria.id) ||

                        0

                    );
                }

            )

        ) + 1

    );
}


/* =========================================================
   VALIDAR NOMBRE REPETIDO
========================================================= */

function existeNombreCategoria(
    nombreEs,
    nombreEn,
    categoriaIdIgnorada = null
) {

    return categoriasGestion.some(

        function (categoria) {

            const esCategoriaActual =

                categoriaIdIgnorada !== null &&

                String(categoria.id) ===

                String(categoriaIdIgnorada);


            if (esCategoriaActual) {

                return false;
            }


            const mismoNombreEs =

                (
                    categoria.nombre_es ||
                    ""
                ).trim().toLowerCase() ===

                nombreEs.trim().toLowerCase();


            const mismoNombreEn =

                (
                    categoria.nombre_en ||
                    ""
                ).trim().toLowerCase() ===

                nombreEn.trim().toLowerCase();


            return (

                mismoNombreEs ||

                mismoNombreEn

            );
        }

    );
}


/* =========================================================
   GUARDAR CATEGORÍA
========================================================= */

function guardarCategoriaFormulario(
    evento
) {

    evento.preventDefault();


    const nombreEs =

        document.getElementById(

            "categoria-nombre-es"

        ).value.trim();


    const nombreEn =

        document.getElementById(

            "categoria-nombre-en"

        ).value.trim();


    if (
        !nombreEs ||
        !nombreEn
    ) {

        mostrarNotificacionAdmin(

            "Completa correctamente todos los campos.",

            "advertencia"

        );


        return;
    }


    if (

        existeNombreCategoria(

            nombreEs,

            nombreEn,

            categoriaEditandoId

        )

    ) {

        mostrarNotificacionAdmin(

            "Ya existe una categoría con ese nombre.",

            "advertencia"

        );


        return;
    }


    /* =============================================
       EDITAR
    ============================================== */

    if (
        categoriaEditandoId !== null
    ) {

        const indice =

            categoriasGestion.findIndex(

                function (categoria) {

                    return (

                        String(categoria.id) ===

                        String(categoriaEditandoId)

                    );
                }

            );


        if (indice === -1) {

            return;
        }


        categoriasGestion[indice] = {

            ...categoriasGestion[indice],

            nombre_es: nombreEs,

            nombre_en: nombreEn

        };


        mostrarNotificacionAdmin(

            "Categoría actualizada correctamente.",

            "exito"

        );


    } else {


        /* =========================================
           CREAR
        ========================================== */

        const nuevaCategoria = {

            id: generarNuevoIdCategoria(),

            nombre_es: nombreEs,

            nombre_en: nombreEn

        };


        categoriasGestion.push(

            nuevaCategoria

        );


        mostrarNotificacionAdmin(

            "Categoría creada correctamente.",

            "exito"

        );
    }


    guardarCategoriasAdmin();


    renderizarCategoriasAdmin();


    cerrarModalCategoria();
}


/* =========================================================
   EDITAR CATEGORÍA
========================================================= */

function editarCategoria(
    categoriaId
) {

    const categoria =

        categoriasGestion.find(

            function (categoria) {

                return (

                    String(categoria.id) ===

                    String(categoriaId)

                );
            }

        );


    if (!categoria) {

        return;
    }


    abrirModalCategoria(categoria);
}


/* =========================================================
   ELIMINAR CATEGORÍA
========================================================= */

function eliminarCategoria(
    categoriaId
) {

    const categoria =

        categoriasGestion.find(

            function (categoria) {

                return (

                    String(categoria.id) ===

                    String(categoriaId)

                );
            }

        );


    if (!categoria) {

        return;
    }


    const cantidadProductos =

        obtenerCantidadProductosCategoria(

            categoriaId

        );


    /* =============================================
       EVITAR ELIMINAR CATEGORÍAS EN USO
    ============================================== */

    if (cantidadProductos > 0) {

        mostrarNotificacionAdmin(

            `No puedes eliminar "${categoria.nombre_es}" porque tiene ${cantidadProductos} producto(s) asociado(s).`,

            "advertencia"

        );


        return;
    }


    const confirmar =

        window.confirm(

            `¿Deseas eliminar la categoría "${categoria.nombre_es}"?`

        );


    if (!confirmar) {

        return;
    }


    categoriasGestion =

        categoriasGestion.filter(

            function (categoria) {

                return (

                    String(categoria.id) !==

                    String(categoriaId)

                );
            }

        );


    guardarCategoriasAdmin();


    renderizarCategoriasAdmin();


    mostrarNotificacionAdmin(

        "Categoría eliminada correctamente.",

        "exito"

    );
}


/* =========================================================
   EVENTOS DE LA TABLA
========================================================= */

function configurarEventosTablaCategorias() {

    document

        .querySelectorAll(

            "[data-editar-categoria]"

        )

        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        editarCategoria(

                            boton.dataset
                                .editarCategoria

                        );
                    }

                );
            }

        );


    document

        .querySelectorAll(

            "[data-eliminar-categoria]"

        )

        .forEach(

            function (boton) {

                boton.addEventListener(

                    "click",

                    function () {

                        eliminarCategoria(

                            boton.dataset
                                .eliminarCategoria

                        );
                    }

                );
            }

        );
}


/* =========================================================
   CONFIGURAR EVENTOS GENERALES
========================================================= */

function configurarEventosCategoriasAdmin() {

    const botonNuevaCategoria =

        document.getElementById(

            "boton-nueva-categoria"

        );


    const botonCerrarModal =

        document.getElementById(

            "cerrar-modal-categoria"

        );


    const botonCancelar =

        document.getElementById(

            "cancelar-categoria"

        );


    const formulario =

        document.getElementById(

            "formulario-categoria"

        );


    const campoBusqueda =

        document.getElementById(

            "buscar-categoria"

        );


    const fondoModal =

        document.getElementById(

            "fondo-modal-categoria"

        );


    if (botonNuevaCategoria) {

        botonNuevaCategoria.addEventListener(

            "click",

            function () {

                abrirModalCategoria();

            }

        );
    }


    if (botonCerrarModal) {

        botonCerrarModal.addEventListener(

            "click",

            cerrarModalCategoria

        );
    }


    if (botonCancelar) {

        botonCancelar.addEventListener(

            "click",

            cerrarModalCategoria

        );
    }


    if (formulario) {

        formulario.addEventListener(

            "submit",

            guardarCategoriaFormulario

        );
    }


    if (campoBusqueda) {

        campoBusqueda.addEventListener(

            "input",

            renderizarCategoriasAdmin

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

                    cerrarModalCategoria();
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

                cerrarModalCategoria();
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

        configurarEventosCategoriasAdmin();

        cargarDatosCategoriasAdmin();

    }

);