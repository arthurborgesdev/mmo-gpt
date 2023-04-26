import fs from 'fs';
import { vectorize, getObject } from '../weaviate/utils.js';

export async function gptCompletion(name, content, openai) {
  let prompt = '';

  try {
    const data = fs.readFileSync('prompt.txt', 'utf8');
    prompt = data.toString();
  } catch(e) {
    console.log('Error:', e.stack);
  }

  const systemMessage = {
    role: "system",
    content: prompt,
  }

  const userMessage = {
    role: "user",
    name,
    content,
  }

  try {
    const weaviateObjects = await getObject('Context', 'name role content') || [];
    const context = weaviateObjects?.data?.Get?.Context || [];
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...context,
        userMessage,
      ],
    });
    const gptMessage = completion.data.choices[0].message;
    gptMessage.name = "gpt";
    vectorize('Context', userMessage);
    return gptMessage;
  } catch (e) {
    return e;
  }
}
