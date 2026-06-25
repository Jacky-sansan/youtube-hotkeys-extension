let videoFPS = null;

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

const waitForElement = (selector) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const el = document.getElementsByClassName(selector);
      if (el) {
        console.log(
          `[YouTube Hotkeys] Found element with selector: ${selector}`,
        );
        clearInterval(interval);
        resolve(el);
      }
    }, 100); // Check every 100ms
  });
};

function setupMessageListener() {
  if (window.__youtubeHotkeysInitialized) return;
  window.__youtubeHotkeysInitialized = true;

  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const video = document.querySelector("video");
    if (!video) return;

    switch (request.action) {
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
        break;
      case "slowdown":
        video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
        break;
    }
  });
}

// Try to initialize immediately in case the video is already present
function initVideoScript() {
  const video = document.querySelector("video");
  if (!video) {
    return false;
  }

  setupMessageListener();
  return true;
}

function waitForVideoAndInit() {
  if (initVideoScript()) {
    console.log("[YouTube Hotkeys] video found, script initialized");
    return;
  }

  const observer = new MutationObserver(() => {
    if (initVideoScript()) {
      observer.disconnect();
      console.log("[YouTube Hotkeys] video appeared, script initialized");
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
}

waitForVideoAndInit();
