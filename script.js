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
  function displayMemory(memory) {
  const card = document.createElement("div");
  card.classList.add("memory-card");
  card.style.borderLeft = `5px solid ${memory.color}`;
  
  const memoryDetails = `
    <h3>${memory.topic}</h3>
    <p class="category">${memory.category}</p>
    <div class="memory-details">
      <p class="memory-text">${memory.details}</p>
      <button class="view-more">View More</button>
    </div>
    <small>${memory.date}</small>
  `;
  
  card.innerHTML = memoryDetails;
  memoryList.appendChild(card);
  
  // Handle "View More" click
  const viewMoreButton = card.querySelector('.view-more');
  const memoryText = card.querySelector('.memory-text');
  
  // Limit to 4 lines of text
  const maxLines = 4;
  const lineHeight = 1.5; // Adjust based on your font size/line height
  
  // Get height of the memory text and compare with max line height
  const lines = Math.ceil(memoryText.scrollHeight / lineHeight);
  if (lines > maxLines) {
    memoryText.style.maxHeight = `${maxLines * lineHeight}em`;
    memoryText.style.overflow = "hidden"; // Hide overflow
    viewMoreButton.style.display = "inline-block"; // Show the 'View More' button
  }

  // Toggle "View More" / "View Less"
  viewMoreButton.addEventListener('click', () => {
    if (memoryText.style.maxHeight) {
      memoryText.style.maxHeight = null;
      viewMoreButton.textContent = "View Less";
    } else {
      memoryText.style.maxHeight = `${maxLines * lineHeight}em`;
      viewMoreButton.textContent = "View More";
    }
  });
  }
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
    <div class="memory-details">${memory.details}</div>
    <small>${memory.date}</small>
  `;
  memoryList.appendChild(card);
}

// Load memories on page load
window.addEventListener("DOMContentLoaded", () => {
  const memories = JSON.parse(localStorage.getItem("memories")) || [];
  memories.forEach((memory) => displayMemory(memory));
});
