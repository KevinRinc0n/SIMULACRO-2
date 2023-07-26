let rutas = [];

window.addEventListener("DOMContentLoaded", e ,() => {
    e.preventDefault();
    getRutas();
});

async function getRutas () { 
    try {
        const url = await fetch ("http://localhost:3000/Rutas");
        const datos = await url.json();
        const rut = datos;
        console.log(rut);
        renderRutas(rut);
    } catch (error) {
        alertManager("error", "Ha ocurrido un problema");
    };   
};

const contenedorRutas = document.getElementById('contenedor');

const renderRutas = (rutas) => {
    let listar = "";
    rutas.forEach(ruta => {
        listar += `
            <tr>
                <td>${ruta.id}</td>
                <td>${ruta.NomRuta}</td>
                <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="editarRuta(${ruta.id})">EDITAR</button></td>
                <td><button class="btn btn-danger" onclick="eliminarRuta(${producto.id})">ELIMINAR</button></td>
            </tr>`;
    });
    contenedorRutas.innerHTML = listar;
};

const crearProducto = () => {
    const inputNombre = document.getElementById('inputNombre').value;
    const id = document.getElementById('inputPrecio').value;

    if (!inputNombre || !id || !selectCategoria) {
        document.getElementById('llenarTodo').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodo").innerHTML = "";

    const ruta = {
        NomRuta: inputNombre,
        id: id,
    };
    console.log(ruta);

    try{
        await fetch(url), {
            method: "POST",
            body: JSON.stringify(ruta),
            headers: {
                "Content-Type": "application/json"
            }
        }
        (respuesta => respuesta.json())
        (respuesta => {
        alertManager("success", respuesta.mensaje);
        getRutas();
    })
    } catch (error) {
        alertManager("error", error);
        document.getElementById("crear").reset();
    };
};

const editarProducto = (id) => {
    let ruta = rutas.find(ruta => ruta.id == id);

    document.getElementById("editarNombre").value = ruta.nombre;

    document.getElementById("modalEditar").setAttribute("data-id", id);
};

// import 
const subirRuta = () => {
    const editarNombre = document.getElementById("editarNombre").value;

    if (!editarNombre ) {
        document.getElementById('llenarTodoEditar').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoEditar").innerHTML = "";

    const id = document.getElementById("modalEditar").getAttribute("data-id"); 

    const producto = {
        nombre: editarNombre,
        id: id
    };
    try{
        await fetch(`${url}/${id}`, {
            method: "PUT",
            body: JSON.stringify(producto),
            headers: {
                "Content-Type": "application/json"
            }
        })
        (respuesta => respuesta.json())
        (respuesta => {
            alertManager("success", respuesta.mensaje);
            getRutas();
        })
    } catch(error) {
        alertManager("error", error);
    };

    document.getElementById("modalEditar").reset();
};

const eliminarProducto = (id) => {
    try {
        await fetch(`${url}/${id}`, {
            method: "DELETE"
        })
        (respuesta => respuesta.json())
        (respuesta => {
            alertManager("success", respuesta.mensaje);
            getRutas();
        })
    } catch(error) {
        alertManager("error", error);
    };
};

///////////////////////////////////////////////