import express from 'express';
import bodyParser from 'body-parser';
import loadOpenAI from './loadOpenAI.js';
import dotenv from 'dotenv';
import { vectorizer } from './weaviate.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

app.post('/action', async (req, res) => {
  const openai = loadOpenAI();
  const { name, message } = req.body;

  const gptMessage = {
    role: "user",
    content: `${name}: ${message}`,
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        gptMessage,
      ],
    });
    vectorizer('Action', gptMessage);
    vectorizer('Response', completion.data.choices[0].message);
    res.send(completion.data.choices[0].message);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
