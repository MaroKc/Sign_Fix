var express = require('express');
var Sync = require('sync');
var app = express();
var bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const lineReader = require('line-reader');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.raw());

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const tools = require('./tools');
const keys = require('./outh2.key.json');

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

app.get('/importCsv/:id_course',function(req,res){
   idCorso =req.params.id_course
   connection.query("DELETE FROM `students` WHERE id_course="+idCorso, function (error, results, fields) {
      if (error) throw error;
      });
   try {
   
      // read contents of the file
      const data = fs.readFileSync('data.csv', 'UTF-8');

      // split the contents by new line
      const lines = data.split(/\r?\n/);
      persone=[]
   
      for (let i = 0; i < lines.length-1; i++) {

         // splitta ogni riga in vari campi ai quali si può accedere così: name= lines[i].split(',')[7]
         const lineaSplittata= lines[i].split(',')
         const email = tools.stringLowerCase(tools.stringTrim(lineaSplittata[22]));
         const firstName = tools.stringLowerCase(tools.stringTrim(lineaSplittata[7]));
         const lastName = tools.stringLowerCase(tools.stringTrim(lineaSplittata[8]));
         const birth = tools.stringLowerCase(tools.stringTrim(lineaSplittata[10]));
         const residence = tools.stringLowerCase(tools.stringTrim(lineaSplittata[15]));
         const fiscalCode = lineaSplittata[3];
         var query = "INSERT INTO `students`(`email`, `first_name`, `last_name`, `date_of_birth`, `residence`, `fiscal_code`, `id_course`, `ritirato`) VALUES ("+email+","+firstName+","+lastName+","+birth+","+residence+","+fiscalCode+","+ idCorso+",0)";
         
         connection.query(query, function (error, results, fields) {
            if (error) throw error;
            });
         }
      // il res.send deve andare fuori ai cicli, perchè invia dati e se ci sono ancora operazioni da svolgere le interrompe
         return res.send({ error: true, message: 'ok' });

      } catch (err) {
         return res.send({ error: true, data: err, message: 'ko' });

         }
});




app.get('/listAllTeachers', function (req, res) {
   var data = [];

   connection.query("SELECT * from teachers", function (error, results, fields) {
      if (error) throw error;
      data= results
      return res.send(JSON.stringify(data));
   });
});

app.get('/listTeachers', function (req, res) {
   try {
      var data = []
      connection.query("SELECT first_name,ritirato,last_name,teachers.companies_id as companies_id,signatures_teachers.email_responsible as email_responsible,sum(signatures_teachers.hours_of_lessons) as hours_of_lessons FROM signatures_teachers join teachers on signatures_teachers.email_responsible=teachers.email_responsible group by teachers.email_responsible", function (error, results, fields) {
         if (error) throw error;
         for (let i = 0; i < results.length; i++) {
            var hours_appoggio = (results[i].hours_of_lessons.toString()).split('.')
            var hours_of_lessonss = hours_appoggio[1] > 0 ? hours_appoggio[0] + '.' + (hours_appoggio[1] * 0.60).toFixed(0) : hours_appoggio[0]
            data.push(
               {
                  first_name: results[i].first_name,
                  ritirato: results[i].ritirato,
                  last_name: results[i].last_name,
                  email_responsible: results[i].email_responsible,
                  companies_id: results[i].companies_id,
                  hours_of_lessons: hours_of_lessonss ? hours_of_lessonss : '0',
               })
         }
         return res.send({ error: true, data: data, message: 'ok' });
      });
   } catch (error) {
      return res.send({ error: true, data: error, message: 'ko' });
   }
});


app.put('/updateTeacher/:email', function (req, res) {
   try {
      var email = req.params.email
      var first_name = req.body.first_name
      var last_name = req.body.last_name

      var query = "UPDATE `teachers` SET `first_name`=?,`last_name`=? WHERE `email_responsible` = ?";
      connection.query(query, [first_name, last_name, email], function (error, results, fields) {
         if (error) throw error;
         res.send({ error: true, data: results, message: 'ok' });
      });
   } catch (error) {
      res.send({ error: true, data: error, message: 'ko' });
   }

});

app.put('/retireTeacher/:email', function (req, res) {

   try {
      var email = req.params.email
      var ritirato = req.body.ritirato

      var query = "UPDATE `teachers` SET `ritirato` = ? WHERE `email_responsible` = ?";
      connection.query(query, [ritirato, email], function (error, results, fields) {
         if (error) throw error;
         res.send({ error: false, data: results, message: 'ok' });
      });
   } catch (error) {
      res.send({ error: false, data: error, message: 'ko' });
   }
});

app.get('/teachersDetails', function (req, res) {
   try {
      var data = []
      var query = "SELECT  name as company_name,companies.id as company_id,lesson,sum(`total_hours`) as total_hours FROM `lessons` join companies on lessons.companies_id=companies.id group by lesson,company_name,company_id";
      connection.query(query, function (err, results, fields) {
         if (err) throw err;
         for (let i = 0; i < results.length; i++) {
            var hours_appoggio = (results[i].total_hours.toString()).split('.')
            var total_hourss = hours_appoggio[1] > 0 ? hours_appoggio[0] + '.' + (hours_appoggio[1] * 0.60).toFixed(0) : hours_appoggio[0]
            data.push(
               {
                  company_name: results[i].company_name,
                  company_id: results[i].company_id,
                  total_hours: total_hourss ? total_hourss : '0',
                  lesson: results[i].lesson,
               })
         }
         res.send({ error: false, data: data, message: 'ok' });
      });
   } catch (error) {
      res.send({ error: false, data: error, message: 'ko' });
   }
});

app.post('/createTeacher', function (req, res) {

   var firstName = req.body.firstName
   var lastName = req.body.lastName
   var emailDocente = req.body.emailDocente
   var idCorso = req.body.idCorso
   var companyName = req.body.companyName
   var company = []

   connection.query("SELECT * FROM companies where name='" + companyName + "'", function (error, items, fields) {
      if (error) throw error;
      if (items.length > 0) {
         for (let i = 0; i < items.length; i++) {
            company.push(
               {
                  id: items[i].id,
                  name: items[i].name,
               })
         }
         connection.query("INSERT INTO `teachers`(`email_responsible`, `first_name`, `last_name`, `id_course`, `companies_id`, `ritirato`) VALUES ('" + emailDocente + "','" + firstName + "','" + lastName + "'," + idCorso + "," + company[0].id + ",0)", function (error, result, fields) {
            if (error) throw error;
            return res.send({ error: false, result: result, message: 'ok' });
         });
      } else {
         connection.query("INSERT INTO `companies` (`name`) VALUES ('" + companyName + "')", function (error, result, fields) {
            if (error) throw error;
         });
         connection.query("SELECT * FROM companies where name='" + companyName + "'", function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
               for (let i = 0; i < results.length; i++) {
                  company.push(
                     {
                        id: results[i].id,
                        name: results[i].name,
                     })
               }
               connection.query("INSERT INTO `teachers`(`email_responsible`, `first_name`, `last_name`, `id_course`, `companies_id`, `ritirato`) VALUES ('" + emailDocente + "','" + firstName + "','" + lastName + "'," + idCorso + "," + company[0].id + ",0)", function (error, result, fields) {
                  if (error) throw error;
                  return res.send({ error: false, result: result, message: 'ok' });
               });
            }
         });
      }
   });

});


app.get('/lessons/:date/:id_course', function (req, res) {
   var data = [];
   var date_appoggio = req.params.date
   var id_course = req.params.id_course

   var data_Scelta = date_appoggio.split('-');
   var dataFinale = data_Scelta[2] + '-' + data_Scelta[1] + '-' + data_Scelta[0]
   connection.query("SELECT * FROM lessons WHERE date= '" + (dataFinale) + "' and id_course=" + id_course + "", function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
         var end_time_appoggio = (results[i].end_time.toString()).split('.')
         var end_time_float = end_time_appoggio[1] > 0 ? end_time_appoggio[0] + '.' + (end_time_appoggio[1] * 0.60).toFixed(0) : end_time_appoggio[0]

         var start_time_appoggio = (results[i].start_time.toString()).split('.')
         var start_time_float = start_time_appoggio[1] > 0 ? start_time_appoggio[0] + '.' + (start_time_appoggio[1] * 0.60).toFixed(0) : start_time_appoggio[0]

         data.push(
            {
               email: results[i].email_signature,
               classroom: results[i].classroom,
               id: results[i].id,
               lesson: results[i].lesson,
               startTime: start_time_float ? start_time_float : 'errore',
               endTime: end_time_float ? end_time_float : 'errore'
            })
      }
      res.send(JSON.stringify(data));
   });
});

app.get('/listSignaturesStudents/:data_scelta', function (req, res) {
   var data = []
   var date_appoggio = req.params.data_scelta
   var data_Scelta = date_appoggio.split('-');
   var dataFinale = data_Scelta[2] + '-' + data_Scelta[1] + '-' + data_Scelta[0]

   connection.query("SELECT final_start_time,final_end_time,mattinaPomeriggio,first_name,last_name,id_lesson,email from students join signatures_students on signatures_students.email_student=students.email where signatures_students.date='"+dataFinale+"' and ritirato=0", function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {

         var end_time_appoggio = (results[i].final_end_time.toString()).split('.')
         var end_time_float = end_time_appoggio[1] > 0 ? end_time_appoggio[0] + '.' + (end_time_appoggio[1] * 0.60).toFixed(0) : end_time_appoggio[0]

         var start_time_appoggio = (results[i].final_start_time.toString()).split('.')
         var start_time_float = start_time_appoggio[1] > 0 ? start_time_appoggio[0] + '.' + (start_time_appoggio[1] * 0.60).toFixed(0) : start_time_appoggio[0]

         data.push(
            {
               mattinaPomeriggio: results[i].mattinaPomeriggio,
               firstName: results[i].first_name,
               lastName: results[i].last_name,
               idLesson :  results[i].id_lesson,
               emailStudent : results[i].email,
               startTime: start_time_float !=1 ? start_time_float : 'assente',
               endTime: end_time_float !=1 ? end_time_float : 'assente'
            })
      }
      return res.send(JSON.stringify(data));
   });
});

app.get('/listStudents/:id_course', function (req, res) {
   var data = [];
   var totalHours = []
   var datetimeNow = new Date();
   var id_course = req.params.id_course
   var query = "SELECT sum(total_hours) as total_hours FROM `lessons` WHERE date <= '" + tools.formattedDate(datetimeNow) + "' and id_course= " + id_course + "";
   connection.query(query, function (error, results, fields) {
      if (error) throw error;
      totalHours.push({
         totalHours: results[0].total_hours
      })
   });
   connection.query("SELECT first_name,last_name,email,residence,SUM(hours_of_lessons) as hours_of_lessons,SUM(lost_hours) as lost_hours,fiscal_code,date_of_birth,ritirato FROM students join signatures_students on students.email=signatures_students.email_student where id_course= " + id_course + " GROUP BY email_student", function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {

         var hoursDecimalAppoggio = (results[i].hours_of_lessons.toString()).split('.')
         var hourDecimal = hoursDecimalAppoggio[1] > 0 ? hoursDecimalAppoggio[0] + '.' + (hoursDecimalAppoggio[1] * 0.60).toFixed(0) : hoursDecimalAppoggio[0]
         var percentage = ((results[i].hours_of_lessons * 100) / totalHours[0].totalHours).toFixed(0)
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

app.get('/listAllStudents/:id_course', function (req, res) {
   var data = [];
   var id_course = req.params.id_course
   connection.query("SELECT * from students where id_course= "+id_course, function (error, results, fields) {
      if (error) throw error;
      data= results
      return res.send(JSON.stringify(data));
   });
});

app.put('/updateStudent/:email', function (req, res) {

   try {
      var email = req.params.email
      var first_name = req.body.first_name
      var last_name = req.body.last_name
      var date_of_birth = req.body.date_of_birth
      var residence = req.body.residence
      var fiscal_code = req.body.fiscal_code
   
      var query = "UPDATE `students` SET `first_name`=?,`last_name`=?,`date_of_birth`=?,`residence`=?,`fiscal_code`=? WHERE `email` = ?";
      connection.query(query, [first_name, last_name, date_of_birth, residence, fiscal_code, email], function (error, results, fields) {
         if (error) throw error;
         res.send({ error: false, data: results, message: 'ok' });
      });
   } catch (error) {
      res.send({ error: false, data: error, message: 'ko' });
   }
 
});



app.put('/retireStudent/:email', function (req, res) {
   
   try {
      var email = req.params.email;

      var ritirato = req.body.ritirato
   
      var query = "UPDATE `students` SET `ritirato` = ? WHERE `email` = ?";
      connection.query(query, [ritirato, email], function (error, results, fields) {
         if (error) throw error;
         res.send({ error: false, data: results, message: 'ok' });
      });
   } catch (error) {
      res.send({ error: false, data: error, message: 'ko' });
   }
});

app.get('/calendar/listLessons', function (req, res) {
   connection.query('SELECT * FROM lessons', function (error, items, fields) {
      if (error) throw error;
      return res.send({ error: false, items: items, message: 'users list.' });
   });
});


app.post('/calendar/importLessons', async function (req, res) {

   const email = escape(req.body.email);
   const idCalendar = escape(req.body.token);
   const courseID = escape(req.body.courseID);


   const oAuth2Client = new OAuth2Client(
      keys.web.client_id,
      keys.web.client_secret,
      keys.web.redirect_uris[0]
   );

   authorize(oAuth2Client, listEvents);

   /*
   // Load client secrets from a local file.
   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Calendar API.
      authorize(JSON.parse(content), listEvents);
   });
   */

   function authorize(oAuth2Client, callback) {

      //const { client_secret, client_id, redirect_uris } = credentials.installed;
      //const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      const query = 'SELECT * FROM google_token WHERE email = ' + connection.escape(email);
      connection.query(query, async function (error, results, fields) {
         if (error) throw error;
         if (results.length == 0) {
            console.log('Token Non Trovato');
            return res.send({ error: false, data: error, message: 'Token Non Trovato' });
         }

         const tokenInfo = results[0];
         const tokenExpire = new Date(parseInt(tokenInfo.expiry_date));
         oAuth2Client.setCredentials({ refresh_token: tokenInfo.refresh_token });

         if(tokenExpire < (new Date())) {
            const newToken = await oAuth2Client.getAccessToken().catch(console.error);
            const query = "UPDATE google_token SET access_token = ?, expiry_date = ? WHERE email = ?";
            connection.query(query, [newToken.token, newToken.res.data.expiry_date, email], function (error, results, fields) {
               if (error) throw error;
               console.log("Acces Token Refreshato e Salvato");
            });
            oAuth2Client.setCredentials({ access_token: newToken.token });
            callback(oAuth2Client);

         } else {
            oAuth2Client.setCredentials({ access_token: tokenInfo.access_token });
            callback(oAuth2Client);
         }

      })
   }


   let ProfCheck = (teacher) => {
      return new Promise(function (resolve, reject) {
         const queryProf = 'SELECT id FROM companies WHERE name like "%?%" ';
         connection.query(queryProf, [teacher], function (errorProf, resultsProf, fields) {
            if (errorProf) { throw reject(new Error(errorProf)); }
            if (resultsProf.length == 0) { resolve(false); } else { resolve(queryProf[0].id); }
         });

      });
   }

   let LeassonCheck =  (lessontype) => {
      return new Promise( function (resolve, reject) {
         const querySub = 'SELECT id FROM companies WHERE name like "%?%" ';
         connection.query(querySub, [lessontype], function (errorSub, resultsSub, fields) {
            if (errorSub) { throw errorSub; }
            if (resultsSub.length == 0) { resolve(false); } else { resolve(querySub[0].id); }
         });

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
         maxResults: 1,
         singleEvents: true,
         orderBy: 'startTime',
      }, async (err, resu) => {
         if (err) return console.log('The API returned an error: ' + err);
         const events = resu.data.items;

         const errori = [];
         const datiInsert = [];

         if (events.length) {

            events.map(async (event, i) => {
               const riga = {}

               try {
                  const classroom = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[0]));
                  const teacher = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[1].split(',')[0]));
                  const lessontype = tools.stringLowerCase(tools.stringTrim(event.summary.split(':')[1].split(',')[1]));

                  const dateStart = new Date(event.start.dateTime);
                  const dateEnd = new Date(event.end.dateTime);

                  const timeStart = dateStart.getHours() + dateStart.getMinutes() / 60;
                  const timeEnd = dateEnd.getHours() + dateEnd.getMinutes() / 60;

                  const totalHours = timeEnd - timeStart;

                  
                  const checkProf = await ProfCheck(teacher);
                  const checkLeasson = await LeassonCheck(lessontype);
                  if (checkProf === false) {
                     riga.prof = false;
                  }
                  if (checkLeasson === false) {
                     riga.leasson = false;
                  }

                  if (Object.entries(riga).length !== 0) {
                     riga.dataStart = dateStart;
                     riga.dataEnd = dateEnd;
                     errori.push(riga);
                     console.log("push");
                  } else {
                     //datiInsert.push([checkLeasson, checkProf, classroom, tools.formattedDate(dateStart), timeStart, timeEnd, totalHours, tools.formattedDate()])
                     console.log("ok");
                  }

               } catch (err) {
                  console.log(err);
                  errorDataInsert.push(event.summary + " " + event.start.dateTime.split("T")[0]);
                  console.log("I seguenti dati non sono stati inseriti correttamente: ");
                  console.log(JSON.stringify(errorDataInsert));
               }


            });
         } else {
            console.log('No upcoming events found.');
         }
      

         if (errori.length === 0) {
            console.log("insert")
            /*const queryIns = 'INSERT INTO lessons (`lesson`, `email_responsible`, `classroom`,`id_course`,`date`,`start_time`,`end_time`,`total_hours`,`creation_date`) VALUES ?';                           
            connection.query(queryIns, [datiInsert], function (errorIns, itemsIns, fields) {
               if (errorIns) throw errorIns;
               return res.send({ error: false, data: items, message: 'Calendar added' });
            });*/
         } else {
            console.log(errori);
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