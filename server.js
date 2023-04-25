import express from 'express';
import bodyParser from 'body-parser';
import loadOpenAI from './loadOpenAI.js';
import dotenv from 'dotenv';
import weaviate from './weaviate/index.js';
import fs from 'fs';

import { vectorize, getObject } from './weaviate/utils.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

app.use('/weaviate', weaviate);

let prompt = '';

  try {
    const data = fs.readFileSync('prompt.txt', 'utf8');
    prompt = data.toString();
  } catch(e) {
    console.log('Error:', e.stack);
  }

app.post('/action', async (req, res) => {
  const openai = loadOpenAI();
  const { name, message } = req.body;

  const systemMessage = {
    role: "system",
    content: prompt,
  }

  const userMessage = {
    role: "user",
    name: name,
    content: message,
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
    vectorize('Context', userMessage);
    vectorize('Context', completion.data.choices[0].message);
    res.send(completion.data.choices[0].message);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
