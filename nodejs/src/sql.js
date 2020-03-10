import asyncHandler from 'express-async-handler';
import { Router } from 'express';
import { getCurrentMillis } from './helpers';
import { getConnection, getDb } from './GCloud';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const startTime = getCurrentMillis();

    const connection = getConnection();
    const db = getDb();
    const body = req.body;
    const id = body.id;
    const frequency = body.frequency;
    const requestSize = body.requestSize;
    const data = body.data;

    const writeStart = getCurrentMillis();
    await connection.query(`INSERT INTO data_table (id, data) VALUES(?, ?)`, [id, data]);
    const writeEnd = getCurrentMillis();

    const readStart = getCurrentMillis();
    const doc = await connection.query(`SELECT * FROM data_table WHERE id = '${id}'`);
    const readEnd = getCurrentMillis();

    const deleteStart = getCurrentMillis();
    await connection.query(`DELETE FROM data_table WHERE id = '${id}'`);
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

export const sqlRoute = router;
