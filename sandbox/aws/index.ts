/*
Region: Asia Pacific (Singapore) ap-southeast-1
Bucket ARN: arn:aws:s3:::s3-es-labs
AKIATADURGW3ULYHD3DM
V74o7mZQzyzWINda3en1Jk6cL8qA4cgp9vc8NPgT
*/
import { config } from 'dotenv';

import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  _Object,
  AbortMultipartUploadCommandOutput,
  CompleteMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3';


import { SdkStream } from '@aws-sdk/types';

import { PassThrough } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';

import * as readline from 'readline';
import { generateEmail, memUsage } from './utils.js';

config();
const { MAIN_BUCKET = '', READ_FOLDERS = '', WRITE_FOLDER = '', TIVO_TOKEN = '', MAX_KEYS = 50 } = process.env;

const client = new S3Client({
  region: 'ap-southeast-1',
  credentials:{
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY
  },
});



// streaming write
export function sS3Create(key: string): { stream: PassThrough, upload: Promise<AbortMultipartUploadCommandOutput | CompleteMultipartUploadCommandOutput> } {
  const stream = new PassThrough();
  stream.on('error', (e) => console.log('ERROR[s3 stream]:', e))
  const upload = new Upload({
    client, params: { Bucket: MAIN_BUCKET, Key: key, Body: stream }    
  }).done(); // Call done to start reading the string and return a Promise.
  return { stream, upload };
}

export async function sS3Finish(upload: Upload, stream: PassThrough): Promise<void> {
  stream.end();
  // wait for the upload promise to resolve
  await upload;
}

export async function sS3Write(stream: PassThrough, data: string): Promise<void> {
  // If the stream returns false it represents that the amount of data in the stream has passed the
  // highWaterMark threshold and we should wait for a drain event from the stream before continuing to add more data
  return new Promise<void>((resolve) => {
    if (!stream.write(data)) {
      console.log("drain needed")
      stream.once('drain', resolve);
    } else {
      resolve();
    }
  });
}

// streaming read
export const readFile = async (keyName: string | undefined) => {
  const command = new GetObjectCommand({
    Bucket: MAIN_BUCKET,
    Key: keyName,
  });

  // TODO try and promisify
  try {
    const response = await client.send(command);
    const input: SdkStream<any> | undefined = response.Body
    const rl = readline.createInterface({ input });
    rl.on('line', (input: string) => {
      console.log(`Received: ${input}`);
    });
  } catch (err) {
    console.error(err);
  }
}

/*
export const generateTestFile = async (prefix, rows = 100, batch = 500) => {
  // get ISO date
  const nowDate = new Date();
  const dateZ = nowDate.toISOString().substring(0, 10).replaceAll('-', '');
  const timeZ = nowDate.toISOString().substring(11, 16).replaceAll(':', '');
  const keyName = prefix + '/' + dateZ + '-' + timeZ + '.csv';

  const {stream, upload} = sS3Create(keyName);
  // console.log('rows', rows);
  // console.log('writableHighWaterMark', stream.writableHighWaterMark);
  let idx = 1;
  while (rows > 0) {
    let batchRows = (rows >= batch) ? batch : rows;
    rows -= batchRows;

    console.log('current rows left', rows);
    console.log('batch size', batchRows);

    let data = '';
    for (let j=1; j<=batchRows; j++) {
      data += generateEmail(idx, prefix) + `\n`;
      idx++;
      // const data = `test-${idx}@somedomain.com\n`;
    }
    // console.log('data len', data.length);
    await sS3Write(stream, data);

    console.log(`BATCH LATEST INDEX ${idx}`);
  }
  await sS3Finish(upload, stream);
  console.log("Upload complete");
};
*/

export const deleteFile = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: MAIN_BUCKET,
    Key: key,
  });
  try {
    const response = await client.send(command);
    // console.log(response);
  } catch (err) {
    console.error(err);
  }
};


export const deleteFiles = async (keys: string[]): Promise<void> => { 
  try {
    const promises = keys.map((file: any) => { return deleteFile(file.Key) })
    await Promise.allSettled(promises);
    console.log('ok delete', keys);
  } catch (e) {
    console.log('err delete', e.toString());
  }
};


export const listFiles = async (prefix: string): Promise<_Object[]> => {
  const command = new ListObjectsV2Command({
    Bucket: MAIN_BUCKET,
    Prefix: prefix,
    MaxKeys: Number(MAX_KEYS), // default 1000
  });

  let contents: _Object[] = [];
  try {
    let isTruncated: boolean | undefined = true;
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
      if (Contents) {
        // contents = [...contents, ...Contents.map(item => ({ Key: item.Key, LastModified: item.LastModified }))];
        contents = [...contents, ...Contents ];
      }
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken; 
    }
  } catch (err) {
    console.error(err);
  }

  // sort desceending time
  const compareFn = (a: any, b: any) => {
    if (a.LastModified > b.LastModified) return -1;
    else if (a.LastModified < b.LastModified) return 1;
    else {
      if (a.Key > b.Key) return -1;
      else return 1;
    }
  }
  contents.sort(compareFn);
  return contents;
}


export const isTivoScope = (email: string | undefined): boolean => {
  const emailParts = email?.split('@', 2) || [];
  return emailParts[0].search(TIVO_TOKEN) !== -1 ? true : false;
}


export const main = async () => {
  console.log('start');
  console.time('timelog-main');
  const readFolders = process?.env?.READ_FOLDERS?.split(',') ?? [];

  /*
  const {stream, upload} = sS3Create('hello-s3.txt');
  const max = 10000
  let current = 0
  while (current <= max) {
    current++
    await sS3Write(stream, `1abc-${current}@gmail.com\n`);
  }
  await sS3Finish(upload, stream);
  */
  // await generateTestFile(readFolders[0], 2300);

  // await listFiles('Workpal/');
  // await listFiles('merged/');
  const files = await listFiles('');
  console.log('files', files);

  // await readFile(files[0].Key);
  // await deleteFiles(files);

  console.timeEnd('timelog-main');
  memUsage();
};

main();


