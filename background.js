const validCommands = new Set([
  "mute-unmute",
  "forward-1-second",
  "backward-1-second",
  "toggle-description",
]);

chrome.commands.onCommand.addListener((command) => {
  if (!validCommands.has(command)) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, { action: command }, () => {
      if (chrome.runtime.lastError) {
        console.log("[YouTube Hotkeys] ", chrome.runtime.lastError.message);
        // no active listener on this tab
      }
    });
  });
});