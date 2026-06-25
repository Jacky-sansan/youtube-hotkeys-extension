let videoFPS = null;
let notificationTimer = null;
let currentOverlay = null;

document.addEventListener("keydown", (event) => {
  // SAFETY CHECK: Ignore shortcuts if the user is typing in an input field or textarea
  const target = event.target;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  ) {
    return;
  }

  // 
  if (event.ctrlKey && event.shiftKey && event.key === "ArrowLeft") {
    event.preventDefault(); // Stop the default browser action
    triggerAction("backward-1-second");
  }
  else if (event.ctrlKey && event.shiftKey && event.key === "ArrowRight") {
    event.preventDefault();
    triggerAction("forward-1-second");
  }
  else if (event.ctrlKey && event.shiftKey && event.key === "<") {
    event.preventDefault();
    triggerAction("slowdown");
  } else if (event.ctrlKey && event.shiftKey && event.key === ">") {
    event.preventDefault();
    triggerAction("speedup");
  }

});

// Function to handle the triggered action
function triggerAction(actionName) {
  console.log("Shortcut activated: ", actionName);

  let video

  const currentUrl = window.location.href; 
  if (currentUrl.includes('shorts')) 
    video = document.querySelectorAll("video")[1];
  else
    video = document.querySelector("video");
  if (!video) return;

  switch (actionName) {
    case "mute-unmute":
      video.muted = !video.muted;
      break;
    case "forward-1-second":
      video.currentTime += 1;
      break;
    case "backward-1-second":
      video.currentTime -= 1;
      break;
    case "speedup":
      video.playbackRate += 0.25;
      showTemporaryNotification(video);
      break;
    case "slowdown":
      video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
      showTemporaryNotification(video);
      break;
  }
}

function showTemporaryNotification(video) {
  if (!video) return

  if (currentOverlay) {
    clearTimeout(notificationTimer);
    currentOverlay.remove();
    currentOverlay = null;
  }

  const rect = video.getBoundingClientRect();
  const videoTop = rect.top + window.scrollY;
  const videoLeft = rect.left + window.scrollX;
  const videoWidth = rect.width;

  let overlayElement = document.createElement("div");
  overlayElement.style.cssText = `
    position: absolute; 
    top: ${videoTop + 16}px; 
    left: ${videoLeft + videoWidth / 2}px; 
    transform: translateX(-50%);
    z-index: 9999;
    pointer-events: none;
  `;

  let modalElement = document.createElement("div");
  modalElement.style.cssText = `
    background: rgba(0, 0, 0, 0.8); /* Dark background for better contrast over video */
    color: white;
    padding: 8px 16px;
    border-radius: 20px; /* Capsule shape looks better for video overlays */
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    font-family: sans-serif;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
  `;

  modalElement.innerHTML = `<p> x${video.playbackRate} </p>`;
  overlayElement.appendChild(modalElement);
  document.body.appendChild(overlayElement);

  // 2. Save reference to the active overlay
  currentOverlay = overlayElement;

  // 3. Clear memory references inside the timeout
  notificationTimer = setTimeout(() => {
    if (overlayElement) {
      overlayElement.remove();
      // Break the closure reference
      overlayElement = null;
    }
    if (currentOverlay === overlayElement) {
      currentOverlay = null;
    }
  }, 1000);
}

function getVideoFramerate(video) {
  return new Promise((resolve) => {
    let times = [];
    const callback = (now) => {
      times.push(now);
      if (times.length < 10) {
        video.requestVideoFrameCallback(callback);
      } else {
        const deltas = [];
        for (let i = 1; i < times.length; i++) {
          deltas.push(times[i] - times[i - 1]);
        }
        const avgDelta = deltas.reduce((a, b) => a + b) / deltas.length;
        const framerate = 1000 / avgDelta;
        resolve(framerate);
      }
    };
    if (typeof video.requestVideoFrameCallback === "function") {
      video.requestVideoFrameCallback(callback);
    } else {
      resolve(0);
    }
  });
}