document.addEventListener('DOMContentLoaded', function() {
  const filterWordInput = document.getElementById('filterWord');
  const addFilterButton = document.getElementById('addFilter');
  const filterListDiv = document.getElementById('filterList');

  // Load and display existing filters
  loadFilters();

  // Add new filter when button is clicked
  addFilterButton.addEventListener('click', function() {
    addFilter();
  });

  // Add filter when Enter key is pressed
  filterWordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      addFilter();
    }
  });

  function addFilter() {
    const word = filterWordInput.value.trim().toLowerCase();
    if (word) {
      // Get existing filters from storage
      chrome.storage.local.get(['filters'], function(result) {
        const filters = result.filters || [];
        if (!filters.includes(word)) {
          filters.push(word);
          // Save updated filters
          chrome.storage.local.set({ filters: filters }, function() {
            // Clear input field
            filterWordInput.value = '';
            // Refresh filter list display
            loadFilters();
            // Notify content script about the filter update
            notifyContentScript();
          });
        } else {
          alert('This word is already in your filter list!');
        }
      });
    }
  }

  function loadFilters() {
    chrome.storage.local.get(['filters'], function(result) {
      const filters = result.filters || [];
      filterListDiv.innerHTML = '';
      
      if (filters.length === 0) {
        filterListDiv.innerHTML = '<p>No filters added yet.</p>';
        return;
      }
      
      filters.forEach(function(word) {
        const item = document.createElement('div');
        item.className = 'filter-item';
        
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', function() {
          removeFilter(word);
        });
        
        item.appendChild(wordSpan);
        item.appendChild(removeButton);
        filterListDiv.appendChild(item);
      });
    });
  }

  function removeFilter(word) {
    chrome.storage.local.get(['filters'], function(result) {
      const filters = result.filters || [];
      const index = filters.indexOf(word);
      if (index !== -1) {
        filters.splice(index, 1);
        chrome.storage.local.set({ filters: filters }, function() {
          loadFilters();
          notifyContentScript();
        });
      }
    });
  }

  function notifyContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'update_filters' });
      }
    });
  }
});