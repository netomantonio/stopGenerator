const form = document.querySelector("form")
const campos = document.querySelector(".input")
const letter = document.getElementById("letter")
const OPENAI_API_KEY = "<PREENCHA COM SUA OPENAI API KEY"
let dados = [];
form.addEventListener("submit", async (event) => {
    event.preventDefault()
    localStorage.removeItem("lista")
    const topicos = campos.value.split(",")
    const letra = letter.value
    const lista = document.getElementById("result")
    let respostas = ""
    lista.innerHTML = ""

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", headers: {
            "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_API_KEY
        }, body: JSON.stringify({
            model: "gpt-3.5-turbo", // prompt: "stopots palavras com a letra" + letra + "para "+ topicos +"com uma palavra para cada tópico",
            messages: [{
                "role": "system",
                "content": "stopots palavras com a letra " + letra + " para os tópicos, " + topicos + " com uma palavra para cada tópico e devolver a resposa em formato chave:valor"
            },], temperature: 0.7
        })
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.error?.message) {
                console.log(json.error)
                localStorage.setItem("error", json.error)
                alert("Erro na conexão com o chatgpt, tente mais tarde")
            } else if (json.choices?.[0].message.content) {
                respostas = json.choices[0].message.content || "Sem resposta";
                respostas = JSON.parse(respostas)
                localStorage.setItem("resposta", respostas)

                for (let key in respostas) {
                    const item = document.createElement("li")
                    item.classList.add("result")

                    const divTexto = document.createElement("div")
                    const keySpan = document.createElement("span")
                    const valueSpan = document.createElement("span")
                    keySpan.textContent = `${key}`
                    valueSpan.textContent = `${respostas[key]}`
                    keySpan.classList.add("keySpan")
                    valueSpan.classList.add("valueSpan")
                    divTexto.textContent = `${keySpan.textContent} : ${valueSpan.textContent}`// Remove espaços em branco extras
                    item.appendChild(divTexto)
                    lista.appendChild(item)
                    dados.push(item.outerHTML);
                }
            }
        })
        .catch((error) => console.error("Error", error));

    // Armazena a lista no localStorage
    localStorage.setItem("lista", JSON.stringify(dados));
})

// Recupera a lista do localStorage, caso exista
if (localStorage.getItem("lista")) {
    dados = JSON.parse(localStorage.getItem("lista"));
    localStorage.removeItem("lista")
    document.getElementById("result").innerHTML = dados.join("");
}
