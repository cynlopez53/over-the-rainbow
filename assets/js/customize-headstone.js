document.getElementById("headstone-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const headstoneData = {
    name: document.getElementById("pet-name").value,
    birth: document.getElementById("birth-year").value,
    passing: document.getElementById("passing-year").value,
    message: document.getElementById("message").value
  };

  localStorage.setItem("customHeadstone", JSON.stringify(headstoneData));

  document.getElementById("save-status").textContent =
    "Your headstone has been saved and will appear on the Tribute Wall.";
});
