var btoa = require('btoa');
var express = require('express')
const path2 = require('path');

module.exports.renderEmailMessage = function ( app , ejs , path , res, msgHeader ,cnt ) {
  var appR =  app;
  appR.set("view engine", "ejs");
 // appR.use('/images', express.static('images'));
 var emailTemplate ="";
 var bas64 = btoa(cnt);
 console.log(" Render Email Messages")
 console.log(" Content ",bas64)
ejs
.renderFile(path2.join(__dirname, "views/email-message.ejs"),
{
  subjectMail: msgHeader.subject ,
  fromMail: msgHeader.from,
  toMail : msgHeader.to,
  dateMail : msgHeader.date,
  contentMail : bas64
})
.then(result => {
  emailTemplate = result; 
  res.send(emailTemplate);
})
.catch(err => {
  res.status(400).json({
      message: "Error Rendering Message HEader",
      error: err
    });
  });

}