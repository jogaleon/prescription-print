const PADDING = 5;

const container = document.querySelector('#container');

//Marker dragging
let dragActive = false;
let selectedMarker = null;
let markerOffsetX = 0; 
let markerOffsetY = 0;
let dragCurrentX, dragCurrentY;

const dragStart = (e) => {
    const isMarker = [...e.target.classList].includes('marker');
    if (isMarker && !selectedMarker) {
        selectedMarker = e.target;
        dragActive = true;
        markerOffsetX = e.offsetX;
        markerOffsetY = e.offsetY;
    }
    
}

const drag = (e) => {
    if (!dragActive) return;

    dragCurrentX = e.clientX - container.offsetLeft - markerOffsetX;
    dragCurrentY = e.clientY - container.offsetTop - markerOffsetY;

    if (dragCurrentX > container.offsetWidth - selectedMarker.offsetWidth - PADDING || dragCurrentX < PADDING) return;
    selectedMarker.style.left = `${dragCurrentX}px`;
    if (dragCurrentY > container.offsetHeight - selectedMarker.offsetHeight - PADDING || dragCurrentY < PADDING) return;
        selectedMarker.style.top = `${dragCurrentY}px`;

}

const dragEnd = (e) => {
    dragActive = false;
    selectedMarker = null;
}

container.addEventListener('mousedown', dragStart);
container.addEventListener('mousemove', drag);
container.addEventListener('mouseup', dragEnd);

//Marker resizing

let resizeActive = false;
let selectedResizeMarker = null;
let resizeInitialX, resizeInitialY;

const resizeStart = (e) => {
    const isResize = [...e.target.classList].includes('marker_resize');
    if (isResize && !selectedResizeMarker) {
        selectedResizeMarker = e.target.parentNode;
        resizeActive = true;
        resizeInitialX = e.clientX;
        resizeInitialY = e.clientY;
    }
}

const resize = (e) => {
    if (resizeActive) {
        newWidth = selectedResizeMarker.offsetWidth + e.clientX - resizeInitialX;
        newHeight = selectedResizeMarker.offsetHeight + e.clientY - resizeInitialY;

        if (newWidth > container.offsetWidth - (e.clientX - container.offsetLeft - newWidth) - PADDING || newHeight > container.offsetHeight - (e.clientY - container.offsetTop - newHeight) - PADDING) return;

        selectedResizeMarker.style.width = `${newWidth}px`;
        selectedResizeMarker.style.height = `${newHeight}px`;

        resizeInitialX = e.clientX;
        resizeInitialY = e.clientY;
    }
}

const resizeEnd = (e) => {
    resizeActive = false;
    selectedResizeMarker = null;
}

container.addEventListener('mousedown', resizeStart);
container.addEventListener('mousemove', resize);
container.addEventListener('mouseup', resizeEnd);
