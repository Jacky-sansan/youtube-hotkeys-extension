// chrome.storage.sync.get("autoPlayEnabled", (data) => {
//   if (data.autoPlayEnabled) {
//     setupAutoPlayNextShort();
//   }
// });

// Function to handle video end and play next Short
function setupAutoPlayNextShort() {
  const video = document.querySelectorAll("video")[1];
  if (!video) {
    console.log("No video element found");
    return;
  }

  // Add event listener for when the video ends
  video.addEventListener("ended", () => {
    // Find the "Next" button in YouTube Shorts
    const nextButton = document.getElementById("navigation-button-down");
    if (nextButton) {
			button = nextButton.children[0].children[0].children[0];
      console.log("Video ended, clicking next button");
      button.click();
    } else {
      console.log("Next button not found");
    }
  });
}

// Run setup when the page loads
setupAutoPlayNextShort();

// Handle dynamic page changes (YouTube Shorts is a single-page app)
const observer = new MutationObserver(() => {
  // Re-run setup to ensure new video elements are detected
  setupAutoPlayNextShort();
});

// Observe changes to the DOM to handle video changes
observer.observe(document.body, { childList: true, subtree: true });