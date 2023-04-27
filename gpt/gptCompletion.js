import fs from 'fs';
import { vectorize, getObject } from '../weaviate/utils.js';

function loadPrompt(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return data.toString();
  } catch(e) {
    console.log('Error:', e.stack);
    return '';
  }
}

export async function getGptCompletion(openai, name, content) {
  const prompt = loadPrompt('prompt.txt');

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

export async function gptSummarize(openai) {
  const prompt = loadPrompt('summary.txt');

  try {
    const weaviateObjects = await getObject('Context', 'name role content') || [];
    const context = weaviateObjects?.data?.Get?.Context || [];
    let content = '';
    context.forEach(item => content += `${item.content} `);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt} ${content}`,
    });
    const gptMessage = completion.data.choices[0].text;
    return gptMessage;
  } catch (e) {
    return e;
  }
}
