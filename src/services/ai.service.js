const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});


async function aiResponseGEnartor() {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);


}