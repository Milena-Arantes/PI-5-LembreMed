
export async function processarImagem(base64Image: string, setnomeMedicamento: (nome: string) => void) {
    try {
        //console.log("enviando imagem pro gemini")

        const GEMINI_API_KEY = "AIzaSyDCQW10rCk8fDcW51AylC-NdaEWIHKmzVs"


        const prompt = `
        Leia o texto visível na embalagem do medicamento.
        Retorne apenas o nome principal do remédio.
        Se houver mais de um nome, escolha o que parece ser o nome comercial.
        Responda apenas com o nome do medicamento, sem explicações.
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "content-Type": "application/json"},
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt },
                                { inline_data: { mime_type: "image/jpeg", data: base64Image}},
                            ],
                        },
                    ],
                }),
            }
        )

        const data = await response.json()

        //console.log("resposta: ", data)

        const textoGerado = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (textoGerado) {
            //console.log("nome encontrado:", textoGerado)
            setnomeMedicamento(textoGerado)
        } else {
            //console.warn("nenhum texto retornado")
            setnomeMedicamento("Não identificado")
        }

    } catch (erro) {
        //console.error("erro ao processar a imagem:", erro)
        setnomeMedicamento("Erro ao identificar")
    }

}
