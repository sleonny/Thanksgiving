// Interacción de la foto familiar y galería de fotos del día.
document.querySelectorAll('.hotspots a').forEach((link) => {
  link.addEventListener('focus', () => link.querySelector('polygon')?.classList.add('active'));
  link.addEventListener('blur', () => link.querySelector('polygon')?.classList.remove('active'));
});

// Configuración de Cloudinary. Requiere nombre de nube y preset de carga sin firma.
const CLOUDINARY_CLOUD_NAME = 'zpcfuuvx';
const CLOUDINARY_UPLOAD_PRESET = 'thanksgiving_family';

document.querySelectorAll('.upload-button').forEach((button) => {
  const day = button.dataset.day;
  const gallery = document.getElementById('gallery-day-' + day);
  const status = button.parentElement.querySelector('.upload-status');
  const tag = 'thanksgiving-family-day-' + day;
  const cloudReady = !CLOUDINARY_CLOUD_NAME.startsWith('CONFIGURA') && !CLOUDINARY_UPLOAD_PRESET.startsWith('CONFIGURA');

  async function loadGallery() {
    if (!cloudReady) {
      status.textContent = 'La galería estará disponible cuando configuremos el servicio para guardar fotos.';
      return;
    }
    try {
      const response = await fetch('https://res.cloudinary.com/' + CLOUDINARY_CLOUD_NAME + '/image/list/' + tag + '.json');
      if (!response.ok) throw new Error('Galería no disponible');
      const data = await response.json();
      gallery.innerHTML = '';
      (data.resources || []).reverse().forEach((photo) => {
        const img = document.createElement('img');
        img.src = 'https://res.cloudinary.com/' + CLOUDINARY_CLOUD_NAME + '/image/upload/f_auto,q_auto,w_600/' + photo.public_id + '.' + photo.format;
        img.alt = 'Foto compartida del día ' + day;
        img.loading = 'lazy';
        gallery.appendChild(img);
      });
      status.textContent = (data.resources || []).length ? '¡Fotos compartidas por la familia!' : 'Todavía no hay fotos. ¡Sé el primero en compartir una!';
    } catch (e) {
      status.textContent = 'La galería se actualizará cuando habilitemos el servicio de fotos.';
    }
  }

  button.addEventListener('click', async () => {
    if (!cloudReady) {
      status.textContent = '¡Estamos preparando las cargas de fotos! Falta configurar el servicio de almacenamiento.';
      return;
    }
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.multiple = true;
    input.addEventListener('change', async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      status.textContent = 'Subiendo fotos…';
      for (const file of files) {
        const form = new FormData();
        form.append('file', file); form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); form.append('tags', tag);
        try {
          const response = await fetch('https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD_NAME + '/image/upload', {method:'POST',body:form});
          if (!response.ok) throw new Error('Carga fallida');
        } catch (err) {
          status.textContent = 'No se pudo subir una foto. Inténtalo de nuevo.';
          return;
        }
      }
      status.textContent = '¡Listo! Las fotos se han subido.';
      loadGallery();
    });
    input.click();
  });
  loadGallery();
});