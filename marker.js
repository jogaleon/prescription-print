const container = document.querySelector('#container');
const marker1 = document.querySelector('#marker1');

let active = false;
let selectedMarker = null;
let markerOffsetX, markerOffsetY;
let currentX, currentY;

const dragStart = (e) => {
    const isMarker = [...e.target.classList].includes('marker');
    if (isMarker && !selectedMarker) {
        selectedMarker = e.target
        active = true;
        markerOffsetX = e.offsetX;
        markerOffsetY = e.offsetY;
    }
    
}

const drag = (e) => {
    if (!active) return;

    currentX = e.clientX - container.offsetLeft - markerOffsetX;
    currentY = e.clientY - container.offsetTop - markerOffsetY;

    if (currentX > container.offsetWidth - selectedMarker.offsetWidth || currentX < 0) return;
    if (currentY > container.offsetHeight - selectedMarker.offsetWidth || currentY < 0) return;

    selectedMarker.style.left = `${currentX}px`;
    selectedMarker.style.top = `${currentY}px`;
}

const dragEnd = (e) => {
    active = false;
    selectedMarker = null;
}

container.addEventListener('mousedown', dragStart);
container.addEventListener('mousemove', drag);
container.addEventListener('mouseup', dragEnd);