const CLAVE_SESION_ADMIN = "sodaSlothSesionAdmin";

const CORREO_ADMIN = "administrador@sodasloth.com";
const CONTRASENA_ADMIN = "Sloth2026";


/* =========================================================
   ELEMENTOS
========================================================= */

const formularioLogin =
    document.getElementById("formulario-login");

const campoCorreo =
    document.getElementById("correo");

const campoContrasena =
    document.getElementById("contrasena");

const errorCorreo =
    document.getElementById("error-correo");

const errorContrasena =
    document.getElementById("error-contrasena");

const mensajeLogin =
    document.getElementById("mensaje-login");

const botonIniciarSesion =
    document.getElementById("boton-iniciar-sesion");

const botonMostrarContrasena =
    document.getElementById("mostrar-contrasena");


/* =========================================================
   LIMPIAR ERRORES
========================================================= */

function limpiarErroresLogin() {

    if (errorCorreo) {

        errorCorreo.textContent = "";
        errorCorreo.classList.add("oculto");
    }

    if (errorContrasena) {

        errorContrasena.textContent = "";
        errorContrasena.classList.add("oculto");
    }

    if (campoCorreo) {

        campoCorreo.classList.remove("campo-error");
    }

    if (campoContrasena) {

        campoContrasena.classList.remove("campo-error");
    }

    ocultarMensajeLogin();
}


/* =========================================================
   VALIDAR CORREO
========================================================= */

function validarCorreo(correo) {

    const expresionCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!correo) {

        mostrarErrorCorreo(
            "Debes ingresar el correo electrónico."
        );

        return false;
    }


    if (!expresionCorreo.test(correo)) {

        mostrarErrorCorreo(
            "Ingresa un correo electrónico válido."
        );

        return false;
    }


    return true;
}


/* =========================================================
   VALIDAR CONTRASEÑA
========================================================= */

function validarContrasena(contrasena) {

    if (!contrasena) {

        mostrarErrorContrasena(
            "Debes ingresar la contraseña."
        );

        return false;
    }


    if (contrasena.length < 6) {

        mostrarErrorContrasena(
            "La contraseña debe tener al menos 6 caracteres."
        );

        return false;
    }


    return true;
}


/* =========================================================
   MOSTRAR ERROR DE CORREO
========================================================= */

function mostrarErrorCorreo(mensaje) {

    if (errorCorreo) {

        errorCorreo.textContent = mensaje;
        errorCorreo.classList.remove("oculto");
    }


    if (campoCorreo) {

        campoCorreo.classList.add("campo-error");
    }
}


/* =========================================================
   MOSTRAR ERROR DE CONTRASEÑA
========================================================= */

function mostrarErrorContrasena(mensaje) {

    if (errorContrasena) {

        errorContrasena.textContent = mensaje;
        errorContrasena.classList.remove("oculto");
    }


    if (campoContrasena) {

        campoContrasena.classList.add("campo-error");
    }
}


/* =========================================================
   MOSTRAR MENSAJE GENERAL
========================================================= */

function mostrarMensajeLogin(mensaje, tipo) {

    if (!mensajeLogin) {
        return;
    }


    mensajeLogin.textContent = mensaje;

    mensajeLogin.className =
        `mensaje-login ${tipo}`;
}


/* =========================================================
   OCULTAR MENSAJE GENERAL
========================================================= */

function ocultarMensajeLogin() {

    if (!mensajeLogin) {
        return;
    }


    mensajeLogin.textContent = "";

    mensajeLogin.className =
        "mensaje-login oculto";
}


/* =========================================================
   MOSTRAR / OCULTAR CONTRASEÑA
========================================================= */

function alternarVisibilidadContrasena() {

    if (!campoContrasena) {
        return;
    }


    const estaOculta =
        campoContrasena.type === "password";


    campoContrasena.type =
        estaOculta
            ? "text"
            : "password";


    if (botonMostrarContrasena) {

        botonMostrarContrasena.textContent =
            estaOculta
                ? "🙈"
                : "👁";


        botonMostrarContrasena.setAttribute(

            "aria-label",

            estaOculta
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
        );
    }
}


/* =========================================================
   VALIDAR CREDENCIALES
========================================================= */

function validarCredenciales(correo, contrasena) {

    return (

        correo === CORREO_ADMIN &&

        contrasena === CONTRASENA_ADMIN

    );
}


/* =========================================================
   GUARDAR SESIÓN DEL ADMINISTRADOR
========================================================= */

function guardarSesionAdministrador(correo) {

    try {

        const sesion = {

            autenticado: true,

            correo: correo,

            fechaInicio:
                new Date().toISOString()
        };


        sessionStorage.setItem(

            CLAVE_SESION_ADMIN,

            JSON.stringify(sesion)
        );


        return true;


    } catch (error) {

        console.error(
            "Error guardando la sesión:",
            error
        );


        return false;
    }
}


/* =========================================================
   PROCESAR LOGIN
========================================================= */

function procesarLogin(evento) {

    evento.preventDefault();


    limpiarErroresLogin();


    if (
        !campoCorreo ||
        !campoContrasena
    ) {

        return;
    }


    const correo =
        campoCorreo.value
            .trim()
            .toLowerCase();


    const contrasena =
        campoContrasena.value;


    const correoValido =
        validarCorreo(correo);


    const contrasenaValida =
        validarContrasena(contrasena);


    if (
        !correoValido ||
        !contrasenaValida
    ) {

        return;
    }


    if (botonIniciarSesion) {

        botonIniciarSesion.disabled = true;


        botonIniciarSesion.innerHTML = `

            <span>
                Verificando acceso...
            </span>

        `;
    }


    setTimeout(

        function () {

            const credencialesValidas =

                validarCredenciales(

                    correo,

                    contrasena
                );


            if (!credencialesValidas) {

                mostrarMensajeLogin(

                    "El correo o la contraseña son incorrectos.",

                    "error"
                );


                if (botonIniciarSesion) {

                    botonIniciarSesion.disabled = false;


                    botonIniciarSesion.innerHTML = `

                        <span>
                            Iniciar sesión
                        </span>

                    `;
                }


                return;
            }


            const sesionGuardada =

                guardarSesionAdministrador(
                    correo
                );


            if (!sesionGuardada) {

                mostrarMensajeLogin(

                    "No fue posible iniciar la sesión.",

                    "error"
                );


                if (botonIniciarSesion) {

                    botonIniciarSesion.disabled = false;


                    botonIniciarSesion.innerHTML = `

                        <span>
                            Iniciar sesión
                        </span>

                    `;
                }


                return;
            }


            mostrarMensajeLogin(

                "Acceso correcto. Ingresando al panel administrativo...",

                "exito"
            );


            setTimeout(

                function () {

                    window.location.href =
                        "dashboard.html";
                },

                500
            );

        },

        400
    );
}


/* =========================================================
   VERIFICAR SESIÓN EXISTENTE
========================================================= */

function verificarSesionExistente() {

    try {

        const sesionGuardada =

            sessionStorage.getItem(
                CLAVE_SESION_ADMIN
            );


        if (!sesionGuardada) {
            return;
        }


        const sesion =
            JSON.parse(sesionGuardada);


        if (
            sesion &&
            sesion.autenticado === true
        ) {

            window.location.href =
                "dashboard.html";
        }


    } catch (error) {

        console.error(
            "Error verificando la sesión:",
            error
        );


        sessionStorage.removeItem(
            CLAVE_SESION_ADMIN
        );
    }
}


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventosLogin() {

    if (formularioLogin) {

        formularioLogin.addEventListener(

            "submit",

            procesarLogin
        );
    }


    if (botonMostrarContrasena) {

        botonMostrarContrasena.addEventListener(

            "click",

            alternarVisibilidadContrasena
        );
    }


    if (campoCorreo) {

        campoCorreo.addEventListener(

            "input",

            function () {

                campoCorreo.classList.remove(
                    "campo-error"
                );


                if (errorCorreo) {

                    errorCorreo.classList.add(
                        "oculto"
                    );
                }


                ocultarMensajeLogin();
            }
        );
    }


    if (campoContrasena) {

        campoContrasena.addEventListener(

            "input",

            function () {

                campoContrasena.classList.remove(
                    "campo-error"
                );


                if (errorContrasena) {

                    errorContrasena.classList.add(
                        "oculto"
                    );
                }


                ocultarMensajeLogin();
            }
        );
    }
}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        verificarSesionExistente();

        configurarEventosLogin();
    }
);