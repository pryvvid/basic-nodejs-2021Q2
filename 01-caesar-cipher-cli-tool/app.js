const fs = require('fs');
const path = require('path')
const argv = require('minimist')(process.argv.slice(2));
const { Readable, Writable, Transform, pipeline } = require('stream');
const { encode, decode } = require('./cypher');


const app = () => {
  const action = argv.a || argv.action
  const shift = argv.s || argv.shift
  const inputPath = argv.i || argv.input
  const outputPath = argv.o || argv.output

  if (shift !== parseInt(shift)) {
    process.stderr.write(`Shift must be an integer`)
    process.exit(1)
  }

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

  if (action && shift && inputPath && outputPath) {

    const inputFilename = path.resolve(__dirname, inputPath)
    const readStream = fs.createReadStream(inputFilename)

    const outputFilename = path.resolve(__dirname, outputPath)
    const writeStream = fs.createWriteStream(outputFilename, {flags: 'a'})

    const encodeTransform = new EncodeTransform();
    const decodeTransform = new DecodeTransform();

    readStream.on('error', (error) => {
      process.stderr.write(`Can't open file at path ${inputFilename}\nPlease check the path`)
      process.exit(1)
    })

    switch (action) {
      case "encode":
        pipeline(readStream, encodeTransform, writeStream, (e) => {
          if (e) {
            process.stderr.write(e)
            process.exit(1)
          } else {
            console.log("The file was successfully encoded")
          }
        })
        break;
      case "decode":
        pipeline(readStream, decodeTransform, writeStream, (e) => {
          if (e) {
            process.stderr.write(e)
            process.exit(1)
          } else {
            console.log("The file was successfully encoded")
          }
        })
        break;
      default:
        return process.stderr.write("No such action. Only 'encode' and 'decode' are supported.")
    }
  } else if (action && shift && inputPath) {
      const inputFilename = path.resolve(__dirname, inputPath)
      const readStream = fs.createReadStream(inputFilename)

      const encodeTransform = new EncodeTransform();
      const decodeTransform = new DecodeTransform();

      readStream.on('error', (error) => {
        process.stderr.write(`Can't open file at path ${inputFilename}\nPlease check the path`)
        process.exit(1)
      })

      switch (action) {
        case "encode":
          pipeline(readStream, encodeTransform, process.stdout, (e) => {
            if (e) {
              process.stderr.write(e)
              process.exit(1)
            } else {
              console.log("The file was successfully encoded")
            }
          })
          break;
        case "decode":
          pipeline(readStream, decodeTransform, process.stdout, (e) => {
            if (e) {
              process.stderr.write(e)
              process.exit(1)
            } else {
              console.log("The file was successfully encoded")
            }
          })
          break;
        default:
          return process.stderr.write("No such action. Only 'encode' and 'decode' are supported.")
      }
  
  } else if (action && shift && outputPath) {

    const outputFilename = path.resolve(__dirname, outputPath)
    const writeStream = fs.createWriteStream(outputFilename, {flags: 'a'})

    const readable = process.stdin;

      switch (action) {
        case "encode":
          
          readable.on('readable', () => {
            let chunk;
            while (null !== (chunk = readable.read())) {
              writeStream.write(encode(chunk.toString(), shift));
              
            }
          });

          readable.on('end', () => {
            console.log('Reached end of stream.');
          });
          break;
        case "decode":
          
          readable.on('readable', () => {
            let chunk;
            
            while (null !== (chunk = readable.read())) {
              writeStream.write(decode(chunk.toString(), shift));
            }
          });

          readable.on('end', () => {
            console.log('Reached end of stream.');
          });
          break;
        default:
          return process.stderr.write("No such action. Only 'encode' and 'decode' are supported.")
      }

  } else if (action && shift) {

      const encodeTransform = new EncodeTransform();
      const decodeTransform = new DecodeTransform();

      const readable = process.stdin;

      switch (action) {
        case "encode":
          
          readable.on('readable', () => {
            let chunk;
            while (null !== (chunk = readable.read())) {
              process.stdout.write(encode(chunk.toString(), shift));
              
            }
          });

          readable.on('end', () => {
            console.log('Reached end of stream.');
          });
          break;
        case "decode":
          
          readable.on('readable', () => {
            let chunk;
            
            while (null !== (chunk = readable.read())) {
              process.stdout.write(decode(chunk.toString(), shift));
            }
          });

          readable.on('end', () => {
            console.log('Reached end of stream.');
          });
          break;
        default:
          return process.stderr.write("No such action. Only 'encode' and 'decode' are supported.")
      }

  } else {
    return process.stderr.write("No required arguments")
  }

}

module.exports = app;


