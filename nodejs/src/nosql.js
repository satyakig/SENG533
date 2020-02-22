import asyncHandler from 'express-async-handler';
import sizeof from 'object-sizeof';
import { Router } from 'express';
import { nanoTime } from './helpers';
import { getDb } from './Firebase';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const startTime = nanoTime();

    const db = getDb();
    const body = req.body;
    const id = body.id;
    const frequency = body.frequency;
    const requestSize = body.requestSize;
    const data = body.data;

    const writeStart = nanoTime();
    const doc = await db.collection('data').add({ data });
    const writeEnd = nanoTime();

    const readStart = nanoTime();
    const docRead = await db
      .collection('data')
      .doc(doc.id)
      .get();
    docRead.data();
    const readEnd = nanoTime();

    const deleteStart = nanoTime();
    await db
      .collection('data')
      .doc(doc.id)
      .delete();
    const deleteEnd = nanoTime();

    const log = {
      id,
      frequency,
      timestamp: Date.now(),
      serverType: 'nodejs',
      databaseType: 'nosql',
      requestSize,
      timeWrite: writeEnd - writeStart,
      timeRead: readEnd - readStart,
      timeDelete: deleteEnd - deleteStart,
    };

    await db
      .collection('logs')
      .doc(id)
      .set(log);

    const endTime = nanoTime();
    return res.send({
      id,
      totalTime: endTime - startTime,
    });
  }),
);

export const noSqlRoute = router;
