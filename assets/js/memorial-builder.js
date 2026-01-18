document.getElementById('memorial-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const petName = document.getElementById('petName').value;
  const petType = document.getElementById('petType').value;
  const birthDate = document.getElementById('birthDate').value;
  const passingDate = document.getElementById('passingDate').value;
  const message = document.getElementById('message').value;
  
  const content = `
    <h3>In Memory of ${petName}</h3>
    <p><strong>Type:</strong> ${petType}</p>
    <p><strong>Born:</strong> ${birthDate || 'Unknown'}</p>
    <p><strong>Passed:</strong> ${passingDate || 'Unknown'}</p>
    <p>${message}</p>
  `;
  
  document.getElementById('memorial-content').innerHTML = content;
  document.getElementById('memorial-preview').style.display = 'block';
});