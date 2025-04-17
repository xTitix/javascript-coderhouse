document.addEventListener('DOMContentLoaded', () => {
    const botonesAgregar = document.querySelectorAll('.agregarCarrito');
    const totalCarrito = document.getElementById('totalCarrito');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const inputBuscar = document.getElementById('buscarInput');
    const productosb = document.querySelectorAll('.producto');

function filtrarProductos() {
    const textoBusqueda = inputBuscar.value.toLowerCase();  // Obtener el texto de búsqueda en minúsculas

    productosb.forEach(producto => {
        const nombreProducto = producto.querySelector('h2').textContent.toLowerCase();  // Obtener el nombre del producto
        if (nombreProducto.includes(textoBusqueda)) {
            producto.style.display = 'block';  // Mostrar el producto
        } else {
            producto.style.display = 'none';   // Ocultar el producto
        }
    });
}

inputBuscar.addEventListener('input', filtrarProductos);


    const productos = [
        { nombre: 'Brownie con frutillas', precio: 15000 },
        { nombre: 'Cheesecake de Frutos Rojos', precio: 18000 },
        { nombre: 'Pastafrola', precio: 10000 },
        { nombre: 'Red Velvet', precio: 19000 },
        { nombre: 'Tarta de Ricota', precio: 12000 },
        { nombre: 'Tarta Tofi', precio: 13000 },
        { nombre: 'Croissant', precio: 2000 },
        { nombre: 'Tarta de Frutillas', precio: 15000 },
        { nombre: 'Macarons', precio: 13000 },
        { nombre: 'Lemon Pie', precio: 17000 },
        { nombre: 'Tiramisu', precio: 14000 },
        { nombre: 'Torta Rogel', precio: 16000 }
    ];

    // Función para actualizar el carrito
    function actualizarCarrito() {
        totalCarrito.textContent = carrito.length;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Agregar productos al carrito
    botonesAgregar.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            agregarAlCarrito(index);
        });
    });

    // Agregar un producto al carrito
    function agregarAlCarrito(index) {
        const producto = productos[index];
        carrito.push(producto);
        actualizarCarrito();
        alert(`${producto.nombre} ha sido agregado al carrito`);
    }

    // Inicializar el carrito cuando la página cargue
    actualizarCarrito();
});
