document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const title = document.getElementById('artTitle').value.trim();
    const description = document.getElementById('artDescription').value.trim();
    const imageInput = document.getElementById('artImage');
    const gallery = document.getElementById('gallery');
  
    if (!title || !description || !imageInput.files[0]) {
      alert("Please fill out all fields and select an image.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const col = document.createElement('div');
      col.className = 'col-md-4 gallery-item';
  
      const card = `
        <div class="card gallery-card">
          <img src="${e.target.result}" class="gallery-img" alt="${title}" />
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
          </div>
        </div>
      `;
  
      col.innerHTML = card;
      gallery.prepend(col);
  
      // Reset the form
      document.getElementById('uploadForm').reset();
    };
  
    reader.readAsDataURL(imageInput.files[0]);
  });
  