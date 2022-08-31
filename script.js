const SCALE_FACTOR = 0.3; 
const FONT_SIZE = 15;

let textData = {
    name: {
        name: 'name',
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    date: {
        name: 'date',
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    address: {
        name: 'address',
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    sex: {
        name: 'sex',
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    age: {
        name: 'age',
        text: '',
        x: 0,
        y: 0,
        width: 0,
    }
}

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

//Text input handler
const form = document.querySelector('#form');
const submitData = (e) => {
    e.preventDefault();
    const dataElements = [...e.target.elements].filter(element => {
        const classes = [...element.classList]
        return classes.includes('input_data')
    });
    dataElements.forEach(element => {
        // console.log(element.value)
        textData[element.dataset.name].text = element.value;
    });
    console.log("Text saved!");
}

//Marker System
const PADDING = 5;

const container = document.querySelector('#canvas_marker');
//Generate Markers

const generateMarkers = (data) => {
    let stringElements = ''
    const keys = Object.keys(data);
    for(let i = 0; i < keys.length; i++) {
        stringElements += `
        <div class="marker" data-name="${data[keys[i]].name}">
        <div class="marker_resize" data-type="marker_part"></div>
        <p class="marker_label" data-type="marker_part">${data[keys[i]].name}</p>
        </div>        
        `
    }

    container.innerHTML += stringElements;
}

const saveMarkers = (data) => {
    const {x: offsetX, y: offsetY} = container.getBoundingClientRect();
    console.log(offsetX, offsetY);
    [...container.children].forEach(marker => {
        const {x, y, width} = marker.getBoundingClientRect();
        const targetData = data[marker.dataset.name];
        targetData.x = (x - offsetX) / SCALE_FACTOR;
        targetData.y = (y - offsetY) / SCALE_FACTOR;
        targetData.width = width / SCALE_FACTOR;
    });
    console.log("Markers saved!")
}

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

form.addEventListener('submit', submitData);

//Canvas

const readFile = (file) => {
    const reader = new FileReader();
    return new Promise((resolve,reject) => {
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = () => {
            reader.abort();
            reject(new Error("Problem parsing input file."))
        }
        reader.readAsDataURL(file);
    });
}

const dataToImage = (data) => {
    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        }
        image.onerror = () => {
            reject(new Error("Problem loading image data."));
        }
        image.src = data;
    }) 
}

const drawImageToCanvas = (imageElement) => {
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    container.style.width = `${imageElement.naturalWidth * SCALE_FACTOR}px`;
    container.style.height = `${imageElement.naturalHeight * SCALE_FACTOR}px`;
    generateMarkers(textData);
    
    ctx.drawImage(imageElement, 0,0);
    canvas.style.transform = `scale(${SCALE_FACTOR})`;
}

const imageInput = document.querySelector('#input_image');
imageInput.addEventListener('change', async (e) => {
    const data = await readFile(e.target.files[0]);
    const image = await dataToImage(data);
    drawImageToCanvas(image);
});

//Writing text
const writeText = (x, y, width, text, size, color) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.textBaseline = 'hanging';
    ctx.font = `${size / SCALE_FACTOR}px Arial`;
    ctx.fillText (text, x, y, width);
}

const writeAllTextData = () => {
    const keys = Object.keys(textData);
    for (let i = 0; i < keys.length; i++) {
        const {x, y, width, text} = textData[keys[i]];
        console.log(x, y, width, text)
        writeText(x, y, width, text, FONT_SIZE, 'black');
    }
}

const writeButton = document.querySelector('#button_write');
const nameInput = document.querySelector('#name_input');
writeButton.addEventListener('click', writeAllTextData);


//Print handler
const printCanvas = async () => {
    let myWindow = window.open();
    let image = await dataToImage(canvas.toDataURL());
    await myWindow.document.body.appendChild(image);
    myWindow.focus();
    myWindow.print();
    myWindow.close();
}

const printButton = document.querySelector('#button_print');
printButton.addEventListener('click', printCanvas)

const saveMarkersButton = document.querySelector('#button_save_markers');
saveMarkersButton.addEventListener('click', () => saveMarkers(textData));

const init = () => {
    const image = new Image();
    image.src = './image/dummy.png';
    image.onload = () => {
        drawImageToCanvas(image);
    }
}

init();


