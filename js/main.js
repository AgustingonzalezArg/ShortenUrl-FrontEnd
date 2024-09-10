const newLink = document.getElementById("new-link");
const formUrl = document.getElementById("form-url");
const formShortUrl = document.getElementById("form-short-url");
const viewsInPages = document.getElementById("views-in-pages");
const regexUrl = /^https:\/\/[^\s/$.?#].[^\s]*$/;
const regexSubDomain = /^http:\/\/localhost:3000\//
const regexCode = /^.{5,15}$/;


function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    .then(()=> {
        alert("¡Enlace copiado al portapapeles!");
    }, ()=> {
        alert("Ha surgido un error no se pudo compiar en el portapapeles")
    })
}

formUrl.addEventListener("submit", async(e) => {
    e.preventDefault();

    const originalUrl = document.getElementById("originalUrl").value;
    const code = document.getElementById("val-code").value
    
    if (!regexUrl.test(originalUrl)) {
        alert("Debe ingresar en un enlace valido con https://");
        return
    }

    if (!regexCode.test(code)) {
        alert("Debe ingresar un codigo entre 5 a 15 caracteres")
        return
    }

    try {
        const response = await fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({defaultUrl: originalUrl, code})
        });

        const data = await response.json();

        if(response.ok) {
            newLink.innerText = `${data.newURL}`;
            newLink.addEventListener("click", () => {
                copyToClipboard(data.newURL);
            });
        } else {
            newLink.innerText = "Error"
        }

    } catch (error) {
        newLink.innerText = "Error"
    }

});

formShortUrl.addEventListener("submit", async (e) => {

    e.preventDefault()

    const shUrl = document.getElementById("short-url").value;
    const code = document.getElementById("check-code").value;

    if (!regexSubDomain.test(shUrl)) {
        alert("Debe ingresar en un enlace valido");
        return
    }

    if (!regexCode.test(code)) {
        alert("Debe ingresar un codigo entre 5 a 15 caracteres")
        return
    }

    try {
        
        const shortUrl = shUrl.replace("http://localhost:3000/", "");
        const response = await fetch("http://localhost:3000/check", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            }, 
            body: JSON.stringify({shortUrl, code})
        })

        const data = await response.json()

        if(response.ok) {

            viewsInPages.innerText = data.clicks === 1 ? `Has recibido ${data.clicks} clic en tu pagina web utlizando nuestro enlace` : `Has recibido ${data.clicks} clics en tu pagina web utlizando nuestro enlace`
        } else {
            if(response.statusText === "Unauthorized") {
                viewsInPages.innerText = `El codigo que proporciono no coincide con el enlace`
            }
        }

    } catch (error) {
        console.error("Error al verificar el enlace:", error);
        viewsInPages.innerText = "Algo fallo en el servidor vuelva intentarlo de nuevo mas tarde."
    }
})