function cambiaClase() {
  this.classList.toggle("activo");
}

document.querySelectorAll(".elemento").forEach(function(e) {
  e.addEventListener("click", cambiaClase);
});
