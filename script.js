// Initialize memory list from localStorage (if any)
let memories = JSON.parse(localStorage.getItem("memories")) || [];

// DOM elements
const memoryForm = document.getElementById("memory-form");
const memoryListContainer = document.getElementById("memory-list-container");
const bestMemoryList = document.getElementById("best-memory-list");
const searchBar = document.getElementById("search-bar");
const voiceSearchBtn = document.getElementById("voice-search-btn");

// Function to save memories to localStorage
function saveMemories() {
  localStorage.setItem("memories", JSON.stringify(memories));
}

// Function to get category color
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
    case "Friends":
      return "green"; // New color for Friends category
    default:
      return "gray";
  }
}

// Function to display all memories
function displayMemories(filteredMemories = memories) {
  memoryListContainer.innerHTML = ""; // Clear existing memories

  if (filteredMemories.length === 0) {
    memoryListContainer.innerHTML = "<p>No memories found.</p>";
    return;
  }

  filteredMemories.forEach((memory, index) => {
    const memoryCard = document.createElement("div");
    memoryCard.classList.add("memory-card");
    memoryCard.style.borderLeft = `5px solid ${getCategoryColor(memory.category)}`;

    memoryCard.innerHTML = `
      <h3>${memory.topic}</h3>
      <p class="category">${memory.category}</p>
      <div class="memory-details">
        <p class="memory-text">${memory.details}</p>
        <button class="view-more">View More</button>
      </div>
      <small>${memory.date}</small>
      <button class="favorite-button" onclick="toggleFavorite(${index})">
        ${memory.favorite ? "Unfavorite" : "Favorite"}
      </button>
      <button class="edit-button" onclick="editMemory(${index})">Edit</button>
      <button class="delete-button" onclick="deleteMemory(${index})">Delete</button>
    `;

    const viewMoreButton = memoryCard.querySelector(".view-more");
    const memoryText = memoryCard.querySelector(".memory-text");

    // Limit text to 4 lines
    const maxLines = 4;
    const lineHeight = parseInt(window.getComputedStyle(memoryText).lineHeight);
    const maxHeight = maxLines * lineHeight;

    if (memoryText.scrollHeight > maxHeight) {
      memoryText.style.maxHeight = `${maxHeight}px`;
      memoryText.style.overflow = "hidden";
      viewMoreButton.style.display = "inline-block";
    } else {
      viewMoreButton.style.display = "none";
    }

    viewMoreButton.addEventListener("click", () => {
      memoryText.classList.toggle("expanded");
      viewMoreButton.textContent = memoryText.classList.contains("expanded") ? "View Less" : "View More";
    });

    memoryListContainer.appendChild(memoryCard);
  });
}

// Function to display best memories (Favorites)
function displayBestMemories() {
  bestMemoryList.innerHTML = ""; // Clear best memories

  const favoriteMemories = memories.filter((memory) => memory.favorite);

  if (favoriteMemories.length === 0) {
    bestMemoryList.innerHTML = "<p>No favorite memories found.</p>";
    return;
  }

  favoriteMemories.forEach((memory) => {
    const memoryItem = document.createElement("div");
    memoryItem.classList.add("memory-item");
    memoryItem.style.borderLeft = `5px solid ${getCategoryColor(memory.category)}`;

    memoryItem.innerHTML = `
      <h4>${memory.topic}</h4>
      <p class="category">${memory.category}</p>
      <p class="memory-text">${memory.details}</p>
      <small>${memory.date}</small>
    `;

    bestMemoryList.appendChild(memoryItem);
  });
}

// Add a new memory
memoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const category = document.getElementById("memory-category").value;
  const topic = document.getElementById("memory-topic").value;
  const details = document.getElementById("memory-details").value;
  const tags = document.getElementById("memory-tags").value.split(",").map(tag => tag.trim()); // New tags feature

  const newMemory = {
    category,
    topic,
    details,
    tags,
    date: new Date().toLocaleString(),
    favorite: false,
    color: getCategoryColor(category),
  };

  memories.push(newMemory);
  saveMemories();
  memoryForm.reset();
  displayMemories();
  displayBestMemories();
});

// Toggle favorite status
function toggleFavorite(index) {
  memories[index].favorite = !memories[index].favorite;
  saveMemories();
  displayMemories();
  displayBestMemories();
}

// Edit a memory
function editMemory(index) {
  const newTopic = prompt("Enter new memory topic:", memories[index].topic);
  const newCategory = prompt("Enter new category:", memories[index].category);
  const newDetails = prompt("Enter new details:", memories[index].details);
  const newTags = prompt("Enter new tags (comma separated):", memories[index].tags.join(","));

  if (newTopic && newCategory && newDetails) {
    memories[index] = {
      ...memories[index],
      topic: newTopic,
      category: newCategory,
      details: newDetails,
      tags: newTags.split(",").map(tag => tag.trim()), // Update tags
    };

    saveMemories();
    displayMemories();
    displayBestMemories();
  }
}

// Delete a memory
function deleteMemory(index) {
  if (confirm("Are you sure you want to delete this memory?")) {
    memories.splice(index, 1);
    saveMemories();
    displayMemories();
    displayBestMemories();
  }
}

// Search function
searchBar.addEventListener("input", function () {
  const searchTerm = searchBar.value.toLowerCase();
  const filteredMemories = memories.filter((memory) =>
    memory.topic.toLowerCase().includes(searchTerm) ||
    memory.details.toLowerCase().includes(searchTerm) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) // Search tags too
  );
  displayMemories(filteredMemories);
});

// Display stored memories and best memories on page load
document.addEventListener("DOMContentLoaded", function () {
  displayMemories();
  displayBestMemories();
});

// Voice Search functionality
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    const searchTerm = event.results[0][0].transcript.toLowerCase();
    searchBar.value = searchTerm;
    const filteredMemories = memories.filter((memory) =>
      memory.topic.toLowerCase().includes(searchTerm) ||
      memory.details.toLowerCase().includes(searchTerm) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchTerm)) // Search tags too
    );
    displayMemories(filteredMemories);
    // Voice feedback on search results
    const speechSynthesis = window.speechSynthesis;
    const searchFeedback = new SpeechSynthesisUtterance(`Found ${filteredMemories.length} memories`);
    speechSynthesis.speak(searchFeedback);
  };

  voiceSearchBtn.addEventListener("click", function () {
    recognition.start();
  });
}
