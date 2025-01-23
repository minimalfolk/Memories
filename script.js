const form = document.getElementById("memory-form");
const memoryList = document.getElementById("memory-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const category = form["memory-category"];
  const topic = form["memory-topic"].value;
  const details = form["memory-details"].value;
  const date = new Date().toLocaleString();

  // Create a memory object
  const memory = {
    category: category.value,
    topic,
    details,
    date,
    color: category.options[category.selectedIndex].dataset.color,
  };

  // Save to local storage
  saveMemory(memory);

  // Reset form
  form.reset();

  // Display the memory
  displayMemory(memory);
});

// Save memory to local storage
function saveMemory(memory) {
  let memories = JSON.parse(localStorage.getItem("memories")) || [];
  memories.push(memory);
  localStorage.setItem("memories", JSON.stringify(memories));
}

// Display a memory card
function displayMemory(memory) {
  const card = document.createElement("div");
  card.classList.add("memory-card");
  card.style.borderLeft = `5px solid ${memory.color}`;
  card.innerHTML = `
    <h3>${memory.topic}</h3>
    <p class="category">${memory.category}</p>
    <p>${memory.details}</p>
    <small>${memory.date}</small>
  `;
  memoryList.appendChild(card);
}

// Load memories on page load
window.addEventListener("DOMContentLoaded", () => {
  const memories = JSON.parse(localStorage.getItem("memories")) || [];
  memories.forEach((memory) => displayMemory(memory));
});
