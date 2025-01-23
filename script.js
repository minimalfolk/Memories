// Initialize memory list from localStorage (if any)
let memories = JSON.parse(localStorage.getItem("memories")) || [];

// DOM elements
const memoryForm = document.getElementById("memory-form");
const memoryList = document.getElementById("memory-list");

// Handle form submission
memoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const category = document.getElementById("memory-category").value;
  const topic = document.getElementById("memory-topic").value;
  const details = document.getElementById("memory-details").value;

  // Create new memory object
  const newMemory = {
    category,
    topic,
    details,
    date: new Date().toLocaleString(),
    color: getCategoryColor(category),
  };

  // Add new memory to the list
  memories.push(newMemory);

  // Save the updated memories to localStorage
  localStorage.setItem("memories", JSON.stringify(memories));

  // Clear the form
  memoryForm.reset();

  // Refresh memory list
  displayMemories();
});

// Display memories function
function displayMemories() {
  memoryList.innerHTML = ""; // Clear the memory list

  memories.forEach((memory) => {
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

    // Handle "View More" button click
    const viewMoreButton = card.querySelector('.view-more');
    const memoryText = card.querySelector('.memory-text');

    // Limit to 4 lines of text (with scroll option)
    const maxLines = 4;
    const lineHeight = parseInt(window.getComputedStyle(memoryText).lineHeight);
    const maxHeight = maxLines * lineHeight;
    
    // Set text to maxHeight, allowing scroll if it's too long
    if (memoryText.scrollHeight > maxHeight) {
      memoryText.style.maxHeight = `${maxHeight}px`;
      memoryText.style.overflow = "hidden"; // Hide extra text
      viewMoreButton.style.display = "inline-block"; // Show "View More" button
    }

    // Toggle "View More" / "View Less"
    viewMoreButton.addEventListener('click', () => {
      memoryText.classList.toggle('expanded');
      viewMoreButton.textContent = memoryText.classList.contains('expanded') ? 'View Less' : 'View More';
    });
  });
}

// Get category color for each memory
function getCategoryColor(category) {
  switch (category) {
    case "Personal":
      return "blue";
    case "Family":
      return "skyblue";
    case "Achievement":
      return "yellow";
    case "Relationship":
      return "lightcoral";
    default:
      return "gray";
  }
}

// Display stored memories on page load
document.addEventListener("DOMContentLoaded", function () {
  displayMemories();
});
