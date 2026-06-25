let videoFPS = null;

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
  else if (event.ctrlKey && event.shiftKey && event.key === ",") {
    event.preventDefault();
    triggerAction("slowdown");
  }
  else if (event.ctrlKey && event.shiftKey && event.key === ".") {
    event.preventDefault();
    triggerAction("slowdown");
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
      break;
    case "slowdown":
      video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
      break;
  }

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