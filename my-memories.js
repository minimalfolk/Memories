document.addEventListener('DOMContentLoaded', function () {
  const memoryList = document.getElementById('my-memory-list');
  const searchInput = document.getElementById('memory-search');

  let memories = JSON.parse(localStorage.getItem('memories')) || [];

  function displayMemories(filterText = '') {
    memoryList.innerHTML = '';
    const filteredMemories = memories.filter(memory =>
      memory.topic.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredMemories.forEach(memory => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.innerHTML = `
        <h3>${memory.topic}</h3>
        <div class="memory-details">
          <p>${memory.details}</p>
          <small>${memory.date}</small>
        </div>
      `;
      memoryList.appendChild(card);
    });
  }

  searchInput.addEventListener('input', function () {
    displayMemories(searchInput.value);
  });

  displayMemories();
});
