document.addEventListener('DOMContentLoaded', () => {
    const carritoProductosContainer = document.getElementById('carritoProductos');
    const vaciarCarritoBtn = document.getElementById('vaciarCarrito');
    const totalCarritoPrecio = document.getElementById('totalCarritoPrecio');
    const finalizarCompraBtn = document.getElementById('finalizarCompra');
    const totalCarritoSpan = document.getElementById('totalCarrito');

    let carrito = [];

    try {
        carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    } catch {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        Swal.fire('Error', 'No se pudo cargar el carrito', 'error');
    }

    function renderizarCarrito() {
        carritoProductosContainer.innerHTML = '';
        totalCarritoSpan.textContent = carrito.length;

        if (carrito.length === 0) {
            carritoProductosContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            totalCarritoPrecio.textContent = '0';
            return;
        }

        let total = 0;
        carrito.forEach((producto, index) => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-en-carrito');
            productoDiv.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h4>${producto.nombre}</h4>
                        <p>$${producto.precio.toLocaleString()}</p>
                    </div>
                    <div class="col-md-4 text-end">
                        <button class="eliminar-producto btn btn-danger btn-sm" data-index="${index}">Eliminar</button>
                    </div>
                </div>
            `;
            carritoProductosContainer.appendChild(productoDiv);
            total += producto.precio;
        });

        totalCarritoPrecio.textContent = total.toLocaleString();
    }

    carritoProductosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('eliminar-producto')) {
            const index = e.target.dataset.index;
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }
    });

    vaciarCarritoBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            Swal.fire('El carrito ya está vacío', '', 'info');
            return;
        }

        Swal.fire({
            title: '¿Vaciar el carrito?',
            text: "Esta acción eliminará todos los productos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, vaciar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderizarCarrito();
                Swal.fire('Carrito vacío', '', 'success');
            }
        });
    });

    finalizarCompraBtn.addEventListener('click', () => {
        if (carrito.length === 0) {
            Swal.fire('Tu carrito está vacío', '', 'info');
            return;
        }

        Swal.fire({
            title: 'Finalizar compra',
            html:
                '<input id="swal-input-nombre" class="swal2-input" placeholder="Nombre">' +
                '<input id="swal-input-apellido" class="swal2-input" placeholder="Apellido">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar compra',
            preConfirm: () => {
                const nombre = document.getElementById('swal-input-nombre').value.trim();
                const apellido = document.getElementById('swal-input-apellido').value.trim();
                if (!nombre || !apellido) {
                    Swal.showValidationMessage('Por favor, ingresá tu nombre y apellido');
                    return false;
                }
                return { nombre, apellido };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const pedido = {
                    cliente: `${result.value.nombre} ${result.value.apellido}`,
                    productos: [...carrito],
                    total: carrito.reduce((acc, p) => acc + p.precio, 0),
                    fecha: new Date().toLocaleString('es-AR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })
                };

                // Guardar pedido
                const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
                pedidos.push(pedido);
                localStorage.setItem('pedidos', JSON.stringify(pedidos));

                // Limpiar carrito
                carrito = [];
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderizarCarrito();
                renderizarPedidosAnteriores();

                // Mostrar resumen
                const resumen = pedido.productos.map(p => `• ${p.nombre} - $${p.precio.toLocaleString()}`).join('<br>');
                Swal.fire({
                    title: '¡Gracias por tu compra!',
                    html: `
                        <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                        <p><strong>Total:</strong> $${pedido.total.toLocaleString()}</p>
                        <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                        <hr>
                        <p><strong>Productos:</strong></p>
                        <p>${resumen}</p>
                    `,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        });
    });

    function renderizarPedidosAnteriores() {
        const listaPedidos = document.getElementById('listaPedidos');
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = '<p>No hay pedidos anteriores.</p>';
            return;
        }

        listaPedidos.innerHTML = pedidos.map(pedido => {
            const productosHTML = pedido.productos
                .map(p => `• ${p.nombre} - $${p.precio.toLocaleString()}`)
                .join('<br>');

            return `
                <div class="pedido-item">
                    <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                    <p><strong>Fecha:</strong> ${pedido.fecha}</p>
                    <p><strong>Total:</strong> $${pedido.total.toLocaleString()}</p>
                    <p><strong>Productos:</strong><br>${productosHTML}</p>
                </div>
            `;
        }).join('');
    }

    renderizarCarrito();
    renderizarPedidosAnteriores();
});

