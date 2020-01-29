var mysql = require('mysql');

var express = require('express');

const fs = require('fs');

const readline = require('readline');

const {google} = require('googleapis');

var con = mysql.createConnection({
   host: "localhost",
   user: "niccodb",
   password: "taglierino2000",
   database: 'sign_fix'
 });

 con.connect();


var app = express();



let idCalendar='qqm2jgu3mkl1hu7l987als4eto@group.calendar.google.com';
 

function myTrim(textToTrim) {
   return textToTrim.replace(/^\s+|\s+$/gm,'');
 }

 function myLowerCase(textToLower) {
   return textToLower.toLowerCase();
 }

app.get('/listCities', function (req, res) {
   con.query('SELECT * FROM cities limit 10', function (error, results, fields) {
       if (error) throw error;
       return res.send({ error: false, data: results, message: 'users list.' });
   });
});


app.get('/calendar', function (req, res) {
   // If modifying these scopes, delete token.json.
   const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
   // The file token.json stores the user's access and refresh tokens, and is
   // created automatically when the authorization flow completes for the first
   // time.
   const TOKEN_PATH = 'token.json';

   // Load client secrets from a local file.
   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
         // Authorize a client with credentials, then call the Google Calendar API.
         authorize(JSON.parse(content), listEvents);
   });

   /**
    * Create an OAuth2 client with the given credentials, and then execute the
    * given callback function.
    * @param {Object} credentials The authorization client credentials.
    * @param {function} callback The callback to call with the authorized client.
    */
   function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
         if (err) return getAccessToken(oAuth2Client, callback);
         oAuth2Client.setCredentials(JSON.parse(token));
         callback(oAuth2Client);
      });
   }

   /**
    * Get and store new token after prompting for user authorization, and then
    * execute the given callback with the authorized OAuth2 client.
    * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
    * @param {getEventsCallback} callback The callback for the authorized client.
    */
   function getAccessToken(oAuth2Client, callback) {
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
    * Lists the next 10 events on the user's primary calendar.
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */

   function listEvents(auth) {
      const calendar = google.calendar({version: 'v3', auth});
      calendar.events.list({
         calendarId: idCalendar,
         timeMin: (new Date()).toISOString(),
         maxResults: 10,
         singleEvents: true,
         orderBy: 'startTime',
      }, (err, resu) => {
         if (err) return console.log('The API returned an error: ' + err);
         const events = resu.data.items;
         if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
               let arrayEventSplit = event.summary.split(':');
               let arrayEventSplitSecond= arrayEventSplit[1].split(',');
               const classroom =myLowerCase(myTrim(arrayEventSplit[0]));
               const teacher = myLowerCase(myTrim(arrayEventSplitSecond[0]));
               const lessontype =myLowerCase(myTrim(arrayEventSplitSecond[1]));
               
               const dateStart= event.start.dateTime;
               const dateEnd =event.end.dateTime;
               const hoursStart= dateStart.split("T")[1].substring(0,5);
               
               const hoursEnd= dateStart.split("T")[1].substring(0,5);

               console.log(dateStart,dateEnd);
               console.log("start at: "+hoursStart,"end at: "+hoursEnd);
               console.log(`${event.summary}`);

               //console.log(classroom);
               //console.log(teacher);
               //console.log(lessontype);
               /*
               con.query('INSERT INTO lessons (`lesson`, `email_responsible`, `classroom`,`id_course`) VALUES ("'+lessontype+'","'+teacher+'","'+classroom+'",1)', function (error, results, fields) {
                  if (error) throw error;
                  return console.log("query andata");
               });     
               */          
         });
      } else {
         console.log('No upcoming events found.');
      }
   });
   }
  
});



app.get('/city=:id', function (req, res) {
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id] 
      res.end( JSON.stringify(user));
   });
})

app.post('/addUser', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       res.end( JSON.stringify(data));
    });
 })

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})