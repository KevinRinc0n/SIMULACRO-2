import { selector, contenedor, modal, limpiarCarrito  } from "./selectores.js";
import { seleccionarCategoria, getCategoria, agregarCarrito, eliminar, vaciarCarrito  } from "./funciones.js";

class App {
    constructor(){
        this.initApp();
    };
    initApp(){
        seleccionarCategoria();
        selector.addEventListener("input",getCategoria);
        contenedor.addEventListener("click",agregarCarrito);
        modal.addEventListener("click",eliminar);
        limpiarCarrito.addEventListener("click",vaciarCarrito);
    };
};

export default App;