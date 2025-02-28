
const productos = [
  {
    id: "0001",
    nombre: "Malta Pilsen 1kg",
    precio: "1500",
  },
  {
    id: "0002",
    nombre: "Lúpulo Cacade 100gr",
    precio: "4400",
  },
  {
    id: "0003",
    nombre: "Levadura US-05",
    precio: "4100",
  },
  {
    id: "0004",
    nombre: "Levadura S-33 11,5gr",
    precio: "4900",
  },
  {
    id: "0005",
    nombre: "Botella Pet 1ltr",
    precio: "400",
  },
];

// Tarjetas
const contenedorTarjetas = document.getElementById("tarjetas");
productos.forEach((producto) => {
  let contenedor = document.createElement("div");
  contenedor.className = "tarjeta";

  contenedor.innerHTML = `<h3> ID: ${producto.id}</h3>
                            <p> Producto: ${producto.nombre}
                            <p> Precio: $${producto.precio}`;

  let boton = document.createElement("button");
  boton.innerHTML = "Agregar";
  boton.id = producto.id;
  boton.value = producto.nombre;
  boton.className = "botonAgregar";
  boton.addEventListener("click", () => agregarAlCarrito(producto));
  contenedor.appendChild(boton);

  contenedorTarjetas.appendChild(contenedor);
});

//Agregar al carrito
function agregarAlCarrito(producto) {
  let carritoEnElLocalStorage = localStorage.getItem("carrito");

  if (carritoEnElLocalStorage) {
    carrito = JSON.parse(carritoEnElLocalStorage);
  } else {
    carrito = [];
  }

  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`Producto agregado al carrito: ${producto.nombre}`);
}

// Actualizar Total
let botonObtenerTotal = document.createElement("button");
botonObtenerTotal.innerHTML = "Actualizar Total";
botonObtenerTotal.className = "botonActualizarTotal";
botonObtenerTotal.addEventListener("click", () => calcularCuenta());
document.body.appendChild(botonObtenerTotal);

function calcularCuenta() {
  let carritoEnElLocalStorage = localStorage.getItem("carrito");
  if (carritoEnElLocalStorage) {
    carrito = JSON.parse(carritoEnElLocalStorage);
  } else {
    carrito = [];
  }

  let cuentaAnterior = document.getElementById("totalCuenta");
  if (cuentaAnterior) {
    cuentaAnterior.remove();
  }

  let totalCuenta = 0;

  carrito.forEach((producto) => {
    totalCuenta += parseInt(producto.precio);
  });

  let contenedorTotalCuenta = document.createElement("div");
  contenedorTotalCuenta.id = "totalCuenta";

  contenedorTotalCuenta.innerHTML = `<p>$${totalCuenta}</p>`;
  document.body.appendChild(contenedorTotalCuenta);
}


let contenedorMostrarCarrito = document.createElement("div");
contenedorMostrarCarrito.id = "contenedorMostrarCarrito";

let botonMostrarCarrito = document.createElement("button");
botonMostrarCarrito.innerHTML = "Mostrar Carrito";
botonMostrarCarrito.addEventListener("click", () => mostrarCarrito());

contenedorMostrarCarrito.appendChild(botonMostrarCarrito);

document.body.appendChild(contenedorMostrarCarrito);


//Mostrar carrito
function mostrarCarrito() {
  // Me traigo el carrito desde el localStorage
  let carritoEnElLocalStorage = localStorage.getItem("carrito");
  if (carritoEnElLocalStorage) {
    carrito = JSON.parse(carritoEnElLocalStorage);
  } else {
    carrito = [];
  }

  let elementosDelCarrito = document.getElementById("elementosDelCarrito");
  if (elementosDelCarrito) {
    elementosDelCarrito.remove();
  }

  elementosDelCarrito = document.createElement("div");
  elementosDelCarrito.id = "elementosDelCarrito";
  elementosDelCarrito.className = "claseElementosDelCarrito";

   carrito.forEach((producto) => {
    let productoEnElCarrito = document.createElement("div");
    productoEnElCarrito.innerHTML = `Producto: ${producto.nombre}`;
    elementosDelCarrito.appendChild(productoEnElCarrito);
  });

  contenedorMostrarCarrito.appendChild(elementosDelCarrito);
}

//Vaciar carrito
let contenedorVaciarCarrito = document.createElement("div");

let botonVaciarCarrito = document.createElement("button");
botonVaciarCarrito.innerHTML = "Vaciar Carrito";
botonVaciarCarrito.addEventListener("click", () => (carrito = vaciarCarrito()));

contenedorVaciarCarrito.appendChild(botonVaciarCarrito);

document.body.appendChild(contenedorVaciarCarrito);

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  let elementosDelCarrito = document.getElementById("elementosDelCarrito");
  if (elementosDelCarrito) {
    elementosDelCarrito.remove();
  }
}
