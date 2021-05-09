const fs = require('fs');
const path = require('path')
const { Transform, pipeline } = require('stream');
const { program } = require('commander');

const { encode, decode } = require('./cypher');
program.version('0.0.1');

const app = () => {
  let action = null;
  let shift = null;
  let inputPath = null;
  let outputPath = null;

  program
  .requiredOption('-a, --action <type>', 'encode or decode')
  .requiredOption('-s, --shift <number>', 'shift integer')
  .option('-i, --input <path>', 'input file path')
  .option('-o, --output <path>', 'output file path');

  program.parse(process.argv);

  const options = program.opts();
  if (options.action) {
    action = options.action;
  }
  if (options.shift) {
    shift = parseInt(options.shift, 10);
    if (isNaN(shift) || options.shift != shift) {
      process.stderr.write("Shift must be an integer");
      process.exit(1)
    }
  }
  if (options.input) {
    inputPath = options.input;
  }
  if (options.output) {
    outputPath = options.output
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

  if (action && inputPath && outputPath) {

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
            console.log("The file was successfully decoded")
          }
        })
        break;
      default:
        return process.stderr.write("No such action. Only 'encode' and 'decode' are supported.")
    }
  } else if (action && inputPath) {
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
              console.log("The file was successfully decoded")
            }
          })
          break;
        default:
          return process.stderr.write("No such action. Only 'encode' and 'decode' are supported.")
      }
  
  } else if (action && outputPath) {

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

  } else if (action) {

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


