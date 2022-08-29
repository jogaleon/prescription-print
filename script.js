let textStartX = 50;
let textStartY = 50;

//Text coordinates
const textCoordsDisplay = document.querySelector('.text_coords_display');
const setTextStart = (e) => {
    textStartX = e.offsetX;
    textStartY = e.offsetY;
    textCoordsDisplay.innerHTML = `X: ${textStartX}, Y: ${textStartY}`
}

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
    canvas.style.transform = 'scale(.3)';
}

const imageInput = document.querySelector('#image_input');
imageInput.addEventListener('change', async (e) => {
    const data = await readFile(e.target.files[0]);
    const image = await dataToImage(data);
    drawImageToCanvas(image);
});

canvas.addEventListener('click', setTextStart);

//Writing text
const writeText = (text) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText (text, textStartX, textStartY);
}

const writeTextButton = document.querySelector('#write_text_button');
const nameInput = document.querySelector('#name_input');
writeTextButton.addEventListener('click', () => {
    writeText(nameInput.value);
})


//Print handler
const printCanvas = async () => {
    let myWindow = window.open();
    let image = await dataToImage(canvas.toDataURL());
    await myWindow.document.body.appendChild(image);
    myWindow.focus();
    myWindow.print();
    myWindow.close();
}

const printButton = document.querySelector('#print_button');
printButton.addEventListener('click', printCanvas)




const init = () => {
    const image = new Image();
    image.src = './image/dummy.png';
    image.onload = () => {
        drawImageToCanvas(image);
    }
}

init();


