// Memory Data
let memories = JSON.parse(localStorage.getItem("memories")) || [];
let memoryToDelete = null;
let memoryToEdit = null;

// DOM Elements
const memoryList = document.getElementById("memory-list");
const searchInput = document.getElementById("search-memories");
const deleteModal = document.getElementById("delete-modal");
const editModal = document.getElementById("edit-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const editMemoryForm = document.getElementById("edit-memory-form");

// Search Memories
searchInput.addEventListener("input", function () {
  const query = searchInput.value.toLowerCase();
  displayMemories(query);
});

// Display Memories
function displayMemories(query = "") {
  memoryList.innerHTML = "";
  memories
    .filter(
      (memory) =>
        memory.topic.toLowerCase().includes(query) ||
        memory.category.toLowerCase().includes(query)
    )
    .forEach((memory, index) => {
      const card = document.createElement("div");
      card.classList.add("memory-card");
      card.style.borderLeft = `5px solid ${memory.color}`;
      card.innerHTML = `
        <h3>${memory.topic}</h3>
        <p class="category">${memory.category}</p>
        <div class="memory-details">
          <p class="memory-text">${memory.details}</p>
          <button class="view-more">View More</button>
        </div>
        <small>${memory.date}</small>
        <div>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </div>
      `;
      memoryList.appendChild(card);

      card.querySelector(".delete-btn").addEventListener("click", () => {
        memoryToDelete = index;
        toggleModal(deleteModal);
      });

      card.querySelector(".edit-btn").addEventListener("click", () => {
        memoryToEdit = index;
        populateEditModal(memories[index]);
        toggleModal(editModal);
      });
    });
}

// Toggle Modal
function toggleModal(modal) {
  modal.classList.toggle("show");
}

// Delete Memory
confirmDeleteBtn.addEventListener("click", () => {
  memories.splice(memoryToDelete, 1);
  localStorage.setItem("memories", JSON.stringify(memories));
  toggleModal(deleteModal);
  displayMemories();
});

cancelDeleteBtn.addEventListener("click", () => toggleModal(deleteModal));

// Populate Edit Modal
function populateEditModal(memory) {
  document.getElementById("edit-category").value = memory.category;
  document.getElementById("edit-topic").value = memory.topic;
  document.getElementById("edit-details").value = memory.details;
}

// Save Edited Memory
editMemoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  memories[memoryToEdit] = {
    ...memories[memoryToEdit],
    category: document.getElementById("edit-category").value,
    topic: document.getElementById("edit-topic").value,
    details: document.getElementById("edit-details").value,
  };
  localStorage.setItem("memories", JSON.stringify(memories));
  toggleModal(editModal);
  displayMemories();
});

// Cancel Edit
document.getElementById("cancel-edit").addEventListener("click", () => {
  toggleModal(editModal);
});

// Initial Load
displayMemories();
