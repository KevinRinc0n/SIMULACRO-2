let rutas = [];
const url = "http://localhost:3000/Rutas";

window.addEventListener("DOMContentLoaded", getRutas);

async function getRutas() { 
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        const rutaSelect = document.getElementById("selectRuta");
        rutaSelect.innerHTML = "";

        const rutaSelects = document.querySelectorAll(".ruta-select");

        rutaSelects.forEach((select) => {
            select.innerHTML = "";

            datos.forEach((ruta) => {
                const opcion = document.createElement("option");
                opcion.value = ruta.id;
                opcion.textContent = ruta.NomRuta;
                select.appendChild(opcion);
            });
        });

        rutas = datos;
        console.log(rutas);
        renderRutas();
    } catch (error) {
        alertManager("error", "Ha ocurrido un problema");
    }   
};

const contenedorRutas = document.getElementById('contenedor');

const renderRutas = () => {
    let listar = "";
    rutas.forEach(ruta => {
        listar += `
            <tr>
                <td>${ruta.id}</td>
                <td>${ruta.NomRuta}</td>
                <td><button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalEditar" onclick="editarRuta(${ruta.id})">EDITAR</button></td>
                <td><button class="btn btn-danger" onclick="eliminarRuta(${ruta.id})">ELIMINAR</button></td>
            </tr>`;
    });
    contenedorRutas.innerHTML = listar;
};

async function crearRuta () {
    const inputNombre = document.getElementById('inputNombre').value;

    if (!inputNombre) {
        document.getElementById('llenarTodo').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodo").innerHTML = "";

    const ruta = {
        NomRuta: inputNombre
    };

    console.log(ruta);

    try {
        const respuesta = await fetch(url, {
            method: "POST",
            body: JSON.stringify(ruta),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await respuesta.json();
        alertManager("success", 'Ruta agregada correctamente');
        getRutas();

    } catch (error) {
        alertManager("error", error);
        document.getElementById("crear").reset();
    }
};

const editarRuta = (id) => {
    let ruta = rutas.find(ruta => ruta.id == id);

    document.getElementById("editarNombre").value = ruta.NomRuta;

    document.getElementById("modalEditar").setAttribute("data-id", id);
};

async function subirRuta() {
    const editarNombre = document.getElementById("editarNombre").value;

    if (!editarNombre) {
        document.getElementById('llenarTodoEditar').innerHTML = "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoEditar").innerHTML = "";

    const id = document.getElementById("modalEditar").getAttribute("data-id"); 

    const ruta = {
        NomRuta: editarNombre
    };

    try {
        const respuesta = await fetch(`${url}/${id}`, {
            method: "PUT",
            body: JSON.stringify(ruta),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await respuesta.json();
        alertManager("success", data.mensaje);
        getRutas();

    } catch(error) {
        alertManager("error", error);
    }

    document.getElementById("modalEditar").reset();
};

async function eliminarRuta(id) {
    try {
        const respuesta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        });

        const data = await respuesta.json();
        alertManager("success", 'Ruta eliminada correctamente');

        await eliminarPuntosPorRuta(id);

        getRutas();
        
    } catch(error) {
        alertManager("error", error);
    }
};

async function eliminarPuntosPorRuta(rutaId) {
    try {
        const puntosAEliminar = puntos.filter(punto => punto.RutaId === rutaId);

        for (const punto of puntosAEliminar) {
            await fetch(`${urll}/${punto.id}`, {
                method: "DELETE"
            });
        }
        
    } catch(error) {
        throw new Error("Error al eliminar puntos de la ruta");
    }
};

function alertManager(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    const alertElement = document.createElement('div');

    alertElement.className = 'alert ' + type;
    alertElement.textContent = message;

    alertContainer.appendChild(alertElement);

    setTimeout(function() {
        alertElement.remove();
    }, 3000);
};

///////////////////////////////////////////////

let puntos = [];
const urll = "http://localhost:3000/Puntos";

window.addEventListener("DOMContentLoaded", () => {
    getPuntos();
    cargarRutas();
});

async function getPuntos() {
    try {
        const respuesta = await fetch(urll);
        const datos = await respuesta.json();
        puntos = datos;
        renderPuntos();
    } catch (error) {
        alertManager("error", "Ha ocurrido un problema");
    }
};

const contenedorPuntos = document.getElementById("contenedorPuntos");

document.getElementById("selectRuta").addEventListener("change", mostrarPuntos);

function mostrarPuntos() {
    const rutaId = document.getElementById("selectRuta").value;
    const puntosFiltrados = puntos.filter((punto) => punto.RutaId == rutaId);
    renderPuntosFiltrados(puntosFiltrados);
}

const renderPuntos = () => {
    let listar = "";
    puntos.forEach((punto) => {
        listar += `
            <div class="card cartas" style="width: 18rem;">
                <img src="./imgs/1590949.png" class="card-img-top" alt="...">
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${punto.id}</li>
                        <li class="list-group-item">${punto.NomPuntos}</li>
                        <li class="list-group-item">${punto.RutaId}</li>
                        <a href="#">
                            <button class="btn btn-warning btnsPuntos" data-bs-toggle="modal" data-bs-target="#modalEditarPuntos" onclick="editarPunto(${punto.id})">EDITAR</button><button class="btn btn-danger btnsPuntos" onclick="eliminarPunto(${punto.id})">ELIMINAR</button>
                        </a>
                    </ul>
                </div>
            </div>`;
    });
    contenedorPuntos.innerHTML = listar;
};

const renderPuntosFiltrados = (puntosFiltrados) => {
    let listar = "";
    puntosFiltrados.forEach((punto) => {
        listar += `
            <div class="card cartas" style="width: 18rem;">
                <img src="./imgs/1590949.png" class="card-img-top" alt="...">
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${punto.id}</li>
                        <li class="list-group-item">${punto.NomPuntos}</li>
                        <li class="list-group-item">${punto.RutaId}</li>
                        <a href="#">
                            <button class="btn btn-warning btnsPuntos" data-bs-toggle="modal" data-bs-target="#modalEditarPuntos" onclick="editarPunto(${punto.id})">EDITAR</button><button class="btn btn-danger btnsPuntos" onclick="eliminarPunto(${punto.id})">ELIMINAR</button>
                        </a>
                    </ul>
                </div>
            </div>`;
    });
    contenedorPuntos.innerHTML = listar;
};

async function crearPunto() {
    const inputNombrePunto = document.getElementById("inputNombrePuntos").value;
    const inputIdPuntos = document.getElementById("inputIdPuntos").value;

    if (!inputNombrePunto || !inputIdPuntos) {
        document.getElementById("llenarTodoPunto").innerHTML =
            "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoPunto").innerHTML = "";

    const punto = {
        NomPuntos: inputNombrePunto,
        RutaId: parseInt(inputIdPuntos),
        Imagen: "./imgs/1590949.png",
    };

    try {
        const respuesta = await fetch(urll, {
            method: "POST",
            body: JSON.stringify(punto),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await respuesta.json();
        alertManager("success", data.mensaje);
        getPuntos();
    } catch (error) {
        alertManager("error", error);
        document.getElementById("crear").reset();
    }
};

const editarPunto = (id) => {
    let punto = puntos.find((punto) => punto.id == id);

    document.getElementById("editarNombrePunto").value = punto.NomPuntos;
    document.getElementById("editarRutaPuntos").value = punto.RutaId;

    document.getElementById("modalEditarPuntos").setAttribute("data-id", id);
};

async function subirPunto() {
    const editarNombrePunto = document.getElementById("editarNombrePunto").value;
    const editarRutaPuntos = document.getElementById("editarRutaPuntos").value;

    if (!editarNombrePunto || !editarRutaPuntos) {
        document.getElementById("llenarTodoPuntoEditar").innerHTML =
            "DEBES LLENAR TODOS LOS CAMPOS";
        return;
    }

    document.getElementById("llenarTodoPuntoEditar").innerHTML = "";

    const id = document.getElementById("modalEditarPuntos").getAttribute("data-id");

    const punto = {
        NomPuntos: editarNombrePunto,
        RutaId: parseInt(editarRutaPuntos),
        Imagen: "./imgs/1590949.png",
    };

    try {
        const respuesta = await fetch(`${urll}/${id}`, {
            method: "PUT",
            body: JSON.stringify(punto),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await respuesta.json();
        alertManager("success", data.mensaje);
        getPuntos();
    } catch (error) {
        alertManager("error", error);
    }

    document.getElementById("modalEditarPuntos").reset();
};

async function eliminarPunto(id) {
    try {
        const respuesta = await fetch(`${urll}/${id}`, {
            method: "DELETE",
        });

        const data = await respuesta.json();
        alertManager("success", data.mensaje);
        getPuntos();
    } catch (error) {
        alertManager("error", error);
    }
};