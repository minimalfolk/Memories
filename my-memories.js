// Initialize memory list from localStorage
let memories = JSON.parse(localStorage.getItem("memories")) || [];

// DOM Elements
const memoryList = document.getElementById("memory-list");
const searchMemories = document.getElementById("search-memories");

// Display all memories
function displayAllMemories(filteredMemories = memories) {
  memoryList.innerHTML = ""; // Clear memory list

  if (filteredMemories.length === 0) {
    memoryList.innerHTML = "<p>No memories found.</p>";
  } else {
    filteredMemories.forEach((memory) => {
      const card = document.createElement("div");
      card.classList.add("memory-card");
      card.style.borderLeft = `5px solid ${memory.color}`;
      
      const memoryDetails = `
        <h3>${memory.topic}</h3>
        <p class="category">${memory.category}</p>
        <div class="memory-details">
          <p class="memory-text">${memory.details}</p>
        </div>
        <small>${memory.date}</small>
      `;
      card.innerHTML = memoryDetails;

      // Add "Edit" button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit-button");
      editButton.addEventListener("click", () => editMemory(memory));
      card.appendChild(editButton);

      // Add "Delete" button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", () => confirmDelete(memory));
      card.appendChild(deleteButton);

      // Add "Favorite" button
      const favoriteButton = document.createElement("button");
      favoriteButton.textContent = memory.favorite ? "★ Unmark Favorite" : "☆ Mark Favorite";
      favoriteButton.classList.add("favorite-button");
      favoriteButton.addEventListener("click", () => toggleFavorite(memory));
      card.appendChild(favoriteButton);

      memoryList.appendChild(card);
    });
  }
}

// Edit memory
function editMemory(memory) {
  const newTopic = prompt("Edit Topic:", memory.topic);
  const newDetails = prompt("Edit Details:", memory.details);

  if (newTopic) memory.topic = newTopic;
  if (newDetails) memory.details = newDetails;

  saveMemories();
  displayAllMemories();
}

// Confirm delete memory
function confirmDelete(memory) {
  if (confirm("Are you sure you want to delete this memory?")) {
    memories = memories.filter((m) => m !== memory);
    saveMemories();
    displayAllMemories();
  }
}

// Toggle favorite
function toggleFavorite(memory) {
  memory.favorite = !memory.favorite;
  saveMemories();
  displayAllMemories();
}

// Save memories to localStorage
function saveMemories() {
  localStorage.setItem("memories", JSON.stringify(memories));
}

// Search memories by topic or category
searchMemories.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filteredMemories = memories.filter(
    (memory) =>
      memory.topic.toLowerCase().includes(query) ||
      memory.category.toLowerCase().includes(query)
  );
  displayAllMemories(filteredMemories);
});

// Display all memories on page load
document.addEventListener("DOMContentLoaded", () => {
  displayAllMemories();
});
