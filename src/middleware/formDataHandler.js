require('dotenv').config({ path: `${process.cwd()}/.env` });
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage });

const formDataFields = fields => upload.fields(fields);

module.exports = formDataFields;
