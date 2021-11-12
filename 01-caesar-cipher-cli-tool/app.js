const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { program } = require("commander");
const { MyTransform } = require("./src/classes/MyTransform");

const { encode, decode } = require("./src/utils/cypher");
const { checkFilePath } = require("./src/utils/checkFilePath");
program.version("0.0.1");

const app = () => {
  let action = null;
  let shift = null;
  let inputPath = null;
  let outputPath = null;
  let inputFilename;
  let outputFilename;
  let readStream;
  let writeStream;

  program
    .requiredOption("-a, --action <type>", "encode or decode")
    .requiredOption("-s, --shift <number>", "shift integer")
    .option("-i, --input <path>", "input file path")
    .option("-o, --output <path>", "output file path");

  program.parse(process.argv);

  const options = program.opts();
  if (options.action) {
    action = options.action;
    if (!["encode", "decode"].includes(action)) {
      process.stderr.write("Action must be 'encode' or 'decode'");
      process.exit(1);
    }
  }
  if (options.shift) {
    shift = parseInt(options.shift, 10);
    if (isNaN(shift) || options.shift != shift) {
      process.stderr.write("Shift must be an integer");
      process.exit(1);
    }
  }
  if (options.input) {
    inputPath = options.input;
    inputFilename = path.resolve(__dirname, inputPath);
    checkFilePath(inputFilename);
    // console.log(inputFilename);
    readStream = fs.createReadStream(inputFilename);
    readStream.on("error", (error) => {
      process.stderr.write(`Error occured. ${error.message}`);
      process.exit(1);
    });
  }
  if (options.output) {
    outputPath = options.output;
    outputFilename = path.resolve(__dirname, outputPath);
    checkFilePath(outputFilename);
    // console.log(outputFilename);
    writeStream = fs.createWriteStream(outputFilename, { flags: "a" });
    writeStream.on("error", (error) => {
      process.stderr.write(`Error occured. ${error.message}`);
      process.exit(1);
    });
  }

  // console.log("Action", action);
  // console.log("Shift", shift);
  // console.log("Input path", inputPath);
  // console.log("Output path", outputPath);

  pipeline(
    inputFilename ? readStream : process.stdin,
    action === "encode"
      ? new MyTransform(encode, shift)
      : new MyTransform(decode, shift),
    outputFilename ? writeStream : process.stdout,
    (e) => {
      if (e) {
        process.stderr.write(e);
        process.exit(1);
      } else {
        console.log(`The file was successfully ${action}d`);
      }
    }
  );
};

module.exports = app;
