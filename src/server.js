const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

// create the multer object, defining a filter for file extension and storage rules
const upload = multer({
  // verify file extension (this doesn't protect against fake extensions!)
  fileFilter: (req, file, cb) => {
    if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
      return cb(new Error('File type not supported!'), false);
    }
    cb(null, true);
  },
  // define storage rules using multerS3
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
      const extension = file.mimetype.split('/').pop();
      cb(null, `products/${Date.now().toString()}.${extension}`);
    }
  })
}).single('file');

// Define POST route
app.post('/test-upload', (request, response) => {
  upload(request, response, error => {
    if (error) {
      return response.status(400).send(error);
    }
    return response.status(200).send(request.file);
  });
});

app.listen(process.env.PORT || 9000);
console.log('Server up and running...');
