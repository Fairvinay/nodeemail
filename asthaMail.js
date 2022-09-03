
const msg = require("./astha")

var nodemailer = require('nodemailer');
var https = require('https');
var http = require('http');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



let isRenameDone=false;
const sendAsthaMail = (user, req, res, callback) => {
  const transporter = nodemailer.createTransport({
      host : "smtp.elasticemail.com",
	    port: 2525,
	  auth: { 
	  user : "vinayak.anvekar@hexaware.com",
	  pass : "8CE9F9B8B2F30D20F36E6B38B6662FA33EE1"
	  }
	
  });
  console.log("Email attachment name "+JSON.stringify(req.file));
  fs.rename(req.file.path, 'uploads/'+req.file.originalname, () => {
			console.log("\nFile Renamed!\n");
         isRenameDone=true;
   });
   var i = 0;
   readline.cursorTo(process.stdout, 0, 0)
  // readline.clearScreenDown(process.stdout);
  var check_spinner = {}
    const render_spinner = (check_spinner, message, i = 1) => {
         const spinner = '|/-\\';
      
         process.stdout.write('\r');
         readline.clearLine(process.stdout, 1);
         readline.cursorTo(process.stdout, 0);
      
         process.stdout.write(`${(spinner[i])} ${message}`);
      
         check_spinner.stop = setTimeout(() => {
         i++;
         render_spinner(check_spinner, message, i % spinner.length);
         }, 100);
      }
   while( true && !isRenameDone)
   { 
     // console.log(" renaming the file ...."+(i++));
     //  process.stdout.write("renaming the file ...."+(i++));
     render_spinner(check_spinner, "renaming the file ....");
      
   }
   rl.close();
   console.log("emailContent "+msg.emailContent)

   var emailContent = "  " +
   " Hello Karan, " + 
    "  Name: Vinayak Anvekar  " + 
    "  Official Email: vinayak.anvekar@lntinfotech.com  " + 
    "  Personal Email: vickyscab24@gmail.com  " + 
    "  Personal Email: vickyscab24@gmail.com  " + 
    "  As per our discussion past 6 months, and the current COVID situation. Can you ensure:  " + 

   "  In case of Job loss or unable to get/perform job(customer as in me) would be provided employment at our investments company  " + 
    "   Look forward to your response and affirmation, Attached is the Job Profile and other documents.  ";
   
   
   var files = [  'PanCard-pdf.pdf', '10684924_Payslip_Aug.pdf' , '10684924_Payslip_oct.pdf', '10684924_Payslip_Sep.pdf' ]
   console.log('files '+JSON.stringify(files))
   const mailOptions = {
	  from: 'vickyscab24@gmail.com',
	  to:  'vickyscab24@gmail.com',//'vinayak.anvekar@lntinfotech.com',
	  subject: 'Profile for Angular/ React JS  / AWS Developer ',
      text : msg.emailContent	,
      attachments: [{
         filename: req.file.originalname,
         path: 'uploads/'+req.file.originalname	
      },
      {
        filename: files[0],
        path: 'uploads/'+files[0]	
     }, 
     {
        filename: files[1],
        path: 'uploads/'+files[1]	
     }, 
     {
        filename: files[2],
        path: 'uploads/'+files[2]	
     }, 
     {
        filename: files[3],
        path: 'uploads/'+files[3]	
     }, 
     ]
	  
	};
 
   transporter.sendMail(mailOptions, callback);

}

module.exports = sendAsthaMail;