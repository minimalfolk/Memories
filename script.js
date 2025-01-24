// Initialize memory list from localStorage (if any)
let memories = JSON.parse(LZString.decompressFromUTF16(localStorage.getItem("memories"))) || [];

// DOM elements for my-memories.html
const memoryForm = document.getElementById("memory-form");
const memoryListContainer = document.getElementById("memory-list");
const searchBar = document.getElementById("search-bar");
const voiceSearchBtn = document.getElementById("voice-search-btn");

// DOM elements for index.html
const bestMemoryList = document.getElementById("best-memory-list");
const noBestMemoriesMsg = document.getElementById("no-best-memories-msg");

// Function to save memories to localStorage with compression
const saveMemories = () => {
  const compressedData = LZString.compressToUTF16(JSON.stringify(memories)); // Compress data before saving
  localStorage.setItem("memories", compressedData);
};

// Function to get category color
const getCategoryColor = (category) => {
  const colors = {
    Personal: "blue",
    Family: "skyblue",
    Achievement: "yellow",
    Relationship: "lightcoral",
    Friends: "green",
  };
  return colors[category] || "gray";
};

// Function to display all memories (for my-memories.html)
const displayMemories = (filteredMemories = memories) => {
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
      <div class="memory-actions">
        <button class="favorite-button" onclick="toggleFavorite(${index})">
          ${memory.favorite ? "Unfavorite" : "Favorite"}
        </button>
        <button class="edit-button" onclick="editMemory(${index})">Edit</button>
        <button class="delete-button" onclick="deleteMemory(${index})">Delete</button>
      </div>
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
};

// Function to display best memories (Favorites) on index.html
const displayBestMemories = () => {
  bestMemoryList.innerHTML = ""; // Clear best memories
  const favoriteMemories = memories.filter((memory) => memory.favorite);

  if (favoriteMemories.length === 0) {
    bestMemoryList.style.display = "none";
    noBestMemoriesMsg.style.display = "block";
  } else {
    noBestMemoriesMsg.style.display = "none";
    bestMemoryList.style.display = "block";

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
};

// Add a new memory
memoryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const category = document.getElementById("memory-category").value;
  const topic = document.getElementById("memory-topic").value;
  const details = document.getElementById("memory-details").value;
  const tags = document.getElementById("memory-tags").value.split(",").map((tag) => tag.trim());

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
const toggleFavorite = (index) => {
  memories[index].favorite = !memories[index].favorite;
  saveMemories();
  displayMemories();
  displayBestMemories();
};

// Edit a memory
const editMemory = (index) => {
  const memory = memories[index];
  const newTopic = prompt("Enter new memory topic:", memory.topic);
  const newCategory = prompt("Enter new category:", memory.category);
  const newDetails = prompt("Enter new details:", memory.details);
  const newTags = prompt("Enter new tags (comma separated):", memory.tags.join(","));

  if (newTopic && newCategory && newDetails) {
    memories[index] = {
      ...memories[index],
      topic: newTopic,
      category: newCategory,
      details: newDetails,
      tags: newTags.split(",").map((tag) => tag.trim()),
      color: getCategoryColor(newCategory),
    };
    saveMemories();
    displayMemories();
    displayBestMemories();
  }
};

// Delete a memory
const deleteMemory = (index) => {
  if (confirm("Are you sure you want to delete this memory?")) {
    memories.splice(index, 1);
    saveMemories();
    displayMemories();
    displayBestMemories();
  }
};

// Initialize the display when the page loads
window.onload = () => {
  if (memoryListContainer) {
    // If on my-memories.html
    displayMemories(); // Display all memories
  }
  if (bestMemoryList) {
    // If on index.html
    displayBestMemories(); // Display best memories (favorites)
  }
};
