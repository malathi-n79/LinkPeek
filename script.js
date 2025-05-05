//Setting up iframe
var iframe = document.createElement('iframe');
iframe.width = screen.width * 0.4;
iframe.height = screen.height * 0.4;
iframe.style.border = 'none';
iframe.style.width = '100%';
iframe.style.height = '100%';

// Create preview container
var previewContainer = document.createElement('div');
previewContainer.className = 'insyd-preview-container';
previewContainer.style.cssText = `
    position: fixed;
    top: 100px;
    left: 100px;
    width: 400px;
    height: 300px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999999;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    resize: both;
`;

// Create header
var header = document.createElement('div');
header.className = 'insyd-preview-header';
header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #6c47ff;
    color: white;
    cursor: move;
    user-select: none;
`;

// Create title with logo
var title = document.createElement('div');
title.className = 'insyd-preview-title';
title.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
`;

// Add logo (optional)
var logo = document.createElement('span');
logo.innerHTML = '🔍';
logo.style.fontSize = '16px';
title.appendChild(logo);
title.appendChild(document.createTextNode('LinkPeek'));

// Create controls
var controls = document.createElement('div');
controls.className = 'insyd-preview-controls';
controls.style.cssText = `
    display: flex;
    gap: 8px;
`;

// Create close button
var closeButton = document.createElement('button');
closeButton.innerHTML = '×';
closeButton.className = 'insyd-preview-close';
closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    transition: background-color 0.2s;
`;
closeButton.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
});
closeButton.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
});

// Add elements to header
controls.appendChild(closeButton);
header.appendChild(title);
header.appendChild(controls);

// Create content container
var contentContainer = document.createElement('div');
contentContainer.className = 'insyd-preview-content';
contentContainer.style.cssText = `
    flex: 1;
    overflow: hidden;
    position: relative;
`;
contentContainer.appendChild(iframe);

// Create resize handle
var resizeHandle = document.createElement('div');
resizeHandle.className = 'insyd-preview-resize-handle';
resizeHandle.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    width: 15px;
    height: 15px;
    cursor: nwse-resize;
    background: linear-gradient(135deg, transparent 50%, #6c47ff 50%);
    z-index: 10;
`;

// Add elements to preview container
previewContainer.appendChild(header);
previewContainer.appendChild(contentContainer);
previewContainer.appendChild(resizeHandle);

// Make the preview draggable
var isDragging = false;
var isResizing = false;
var dragOffsetX = 0;
var dragOffsetY = 0;
var initialWidth = 0;
var initialHeight = 0;
var initialX = 0;
var initialY = 0;

header.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragOffsetX = e.clientX - previewContainer.offsetLeft;
    dragOffsetY = e.clientY - previewContainer.offsetTop;
    e.preventDefault();
});

// Add resize functionality
resizeHandle.addEventListener('mousedown', function(e) {
    isResizing = true;
    initialWidth = previewContainer.offsetWidth;
    initialHeight = previewContainer.offsetHeight;
    initialX = e.clientX;
    initialY = e.clientY;
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        previewContainer.style.left = (e.clientX - dragOffsetX) + 'px';
        previewContainer.style.top = (e.clientY - dragOffsetY) + 'px';
    }
    
    if (isResizing) {
        const newWidth = initialWidth + (e.clientX - initialX);
        const newHeight = initialHeight + (e.clientY - initialY);
        
        // Set minimum size constraints
        if (newWidth >= 200) {
            previewContainer.style.width = newWidth + 'px';
        }
        
        if (newHeight >= 150) {
            previewContainer.style.height = newHeight + 'px';
        }
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    isResizing = false;
});

// Close button functionality
closeButton.addEventListener('click', function() {
    previewContainer.style.display = 'none';
});

//Setting all tippies
var allTippies = tippy('a', {
    placement: 'auto',
    interactive: true,
    allowHTML: true,
    delay: [0, 100],
    content: `<div style="display: flex; align-items: center; justify-content: center; padding: 4px; background-color: #6c47ff; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <span style="color: white; font-weight: bold; font-size: 12px;">🔗</span>
              </div>`,
    onCreate(instance) {
        instance._link=instance.reference.href;
    },
});

allTippies.forEach(function (t) {
    tippy(t.popper, {
        // zIndex: 999999,
        maxWidth: 'none',
        delay: [800, 200],
        arrow: true,
        inertia: true,
        animation: 'scale',
        placement: 'auto',
        interactive: true,
        appendTo: document.body,

        // allowHTML: true,
        // popperOptions: {
        //     strategy: 'fixed',
        //   },
        onShow(instance) {
            // Add the preview container to the body if it's not already there
            if (!document.body.contains(previewContainer)) {
                document.body.appendChild(previewContainer);
            }
            
            // Show the preview container
            previewContainer.style.display = 'flex';
            
            // Set the iframe source
            iframe.src = t._link;
            
            // Position the preview near the tippy
            const tippyRect = t.popper.getBoundingClientRect();
            previewContainer.style.left = (tippyRect.right + 10) + 'px';
            previewContainer.style.top = tippyRect.top + 'px';
            
            // Return an empty div to the tippy content
            instance.setContent('');
        },
        onHide(instance) {
            // Don't hide the preview when the tippy hides
            // The user can close it manually with the close button
        }
    });
});
