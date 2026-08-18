/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CLAVE_PEDIDOS_SODA_SLOTH =
    "sodaSlothPedidosAdmin";


/* =========================================================
   OBTENER PEDIDOS GUARDADOS
========================================================= */

function obtenerPedidosGuardados() {

    try {

        const pedidosGuardados =
            localStorage.getItem(
                CLAVE_PEDIDOS_SODA_SLOTH
            );


        if (!pedidosGuardados) {

            return [];
        }


        const pedidos =
            JSON.parse(
                pedidosGuardados
            );


        return Array.isArray(pedidos)
            ? pedidos
            : [];


    } catch (error) {

        console.error(
            "Error leyendo los pedidos:",
            error
        );


        return [];
    }
}


/* =========================================================
   GUARDAR LISTA DE PEDIDOS
========================================================= */

function guardarListaPedidos(pedidos) {

    try {

        localStorage.setItem(

            CLAVE_PEDIDOS_SODA_SLOTH,

            JSON.stringify(pedidos)

        );


        return true;


    } catch (error) {

        console.error(
            "Error guardando los pedidos:",
            error
        );


        return false;
    }
}


/* =========================================================
   GENERAR ID DE PEDIDO
========================================================= */

function generarIdPedido() {

    const pedidos =
        obtenerPedidosGuardados();


    if (pedidos.length === 0) {

        return 1;
    }


    const identificadores =

        pedidos.map(

            function (pedido) {

                return (
                    Number(pedido.id) ||
                    0
                );
            }
        );


    return (

        Math.max(
            ...identificadores
        ) + 1

    );
}


/* =========================================================
   NORMALIZAR PRODUCTO DEL PEDIDO
========================================================= */

function normalizarProductoPedido(producto) {

    return {

        id:
            producto.id,

        nombre_es:

            producto.nombre_es ||

            producto.nombre ||

            "Producto",

        nombre_en:

            producto.nombre_en ||

            producto.nombre ||

            "Product",

        precio:

            Number(
                producto.precio
            ) || 0,

        cantidad:

            Number(
                producto.cantidad
            ) || 1

    };
}


/* =========================================================
   CALCULAR TOTAL DEL PEDIDO
========================================================= */

function calcularTotalNuevoPedido(productos) {

    if (!Array.isArray(productos)) {

        return 0;
    }


    return productos.reduce(

        function (
            acumulador,
            producto
        ) {

            const precio =

                Number(
                    producto.precio
                ) || 0;


            const cantidad =

                Number(
                    producto.cantidad
                ) || 1;


            return (

                acumulador +

                precio * cantidad

            );
        },

        0
    );
}


/* =========================================================
   VALIDAR PEDIDO
========================================================= */

function validarDatosPedido(
    cliente,
    telefono,
    productos
) {

    if (
        !cliente ||
        cliente.trim() === ""
    ) {

        return {

            valido: false,

            mensaje:
                "Debes ingresar el nombre del cliente."

        };
    }


    if (
        !telefono ||
        telefono.trim() === ""
    ) {

        return {

            valido: false,

            mensaje:
                "Debes ingresar un número de teléfono."

        };
    }


    if (
        !Array.isArray(productos) ||
        productos.length === 0
    ) {

        return {

            valido: false,

            mensaje:
                "El carrito está vacío."

        };
    }


    return {

        valido: true,

        mensaje: ""

    };
}


/* =========================================================
   CREAR PEDIDO
========================================================= */

function crearPedido(
    cliente,
    telefono,
    productos
) {

    const validacion =

        validarDatosPedido(

            cliente,

            telefono,

            productos

        );


    if (!validacion.valido) {

        return {

            exito: false,

            mensaje:
                validacion.mensaje,

            pedido: null

        };
    }


    const productosNormalizados =

        productos.map(

            normalizarProductoPedido

        );


    const nuevoPedido = {

        id:
            generarIdPedido(),

        cliente:
            cliente.trim(),

        telefono:
            telefono.trim(),

        fecha:
            new Date().toISOString(),

        estado:
            "pendiente",

        productos:
            productosNormalizados,

        total:

            calcularTotalNuevoPedido(

                productosNormalizados

            )

    };


    const pedidos =
        obtenerPedidosGuardados();


    pedidos.push(
        nuevoPedido
    );


    const guardadoCorrectamente =

        guardarListaPedidos(
            pedidos
        );


    if (!guardadoCorrectamente) {

        return {

            exito: false,

            mensaje:
                "No fue posible guardar el pedido.",

            pedido: null

        };
    }


    return {

        exito: true,

        mensaje:
            "Pedido registrado correctamente.",

        pedido:
            nuevoPedido

    };
}


/* =========================================================
   OBTENER ÚLTIMO PEDIDO
========================================================= */

function obtenerUltimoPedido() {

    const pedidos =
        obtenerPedidosGuardados();


    if (pedidos.length === 0) {

        return null;
    }


    return pedidos[
        pedidos.length - 1
    ];
}


/* =========================================================
   ELIMINAR TODOS LOS PEDIDOS
========================================================= */

function eliminarTodosLosPedidos() {

    try {

        localStorage.removeItem(
            CLAVE_PEDIDOS_SODA_SLOTH
        );


        return true;


    } catch (error) {

        console.error(
            "Error eliminando los pedidos:",
            error
        );


        return false;
    }
}