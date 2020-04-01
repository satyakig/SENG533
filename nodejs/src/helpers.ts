import moment from 'moment';
import si from 'systeminformation';

export function getCurrentMillis() {
  return moment().valueOf();
}

export async function getStats() {
  const mem = await si.mem();
  const usage = await si.currentLoad();

  return {
    freeMem: mem.free,
    totalMem: mem.total,
    cpuUsage: usage.currentload / 100,
  };
}
