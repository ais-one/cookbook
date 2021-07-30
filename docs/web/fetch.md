# Fetch API Notes

## Progress Indicators

https://stackoverflow.com/questions/35711724/upload-progress-indicators-for-fetch

```js
const response = await fetch(url);
const total = Number(response.headers.get('content-length'));
const reader = response.body.getReader();
let bytesReceived = 0;
while (true) {
    const result = await reader.read();
    if (result.done) {
        console.log('Fetch complete');
        break;
    }
    bytesReceived += result.value.length;
    console.log('Received', bytesReceived, 'bytes of data so far');
}
```

## Credentials

1. ES6 fetch()

```
credentials: 'include'
```

3. axios / XMLHttpRequest

```
withCredentials: true
```

3. jQuery 1.5.1

```
xhrFields: { withCredentials: true }
```

## Streams

https://jakearchibald.com/2016/streams-ftw/

```js
// fetch() returns a promise that
// resolves once headers have been received
fetch(url).then((response) => {
  // response.body is a readable stream.
  // Calling getReader() gives us exclusive access to
  // the stream's content
  var reader = response.body.getReader();
  var bytesReceived = 0;
  // read() returns a promise that resolves
  // when a value has been received
  return reader.read().then(function processResult(result) {
    // Result objects contain two properties:
    // done  - true if the stream has already given
    //         you all its data.
    // value - some data. Always undefined when
    //         done is true.
    if (result.done) {
      console.log('Fetch complete');
      return;
    }
    // result.value for fetch streams is a Uint8Array
    bytesReceived += result.value.length;
    console.log('Received', bytesReceived, 'bytes of data so far');
    // Read some more, and call this function again
    return reader.read().then(processResult);
  });
});
```

result.value is whatever the creator of the stream provides, which can be anything: a string, number, date, ImageData, DOM element… but in the case of a fetch stream it's always a Uint8Array of binary data. The whole response is each Uint8Array joined together. If you want the response as text, you can use TextDecoder:

```js
var decoder = new TextDecoder();
var reader = response.body.getReader();
// read() returns a promise that resolves
// when a value has been received
reader.read().then(function processResult(result) {
  if (result.done) return;
  console.log(decoder.decode(result.value, { stream: true }));
  // Read some more, and recall this function
  return reader.read().then(processResult);
});
```

## Streams

https://github.com/AnthumChris/fetch-progress-indicators

https://fetch-progress.anthum.com/fetch-enhanced/

