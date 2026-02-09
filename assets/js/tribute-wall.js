// Tribute wall functionality - load and display tributes
document.addEventListener('DOMContentLoaded', function() {
    const tributeWall = document.getElementById('tributeWall');
    
    // Example tributes - in real app, these would come from a database
    const exampleTributes = [
        {
            name: "Max",
            type: "Dog",
            message: "The best companion anyone could ask for",
            date: "2024-01-15"
        },
        {
            name: "Whiskers",
            type: "Cat", 
            message: "Always curious, forever loved",
            date: "2023-11-20"
        }
    ];
    
    if (tributeWall) {
        exampleTributes.forEach(tribute => {
            const tributeCard = document.createElement('div');
            tributeCard.className = 'tribute-card';
            tributeCard.innerHTML = `
                <h3>${tribute.name}</h3>
                <p><strong>Beloved ${tribute.type}</strong></p>
                <p>"${tribute.message}"</p>
                <small>Remembered since ${tribute.date}</small>
            `;
            tributeWall.appendChild(tributeCard);
        });
    }
});
