import asyncHandler from 'express-async-handler';
import sizeof from 'object-sizeof';
import { Router } from 'express';
import { getCurrentMillis } from './helpers';
import { getDb } from './Firebase';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const startTime = getCurrentMillis();

    const db = getDb();
    const body = req.body;
    const id = body.id;
    const frequency = body.frequency;
    const requestSize = body.requestSize;
    const data = body.data;

    const writeStart = getCurrentMillis();
    const doc = await db.collection('data').add({ data });
    const writeEnd = getCurrentMillis();

    const readStart = getCurrentMillis();
    const docRead = await db
      .collection('data')
      .doc(doc.id)
      .get();
    docRead.data();
    const readEnd = getCurrentMillis();

    const deleteStart = getCurrentMillis();
    await db
      .collection('data')
      .doc(doc.id)
      .delete();
    const deleteEnd = getCurrentMillis();

    const log = {
      id,
      frequency,
      timestamp: getCurrentMillis(),
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

    const endTime = getCurrentMillis();
    return res.send({
      id,
      totalTime: endTime - startTime,
    });
  }),
);

export const noSqlRoute = router;
