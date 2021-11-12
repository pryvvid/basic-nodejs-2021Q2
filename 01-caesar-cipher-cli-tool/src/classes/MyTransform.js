const { Transform } = require("stream");

class MyTransform extends Transform {
  constructor(action, shift, options) {
    super(options);
    this.action = action;
    this.shift = shift;
  }
  _transform(chunk, encoding, callback) {
    try {
      // console.log("Chunk to transform:", chunk.toString("utf8"));
      const resultString = this.action(chunk.toString("utf8"), this.shift);
      callback(null, resultString);
    } catch (err) {
      console.log("Transform error!");
      callback(err);
    }
  }
}

module.exports = { MyTransform };
