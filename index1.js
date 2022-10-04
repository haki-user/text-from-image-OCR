//index.js file
const Tesseract= require('tesseract.js');
Tesseract.recognize(
// this first argument is for the location of an image it can be a //url like below or you can set a local path in your computer
'8.png',
// this second argument is for the laguage 
'eng',
{ logger: m => console.log(m) }
).then(({ data: { text } }) => {
console.log(text);
})