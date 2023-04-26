import express from 'express';
import { createClass, getSchema, vectorize, deleteClass, getObject } from './utils.js';

const router = express.Router();

router.post('/class', async (req, res) => {
  const { name } = req.body;
  const data = await createClass(name);
  res.send(data);
});

router.get('/schema', async (req, res) => {
  const data = await getSchema();
  res.send(data);
});

router.post('/vectorize', async (req, res) => {
  const { className, obj } = req.body;
  const data = await vectorize(className, obj);
  res.send(data);
});

router.delete('/class', async (req, res) => {
  const { className } = req.body;
  const data = await deleteClass(className);
  res.send(data);
});

router.get('/object', async (req, res) => {
  const { className } = req.body;
  const fields = 'name role content';
  const data = await getObject(className, fields);
  res.send(data);
});

export default router;
