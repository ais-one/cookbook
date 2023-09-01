import fs from 'fs';

async function writeOneMillionTimes(writer, data, encoding, callback) {
  var i = 100000;
  writeWithDrain();
  function writeWithDrain() {
    var ok = true;
    do {
      i -= 1;
      if (i === 0) {
        // last time!
        writer.write(data, encoding, callback);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      console.log('drain', i)
      writer.once('drain', writeWithDrain);
    }
  }
  // await new Promise(r => setTimeout(r, 1));
  console.log('bb')
}

const writeX = (writer, data) => {
  return new Promise((resolve) => {
    if (!writer.write(data)) {
      console.log('drain')
      writer.once('drain', resolve)
    }
    else {
      resolve()
    }
  })
}

async function run() {
  const writeStream = fs.createWriteStream('business_data.csv', 'utf-8');
  console.log('aa')
  // await writeOneMillionTimes(writeStream, "abc@gmail.com\n");

  const max = 10000
  let current = 0
  while (current <= max) {
    current++
    await writeX(writeStream, "1abc@gmail.com\n");
  }

  console.log('cc')
}

run()
