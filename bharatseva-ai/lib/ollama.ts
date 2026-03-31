export async function ollamaChat(message: string) {

    const response = await fetch(
        `${process.env.OLLAMA_URL}/api/generate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3",
                prompt: message,
                stream: false
            })
        }
    )

    const data = await response.json()

    return data.response
}