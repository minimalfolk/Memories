// Utility functions for memory management
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

// Show and hide skeleton for loading state
function showSkeleton() {
  document.getElementById('memory-list-container').innerHTML = "<div class='skeleton-loader'></div>"; // Add skeleton loader
}

function showSpinner() {
  document.getElementById('loading-spinner').classList.remove('hidden'); // Show spinner while loading
}

function hideSpinner() {
  document.getElementById('loading-spinner').classList.add('hidden'); // Hide spinner when done
}

// Render memories with infinite scrolling
function renderMemories(containerId, filterFn = () => true) {
  if (isDataLoading) return;  // Prevent multiple simultaneous requests
  showSkeleton();  // Show loading skeleton
  isDataLoading = true;

  setTimeout(() => {
    const container = document.getElementById(containerId);
    const allMemories = getMemories().filter(filterFn);  // Filter memories based on the provided filter function
    const memories = allMemories.slice(currentIndex, currentIndex + batchSize);  // Slice memories for batch loading
    currentIndex += batchSize;

    if (memories.length === 0 && containerId === 'memory-list-container') {
      document.getElementById('no-memories-msg').classList.remove('hidden'); // Show "No memories" message if no memories are found
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
    hideSpinner();  // Hide spinner when data is rendered
  }, 500);  // Simulated async loading delay
}

// Open memory options modal for editing
function openMemoryOptions(memoryId) {
  const memory = getMemories().find(m => m.id === memoryId);
  if (memory) {
    openAddMemoryModal(memory);  // Reuse modal to edit memory
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
    saveMemories(memories);  // Save updated memories
    renderMemories('memory-list-container');  // Re-render memory list
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
      renderMemories(containerId);  // Load more memories when scrolling to the bottom
    }
  };
}

// Initialize the page
function initPage() {
  renderMemories('memory-list-container');  // Initial rendering of memories
  initInfiniteScroll('memory-list-container');  // Set up infinite scrolling
}

document.addEventListener('DOMContentLoaded', initPage);

// Filter memories by tags (live search)
function filterMemories() {
  const query = document.getElementById('search-memories').value.toLowerCase();  // Get search query
  const tag = document.getElementById('filter-tags').value.toLowerCase();  // Get selected tag filter
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

// Show and hide skeleton loader for tag-based filtering
function showSkeletonLoaderForFilter() {
  document.getElementById('memory-list-container').innerHTML = "<div class='skeleton-loader'></div>";
}
