import fs from 'fs';

export const generateEmail = (index: number, prefix: string): string => {
  return `${index.toString().padStart(6, '0')}-user@${prefix}.com.sg`;
}

export const memUsage = (): void => {
  const used = process.memoryUsage();
  console.log(used);
}

import crypto from 'crypto';

export const extractData = (data: string): object[] => {
  return JSON.parse(`[${data}]`);
}

const datax = fs.readFileSync('./test.txt');
const testShapeJSON = extractData(datax.toString());
console.log(testShapeJSON);
