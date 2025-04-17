document.addEventListener('DOMContentLoaded', () => {
    const carritoProductosContainer = document.getElementById('carritoProductos');
    const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
    const totalCarritoPrecio = document.getElementById('totalCarritoPrecio');
    const finalizarCompraBtn = document.getElementById('finalizarCompra');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para renderizar el carrito
    function renderizarCarrito() {
        carritoProductosContainer.innerHTML = '';
        if (carrito.length === 0) {
            carritoProductosContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            totalCarritoPrecio.textContent = '0';
        } else {
            let total = 0;
            carrito.forEach((producto, index) => {
                const productoDiv = document.createElement('div');
                productoDiv.classList.add('producto-en-carrito');
                productoDiv.innerHTML = `
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h4>${producto.nombre}</h4>
                            <p>$${producto.precio}</p>
                        </div>
                        <div class="col-md-4 text-end">
                            <button class="eliminar-producto" data-index="${index}">Eliminar</button>
                        </div>
                    </div>
                `;
                carritoProductosContainer.appendChild(productoDiv);
                total += producto.precio;
            });
            totalCarritoPrecio.textContent = total;
        }
    }

    // Eliminar productos del carrito
    carritoProductosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('eliminar-producto')) {
            const index = e.target.dataset.index;
            eliminarProducto(index);
        }
    });

    // Eliminar un producto del carrito
    function eliminarProducto(index) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }
    });

    // Finalizar compra
    finalizarCompraBtn.addEventListener('click', () => {
        if (carrito.length > 0) {
            alert('¡Gracias por tu compra!');
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        } else {
            alert('Tu carrito está vacío.');
        }
    });

    // Inicializar el carrito cuando la página cargue
    renderizarCarrito();
});

