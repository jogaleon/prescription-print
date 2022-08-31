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

    if (dragCurrentX > container.offsetWidth - selectedMarker.offsetWidth || dragCurrentX < 0) return;
    selectedMarker.style.left = `${dragCurrentX}px`;
    if (dragCurrentY > container.offsetHeight - selectedMarker.offsetHeight || dragCurrentY < 0) return;
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
const resizeButtons = document.querySelectorAll('.marker_resize');


let resizeActive = false;
let selectedResizeMarker = null;
let resizeInitialX, resizeInitialY;

let addedWidth, addedHeight;


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
        // console.log('resizing')
        newWidth = selectedResizeMarker.offsetWidth + e.clientX - resizeInitialX;
        newHeight = selectedResizeMarker.offsetHeight + e.clientY - resizeInitialY;
        console.log(e)
        if (newWidth > container.offsetWidth - (e.clientX - container.offsetLeft - newWidth) || newHeight > container.offsetHeight - (e.clientY - container.offsetTop - newHeight)) return;

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
