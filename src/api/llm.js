const apiKey = ""; // MUST be an empty string in this environment for runtime key injection
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

/**
 * MOCK function to generate content using the Gemini API.
 * This structure explicitly uses the defined apiKey and apiUrl, 
 * which should resolve the external API key prompt issue.
 * @param {string} userQuery The prompt text.
 * @returns {Promise<string>} The generated text.
 */
const generateContent = async (userQuery) => {
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
    };

    try {
        // Implement exponential backoff for robustness
        let response;
        for (let i = 0; i < 3; i++) { // Max 3 retries
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                return result.candidates?.[0]?.content?.parts?.[0]?.text || "Generation failed.";
            }

            // Simple delay before retry
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
        
        console.error("LLM API failed after all retries.");
        return "Error: Could not connect to generation service.";

    } catch (error) {
        console.error("LLM API fetch error:", error);
        return "Error during content generation.";
    }
};

// Export the function in case it is intended to be used by other components
export { generateContent };