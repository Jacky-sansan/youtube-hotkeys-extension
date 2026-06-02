(function() {
    'use strict';
        
    // Block visibilitychange events (TikTok checks document.hidden / visibilityState)
    window.addEventListener('visibilitychange', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();  // extra insurance
    }, true);
    
    // Also block blur (some sites use this too)
    window.addEventListener('blur', function(e) {
        e.stopImmediatePropagation();
    }, true);
    
    // Force visibilityState to always be "visible"
    Object.defineProperty(document, 'visibilityState', {
        get: function() { return 'visible'; },
        configurable: true
    });
    
    Object.defineProperty(document, 'hidden', {
        get: function() { return false; },
        configurable: true
    });
})();