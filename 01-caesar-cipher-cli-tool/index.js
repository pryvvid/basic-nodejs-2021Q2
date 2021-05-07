const fs = require('fs');
const path = require('path')
const argv = require('minimist')(process.argv.slice(2));
const { Readable, Writable, Transform } = require('stream');
const { encode, decode } = require('./cypher');


console.log(argv);

const action = argv.a || argv.action
const shift = argv.s || argv.shift
const inputPath = argv.i || argv.input
const outputPath = argv.o || argv.output

class EncodeTransform extends Transform {
  constructor(options) {
    super(options)
  }
  _transform(chunk, encoding, callback) {
    try {
      const resultString = encode(chunk.toString('utf8'), shift);

      callback(null, resultString);
    } catch (err) {
      callback(err);
    }
  }
}

class DecodeTransform extends Transform {
  constructor(options) {
    super(options)
  }
  _transform(chunk, encoding, callback) {
    try {
      const resultString = decode(chunk.toString('utf8'), shift);

      callback(null, resultString);
    } catch (err) {
      callback(err);
    }
  }
}

if (action && inputPath && outputPath) {

  const inputFilename = path.resolve(__dirname, inputPath)
  const readStream = fs.createReadStream(inputFilename, 'utf8')

  const outputFilename = path.resolve(__dirname, outputPath)
  const writeStream = fs.createWriteStream(outputFilename, 'utf8')

  const encodeTransform = new EncodeTransform();
  const decodeTransform = new DecodeTransform();

  switch (action) {
    case "encode":
      readStream.pipe(encodeTransform).pipe(writeStream);
      // readStream.on("data", (chunk) => { 
      //   writeStream.write(encode(chunk, shift));
      //   writeStream.end("\n")
      // });
      break;
    case "decode":
      readStream.pipe(decodeTransform).pipe(writeStream);
      // readStream.on("data", (chunk) => { 
      //   writeStream.write(decode(chunk, shift));
      //   writeStream.end("\n")
      // });
      break;
    default:
      return process.stderr.write("No such action")
  }
} else if (action) {
    // const readStream = fs.createReadStream(process.stdin, 'utf8')
    // const writeStream = fs.createWriteStream(process.stdout, 'utf8')

    // const encodeTransform = new EncodeTransform();
    // const decodeTransform = new DecodeTransform();

    const readable = process.stdin;

    switch (action) {
      case "encode":
        

        // 'readable' may be triggered multiple times as data is buffered in
        readable.on('readable', () => {
          let chunk;
          // Use a loop to make sure we read all currently available data
          while (null !== (chunk = readable.read())) {
            console.log(encode(chunk.toString(), shift));
          }
        });

        // 'end' will be triggered once when there is no more data available
        readable.on('end', () => {
          console.log('Reached end of stream.');
        });
        break;
      case "decode":
        // 'readable' may be triggered multiple times as data is buffered in
        readable.on('readable', () => {
          let chunk;
          // Use a loop to make sure we read all currently available data
          while (null !== (chunk = readable.read())) {
            console.log(decode(chunk.toString(), shift));
          }
        });

        // 'end' will be triggered once when there is no more data available
        readable.on('end', () => {
          console.log('Reached end of stream.');
        });
        break;
      default:
        return process.stderr.write("No such action")
    }

} else {
  return process.stderr.write("No required arguments")
}

// class CypherReader extends Readable {
//   constructor(opt) {
//     super(opt);
//   }

//   _read() {

//       const buf = Buffer.from(`${this._index}`, 'utf8');

//       this.push(buf);
//     }
//   }
// }

// class CypherWriter extends Writable {
//   _write(chunk, encoding, callback) {
//     console.log(chunk.toString());

//     callback();
//   }
// }



// const cypherReader = new CypherReader({ highWaterMark: 2 });
// const cypherWriter = new CypherWriter({ highWaterMark: 2 });



