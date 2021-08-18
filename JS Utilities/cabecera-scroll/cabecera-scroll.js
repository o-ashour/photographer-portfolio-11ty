function navegacionScroll() {
  var elementoNavegacion = document.querySelector(".cabecera");
  var navegacionAltura = elementoNavegacion.clientHeight;
  var elementoReferencia = document.querySelector(".portada");

  function revisarPosicion() {
    var posicionY = elementoReferencia.getBoundingClientRect().bottom;
    if (posicionY - navegacionAltura < 0) {
      elementoNavegacion.classList.add("scroll");
    } else {
      elementoNavegacion.classList.remove("scroll");
    }
  }

  window.addEventListener("scroll", revisarPosicion);
}
navegacionScroll();
