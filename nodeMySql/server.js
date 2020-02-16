var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const tools = require('./tools');

var errorDataInsert = [];

const connectionDB = require('./connectionDB');
const connection = connectionDB.createConnectionDB();
connection.connect();

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(bodyParser.raw());

const idCalendar='qqm2jgu3mkl1hu7l987als4eto@group.calendar.google.com';

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });
 
 app.post('/auth', function (req, res) {

   connection.query('SELECT * FROM responsibles WHERE email = ' + connection.escape(req.body.email) + ' and password = ' + connection.escape(req.body.pass), function (error, results, fields) {
       if (error) throw error;
       //return res.send({ email: req.body.email, ruolo: results[0].responsible_level });
       res.send({ email: req.body.email, ruolo: results });
       console.log({ email: req.body.email, ruolo: results[0].responsible_level })
   });
});


app.get('/listStudents', function (req, res) {
   var data = {};
   var items = [];
   connection.query('SELECT first_name,last_name,email FROM students', function (error, results, fields) {
      if (error) throw error;

      for (let i = 0; i < results.length; i++) {
         items.push(
            {
               nome: results[i].first_name,
               cognome: results[i].last_name,
               email: results[i].email
            })
      }
      data = {
      columns: [
        {
          label: 'Nome',
          field: 'nome',  
          sort: 'asc',
          width: 150
        },
        {
          label: 'Cognome',
          field: 'cognome',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 200
        }
      ],
      rows: items
    };
    return res.send(JSON.stringify(data));

   });
});

app.get('/listCities', function (req, res) {
   connection.query('SELECT * FROM cities limit 10', function (error, items, fields) {
       if (error) throw error;
       return res.send({ error: false, items: items, message: 'users list.' });
   });
});



app.get('/calendar/listLessons', function (req, res) {
   connection.query('SELECT * FROM lessons', function (error, items, fields) {
       if (error) throw error;
       return res.send({ error: false, items: items, message: 'users list.' });
   });
});



app.get('/calendar/importLessons', function (req, res) {
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

               try{
                  const classroom =tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[0]));
                  const teacher = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[1].split(',')[0]));
                  const lessontype =tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[1].split(',')[1]));
                  
                  const dateStart= new Date(event.start.dateTime);
                  const dateEnd =new Date(event.end.dateTime);

                  const timeStart = dateStart.getHours() + dateStart.getMinutes()/60;
                  const timeEnd = dateEnd.getHours() + dateEnd.getMinutes()/60;

                  const totalHours = timeEnd - timeStart;

                  //console.log(dateStart,dateEnd);
                  //console.log("start at: " + timeStart,"end at: " + timeEnd + " Ore totali: " + totalHours);
                  //console.log(`${event.summary}`);

                  //console.log(classroom);
                  //console.log(teacher);
                  //console.log(lessontype);
                  /*
                  INSERT INTO `lessons`(`id`, `lesson`, `email_responsible`, `classroom`, `id_course`, 
                  `date`, `start_time`, `end_time`, `total_hours`, `creation_date`, `modify_date`, 
                  `email_supervisor_create`, `email_supervisor_modify`)*/
                  
                  
                  const query = 'INSERT INTO lessons (`lesson`, `email_responsible`, `classroom`,`id_course`,`date`,`start_time`,`end_time`,`total_hours`,`creation_date`)' +
                  'VALUES ("'+lessontype+'","'+teacher+'","'+classroom+'",1,"'+tools.formattedDate(dateStart)+'","'+timeStart+'","'+timeEnd+'","'+totalHours +'","'+tools.formattedDate()+'")';
                  
                  connection.query(query, function (error, items, fields) {
                     if (error) throw error;
                     return res.send({ error: false, data: items, message: 'Calendar added' });
                  });
               } catch(err){
                  errorDataInsert.push(event.summary+" "+event.start.dateTime.split("T")[0]);
                  console.log("I seguenti dati non sono stati inseriti correttamente: ");
                  console.log(JSON.stringify(errorDataInsert));
                  }
         });
      } else {
         console.log('No upcoming events found.');
      }
   });
   }
   res.end();
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