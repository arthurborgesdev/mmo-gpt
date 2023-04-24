import { Configuration, OpenAIApi } from 'openai';

import dotenv from 'dotenv';

dotenv.config();

export default function loadOpenAI() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  return openai;
}
