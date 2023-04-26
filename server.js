import express from 'express';
import bodyParser from 'body-parser';
import loadOpenAI from './loadOpenAI.js';
import dotenv from 'dotenv';
import weaviate from './weaviate/index.js';

import { gptCompletion } from './gpt/gptCompletion.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

app.use('/weaviate', weaviate);

app.post('/action', async (req, res) => {
  const { name, content } = req.body;
  const openai = loadOpenAI();

  const data = await gptCompletion(name, content, openai);

  res.send(data);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
