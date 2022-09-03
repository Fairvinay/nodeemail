/*https://www.tutsmake.com/node-js-send-email-through-gmail-with-attachment-example/

# https://pretagteam.com/question/send-email-from-angular-application-with-attachment
https://stackoverflow.com/questions/41406699/ssl-in-node-using-godaddy-certificates-using-key-and-crt-files
https://stackoverflow.com/questions/37040709/load-certificate-and-private-key-for-ssl-in-node-js	

https://support.google.com/mail/thread/4189258/settings-accounts-can-t-bring-over-gmail-account-without-error-messg?hl=en

https://mailtrap.io/blog/angular-send-email/
https://mailtrap.io/blog/sending-emails-with-nodemailer/

https://medium.com/@petehouston/upload-files-with-curl-93064dcccc76

Used this 
https://stackoverflow.com/questions/54023384/error-downloading-file-to-server-using-multer-node-js

http://welllin.net/responsive-html-email-with-nodejs-using-sendgrid-ink-yeoman-and-express/

https://edigleyssonsilva.medium.com/how-to-send-emails-securely-using-gmail-and-nodejs-eef757525324
https://youtu.be/U4ftsqSt81w

bootstrap in node js 
https://dev.to/bam92/how-to-add-bootstrap-to-your-nodejs-project-ngc

npm install express-generator -g
*/
var express = require('express')
var multer = require('multer')
const cors = require("cors");
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
var https = require('https');
var http = require('http');
var ejs = require('ejs');
var path = require('path');
/*const BootstrapEmail = require('bootstrap-email');

const template = new BootstrapEmail('ashta.html');
template.compileAndSave('<absolute-path-to-output>.html');
*/
//import * as Email  from './smtp/smtp.js'; //file path may change → 
//declare let Email: any;

const Email =require('./smtp/smtp.js');

const indexJS =require('./gmailreader/index.js');

const readEmailMsg =  require('./email-render.js').renderEmailMessage;

//const sendAsthaMail = require("./asthaMail")

const fs = require('fs');

var privateKey  = fs.readFileSync('ssl.key/server.key', 'utf8');
var certificate = fs.readFileSync('ssl.crt/server.crt', 'utf8');


var mail = nodemailer.createTransport({
  service: 'gmail',
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
  auth: {
    user: 'vickyscab24@gmail.com',
    pass: 'lutherking1'
  }
});

var upload = multer({
   dest: 'uploads/'
})

var credentials = {key: privateKey, cert: certificate};

var app = express()
//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({origin: "*" }));
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({extended :false})


//start application server on port 3000
/*var options = {
    key: fs.readFileSync('ssl.key/server.key'),
    cert: fs.readFileSync('ssl.crt/server.crt')
};
https.createServer(options,app.listen(3000, () => {
  console.log("The SSL server started on port 3000");
}) );

*/

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

/*

urlencodedParser

code=4/0AX4XfWhW67thoHrQH9TULy-gbNZYo8iNHrhe-o1SjTSh9bjcBoZs3An04pBpLP_oLtwlrQ
&scope=https://www.googleapis.com/auth/gmail.readonly
*/
new Promise ((rev , rej) => { 
  try { 
    rev(readMailOuts('message') )
 } catch(e ) {
   console.log("e ",e)
   rej("Failed ReadOuts ")
 } 
} )
.then( () => {
 console.log(" read Mail out done ")
 // process.exit(0);
}
);

app.get('/getEmail',urlencodedParser , function(req, res) {
  new Promise ( (resv , rej ) => { 

          resv( indexJS.read()); 
  } ).then(() => {
    setTimeout( function () { 
      var bContent = ""
      var hContent = ""
      var html = ""
      const filesOutdata = [] ;  
      const filesList = readMailOuts('mailout');
       filesList.forEach ( (x) => { 
          
          filesOutdata.push(fs.readFileSync(x.name,  {encoding:'utf8', flag:'r'},));

       }); 
       const filesHeaddata = [] ; 
       const filesHeadList  = readMailOuts('message');
       filesHeadList.forEach( (x) => {
        filesHeaddata.push (fs.readFileSync('message.json',  {encoding:'utf8', flag:'r'}));
       })
      //const fHeaddata =  fs.readFileSync('message.json',  {encoding:'utf8', flag:'r'});

      if(!filesOutdata[0] && !filesHeaddata[0] ){
        console.log("wating for the data ...... ")

        setTimeout( function () { console.log("Waiting to process Fout and FHead  ..."); } , 2000);
      }
      else { 
        console.log("files message header and body content read ...... ")
      }
      var msgHeader = JSON.parse(filesHeaddata[0])
      app.set("view engine", "ejs");
      app.use('/images', express.static('images'));
      app.use('/css', express.static('css'));
      readEmailMsg(app, ejs, path, res, msgHeader, filesOutdata[0])
      console.log("read HTML "+filesHeaddata[0] + filesOutdata[0])
    
        
       },  10000);
  })
 
 
  console.log("wait reading the emails ......")


});
function readMailOuts(fileNameStr) {
  var dir = __dirname;
  var results= { name : "" , time : 3};
  var sortArray = [];
  console.log("readMailouts .....",dir)
  const dirPath = fs.readdirSync(dir);
   fs.readdirSync(dir).forEach(function (dirContentIn) {

    dirContent = path.resolve(dir, dirContentIn);
   
     if (fs.statSync(dirContent).isFile()) {
      if (dirContent.includes(fileNameStr)) {
        console.log(" is file ....  "+dirContent)
        var time  =  fs.statSync(dirContent).mtime.getTime()
         var files ="" ;
         var mailOutEnt = Object.create(results); 
         mailOutEnt.name = dirContent; 
         mailOutEnt.time = time;
         
          sortArray.push(mailOutEnt)
         
  
      }
    }
  });
  if(sortArray.length !=0){
   // sortArray.push(mailOutEnt)
   files =  sortArray.sort(function(a, b) {
     return a.time - b.time;
     })
     .map(function(v) {
       return v.name;
     });
     console.log("files read sorted .....")
     files.forEach((x) => console.log("file "+x));
     sortArray = files;
  }
  else { 
    console.log("files read 0.....")
  }
 return sortArray;
  /*  fs.readdir(dir, function(err, files) {
      console.log(" files readdir ....  ")
      
    })
    */
    
  //results.forEach((x) => console.log("file "+x));
};

app.post('/',urlencodedParser , function(req, res) {
  var response = {
      data: req.body
  };
  const code = req.query.code;
  const scope = req.query.scope;
  
  
  console.log('Response : ' + response);

  var htmlTemplate = {
    titile: "<div style='margin: 0 auto' > Your Gmail Code </div>",
    para1: "<p> ",
    code: "BLANK ",
    para1End:"</p>",
    para2: "<p> ",
    scope: "BLANK ",
    paraEnd2:"</p>",
    print:  () => {
      return this.title+this.para1+this.code+this.para1End+this.para2+this.scope+this.paraEnd2;
    }
  };
 /* if (code ) 
  htmlTemplate =   {
       titile: "<div style='margin: 0 auto' > Your Gmail Code </div>",
       para1: "<p> ",
       code: " "+code,
       para1End:"</p>",
       para2: "<p> ",
       scope: " "+scope,
       paraEnd2:"</p>"

  }
  else {
    htmlTemplate = 
  }*/
            
  res.send( htmlTemplate.print)
 
})

var handleError = (err) => { 
  console.log("Inside handle Error");
  if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      
      console.log("Email has been sent");
      res.send(info);
    }
}
app.post('/asthamail',upload.single('file'), function(req, res) {
  console.log("request came");
  let user = req.body;
  sendAsthaMail(user , req, res , (err, info) => {
   
  });

})

app.get('/readNext',urlencodedParser , function(req, res) {
  var response = {
      data: req.body
  };
  const code = req.query.code;
  const scope = req.query.scope;


  });


app.get('/',urlencodedParser , function(req, res) {
  var response = {
      data: req.body
  };
  const code = req.query.code;
  const scope = req.query.scope;
  
  
  console.log('Response : ' + response);

  var htmlTemplate = {
    titile: "<div style='margin: 0 auto' > Your Gmail Code </div>",
    para1: "<p> ",
    code: "BLANK ",
    para1End:"</p>",
    para2: "<p> ",
    scope: "BLANK ",
    paraEnd2:"</p>",
    print:  () => {
      return this.title+this.para1+this.code+this.para1End+this.para2+this.scope+this.paraEnd2;
    }
  };
 /* if (code ) 
  htmlTemplate =   {
       titile: "<div style='margin: 0 auto' > Your Gmail Code </div>",
       para1: "<p> ",
       code: " "+code,
       para1End:"</p>",
       para2: "<p> ",
       scope: " "+scope,
       paraEnd2:"</p>"

  }
  else {
    htmlTemplate = 
  }*/
            
  res.send( htmlTemplate.print)
 
})

app.post('/uploadfile', upload.single('profile'), function(req, res) {
   var mailOptions = {
      from: 'vickyscab24@gmail.com',
	  to: 'vinayak.anvekar@lntinfotech.com',
	  subject: 'Sending Email via Node.js',
	  text: 'That was easy',
      attachments: [{
         filename: req.file.filename,
         path: req.file.path	
      }]
   };
   
   mail.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			console.log('Email sent: ' + info.response);
		  }
	});
   
})




app.post('/sendmail',upload.single('file'), function(req, res) {
	
	
	console.log("request came");
  let user = req.body;
  sendMail(user , req, res , (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
	  
      console.log("Email has been sent");
      res.send(info);
    }
  });
   var mailOptions = {
	    host: "smtp.mailtrap.io",
	  port: 2525,
	  auth: {
		user: "807ea472d9f432",
		pass: "26d8e32c2650a1"
	  }
    
   };
   
   mail.sendMail(mailOptions, function(error, info){
		  if (error) {
			console.log(error);
		  } else {
			console.log('Email sent: ' + info.response);
		  }
	});
   
})

const sendMail = (user, req, res, callback) => {
  const transporter = nodemailer.createTransport({
    /*host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
     user: 'vickyscab24@gmail.com',
     pass: 'lutherking1'
    }*/
	/* host: "smtp.mailtrap.io",
	  port: 2525,
	  auth: {
		user: "807ea472d9f432",
		pass: "26d8e32c2650a1"
	  }
	  */
	  host : "smtp.elasticemail.com",
	    port: 2525,
	  auth: { 
	  user : "vinayak.anvekar@hexaware.com",
	  pass : "8CE9F9B8B2F30D20F36E6B38B6662FA33EE1"
	  }
	
  });
      
    console.log("  email "+JSON.stringify(Email) );
	
	var sing = { play: function(e) { console.log("playing song"); } };
	
	sing.play();
	function myDisplayer(some) {
			console.log(" "+ some);;
	}
	Email.play();
	console.log("Email attachment name "+JSON.stringify(req.file));
	fs.rename(req.file.path, 'uploads/'+req.file.originalname, () => {
			console.log("\nFile Renamed!\n");
   
			// List all the filenames after renaming
			//getCurrentFilenames();
		});
	
	/*
	let myPromise =   Email.send({
		Host :"smtp.elasticemail.com",
		Username : "vinayak.anvekar@hexaware.com",
		Password : "8CE9F9B8B2F30D20F36E6B38B6662FA33EE1",
		To : "vinayak.anvekar@lntinfotech.com",
		From :"vinayak.anvekar@hexaware.com",
		Subject : "Good Time",
		Body : "<i>This is sent as a feedback from my resume page.</i> <br/> <b>Name: </b> Vinay <br /> <b>Email: </b>ea@adf.com <br />"+
		"<b>Subject: </b>Hello <br /> <b>Message:</b> <br /> Hi  <br><br> <b>~End of Message.</b> "
		});
	
	  myPromise.then( 
			 function(value) {myDisplayer(value);},
			 function(error) {myDisplayer(error);
					console.log("aclling Email.send as Proomise");
			}
		   );
		*/
  const mailOptions = {
	 
	  from: 'vickyscab24@gmail.com',
	  to:  'vickyscab24@gmail.com',//'vinayak.anvekar@lntinfotech.com',
	  subject: 'Profile for Front-End / AWS Developer ',
	  Body : "<i>Hello Ulhas, </i> <br/>  <p> sending the profile, please refer for the Fronet </p><b>Name: </b> Vinay <br /> <b>Email: </b>vickyscab24@gmail.com <br />"+
		"<b>Subject: </b>Profile  <br /> <b>Message:</b> <br /> Hi  <br><br> <b> .</b> "		,
      attachments: [{
         filename: req.file.originalname,
         path: 'uploads/'+req.file.originalname	
      },
      
    
    ]
	  
	};

   transporter.sendMail(mailOptions, callback);
   // console.log("Email attachment name "+req.file.filename);
}
/************************* EEXPRESSS SETIING the VIEW ENNINGE ************ */
//Notice //set express view engine to ejs
app.set("view engine", "ejs");
const  recepientPersonEmail ="vickyscab24@gmail.com";

const requesterName = "Vinayak Anvekar"; 
const recepientName = "Karan";
const recepientOfcEmail = "vinayak.anvekar@lntinfotech.com";
const requesterDesig = "Angular UX - Developer";
app.use('/images', express.static('images'));
app.get("/hello", (req, res, next) => {
  let emailTemplate;
  let capitalizedFirstName = "John";
  let userEmail = "John@example.com";
  var html =  fs.readFile('mailout.html', (err, content) => {
    res.send(" on HTTPS and working ");
  });
});

/********* START SERVER    *********/ 
httpServer.listen(8080, () => {
  console.log("The server started on port 8080");
});
httpsServer.listen(8443, () => {
  console.log("The HTTP SSL server started on port 8443");
});




  process.on("uncaughtException", (err) => {
	  console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
	  console.log(err.message, err.name);
      process.exit(1);
  });
/***********************************SEND EMAIL with ATTAcHEMENT ***************** */


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
         let emailTemplate;
         ejs
         .renderFile(path.join(__dirname, "views/welcome-mail.ejs"),
         {
         
           requesterName : "Vinayak Anvekar",
           recepientName : "Sanket",
           recepientOfcEmail : "vinayak.anvekar@lntinfotech.com",
           recepientPersonEmail : "vickyscab24@gmail.com",
           requesterDesig : "Angular UX - Developer"
         })
         .then(result => {
           emailTemplate = result;
           const mailOptions = {
            from: 'vickyscab24@gmail.com',
            to:  'sanket.w9@gmail.com',//'vinayak.anvekar@lntinfotech.com',
            subject: 'Hello Sanket - Vinayak sending profile (Angular/ React JS  / AWS Developer) ',
              html : emailTemplate,
              attachments: [{
                 filename: req.file.originalname,
                 path: 'uploads/'+req.file.originalname	
              },
           /*   {
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
             }, */
             ]
            
          };
         
           transporter.sendMail(mailOptions, callback);

          // res.send(emailTemplate);
         })

   });
   

}



/******************SEND EMMAIL with ATTACHEMENT ****************** */

/*

curl -X POST http://localhost:3000/sendmail

karan
npm i googleapis cheerio mailparser js-base64 open

Your Client Secret
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
Your Client ID
396135579027-b4gvu1u72l9lhhvov29eild52emov1ak.apps.googleusercontent.com




submit() {
   if (this.EmailForm.valid) {
      this.eServ.sendEmail(this.EmailForm.getRawValue()).subscribe(result => {
         console.log("Email sent!");
      });
      this.ref.close(this.EmailForm.getRawValue())
   }
}

 attachments: [{   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
        },
        {   // binary buffer as an attachment
            filename: 'text2.txt',
            content: new Buffer('hello world!','utf-8')
        },
        {   // file on disk as an attachment
            filename: 'text3.txt',
            path: '/path/to/file.txt' // stream this file
        },
        {   // filename and content type is derived from path
            path: '/path/to/file.txt'
        },
        {   // stream as an attachment
            filename: 'text4.txt',
            content: fs.createReadStream('file.txt')
        },
        {   // define custom content type for the attachment
            filename: 'text.bin',
            content: 'hello world!',
            contentType: 'text/plain'
        },
        {   // use URL as an attachment
            filename: 'license.txt',
            path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
        },
        {   // encoded string as an attachment
            filename: 'text1.txt',
            content: 'aGVsbG8gd29ybGQh',
            encoding: 'base64'
        },
        {   // data uri as an attachment
            path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        }
    ]






*/
