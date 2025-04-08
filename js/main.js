async function cargarProductos() {
  try {
    const response = await fetch("./assets/productos.json");
    if (response.status != 200) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const productosJSON = await response.json();
    return productosJSON.productos;
  } catch (error) {
    console.error("No se pudo cargar el archivo debido al error:", error);
  }
}

// Cargar los productos
const productos = await cargarProductos();

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
  boton.addEventListener("click", () => {
    agregarAlCarrito(producto);
    Swal.fire({
      title: "¡Genial!",
      text: `¡Has agregado ${producto.nombre} al carrito!`,
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  });
  contenedor.appendChild(boton);

  contenedorTarjetas.appendChild(contenedor);
});

let carrito;

// Obtener carrito
function obtenerCarrito() {
  const carritoEnElLocalStorage = localStorage.getItem("carrito");
  if (carritoEnElLocalStorage) {
    carrito = JSON.parse(carritoEnElLocalStorage);
  } else {
    carrito = [];
  }

  return carrito;
}

// Obtener el índice de un producto almacenado en el carrito, si es que existe
function obtenerIndiceDeProducto(carrito, idProducto) {
  let indice = -1;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === idProducto) {
      indice = i;
      break;
    }
  }
  return indice;
}

//Agregar al carrito añadiendo cantidad en caso de producto presente más de una vez
function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();

  const indice = obtenerIndiceDeProducto(carrito, producto.id);

  if (indice !== -1) {
    if (!carrito[indice].cantidad) {
      carrito[indice].cantidad = 1;
    }
    carrito[indice].cantidad = carrito[indice].cantidad + 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Actualizar Total
let botonObtenerTotal = document.createElement("button");
botonObtenerTotal.innerHTML = "Actualizar Total";
botonObtenerTotal.className = "botonActualizarTotal";
botonObtenerTotal.addEventListener("click", () => calcularCuenta());
document.body.appendChild(botonObtenerTotal);

function calcularCuenta() {
  const carrito = obtenerCarrito();

  let cuentaAnterior = document.getElementById("totalCuenta");
  if (cuentaAnterior) {
    cuentaAnterior.remove();
  }

  let totalCuenta = 0;

  carrito.forEach((producto) => {
    totalCuenta += producto.precio * producto.cantidad;
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
  const carrito = obtenerCarrito();

  let elementosDelCarrito = document.getElementById("elementosDelCarrito");
  if (elementosDelCarrito) {
    elementosDelCarrito.remove();
  }

  elementosDelCarrito = document.createElement("div");
  elementosDelCarrito.id = "elementosDelCarrito";
  elementosDelCarrito.className = "claseElementosDelCarrito";

  let tabla = generarTablaCarrito(carrito);
  elementosDelCarrito.appendChild(tabla);

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

// Función para reducir la cantidad de uno de los productos
function reducirCantidad(producto) {
  let carrito = obtenerCarrito();

  const indice = obtenerIndiceDeProducto(carrito, producto.id);

  if (indice !== -1) {
    carrito[indice].cantidad = carrito[indice].cantidad - 1;

    if (carrito[indice].cantidad <= 0) {
      carrito.splice(indice, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
}

// Función para generar la tabla con los productos en el carrito
function generarTablaCarrito(carrito) {
  let tabla = document.createElement("table");
  tabla.innerHTML = `
    <tr>
      <th>Producto</th>
      <th>Precio</th>
      <th>Cantidad</th>
      <th>Total</th>
      <th>Acciones</th>
    </tr>
  `;

  carrito.forEach((producto) => {
    let fila = document.createElement("tr");

    let celdaNombre = document.createElement("td");
    celdaNombre.textContent = producto.nombre;

    let celdaPrecio = document.createElement("td");
    celdaPrecio.textContent = producto.precio;

    let celdaCantidad = document.createElement("td");
    celdaCantidad.textContent = producto.cantidad;

    let celdaTotal = document.createElement("td");
    celdaTotal.textContent = producto.precio * producto.cantidad;

    let celdaAcciones = document.createElement("td");

    // Botón para reducir cantidad de un producto
    let botonReducir = document.createElement("button");
    botonReducir.textContent = "-";
    botonReducir.onclick = () => {
      reducirCantidad(producto);
      mostrarCarrito();
    };

    // Botón para aumentar cantidad de un producto
    let botonAumentar = document.createElement("button");
    botonAumentar.textContent = "+";
    botonAumentar.onclick = () => {
      agregarAlCarrito({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
      });
      mostrarCarrito();
    };

    // Botón para eliminar producto
    function eliminarProducto(id) {
      let carrito = obtenerCarrito();
      let nuevoCarrito = [];
    
      for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id !== id) {
          nuevoCarrito.push(carrito[i]);
        }
      }
    
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    }

    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.onclick = () => {
      eliminarProducto(producto.id);
      mostrarCarrito();
    };

    celdaAcciones.appendChild(botonReducir);
    celdaAcciones.appendChild(botonAumentar);
    celdaAcciones.appendChild(document.createTextNode(" "));
    celdaAcciones.appendChild(botonEliminar);

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaTotal);
    fila.appendChild(celdaAcciones);

    tabla.appendChild(fila);
  });

  return tabla;
}
