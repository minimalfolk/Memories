// Utility functions
function getMemories() {
  try {
    const compressed = localStorage.getItem('memories');
    return compressed ? JSON.parse(LZString.decompress(compressed)) : [];
  } catch (e) {
    console.error("Error retrieving memories from localStorage:", e);
    return [];
  }
}

function saveMemories(memories) {
  try {
    const compressed = LZString.compress(JSON.stringify(memories));
    localStorage.setItem('memories', compressed);
  } catch (e) {
    console.error("Error saving memories to localStorage:", e);
  }
}

// Infinite scrolling variables
let currentIndex = 0;
const batchSize = 10;
let isDataLoading = false;

// Show and hide spinner for loading
function showSkeleton() {
  document.getElementById('memory-list-container').innerHTML = "<div class='skeleton-loader'></div>"; // Add skeleton loader while loading data
}

function showSpinner() {
  document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideSpinner() {
  document.getElementById('loading-spinner').classList.add('hidden');
}

// Render memories with infinite scrolling
function renderMemories(containerId, filterFn = () => true) {
  if (isDataLoading) return;
  showSkeleton();  // Show loading skeleton while fetching data
  isDataLoading = true;

  setTimeout(() => {
    const container = document.getElementById(containerId);
    const allMemories = getMemories().filter(filterFn);
    const memories = allMemories.slice(currentIndex, currentIndex + batchSize);
    currentIndex += batchSize;

    if (memories.length === 0 && containerId === 'memory-list-container') {
      document.getElementById('no-memories-msg').classList.remove('hidden');
    }

    memories.forEach(memory => {
      const memoryCard = document.createElement('div');
      memoryCard.className = 'memory-card';
      memoryCard.innerHTML = `
        <h3>${memory.topic}</h3>
        <p>${memory.details}</p>
        <div class="options">
          <button onclick="openMemoryOptions('${memory.id}')">⋮</button>
        </div>
      `;
      container.appendChild(memoryCard);
    });

    isDataLoading = false;
    hideSpinner();  // Hide loading spinner once data is rendered
  }, 500);  // Simulating async loading, adjust or remove the delay as needed
}

// Open memory options modal for editing
function openMemoryOptions(memoryId) {
  const memory = getMemories().find(m => m.id === memoryId);
  if (memory) {
    openAddMemoryModal(memory);  // Reuse the Add Memory modal to edit memory
    document.getElementById('modal-title').textContent = 'Edit Memory';
    document.getElementById('memory-category').value = memory.category;
    document.getElementById('memory-topic').value = memory.topic;
    document.getElementById('memory-details').value = memory.details;
    document.getElementById('memory-tags').value = memory.tags.join(', ');
    document.getElementById('save-button').onclick = () => updateMemory(memory.id);
  }
}

// Update existing memory
function updateMemory(memoryId) {
  const memories = getMemories();
  const memory = memories.find(m => m.id === memoryId);
  if (memory) {
    memory.category = document.getElementById('memory-category').value;
    memory.topic = document.getElementById('memory-topic').value;
    memory.details = document.getElementById('memory-details').value;
    memory.tags = document.getElementById('memory-tags').value.split(',').map(tag => tag.trim());
    saveMemories(memories);
    renderMemories('memory-list-container');
    closeModal();
  }
}

// Open modal for adding a memory (or editing an existing one)
function openAddMemoryModal(memory = null) {
  document.getElementById('memory-modal').classList.remove('hidden');
  if (memory) {
    document.getElementById('modal-title').textContent = 'Edit Memory';
    document.getElementById('memory-category').value = memory.category;
    document.getElementById('memory-topic').value = memory.topic;
    document.getElementById('memory-details').value = memory.details;
    document.getElementById('memory-tags').value = memory.tags.join(', ');
  } else {
    document.getElementById('modal-title').textContent = 'Add Memory';
  }
}

function closeModal() {
  document.getElementById('memory-modal').classList.add('hidden');
}

// Error handling: Check for corrupted data
window.addEventListener('error', (e) => {
  console.error("An unexpected error occurred: ", e.message);
  alert("An error occurred, please reload the page.");
});

// Infinite scroll event
function initInfiniteScroll(containerId) {
  window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      renderMemories(containerId);
    }
  };
}

// Initialize the page
function initPage() {
  renderMemories('memory-list-container');
  initInfiniteScroll('memory-list-container');
}

document.addEventListener('DOMContentLoaded', initPage);

// Filter memories by tags (live search)
function filterMemories() {
  const query = document.getElementById('search-memories').value.toLowerCase();
  const tag = document.getElementById('filter-tags').value.toLowerCase();
  const memories = getMemories().filter(memory =>
    memory.topic.toLowerCase().includes(query) || memory.details.toLowerCase().includes(query)
  );
  renderMemories('memory-list-container', memory => 
    memories.includes(memory) && (tag ? memory.tags.includes(tag) : true)
  );
}

// Add event listener to filter memories on tag selection or search input change
document.getElementById('search-memories').addEventListener('input', filterMemories);
document.getElementById('filter-tags').addEventListener('change', filterMemories);
