
## References

- Writing With Stream
  - https://github.com/aws/aws-sdk-js-v3/issues/3907

- Read With Stream - line-by-line
  - https://stackoverflow.com/questions/52785580/read-a-file-line-by-line-using-lambda-s3

- Another Read Write Sample - Not Verified
  - https://gist.github.com/hboylan/68ad1bea3e603b33e338c39bbd8c72d3


## Codes

### Simple Write

```js

const testCsv = `
aa@123.com
bb@123.com
`;

const command = new PutObjectCommand({
  Bucket: 's3-es-labs',
  Key: 'hello-s3.txt',
  Body: testCsv,
});
try {
  const response = await client.send(command);
  console.log(response);
} catch (err) {
  console.error(err);
}
```


### Simple Read

```js
export const readFile = async (keyName) => {
  const command = new GetObjectCommand({
    Bucket: 's3-es-labs',
    Key: 'hello-s3.txt',
  });
  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log(str);
  } catch (err) {
    console.error(err);
  }
}
```

### Read By Line

```js
const rl = readline.createInterface({
  input: s3ReadStream,
  terminal: false
});

let myReadPromise = new Promise((resolve, reject) => {
    rl.on('line', (line) => {
      console.log(`Line from file: ${line}`);
    });
    rl.on('error', () => {
        console.log('error');
        reject();
    });
    rl.on('close', function () {
        console.log('closed');
        resolve();
    });
});
```

