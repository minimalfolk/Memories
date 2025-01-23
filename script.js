// Initialize memory list array (you can use localStorage to persist the data)
let memories = JSON.parse(localStorage.getItem("memories")) || [];

// DOM elements
const memoryForm = document.getElementById("memory-form");
const memoryList = document.getElementById("memories");

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

  // Save memory to the list
  memories.push(newMemory);
  
  // Save memories to localStorage
  localStorage.setItem("memories", JSON.stringify(memories));
  
  // Clear the form
  memoryForm.reset();
  
  // Display updated list
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
      return "darkred";
    default:
      return "gray";
  }
}

// Initialize and display the memories on page load
document.addEventListener("DOMContentLoaded", function () {
  displayMemories();
});
