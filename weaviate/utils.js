import weaviate from 'weaviate-ts-client';
import dotenv from 'dotenv';
dotenv.config();

const client = weaviate.client({
  scheme: 'https',
  host: 'mmo-gpt-dgcieymp.weaviate.network',
  apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
  headers: {'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY}
});

export async function createClass(name) {
  return client
  .schema
  .classCreator()
  .withClass({
    'class': name,
    'vectorizer': 'text2vec-openai'
  })
  .do()
  .then(data => {
    return data;
  })
  .catch(err => {
    return err;
  });
}

export async function getSchema() {
  return client
  .schema
  .getter()
  .do()
  .then(data => {
    return data;
  })
  .catch(err => {
    return err;
  });
}

export async function vectorize(className, obj) {
  return client
  .data
  .creator()
  .withClassName(className)
  .withProperties(obj)
  .do()
  .then(data => {
    return data;
  })
  .catch(err => {
    return err;
  });
}

export async function deleteClass(name) {
  return client
  .schema
  .classDeleter()
  .withClassName(name)
  .do()
  .then(data => {
    return data;
  })
  .catch(err => {
    return err;
  });
}

export async function getObject(className, fields) {
  return client.graphql
  .get()
  .withClassName(className)
  .withFields(fields)
  .do()
  .then(data => {
    return data;
  })
  .catch(err => {
    return err;
  });
}
