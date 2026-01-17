
// ApplyWise Content Script
(function() {
  const detectFields = () => {
    const selectors = 'input:not([type="hidden"]), select, textarea, [role="textbox"], [contenteditable="true"]';
    const elements = document.querySelectorAll(selectors);
    const fields = [];

    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      let labelText = '';
      if (el.id) {
        const label = document.querySelector(`label[for="${el.id}"]`);
        labelText = label?.textContent?.trim() || '';
      }
      
      if (!labelText) {
        labelText = el.getAttribute('aria-label') || 
                  el.getAttribute('placeholder') || 
                  el.getAttribute('name') || 
                  el.title || 
                  'Unknown Field';
      }

      fields.push({
        id: el.id || `ext-field-${Math.random().toString(36).substr(2, 9)}`,
        type: el.type || el.getAttribute('role') || 'text',
        label: labelText,
        rect: el.getBoundingClientRect().toJSON()
      });
    });

    if (fields.length > 0) {
      chrome.runtime.sendMessage({
        type: 'FIELDS_DETECTED',
        fields: fields,
        url: window.location.href
      });
    }
  };

  // Listen for fill requests from the side panel
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FILL_FIELD') {
      const { fieldId, value } = request;
      const element = document.getElementById(fieldId) || 
                     document.querySelector(`[name="${fieldId}"]`) ||
                     document.querySelector(`[aria-label="${fieldId}"]`);
      
      if (element) {
        if (element.tagName === 'SELECT') {
           // Basic selection logic
           const option = Array.from(element.options).find(opt => 
             opt.text.toLowerCase().includes(value.toLowerCase()) || 
             opt.value.toLowerCase().includes(value.toLowerCase())
           );
           if (option) element.value = option.value;
        } else {
           element.value = value;
        }
        
        // Trigger input/change events so site logic (like React/Vue) sees the change
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Visual feedback
        const originalOutline = element.style.outline;
        element.style.outline = '2px solid #6366f1';
        setTimeout(() => element.style.outline = originalOutline, 1000);
        
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Element not found' });
      }
    }
    return true;
  });

  // Observe DOM changes
  const observer = new MutationObserver((mutations) => {
    const hasChanges = mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0);
    if (hasChanges) {
      debounce(detectFields, 1000)();
    }
  });

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  observer.observe(document.body, { childList: true, subtree: true });
  detectFields();
})();
