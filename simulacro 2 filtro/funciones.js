import { selector, contenedor, carritoCompras } from "./selectores.js";

export function seleccionarCategoria(){
    const url = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
    fetch(url)
        .then(resultado => {
            return resultado.json();
        })
        .then(datos =>{
            listarCategoria(datos.meals);
        })
        .catch(error => {
            console.error(error);
        });    
};

function listarCategoria(datos){
    datos.forEach(dato => {
        const opcion = document.createElement('option');
        opcion.textContent = dato.strCategory;
        selector.appendChild(opcion);
    });
};

const parametros  = {
    categoria: ""
};

export function getCategoria(e){
    parametros.categoria = e.target.value;
    verCategoria();
};

function verCategoria(){
    const {categoria} = parametros;
    console.log(categoria);
    const url =  `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;
    fetch(url)
        .then(resultado =>{
            return resultado.json();
        })
        .then(datosComida =>{
            mostrarComida(datosComida.meals);
        })
        .catch(error =>{
            console.log(error);
        });
};

function mostrarComida(datosComida){
    limpiar();
    let html = "";
    datosComida.forEach((dato) =>{
        const {strMeal, strMealThumb, idMeal} = dato;
        html += `
        <div class="card comida" style="width: 18rem;">
            <img src="${strMealThumb}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${strMeal}</h5>
                <a href="#" class="btn btn-secondary boton" id="${idMeal}" imagen="${strMealThumb}" nombre="${strMeal}">Añadir al carrito</a>
            </div>
        </div>`;
        contenedor.innerHTML = html;
    });
};

function limpiar(){
    let carta = document.querySelectorAll(".card");
    for (let i = 0; i < carta.length; i++){
        carta[i].remove();
    };
};

let arrayComida = [];
export function agregarCarrito(e){
    e.preventDefault();
    if(e.target.classList.contains('boton')){
        const nombre = e.target.getAttribute("nombre");
        const imagen = e.target.getAttribute("imagen");
        const id = e.target.getAttribute("id");
        let comida = {
            id: id,
            imagen: imagen,
            nombre: nombre
        };
        arrayComida = [...arrayComida, comida];
        console.log(arrayComida);
        inyectarComida();
    };
};

function inyectarComida(){
    limpiarHtml();
    let html = "";
    arrayComida.forEach((array) =>{
        const {imagen, nombre, id} = array;
        html += `
        <tr class="table-dark">
            <td><img src="${imagen}" style="width: 10rem;"></td>
            <td>${nombre}</td>
            <td>
                <a id="${id}" class="btn btn-danger eliminar">X</a>
            </td>
        </tr>`;
        carritoCompras.innerHTML = html;
    });
    addStorage();
};

function addStorage(){
    localStorage.setItem('comida', JSON.stringify(arrayComida));
};

document.addEventListener('DOMContentLoaded', () =>{
    arrayComida = JSON.parse(localStorage.getItem('comida')) || [];
    inyectarComida();
});

function limpiarHtml (){
    carritoCompras.innerHTML ="";
};

export function eliminar(e){
    if (e.target.classList.contains("eliminar")){
        const tarjetaEliminar = e.target.getAttribute("id");
        console.log(tarjetaEliminar);
        arrayComida = arrayComida.filter((te) => te.id !== tarjetaEliminar);
        console.log(arrayComida);
        inyectarComida();
    };
};

export function vaciarCarrito(){
    arrayComida = [];
    localStorage.setItem("comida", JSON.stringify(arrayComida));
    limpiarHtml();
};