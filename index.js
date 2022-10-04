 const express = require('express');

 const multer = require('multer')

 const fs = require('fs')
 
 const tesseract = require("node-tesseract-ocr")

 const path = require('path')

 const app = express();
 var flag = false;

 app.use(express.static(path.join(__dirname + '/uploads')))
 app.use(express.static("public"))
 app.use(express.static(__dirname + '/main')); //for main js added later

//  app.use(express.static(path.join(__dirname + '/uploads')))

  var storage = multer.diskStorage({
     destination: function(req,file,cb){
         cb(null,"uploads");
     },
     filename: function(req,file,cb){
         cb(
             null,
             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
         );
     },
 });

 const upload = multer({storage:storage})

 app.set('view engine',"ejs");
 
 app.get('/',(req,res)=>{
    res.render('index',{data:''});
});

app.post('/extracttextfromimage', upload.single('file'),(req,res)=>{
    console.log(req.file.path)
    flag=true; //for download
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
      }
      
      tesseract
        .recognize(req.file.path, config)
        .then((text) => {
          console.log("Result:", text);
          res.render('index', {data:text});
//creating text file later added for download
          try {
            fs.writeFileSync('./download.txt', text);
            console.log("file written successfully");
          } catch (err) {
            console.error(err);
          }

        })
        .catch((error) => {
          console.log(error.message)
        })

        // document.querySelector("#download").style.display='';
});

//for download 
app.get("/download", (req,res)=>{
 if(flag){
  res.download("./download.txt");
 }else {
  console.log("file not converted");
 }
});


 app.listen(5000,()=>{
     console.log("App is listening on port 5000");
 });
