import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    // Make sure your .env file has this exact variable name: GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY; 
    
    // We will use the gemini-1.5-flash model, which is fast and great for general chat
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: message
                }]
            }]
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Check for invalid keys or other API errors
        if (!response.ok) {
             console.error("Gemini API Error Details:", data);
             throw new Error(`Gemini API responded with status: ${response.status}`);
        }

        // Gemini's response structure is different from OpenAI's
        if (data.candidates && data.candidates.length > 0) {
             return data.candidates[0].content.parts[0].text; // The reply
        } else {
             throw new Error("Unexpected response structure from Gemini");
        }

    } catch (err) {
        console.error("Error in AI Service:", err);
        throw err; 
    }
}

export default getOpenAIAPIResponse;