var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var Sync = require('sync');
const { OAuth2Client } = require('google-auth-library');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.raw());

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const tools = require('./tools');

var errorDataInsert = [];

const connectionDB = require('./connectionDB');
const connection = connectionDB.createConnectionDB();
connection.connect();


app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});


//CONTROLLO UTENTE e JWT
async function chekUser(email) {

   var ruolo = 0;

   connection.query('SELECT * FROM responsibles_auth WHERE email = ' + connection.escape(email), function (error, results, fields) {
      if (error) throw error;

      //IN FUTURO METTERE CHECK JWT
      ruolo = results[0].responsible_level;

      return ruolo;
   });
}

app.post('/tokensignin', function (req, res) {

   const code = req.body.code;
   const keys = require('./outh2.key.json');

   async function verify() {
      /*
         //const token = req.body.idtoken;
         const CLIENT_ID = '122931835616-is0f';
         const client = new OAuth2Client(CLIENT_ID);
         const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
         });
         const payload = ticket.getPayload();
         const userid = payload['sub'];
         // If request specified a G Suite domain:
         //const domain = payload['hd'];
         console.log("ticket");
         console.log(ticket);
         console.log("payload");
         console.log(payload);
         console.log("userid");
         console.log(userid);
         var request = require('request');
         request('https://oauth2.googleapis.com/tokeninfo?id_token='+token, function (error, response, body) {
            if (!error && response.statusCode == 200) {
               console.log(body) // Print the google web page.
            }
         })
      */
      const oAuth2Client = new OAuth2Client(
         keys.web.client_id,
         keys.web.client_secret,
         keys.web.redirect_uris[0]
      );
      const restInfo = await oAuth2Client.getToken(code);
      const tokenInfo = restInfo.tokens;
      oAuth2Client.setCredentials({ access_token: tokenInfo.getAccessToken, refresh_token: tokenInfo.refresh_token });
      const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
      oauth2.userinfo.get((err, resu) => {
         if (err) {
            console.log('The API returned an error: ' + err);
            return res.send({ error: true, data: err, message: 'The API returned an error' });
         }
         //console.log(resu.data);
         const email = resu.data.email;

         const insertToken = email + '","' + tokenInfo.access_token + '","' + tokenInfo.refresh_token + '","' + tokenInfo.scope + '","' + tokenInfo.token_type + '","' + tokenInfo.expiry_date;
         const updateToken = 'access_token = "' + tokenInfo.access_token + '", refresh_token = "' + tokenInfo.refresh_token + '", scope = "' + tokenInfo.scope + '", token_type = "' + tokenInfo.token_type + '", expiry_date = "' + tokenInfo.expiry_date + '"';
         const query = 'INSERT INTO google_token (email, access_token, refresh_token, scope, token_type, expiry_date) VALUES("' + insertToken + '") ON DUPLICATE KEY UPDATE ' + updateToken;

         connection.query(query, function (error, items, fields) {
            if (error) throw error;
            return (
               res.send({ error: false, data: items, message: 'Calendar added' }),
               console.log({ error: error, data: items, message: 'Calendar added' })
            );
         });
      });

   }
   verify().catch(console.error);
});


app.post('/auth', function (req, res) {

   connection.query('SELECT * FROM responsibles_auth WHERE email = ' + connection.escape(req.body.email) + ' and password = ' + connection.escape(req.body.pass), function (error, results, fields) {
      if (error) throw error;
      //return res.send({ email: req.body.email, ruolo: results[0].responsible_level });
      res.send({ email: req.body.email, ruolo: results });
      console.log({ email: req.body.email, ruolo: results[0].responsible_level })
   });
});

/*
fa il totale delle ore sulla tabella lessons a cominciare dalla data odierna meno un giorno.

app.get('/totalHours', function (req, res) {
   var totalHours =[]
   var datetimeNow = new Date();
   tools.formattedDate(datetime)
   connection.query("SELECT sum(total_hours) as total_hours FROM `lessons` WHERE date < '"+tools.formattedDate(datetimeNow)+"'", function (error, results, fields) {
      if (error) throw error;
      totalHours.push({
         totalHours : results[0].total_hours
      })
   });
});
*/

app.get('/getCourses/:email', function (req, res) {

   //var ruolo = 1;
   ruolo = chekUser(req.params.email);
   if (ruolo) {
      if (ruolo == 1) {
         connection.query('SELECT id, name, start_year, end_year, token_calendar FROM courses', function (error, results, fields) {
            if (error) throw error;
            res.send(JSON.stringify(results));
         });

      } else {
         connection.query('SELECT id ,name, start_year, end_year, token_calendar FROM supervisors s JOIN courses c ON s.id_course = c.id WHERE email_responsible  = ' + connection.escape(req.params.email), function (error, results, fields) {
            if (error) throw error;
            res.send(JSON.stringify(results));
         });
      }
   }
})

app.get('/listTeachers',function(req,res){
   var data =[]
   connection.query("SELECT first_name,ritirato,last_name,teachers.companies_id,signatures_teachers.email_responsible,sum(signatures_teachers.hours_of_lessons) as hours_of_lessons FROM signatures_teachers join teachers on signatures_teachers.email_responsible=teachers.email_responsible group by teachers.email_responsible", function (error, results, fields) {
      if (error) throw error;
      data = results
   return res.send(JSON.stringify(data));

   });
});

app.put('/updateTeacher/:email', function (req, res) {

   var email = req.params.email
   var first_name = req.body.first_name
   var last_name = req.body.last_name

   var query = "UPDATE `teachers` SET `first_name`=?,`last_name`=? WHERE `email_responsible` = ?";
   connection.query(query, [first_name, last_name,email], function (error, results, fields) {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'user has been updated successfully.' });
   });
});

app.put('/retireTeacher/:email', function (req, res) {
   var email = req.params.email;

   var ritirato = req.body.ritirato

   var query = "UPDATE `teachers` SET `ritirato` = ? WHERE `email_responsible` = ?";
   connection.query(query, [ritirato, email], function (error, results, fields) {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'user has been updated successfully.' });
   });
});

app.get('/teachersDetails',function (req,res){
   var data= []
   var query = "SELECT  name as company_name,companies.id as company_id,lesson,sum(`total_hours`) as total_hours FROM `lessons` join companies on lessons.companies_id=companies.id group by lesson,company_name,company_id";
   connection.query(query, function (err, result, fields) {
      if (err) throw err;
      data=result
      res.send(JSON.stringify(data));
   });
   
});


app.get('/lessons/:date', function (req, res) {
   var data = [];
   var date_appoggio = req.params.date 
   var data_Scelta = date_appoggio.replace(/-/g, '/')
   connection.query("SELECT * FROM lessons WHERE date= '" + data_Scelta + "'", function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
         var end_time_appoggio = (results[i].end_time.toString()).split('.')
         var end_time_float= end_time_appoggio[1] > 0 ? end_time_appoggio[0] +'.'+ end_time_appoggio[1]*0.60 : end_time_appoggio[0]
         
         var start_time_appoggio = (results[i].start_time.toString()).split('.')
         var start_time_float= start_time_appoggio[1] > 0 ? start_time_appoggio[0] +'.'+ start_time_appoggio[1]*0.60 : start_time_appoggio[0]
         
         data.push(
            {
               email: results[i].email_signature,
               classroom: results[i].classroom,
               id: results[i].id,
               lesson: results[i].lesson,
               startTime:start_time_float ? start_time_float : 'errore',
               endTime: end_time_float ? end_time_float : 'errore'
            })
      }
      res.send(JSON.stringify(data));
   });
});

app.get('/listSignaturesStudents/:data_scelta', function(req,res) {
   var data = []
   var date_appoggio = req.params.data_scelta
   var dataScelta = date_appoggio.replace(/-/g, '/')
   connection.query("SELECT final_start_time,final_end_time,mattinaPomeriggio,first_name,last_name,id_lesson from students join signatures_students on signatures_students.email_student=students.email where signatures_students.date='"+dataScelta+"' and ritirato=0", function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
         
         var end_time_appoggio = (results[i].final_end_time.toString()).split('.')
         var end_time_float= end_time_appoggio[1] > 0 ? end_time_appoggio[0] +'.'+ end_time_appoggio[1]*0.60 : end_time_appoggio[0]
         
         var start_time_appoggio = (results[i].final_start_time.toString()).split('.')
         var start_time_float= start_time_appoggio[1] > 0 ? start_time_appoggio[0] +'.'+ start_time_appoggio[1]*0.60 : start_time_appoggio[0]
         
         data.push(
            {
               mattinaPomeriggio: results[i].mattinaPomeriggio,
               firstName: results[i].first_name,
               lastName: results[i].last_name,
               idLesson :  results[i].id_lesson,
               startTime: start_time_float !=1 ? start_time_float : 'assente',
               endTime: end_time_float !=1 ? end_time_float : 'assente'
            })
      }
      return res.send(JSON.stringify(data));
   });
});

app.get('/listStudents', function (req, res) {
   var data = [];
   var totalHours =[]
   var datetimeNow = new Date();
   connection.query("SELECT sum(total_hours) as total_hours FROM `lessons` WHERE date <= '"+tools.formattedDate(datetimeNow)+"'", function (error, results, fields) {
      if (error) throw error;
      totalHours.push({
         totalHours : results[0].total_hours
      })
   });
   connection.query('SELECT first_name,last_name,email,residence,SUM(hours_of_lessons) as hours_of_lessons,SUM(lost_hours) as lost_hours,fiscal_code,date_of_birth,ritirato FROM students join signatures_students on students.email=signatures_students.email_student GROUP BY email_student', function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
         var hoursDecimalAppoggio = (results[i].hours_of_lessons.toString()).split('.')
         var hourDecimal= hoursDecimalAppoggio[1] > 0 ? hoursDecimalAppoggio[0] +'.'+ hoursDecimalAppoggio[1]*0.60 : hoursDecimalAppoggio[0]
         var percentage = ((results[i].hours_of_lessons  * 100) / totalHours[0].totalHours).toFixed(0)      
         data.push(
            {
               firstName: results[i].first_name,
               lastName: results[i].last_name,
               email: results[i].email,
               fiscalCode: results[i].fiscal_code,
               dateOfBirth: results[i].date_of_birth,
               residence: results[i].residence,
               hoursOfLessons: hourDecimal ? hourDecimal : '0',
               percentage: (percentage) ? (percentage) + " %" : '0',
               ritirato: results[i].ritirato
            })
      }
      return res.send(JSON.stringify(data));
   });
});

app.put('/updateStudent/:email', function (req, res) {

   var email = req.params.email
   var first_name = req.body.first_name
   var last_name = req.body.last_name
   var date_of_birth = req.body.date_of_birth
   var residence = req.body.residence
   var fiscal_code = req.body.fiscal_code

   var query = "UPDATE `students` SET `first_name`=?,`last_name`=?,`date_of_birth`=?,`residence`=?,`fiscal_code`=? WHERE `email` = ?";
   connection.query(query, [first_name, last_name, date_of_birth, residence, fiscal_code, email], function (error, results, fields) {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'user has been updated successfully.' });
   });
});



app.put('/retireStudent/:email', function (req, res) {
   var email = req.params.email;

   var ritirato = req.body.ritirato

   var query = "UPDATE `students` SET `ritirato` = ? WHERE `email` = ?";
   connection.query(query, [ritirato, email], function (error, results, fields) {
      if (error) throw error;
      res.send({ error: false, data: results, message: 'user has been updated successfully.' });
   });
});


app.get('/calendar/listLessons', function (req, res) {
   connection.query('SELECT * FROM lessons', function (error, items, fields) {
      if (error) throw error;
      return res.send({ error: false, items: items, message: 'users list.' });
   });
});


app.post('/calendar/importLessons', function (req, res) {

   //const email = connection.escape(req.body.email);
   const email = 'daniele.marocchi.studio@fitstic-edu.com';
   const idCalendar = req.body.token;

   // Load client secrets from a local file.
   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      authorize(JSON.parse(content), listEvents);
   });

   function authorize(credentials, callback) {

      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      const query = 'SELECT * FROM google_token WHERE email = ' + connection.escape(email);
      connection.query(query, function (error, results, fields) {
         if (error) throw error;
         if (results.length == 0) {
            console.log('Token Non Trovato');
            return res.send({ error: false, data: error, message: 'Token Non Trovat' });
         }
         const tokenInfo = results[0];
         oAuth2Client.setCredentials({ access_token: tokenInfo.access_token, refresh_token: tokenInfo.refresh_token });
         callback(oAuth2Client);
      });
   }


   /**
    * Lists the next 10 events on the user's primary calendar.
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */

   function listEvents(auth) {

      const calendar = google.calendar({ version: 'v3', auth });
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

               try {
                  const classroom = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[0]));
                  const teacher = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[1].split(',')[0]));
                  const lessontype = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[1].split(',')[1]));

                  const dateStart = new Date(event.start.dateTime);
                  const dateEnd = new Date(event.end.dateTime);

                  const timeStart = dateStart.getHours() + dateStart.getMinutes() / 60;
                  const timeEnd = dateEnd.getHours() + dateEnd.getMinutes() / 60;

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

                  /*
                  const query = 'INSERT INTO lessons (`lesson`, `email_responsible`, `classroom`,`id_course`,`date`,`start_time`,`end_time`,`total_hours`,`creation_date`)' +
                  'VALUES ("'+lessontype+'","'+teacher+'","'+classroom+'",1,"'+tools.formattedDate(dateStart)+'","'+timeStart+'","'+timeEnd+'","'+totalHours +'","'+tools.formattedDate()+'")';
                  
                  connection.query(query, function (error, items, fields) {
                     if (error) throw error;
                     return res.send({ error: false, data: items, message: 'Calendar added' });
                  });*/
                  console.log("cered si")
               } catch (err) {
                  errorDataInsert.push(event.summary + " " + event.start.dateTime.split("T")[0]);
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


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})