// Initialize memory list from localStorage
let memories = JSON.parse(localStorage.getItem("memories")) || [];
let bestMemories = JSON.parse(localStorage.getItem("bestMemories")) || [];

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
          <button class="view-more">View More</button>
        </div>
        <small>${memory.date}</small>
      `;
      card.innerHTML = memoryDetails;

      // Add "Edit" button
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit-button");
      editButton.addEventListener("click", () => openEditModal(memory));
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

// Open edit modal
function openEditModal(memory) {
  const editModal = document.createElement("div");
  editModal.classList.add("modal");
  editModal.innerHTML = `
    <div class="modal-content">
      <h3>Edit Memory</h3>
      <label for="edit-topic">Topic:</label>
      <input type="text" id="edit-topic" value="${memory.topic}" />
      <label for="edit-details">Details:</label>
      <textarea id="edit-details">${memory.details}</textarea>
      <button id="save-edit" class="save-button">Save</button>
      <button id="cancel-edit" class="cancel-button">Cancel</button>
    </div>
  `;
  document.body.appendChild(editModal);

  // Save changes
  document.getElementById("save-edit").addEventListener("click", () => {
    memory.topic = document.getElementById("edit-topic").value;
    memory.details = document.getElementById("edit-details").value;
    saveMemories();
    displayAllMemories();
    editModal.remove();
  });

  // Cancel editing
  document.getElementById("cancel-edit").addEventListener("click", () => {
    editModal.remove();
  });
}

// Confirm delete memory
function confirmDelete(memory) {
  const confirmModal = document.createElement("div");
  confirmModal.classList.add("modal");
  confirmModal.innerHTML = `
    <div class="modal-content">
      <p>Are you sure you want to delete this memory?</p>
      <button id="confirm-delete" class="delete-button">Yes</button>
      <button id="cancel-delete" class="cancel-button">No</button>
    </div>
  `;
  document.body.appendChild(confirmModal);

  // Confirm deletion
  document.getElementById("confirm-delete").addEventListener("click", () => {
    memories = memories.filter((m) => m !== memory);
    saveMemories();
    displayAllMemories();
    confirmModal.remove();
  });

  // Cancel deletion
  document.getElementById("cancel-delete").addEventListener("click", () => {
    confirmModal.remove();
  });
}

// Toggle favorite
function toggleFavorite(memory) {
  memory.favorite = !memory.favorite;
  if (memory.favorite) {
    bestMemories.push(memory);
  } else {
    bestMemories = bestMemories.filter((m) => m !== memory);
  }
  saveMemories();
  saveBestMemories();
  displayAllMemories();
}

// Save memories to localStorage
function saveMemories() {
  localStorage.setItem("memories", JSON.stringify(memories));
}

// Save best memories to localStorage
function saveBestMemories() {
  localStorage.setItem("bestMemories", JSON.stringify(bestMemories));
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
