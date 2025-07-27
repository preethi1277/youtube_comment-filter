let filters = [];
let observer = null;

// Fetch filters from storage
function loadFilters() {
  chrome.storage.local.get(['filters'], function(result) {
    filters = result.filters || [];
    processExistingComments();
    setupObserver();
  });
}

// Process comments that are already on the page
function processExistingComments() {
  const comments = document.querySelectorAll('ytd-comment-thread-renderer');
  comments.forEach(filterComment);
}

// Filter individual comment
function filterComment(commentElement) {
  if (!commentElement) return;
  
  const commentTextElement = commentElement.querySelector('#content-text');
  if (!commentTextElement) return;
  
  const commentText = commentTextElement.textContent.toLowerCase();
  
  // Check if comment contains any filtered word
  const shouldHide = filters.some(word => commentText.includes(word.toLowerCase()));
  
  if (shouldHide) {
    commentElement.style.display = 'none';
  } else {
    commentElement.style.display = 'block';
  }
}

// Set up MutationObserver to monitor for new comments
function setupObserver() {
  // Disconnect existing observer if any
  if (observer) {
    observer.disconnect();
  }
  
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          // Check if the added node is a comment
          if (node.nodeName === 'YTD-COMMENT-THREAD-RENDERER') {
            filterComment(node);
          } else if (node.querySelectorAll) {
            // If it's another element, check if it contains comments
            const comments = node.querySelectorAll('ytd-comment-thread-renderer');
            comments.forEach(filterComment);
          }
        });
      }
    });
  });
  
  // Start observing comment section
  const commentSection = document.querySelector('#comments');
  if (commentSection) {
    observer.observe(commentSection, { childList: true, subtree: true });
  }
}

// Initial load
loadFilters();

// Listen for navigation events
window.addEventListener('yt-navigate-finish', function() {
  // Wait for comments to load
  setTimeout(() => {
    processExistingComments();
    setupObserver();
  }, 2000);
});

// Listen for filter updates from popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'update_filters') {
    loadFilters();
  }
});

// Add this function to handle initial page load and navigation within YouTube
function waitForComments() {
  const checkInterval = setInterval(() => {
    const commentSection = document.querySelector('#comments');
    if (commentSection) {
      clearInterval(checkInterval);
      processExistingComments();
      setupObserver();
    }
  }, 1000);
  
  // Clear interval after 60 seconds to prevent infinite checking
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 60000);
}

// Run on initial load
waitForComments();