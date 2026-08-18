/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CLAVE_IDIOMA = "sodaSlothIdioma";

let idiomaActual = cargarIdioma();


/* =========================================================
   CARGAR IDIOMA
========================================================= */

function cargarIdioma() {

    try {

        const idiomaGuardado =
            localStorage.getItem(
                CLAVE_IDIOMA
            );


        if (
            idiomaGuardado === "es" ||
            idiomaGuardado === "en"
        ) {

            return idiomaGuardado;
        }


        return "es";

    } catch (error) {

        console.error(
            "Error al cargar el idioma:",
            error
        );


        return "es";
    }
}


/* =========================================================
   GUARDAR IDIOMA
========================================================= */

function guardarIdioma() {

    try {

        localStorage.setItem(
            CLAVE_IDIOMA,
            idiomaActual
        );

    } catch (error) {

        console.error(
            "Error al guardar el idioma:",
            error
        );
    }
}


/* =========================================================
   OBTENER IDIOMA ACTUAL

   Esta función es utilizada por otros archivos,
   como carrito.js y main.js.
========================================================= */

function obtenerIdiomaActual() {

    return idiomaActual;
}


/* =========================================================
   TRADUCIR TEXTOS DESDE JAVASCRIPT

   EJEMPLO:

   traducirTexto(
       "Agregar",
       "Add"
   );
========================================================= */

function traducirTexto(
    textoEspanol,
    textoIngles
) {

    if (idiomaActual === "en") {

        return textoIngles;
    }


    return textoEspanol;
}


/* =========================================================
   TRADUCIR ELEMENTO
========================================================= */

function traducirElemento(elemento) {

    if (!elemento) {
        return;
    }


    const textoEspanol =
        elemento.getAttribute(
            "data-es"
        );


    const textoIngles =
        elemento.getAttribute(
            "data-en"
        );


    if (
        textoEspanol === null ||
        textoIngles === null
    ) {

        return;
    }


    const textoTraducido =

        idiomaActual === "en"

            ? textoIngles

            : textoEspanol;


    /*
        INPUT Y TEXTAREA

        Si tienen placeholder,
        traducimos el placeholder.
    */

    if (
        elemento.tagName === "INPUT" ||
        elemento.tagName === "TEXTAREA"
    ) {

        if (
            elemento.hasAttribute(
                "placeholder"
            )
        ) {

            elemento.placeholder =
                textoTraducido;

            return;
        }
    }


    /*
        IMÁGENES

        Si una imagen utiliza data-es y data-en,
        traducimos el atributo alt.
    */

    if (
        elemento.tagName === "IMG"
    ) {

        elemento.alt =
            textoTraducido;

        return;
    }


    /*
        RESTO DE ELEMENTOS
    */

    elemento.textContent =
        textoTraducido;
}


/* =========================================================
   TRADUCIR TODOS LOS ELEMENTOS DEL HTML
========================================================= */

function traducirPagina() {

    const elementosTraducibles =

        document.querySelectorAll(
            "[data-es][data-en]"
        );


    elementosTraducibles.forEach(

        function (elemento) {

            traducirElemento(
                elemento
            );
        }
    );
}


/* =========================================================
   ACTUALIZAR BOTONES DE IDIOMA
========================================================= */

function actualizarBotonesIdioma() {

    const botonesIdioma =

        document.querySelectorAll(
            "[data-idioma]"
        );


    botonesIdioma.forEach(

        function (boton) {

            const idiomaBoton =
                boton.getAttribute(
                    "data-idioma"
                );


            if (
                idiomaBoton ===
                idiomaActual
            ) {

                boton.classList.add(
                    "activo"
                );


                boton.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                boton.classList.remove(
                    "activo"
                );


                boton.setAttribute(
                    "aria-pressed",
                    "false"
                );
            }
        }
    );
}


/* =========================================================
   ACTUALIZAR IDIOMA DEL DOCUMENTO
========================================================= */

function actualizarIdiomaDocumento() {

    document.documentElement.lang =
        idiomaActual;
}


/* =========================================================
   CAMBIAR IDIOMA
========================================================= */

function cambiarIdioma(nuevoIdioma) {

    /*
        VALIDAMOS EL IDIOMA.
    */

    if (
        nuevoIdioma !== "es" &&
        nuevoIdioma !== "en"
    ) {

        console.warn(
            "Idioma no válido:",
            nuevoIdioma
        );

        return;
    }


    /*
        ACTUALIZAMOS EL IDIOMA.
    */

    idiomaActual =
        nuevoIdioma;


    /*
        GUARDAMOS LA PREFERENCIA.
    */

    guardarIdioma();


    /*
        ACTUALIZAMOS EL HTML.
    */

    actualizarIdiomaDocumento();


    traducirPagina();


    actualizarBotonesIdioma();


    /*
        AVISAMOS A OTROS ARCHIVOS.

        carrito.js puede volver a mostrar
        los nombres de productos.

        main.js puede volver a mostrar
        categorías y productos.
    */

    document.dispatchEvent(

        new CustomEvent(

            "sodaSlothCambioIdioma",

            {

                detail: {

                    idioma:
                        idiomaActual
                }
            }
        )
    );
}


/* =========================================================
   CONFIGURAR BOTONES DE IDIOMA
========================================================= */

function configurarBotonesIdioma() {

    const botonesIdioma =

        document.querySelectorAll(
            "[data-idioma]"
        );


    botonesIdioma.forEach(

        function (boton) {

            boton.addEventListener(

                "click",

                function () {

                    const idiomaSeleccionado =

                        boton.getAttribute(
                            "data-idioma"
                        );


                    cambiarIdioma(
                        idiomaSeleccionado
                    );
                }
            );
        }
    );
}


/* =========================================================
   TRADUCIR ELEMENTOS DINÁMICOS

   Esta función puede ser llamada desde main.js
   después de crear productos o categorías.
========================================================= */

function actualizarIdiomaElementosDinamicos() {

    traducirPagina();

    actualizarBotonesIdioma();
}


/* =========================================================
   INICIALIZAR IDIOMA
========================================================= */

function inicializarIdioma() {

    actualizarIdiomaDocumento();

    traducirPagina();

    actualizarBotonesIdioma();

    configurarBotonesIdioma();
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        inicializarIdioma();
    }
);