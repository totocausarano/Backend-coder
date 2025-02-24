const socket = io();
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

console.log('Socket client initialized');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value)
    };

    if (!product.name || !product.description || isNaN(product.price) || !product.code || isNaN(product.stock)) {
        alert("Todos los campos son obligatorios y deben tener valores válidos.");
        return;
    }
    
    console.log('Sending product:', product);
    socket.emit('addProduct', product);
    productForm.reset();
});

function deleteProduct(id) {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
        socket.emit('deleteProduct', id);
    }
}

socket.on('updateProducts', (products) => {
    if (Array.isArray(products)) {
        const html = products.map(product => `
            <div class="product-card" id="product-${product.id}">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Código: ${product.code}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="deleteProduct('${product.id}')" class="delete-btn">Eliminar</button>
            </div>
        `).join('');
        productList.innerHTML = html;
    } else {
        console.error('Products is not an array:', products);
    }
});

const productContainer = document.getElementById("productsContainer");

socket.on("loadProducts", (products) => {
    products.forEach((product) => {
        cargarProducto(product);
    });
});

function cargarProducto(product) {
    const productDiv = document.createElement("p");
    productDiv.textContent = `Nombre: ${product.name} Descripción: ${product.description} Precio: ${product.price} Código: ${product.code} Stock: ${product.stock}`;
    productContainer.appendChild(productDiv);
}
