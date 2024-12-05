// Modo Oscuro
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}

// Registro e Inicio de Sesión
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (email && password) {
    window.location.href = "editor.html";
  } else {
    alert('Por favor, complete todos los campos');
  }
}

// Agregar Slide
function addSlide() {
  const slideContainer = document.getElementById('slides-container');
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.innerHTML = `<div class="slide-content"></div>`;
  slideContainer.appendChild(slide);
}

// Agregar Cuadro de Texto
function addText() {
  const selectedSlide = getSelectedSlide();
  if (!selectedSlide) {
    alert("Selecciona un slide para agregar un cuadro de texto.");
    return;
  }

  const text = prompt("Escribe el texto:");
  if (text) {
    const slideContent = selectedSlide.querySelector('.slide-content');
    const textBox = document.createElement('div');
    textBox.className = 'text-box draggable';
    textBox.textContent = text;
    textBox.style.fontFamily = document.getElementById('fontStyle').value;
    textBox.style.fontSize = document.getElementById('fontSize').value;
    
    // Hacer el cuadro de texto movible
    makeDraggable(textBox, selectedSlide);

    // Seleccionar cuadro de texto al hacer clic
    textBox.addEventListener('click', () => selectElement(textBox));

    // Desmarcar al hacer doble clic
    textBox.addEventListener('dblclick', () => {
      clearSelection();
    });

    slideContent.appendChild(textBox);
  }
}

// Subir Imagen
function uploadImage(event) {
  const selectedSlide = getSelectedSlide();
  if (!selectedSlide) {
    alert("Selecciona un slide para agregar una imagen.");
    return;
  }

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const slideContent = selectedSlide.querySelector('.slide-content');
      const imgElement = document.createElement('img');
      imgElement.src = e.target.result;
      imgElement.className = 'resizable-img draggable';
      
      // Crear el manejador de redimensionado
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';
      imgElement.appendChild(resizeHandle);

      // Hacer la imagen movible
      makeDraggable(imgElement, selectedSlide);

      // Permitir redimensionar la imagen
      makeResizable(imgElement, resizeHandle);

      // Seleccionar imagen al hacer clic
      imgElement.addEventListener('click', () => selectElement(imgElement));

      // Desmarcar al hacer doble clic
      imgElement.addEventListener('dblclick', () => {
        clearSelection();
      });

      slideContent.appendChild(imgElement);
    };
    reader.readAsDataURL(file);
  }
}

// Hacer el elemento movible
function makeDraggable(element, slide) {
  element.addEventListener('mousedown', (e) => {
    let offsetX = e.clientX - element.getBoundingClientRect().left;
    let offsetY = e.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      let slideRect = slide.getBoundingClientRect();
      let newX = pageX - offsetX - slideRect.left;
      let newY = pageY - offsetY - slideRect.top;

      // Restringir movimiento dentro del slide
      newX = Math.max(0, Math.min(newX, slideRect.width - element.offsetWidth));
      newY = Math.max(0, Math.min(newY, slideRect.height - element.offsetHeight));

      element.style.left = newX + 'px';
      element.style.top = newY + 'px';
    }

    moveAt(e.pageX, e.pageY);

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });

  element.style.position = 'absolute';
}

// Hacer la imagen redimensionable
function makeResizable(imgElement, resizeHandle) {
  resizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    
    let startX = e.clientX;
    let startY = e.clientY;
    let startWidth = imgElement.offsetWidth;
    let startHeight = imgElement.offsetHeight;

    function onMouseMove(event) {
      let newWidth = startWidth + event.clientX - startX;
      let newHeight = startHeight + event.clientY - startY;
      
      // Restringir el tamaño mínimo de la imagen
      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);
      
      imgElement.style.width = newWidth + 'px';
      imgElement.style.height = newHeight + 'px';
    }

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
  });
}

// Seleccionar un elemento (cuadro de texto o imagen)
function selectElement(element) {
  clearSelection(); // Limpiar cualquier selección anterior
  element.classList.add('selected');
}

// Limpiar selección
function clearSelection() {
  const selectedElements = document.querySelectorAll('.selected');
  selectedElements.forEach(element => {
    element.classList.remove('selected');
  });
}

// Eliminar elementos con las teclas Delete o Backspace
document.addEventListener('keydown', (event) => {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    const selectedElement = document.querySelector('.selected');
    if (selectedElement) {
      selectedElement.remove();
    }
  }
});

// Obtener el slide actualmente seleccionado
function getSelectedSlide() {
  const slides = document.querySelectorAll('.slide');
  return slides[slides.length - 1] || null;
}



// Limpiar selección al hacer doble clic
function clearSelection() {
    const selectedElements = document.querySelectorAll('.draggable.selected');
    selectedElements.forEach(element => {
      element.classList.remove('selected');
    });
  }
  
  function getSelectedSlide() {
    const slides = document.querySelectorAll('.slide');
    return slides[slides.length - 1] || null;
  }