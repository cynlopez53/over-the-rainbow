document.getElementById("tributeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const petName = e.target.petName.value;
  const dates = e.target.dates.value;
  const details = e.target.details.value;

  const response = await fetch("/generate-tribute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petName, dates, details })
  });

  const data = await response.json();

  document.getElementById("tributeResult").innerHTML = `
    <h3>Your Tribute</h3>
    <p>${data.tribute}</p>
  `;
});
