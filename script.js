const SCALE_FACTOR = 0.3; 

let textData = {
    name: {
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    date: {
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    address: {
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    sex: {
        text: '',
        x: 0,
        y: 0,
        width: 0,
    },
    age: {
        text: '',
        x: 0,
        y: 0,
        width: 0,
    }
}
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
    // console.log(textData);
}

form.addEventListener('submit', submitData);

//Text coordinates
const setCoordsButtons = document.querySelectorAll('.button_set_coords');
const textCoordsDisplay = document.querySelector('.text_coords_display');

let target = '';
let setActive = false;
let setWidth = false;

const setTarget = (e) => {
    target = e.target.dataset.name;
    setActive = true;
    setWidth = false;
    console.log(`setActive: ${setActive},`, `setWidth: ${setWidth},`, `target: ${target}`)
}

const setCoords = (e) => {
    if (!setActive) return;
    if (!setWidth) {
        textData[target].x = e.offsetX;
        textData[target].y = e.offsetY;
        setWidth = true;
        textCoordsDisplay.innerHTML = `X: ${textData[target].x}, Y: ${textData[target].y} W: ${textData[target].width}`;
    } else {
        textData[target].width = e.offsetX - textData[target].x;
        setWidth = false;
        setActive = false;
        textCoordsDisplay.innerHTML = `X: ${textData[target].x}, Y: ${textData[target].y} W: ${textData[target].width}`;
    }
}

setCoordsButtons.forEach(button => {
    button.addEventListener('click', setTarget);
})

//Canvas
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

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
    ctx.drawImage(imageElement, 0,0);
    canvas.style.transform = `scale(${SCALE_FACTOR})`;
}

const imageInput = document.querySelector('#input_image');
imageInput.addEventListener('change', async (e) => {
    const data = await readFile(e.target.files[0]);
    const image = await dataToImage(data);
    drawImageToCanvas(image);
});

canvas.addEventListener('click', setCoords);

//Writing text
const writeText = (x, y, width, text, size, color) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.font = `${size / SCALE_FACTOR}px Arial`;
    ctx.fillText (text, x, y, width);
}

const writeAllTextData = () => {
    const keys = Object.keys(textData);
    for (let i = 0; i < keys.length; i++) {
        const {x, y, width, text} = textData[keys[i]];
        console.log(x, y, width, text)
        writeText(x, y, width, text, 15, 'black');
    }
    // textData.forEach(data => {
    //     
    // })
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




const init = () => {
    const image = new Image();
    image.src = './image/dummy.png';
    image.onload = () => {
        drawImageToCanvas(image);
    }
}

init();


