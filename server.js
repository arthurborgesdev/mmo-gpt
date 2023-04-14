import express from 'express';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

function loadOpenAI() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  return openai;
}

app.use(bodyParser.json())

app.post('/action', async (req, res) => {
  const openai = loadOpenAI();
  const { message } = req.body;
  
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: message}],
    });
    console.log(completion.data.choices[0].message);
    res.send(completion.data.choices[0].message);
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
