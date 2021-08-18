function despliegaBloque(evento) {
  evento.preventDefault();

  var objetivo = this.getAttribute("href");
  var elBloque = document.querySelector(objetivo);
  var alturaFinal = elBloque.querySelector(".bloque-contenido").clientHeight;
  if (elBloque.classList.contains("bloque-desplegado")) {
    elBloque.classList.remove("bloque-desplegado");
    elBloque.style.maxHeight = 0;
  } else {
    elBloque.classList.add("bloque-desplegado");
    elBloque.style.maxHeight = alturaFinal + "px";
  }
  document.querySelector(objetivo).classList.add("activo");
}

document.querySelectorAll(".lanzador").forEach(function(elemento) {
  elemento.addEventListener("click", despliegaBloque);
});
