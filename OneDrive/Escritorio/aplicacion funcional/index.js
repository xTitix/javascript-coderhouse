document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.querySelector('.main-productos');
    const totalCarritoSpan = document.getElementById('totalCarrito');
    const inputBuscar = document.getElementById('buscarInput');
    const btnBuscar = document.getElementById('btnbuscar');

    let carrito = [];
    let productosCargados = [];

    try {
        carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    } catch {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function actualizarCarrito() {
        totalCarritoSpan.textContent = carrito.length;
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function renderizarProductos(productos) {
        contenedorProductos.innerHTML = '';
        productos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('producto');
            div.innerHTML = `
                <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}">
                <h2>${producto.nombre}</h2>
                <span>$${producto.precio.toLocaleString()}</span>
                <button class="agregarCarrito" data-id="${producto.id}">Agregar al carrito</button>
            `;
            contenedorProductos.appendChild(div);
        });
        agregarListeners(productos);
    }

    function agregarListeners(productos) {
        document.querySelectorAll('.agregarCarrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const producto = productos.find(p => p.id === id);
                if (producto) {
                    carrito.push(producto);
                    actualizarCarrito();
                    Swal.fire({
                        icon: 'success',
                        title: 'Agregado',
                        text: `${producto.nombre} fue agregado al carrito`,
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });
    }

    function filtrarProductos() {
        const texto = inputBuscar.value.toLowerCase().trim();
        const filtrados = productosCargados.filter(p =>
            p.nombre.toLowerCase().includes(texto)
        );
        renderizarProductos(filtrados);
    }

    fetch('./productos.json')
        .then(response => response.json())
        .then(productos => {
            productosCargados = productos;
            renderizarProductos(productosCargados);
        })
        .catch(error => {
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        });

    inputBuscar.addEventListener('input', filtrarProductos);
    btnBuscar.addEventListener('click', filtrarProductos);

    actualizarCarrito();
});
