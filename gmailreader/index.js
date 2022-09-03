const fs = require('fs');
const readline = require('readline');
console.log(" index js ...execution ")
const { google }= require('googleapis');
const cheerio = require('cheerio');
var btoa = require('btoa');

const { PriorityQueue , QElement}  = require('../models/PriorityQueue');
//const mailparser = require('mailparser');
const MailParser = require('mailparser').MailParser;

const { base64encode, base64decode } = require('nodejs-base64');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']; //['https://www.googleapis.com/auth/gmail.readonly , modify'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
// HeaderType enums can be grouped as static members of a class
class HeaderType {
  // Create new instances of the same class as static attributes
  static Subject = new HeaderType("Subject")
  static To = new HeaderType("To")
  static From = new HeaderType("From")
  static Date = new HeaderType("Date")

  constructor(name) {
    this.name = name
  }
}
function messageHeader () { 
this.subject= '', 
this.from= '', 
this.to= '',  
this.date = ''
 
    return { subject: (name) => {
      this.subject =name;
    },
    getSubject: () => {
      return this.subject ;
    },
    to: (name) => {
      this.to =name;
    },
    getTo: () => {
      return this.to ;
    },
    from: (name) => {
      this.from =name;
    },
    getFrom: () => {
      return this.from ;
    },
    date: (name) => {
      this.date =name;
    },
    getDate: () => {
      return this.date ;
    },
    toString: function () { 
         return " { 'subject':"+this.subject+", 'from':"+this.from+",'to':"+this.to+",'date':"+this.date+"}";
    }
   }
};
var r = new  messageHeader();
r.subject = 10;
/*
messageHeader.prototype.subject = function(v)  { this.subject = v; };
get subject() {
  return this.subject;
},
set from(v)  { this.from = v; },
get from() {
  return this.from;
},
set to(v)  { this.to = v; },
get to() {
  return this.to;
},
set date(v)  { this.date = v; },
get date() {
  return this.date;
}
Object.defineProperty(messageHeader, 'subject', {
  set: function(x) { this.subject = x ; }
});
Object.defineProperties(messageHeader, {
  'from': {
    value: true,
    writable: true
  },
  'to': {
    value: 'Hello',
    writable: true
  },
  'date': {
    value: ' ',
    writable: true
  }
  // etc. etc.
});
*/
const mailComplete  = { 
	 header: messageHeader, 
	 body: ''
}; 
const Color = {
  subject: 1,
  BLUE: 2,
  GREEN: 3,
  YELLOW: 4
};
// Load client secrets from a local file.
module.exports = { 
  isRead: false,
  read: () => { 
    console.log("inside index .read () message .......")
      fs.readFile('credentials.json', (err, content) => {
           if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Gmail API.
            //authorize(JSON.parse(content), listLabels);
            authorize(JSON.parse(content), listMessages);
            this.isRead = true;
      });
   } 
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    console.log(" read TOKEN_PATH ")
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log(" read oAuth2Client setCredentials ")
    try { 
       callback(oAuth2Client);
    }
    catch (e){
      console.log("Errl listing messages may be google access or network issue ")
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}
/** 
   
*/
function listMessages(auth, query){
  console.log("inside list message .......")
  query = 'fairvinay@gmail.com';
  return new Promise((resolve, reject) => {    
    const gmail = google.gmail({version: 'v1', auth});
    console.log("inside list message  PRomise rejected.......")
  
    gmail.users.messages.list(      
      {        
        userId: 'me',  
        q:query,      
        maxResults:5     
      },           
       (err, res) => {        
        if (err) {         
          console.log("error  gmail list rejectsion  "+JSON.stringify(err))    
          reject(err);          
          return;        
        }        
        if (!res.data.messages) {  
          resolve([]);          
          return;        
        }  
         //resolve(res.data);  
         
         console.log("total messages : "+res.data.messages.length)
         var gCount = 0; 

         res.data.messages.forEach((label) => {   
              console.log(`- ${JSON.stringify(label)} : `);    
              console.log(`- ${label.name} : ${label.id}`);  
              //getMail(res.data.messages[0].id, auth, gCount);
            }); 
        
      }    
    );  
  })
}

function getMail(msgId, auth,gCount){
  console.log(msgId)
  const gmail = google.gmail({version: 'v1', auth});
  //This api call will fetch the mailbody.
  gmail.users.messages.get({
      userId:'me',
      id: msgId ,
  }, (err, res) => {
    console.log(res.data.labelIds.INBOX)
      if(!err){
        console.log("no error")
        console.log(" Datat "+JSON.stringify(res.data.payload))
        var body = {};
        // creating object for queue class
        var priorityBodyPart = new PriorityQueue();

        var headers = {};
        if (res.data.payload.parts instanceof Array )
        {   var priortyCntr = 1;
           res.data.payload.parts.forEach((part) => 
             {  
                
                if(!part.mimeType) {
                  console.log(" parts MIME TYPE is absent ")
                }
                else { 
                  console.log(" parts MIME TYPE IS PRESENT ")
                  if(part.mimeType.indexOf("multipart") > -1)
                  { console.log(" parts is attachment ")

                  }
                  else if (part.mimeType.indexOf("text/html") > -1 ){
                    console.log(" parts is text/html ")
                    priorityBodyPart.enqueue(part.body.data, 1);
                    //body = part.body.data;
                  }
                  else if (part.mimeType.indexOf("text/plain") > -1 ){
                    console.log(" parts is text/plain  ")
                    priorityBodyPart.enqueue(part.body.data, 2);
                    // body = part.body.data;
                  }
                }
                
             }
              ) 
          // testing isEmpty and front on an empty queue
          // return true
          console.log(" BodyPart isEmpty :  "+ priorityBodyPart.isEmpty());
          // returns "No elements in BodyPart "
          // console.log(" No elements in BodyPart > 0 ? :  " + !(priorityBodyPart.front()));     
          // prints [multipart/form, text/html,text/plain]
          // console.log(priorityBodyPart.printPQueue());
          
           headers = res.data.payload.headers
           //  console.log("parts are present body "+JSON.stringify(res.data.payload.parts[0]))
             console.log("parts are present body ")
             // prints priortyBodyPart Data
           console.log("   priortyBodyPart Data " + priorityBodyPart.front().element);
           body = priorityBodyPart.front().element
        }
        else if( res.data.payload.headers )
         { body = res.data.payload.body.data;
           headers = res.data.payload.headers
          
           //console.log("parts not present "+JSON.stringify(res.data.payload.body))
           console.log("parts not present ")
         }
         var htmlBody = base64decode(body.replace(/-/g, '+').replace(/_/g, '/'));
          var msgHeader  = new messageHeader();
         // console.log(htmlBody)
         console.log(body)
         var path = 'mailout'+"_"+msgId+"_.html"
         try {
           if (fs.existsSync(path)) {
             
             fs.unlinkSync(path)
           }
         } catch(err) {
           console.error(err)
         }

         fs.writeFile(path, htmlBody,(err, content) => {
           if(!err)
             console.log(" Mail written ");
            else 
            console.log(" Mail error ");
         });

         var path = 'message.json';
         try {
           if (fs.existsSync(path)) {
             
             fs.unlinkSync(path)
           }
         } catch(err) {
           console.error(err)
         }
        //  fs.writeFile(path, ' ',(err, content) => {
        //   if(!err)
        //     console.log(" Mail  Message header started ");
        //     else 
        //     console.log(" Mail Message header error ");
        // });
        var typeHead = { "Subject": 1, "From": 2, "To": 3 , "Date": 4};
         headers.forEach((header) => { 
             var headType = new HeaderType(header.name)
             console.log('headType.name '+headType.name)
             if(headType.name =="Subject" ){
              console.log('Mail ubjet: ',header.value)
              msgHeader.subject = header.value
             }
             else if (headType.name ==   "From"){
              console.log('Mail From: ',header.value)
              msgHeader.from = header.value
             }else if ( headType.name =="To") {
              console.log('Mail To: ',header.value)
              msgHeader.to = header.value
             }else if ( headType.name =="Date") { 
              console.log('Mail Date: ',header.value)
              msgHeader.date = header.value
             }
              
         });
         var toStr = msgHeader.toString.bind(msgHeader);
         //toStr 
         console.log("JSON.stringify(messageHeader) "+toStr());
         var strMsgHeadr = JSON.stringify(msgHeader)
         console.log("strMsgHeadr "+strMsgHeadr);
         fs.writeFile(path, strMsgHeadr ,(err, content) => {
          if(!err)
            console.log(" Mail  Message header completed");
            else 
            console.log(" Mail Message header error ");
        });

      }
  });
}


         /* var mailparser = new MailParser()
          
          mailparser.on("end", (err,res) => {
               console.log("res  -------- ",res);
           })

           mailparser.on('headers', (header) => {
            console.log("headers  -------- ",JSON.stringify(header));
           })
          mailparser.on('data', (dat) => {
            if(dat.type === 'text'){
                  const $ = cheerio.load(dat.textAsHtml);
                  var links = [];
                  var modLinks = [];
                  $('a').each(function(i) {
                      links[i] = $(this).attr('href');
                  });

                  //Regular Expression to filter out an array of urls.
                  var pat = /------[0-9]-[0-9][0-9]/;

                  //A new array modLinks is created which stores the urls.
                  modLinks = links.filter(li => {
                      if(li.match(pat) !== null){
                          return true;
                      }
                      else{
                          return false;
                      }
                  });
                  console.log(modLinks);
               //This function is called to open all links in the array.

              }
          })

          mailparser.write(htmlBody);
          mailparser.end();
          */