import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';

dotenv.config();

const client = weaviate.client({
  scheme: 'https',
  host: 'mmo-gpt-dgcieymp.weaviate.network',
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
  headers: {'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY}
});

export function createSchema(className) {
  client
  .schema
  .classCreator()
  .withClass({
    'class': className,
    'vectorizer': 'text2vec-openai'
  })
  .do()
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  });
}

export function getSchema() {
  client
  .schema
  .getter()
  .do()
  .then(res => {
  console.log(res);
  })
  .catch(err => {
  console.error(err)
  });
}

export function vectorizer(className, obj) {
  client
  .data
  .creator()
  .withClassName(className)
  .withProperties(obj)
  .do()
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  });
}
