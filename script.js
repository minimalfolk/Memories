document.addEventListener('DOMContentLoaded', function () {
    const memoryListContainer = document.getElementById('memory-list');
    const memoryForm = document.getElementById('memory-form');
    const searchBar = document.getElementById('search-memories');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const bestMemoryList = document.getElementById("best-memory-list");
    const noBestMemoriesMsg = document.getElementById("no-best-memories-msg");

    // Load memories from localStorage with decompression if needed
    let memories = loadMemories();

    // Display memories function
    function displayMemories(filteredMemories = memories) {
        memoryListContainer.innerHTML = '';
        if (filteredMemories.length === 0) {
            memoryListContainer.innerHTML = '<p>No memories found. Start by adding your first memory!</p>';
        } else {
            filteredMemories.forEach(memory => {
                const memoryCard = document.createElement('div');
                memoryCard.classList.add('memory-card', memory.favorite ? 'favorite' : '');
                memoryCard.style.borderLeft = `5px solid ${getCategoryColor(memory.category)}`;

                memoryCard.innerHTML = `
                    <div class="memory-header">
                        <span class="category">${memory.category}</span>
                        <span class="date">${memory.date}</span>
                    </div>
                    <h3 class="memory-topic">${memory.topic}</h3>
                    <p class="memory-text">${memory.details}</p>
                    <div class="memory-actions">
                        <button class="edit-button" onclick="openModal(true, '${memory.id}')">✏️</button>
                        <button class="delete-button" onclick="deleteMemory('${memory.id}')">❌</button>
                        <button class="favorite-button" onclick="toggleFavorite('${memory.id}')">
                            ${memory.favorite ? '⭐' : '☆'}
                        </button>
                    </div>
                    <button class="view-more" onclick="toggleMemoryDetails(this)">View More</button>
                `;
                memoryListContainer.appendChild(memoryCard);
            });
        }
    }

    // Load memories from localStorage with decompression if needed
    function loadMemories() {
        let compressedMemories = localStorage.getItem('memories');
        if (compressedMemories) {
            return decompressData(compressedMemories); // Decompress if data exists
        }
        return [
            { id: "1", category: "Personal", date: "2025-01-20", topic: "Graduation Day", details: "The day I graduated college!", favorite: false },
            { id: "2", category: "Family", date: "2025-01-21", topic: "Family Trip", details: "Our amazing trip to the mountains!", favorite: true }
        ];
    }

    // Save memories to localStorage with compression
    function saveMemories() {
        const compressedData = compressData(memories); // Compress before saving
        localStorage.setItem('memories', compressedData);
    }

    // Compression function
    function compressData(data) {
        return JSON.stringify(data); // Add actual compression logic if needed
    }

    // Decompression function
    function decompressData(data) {
        return JSON.parse(data); // Add decompression logic if data is compressed
    }

    // Get category color
    function getCategoryColor(category) {
        const colors = {
            Personal: "blue",
            Family: "skyblue",
            Achievement: "yellow",
            Relationship: "lightcoral",
            Friends: "green",
        };
        return colors[category] || "gray";
    }

    // Toggle memory details (expand/collapse animation)
    window.toggleMemoryDetails = function (btn) {
        const card = btn.closest('.memory-card');
        card.classList.toggle("expanded");
        if (card.classList.contains("expanded")) {
            btn.textContent = "View Less";
        } else {
            btn.textContent = "View More";
        }
    }

    // Filter memories
    window.filterMemories = function () {
        const query = searchBar.value.toLowerCase();
        const filtered = memories.filter(memory =>
            memory.topic.toLowerCase().includes(query) ||
            memory.details.toLowerCase().includes(query) ||
            memory.category.toLowerCase().includes(query)
        );
        displayMemories(filtered);
    };

    // Reset search
    window.resetSearch = function () {
        searchBar.value = '';
        displayMemories();
    };

    // Sort memories
    window.sortMemories = function () {
        const sortOption = document.getElementById('sort-memories').value;
        if (sortOption === 'date') memories.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sortOption === 'category') memories.sort((a, b) => a.category.localeCompare(b.category));
        if (sortOption === 'favorite') memories.sort((a, b) => b.favorite - a.favorite);
        displayMemories();
    };

    // Toggle favorite filter
    window.toggleFavoriteFilter = function () {
        showFavorites = !showFavorites;
        document.getElementById('filter-favorites').textContent = showFavorites ? 'Show All' : 'Show Favorites';
        const filtered = showFavorites ? memories.filter(m => m.favorite) : memories;
        displayMemories(filtered);
    };

    // Add a new memory
    memoryForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const category = document.getElementById("memory-category").value;
        const topic = document.getElementById("memory-topic").value;
        const details = document.getElementById("memory-details").value;

        const newMemory = {
            id: `${memories.length + 1}`,
            category,
            topic,
            details,
            date: new Date().toLocaleString(),
            favorite: false
        };

        memories.push(newMemory);
        saveMemories();
        memoryForm.reset();
        displayMemories();
    });

    // Toggle favorite status
    window.toggleFavorite = function (id) {
        const memory = memories.find(memory => memory.id === id);
        memory.favorite = !memory.favorite; // Toggle favorite
        saveMemories(); // Update localStorage
        displayMemories(); // Re-render memories list
    };

    // Edit a memory
    window.editMemory = function (id) {
        const memory = memories.find(memory => memory.id === id);
        const newTopic = prompt("Enter new memory topic:", memory.topic);
        const newCategory = prompt("Enter new category:", memory.category);
        const newDetails = prompt("Enter new details:", memory.details);

        if (newTopic && newCategory && newDetails) {
            memory.topic = newTopic;
            memory.category = newCategory;
            memory.details = newDetails;
            saveMemories();
            displayMemories();
        }
    };

    // Delete a memory
    window.deleteMemory = function (id) {
        memories = memories.filter(memory => memory.id !== id);
        saveMemories(); // Update localStorage
        displayMemories();
    };

    // Display best memories (Favorites) on index.html
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

    // Initialize the display when the page loads
    window.onload = () => {
        if (memoryListContainer) {
            displayMemories(); // Display all memories
        }
        if (bestMemoryList) {
            displayBestMemories(); // Display best memories (favorites)
        }
    };

    // Initial display of memories
    displayMemories();
});
