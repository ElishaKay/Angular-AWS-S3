var dotenv = require('dotenv').config();
const express = require('express');
const app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, '/')));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/s3creds',function(req,res){
    s3 = {};
    s3.region = process.env.REGION;
    s3.accessKeyId = process.env.ACCESSKEYID;
    s3.secretAccessKey = process.env.SECRETACCESSKEY;
    s3.bucket = process.env.BUCKET;
    s3.region = 'eu-central-1';
    res.json(s3); 
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));