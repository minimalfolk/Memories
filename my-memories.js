// Memory Data (normally you'd get this from a server or database, but for now, we simulate it)
let memories = [];

// Load memories from localStorage (if any)
if(localStorage.getItem('memories')) {
  memories = JSON.parse(localStorage.getItem('memories'));
  renderMemories();
}

// Function to render all memories
function renderMemories() {
  const memoryList = document.getElementById('memory-list-container');
  memoryList.innerHTML = ''; // Clear existing memories

  memories.forEach((memory, index) => {
    const memoryCard = document.createElement('div');
    memoryCard.classList.add('memory-card');
    
    memoryCard.innerHTML = `
      <h3>${memory.topic}</h3>
      <p class="category">${memory.category}</p>
      <p class="memory-text">${memory.details}</p>
      <button class="favorite-button" onclick="toggleFavorite(${index})">${memory.isFavorite ? 'Unfavorite' : 'Favorite'}</button>
      <button class="edit-button" onclick="editMemory(${index})">Edit</button>
      <button class="delete-button" onclick="deleteMemory(${index})">Delete</button>
      <small>Added on: ${new Date(memory.date).toLocaleDateString()}</small>
    `;

    memoryList.appendChild(memoryCard);
  });
}

// Add a new memory
function addMemory(topic, category, details) {
function addMemory(topic, category, details) {
  const newMemory = {
    topic,
    category,
    details,
    isFavorite: false,
    date: new Date().toISOString(),
  };

  memories.push(newMemory);
  localStorage.setItem('memories', JSON.stringify(memories));
  renderMemories();
}

// Toggle favorite status of a memory
function toggleFavorite(index) {
  memories[index].isFavorite = !memories[index].isFavorite;
  localStorage.setItem('memories', JSON.stringify(memories));
  renderMemories();
  updateBestMemories();
}

// Edit a memory
function editMemory(index) {
  const newTopic = prompt("Enter new memory topic:", memories[index].topic);
  const newCategory = prompt("Enter new category:", memories[index].category);
  const newDetails = prompt("Enter new details:", memories[index].details);

  memories[index] = {
    ...memories[index],
    topic: newTopic,
    category: newCategory,
    details: newDetails,
  };

  localStorage.setItem('memories', JSON.stringify(memories));
  renderMemories();
}

// Delete a memory
function deleteMemory(index) {
  if (confirm("Are you sure you want to delete this memory?")) {
    memories.splice(index, 1);
    localStorage.setItem('memories', JSON.stringify(memories));
    renderMemories();
    updateBestMemories();
  }
}

// Function to update the "Best Memories" list on index.html
function updateBestMemories() {
  const bestMemoriesContainer = document.getElementById('best-memories-list');
  bestMemoriesContainer.innerHTML = ''; // Clear the current list

  // Get favorite memories
  const favoriteMemories = memories.filter(memory => memory.isFavorite);

  favoriteMemories.forEach(memory => {
    const memoryItem = document.createElement('div');
    memoryItem.classList.add('memory-item');
    memoryItem.innerHTML = `
      <h4>${memory.topic}</h4>
      <p class="category">${memory.category}</p>
      <p class="memory-text">${memory.details}</p>
    `;
    bestMemoriesContainer.appendChild(memoryItem);
  });
}

// Initial render of best memories
updateBestMemories();

// Add memory form handler (example)
document.getElementById('memory-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const topic = document.getElementById('memory-topic').value;
  const category = document.getElementById('memory-category').value;
  const details = document.getElementById('memory-details').value;

  addMemory(topic, category, details);

  // Clear the form
  document.getElementById('memory-topic').value = '';
  document.getElementById('memory-details').value = '';
});
