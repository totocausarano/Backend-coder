const socket = io();
socket.emit("mensaje", "hola me estoy comunicando");
socket.on("evento", (data) => {
  console.log(data);
});
const sentProductButton = document.getElementById("sendProduct");
sentProductButton.addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const newProduct = {
    title,
    description,
    price,
    code,
    stock,
  };
  socket.emit("newProduct", newProduct);
});
const productContainer = document.getElementById("productsContainer");
socket.on("loadProducts", (products) => {
  products.forEach((product) => {
    cargarProducto(product);
  });
});
function cargarProducto(product) {
  const productDiv = document.createElement("p");
  productDiv.textContent = `Title: ${product.title} Description: ${product.description} Price: ${product.price} Code: ${product.code} Stock: ${product.stock}`;
  productContainer.appendChild(productDiv);
}
