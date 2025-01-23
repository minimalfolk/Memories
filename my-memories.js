document.addEventListener('DOMContentLoaded', function() {
  const memoryList = document.getElementById('my-memory-list');
  let memories = JSON.parse(localStorage.getItem('memories')) || [];

  function displayMemories() {
    memoryList.innerHTML = '';
    memories.forEach((memory, index) => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.style.borderLeft = `5px solid ${memory.color}`;

      const memoryDetails = `
        <h3>${memory.topic}</h3>
        <p class="category">${memory.category}</p>
        <div class="memory-details">
          <p class="memory-text">${memory.details}</p>
          <button class="view-more">View More</button>
          <button class="edit-memory" data-index="${index}">Edit</button>
          <button class="remove-memory" data-index="${index}">Remove</button>
          <button class="mark-best" data-index="${index}">Mark as Best</button>
        </div>
        <small>${memory.date}</small>
      `;

      card.innerHTML = memoryDetails;
      memoryList.appendChild(card);
    });
  }

  // Event delegation for edit, remove, and mark as best buttons
  memoryList.addEventListener('click', function(e) {
    const target = e.target;
    const index = target.getAttribute('data-index');

    if (target.classList.contains('edit-memory')) {
      // Handle edit memory
      const memory = memories[index];
      const newDetails = prompt('Edit memory details:', memory.details);
      if (newDetails !== null) {
        memories[index].details = newDetails;
        localStorage.setItem('memories', JSON.stringify(memories));
        displayMemories();
      }
    } else if (target.classList.contains('remove-memory')) {
      // Handle remove memory
      if (confirm('Are you sure you want to remove this memory?')) {
        memories.splice(index, 1);
        localStorage.setItem('memories', JSON.stringify(memories));
        displayMemories();
      }
    } else if (target.classList.contains('mark-best')) {
      // Handle mark as best
      memories[index].best = !memories[index].best;
      localStorage.setItem('memories', JSON.stringify(memories));
      displayMemories();
    }
  });

  displayMemories();
});
