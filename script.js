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
}

const imageInput = document.querySelector('#image_input');
imageInput.addEventListener('change', async (e) => {
    const data = await readFile(e.target.files[0]);
    const image = await dataToImage(data);
    drawImageToCanvas(image);
});


