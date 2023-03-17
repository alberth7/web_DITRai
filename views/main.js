const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector('h2')
const button = dropArea.querySelector('button')
const input = dropArea.querySelector('#input-file');
const myElement = document.querySelector('#resultados');

let files;

button.addEventListener("click", (e) => {
    input.click();
    console.log("click");
});


input.addEventListener("change", (e) => {
    files = input.files;
    dropArea.classList.add("active");
    showFiles(files)
    dropArea.classList.remove("active");
});

//mientre se este arrastrando
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Suelta para subir archivos";
});

// estamos arrastando
dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta imagenes";
    
});

//soltamos el archivo cuando este en la zona
dropArea.addEventListener(".drop-area", (e) => {
    console.log("soltar imagen")
    e.preventDefault(); 
    files = e.dataTransfer.files;
    showFiles(files);
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta imagenes";

});

function showFiles(files){
    console.log("showFile")
    if (files.length === undefined ){
        processFile(files)
    }
    else{
        for (const file of files){
            processFile(file)
        }
    }
}

function processFile(file){
    const docType = file.type;
    const validExtensions = ['image/jpeg', 'image/jpg','image/png','image/gif', 'application/xml','text/xml'];

    if(validExtensions.includes(docType)){
        // archivo valido
        const fileReader = new FileReader();
        let r = `file-${Math.random().toString(32).substring(7)}`;
        console.log(r);
        const id = ''+r ;

        fileReader.addEventListener('load', (e) => {
            const fileUrl = fileReader.result;
            const image = `
                <div class="file-container">
                    
                    <div class = "status">
                        <span>${file.name}</span>
                        <span>Archivo subido...</span>
                    </div>
                </div>
            `;
            const html = document.querySelector("#preview").innerHTML;
            document.querySelector('#preview').innerHTML = image + html;
        })
        fileReader.readAsDataURL(file);
        uploadFile(file, id);
    }else{
        // no es un archivo valido
        alert('NO es un archivo valido');
    }
}

async function uploadFile(file, id){
    const formData = new FormData();
    formData.append("file", file);
    try{
        const response = await fetch("http://localhost:3000/upload",{
            method:"POST",
            body: formData,
        });
        const responseText = await response.text();
        console.log(responseText)
        if(response)
        document.querySelector("h2").innerHTML = `<div> Archivo subido correctamente</div>`;
        const element = document.querySelector(` .status-text`);
        if (element) {
          element.innerHTML = `<span class="success"> Archivo suibido correctamente...</span>`;
        } else {
          element.innerHTML = `<span class="success"> Archivo suibido correctamente...</span>`;
          console.log(`Element with ID ${id} not found`);
        }
        // document.querySelector(
        //     `#${id} .status-text`)
        //     .innerHTML = ``; 
    }
    catch (error){
        const element = document.querySelector(`#${id} .status-text`);
        if (element) {
          element.innerHTML = `<span class="failure">El archivo no pudo subirse...</span>`;
        } else {
          console.log(`Element with ID ${id} not found`);
        }

        // const status= `#${id} .status-text`
        // console.log(status)
        // document.querySelector("#1234 .status-text").innerHTML = `<span class="failure">El archivo no pudo subirse...</span>`; 
    }
}

