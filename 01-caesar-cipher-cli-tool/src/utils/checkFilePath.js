const { existsSync } = require("fs");

const checkFilePath = (filePath) => {
  try {
    if (!existsSync(filePath)) {
      process.stderr.write(
        `Can't open file at path ${filePath}\nPlease check the path`
      );
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { checkFilePath };
