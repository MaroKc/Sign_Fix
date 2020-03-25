var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.raw());

const { google } = require('googleapis');
const tools = require('./tools');
const keys = require('./outh2.key.json');

const connectionDB = require('./connectionDB');
const connection = connectionDB.createConnectionDB();
connection.connect();




app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

function sendEmails(emailTo, objectEmail, text) {
   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: 'registro.luca.pw@gmail.com',
         pass: 'fitstic2020'
      }
   });

   var mailOptions = {
      from: 'registro.luca.pw@gmail.com',
      to: emailTo,
      subject: objectEmail,
      text: text
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         return true;
      } else {
         return false;
      }
   });
}

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
         keys.web.redirect_uris[1]
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
         const email = resu.data.email;

         const insertToken = email + '","' + tokenInfo.access_token + '","' + tokenInfo.refresh_token + '","' + tokenInfo.scope + '","' + tokenInfo.token_type + '","' + tokenInfo.expiry_date;
         const updateToken = 'access_token = "' + tokenInfo.access_token + '", refresh_token = "' + tokenInfo.refresh_token + '", scope = "' + tokenInfo.scope + '", token_type = "' + tokenInfo.token_type + '", expiry_date = "' + tokenInfo.expiry_date + '"';
         const query = 'INSERT INTO google_token (email, access_token, refresh_token, scope, token_type, expiry_date) VALUES("' + insertToken + '") ON DUPLICATE KEY UPDATE ' + updateToken;

         connection.query(query, function (error, items, fields) {
            if (error) throw error;
         });

         connection.query("SELECT id_course, email FROM students WHERE email ='" + email + "'", function (error, items, fields) {

            if (error) throw error;

            return (
               res.send({ error: false, data: items, message: 'studente trovato' })
            );
         })

      });

   }
   verify().catch(console.error);
});


app.post('/auth', function (req, res) {
   var pass = req.body.pass
   var query = 'SELECT * FROM responsibles_auth WHERE email = ?'
   connection.query(query, [req.body.email], function (error, results, fields) {
      if (error) {
         throw error;
      } else {
         console.log(results)
         if (results.length > 0) {
            bcrypt.compare(pass, results[0].password, function (err, ress) {
               if (!ress) {
                  res.send({ error: true, message: false });
               } else {
                  res.send({ error: false, message: results[0] });
               }
            });
         }
         else {
            res.send({ error: true, message: false });
         }
      }
   });

});

app.post('/badge', function (req, res) {

   const qr = req.body.email;

   //Una volta che ho il QR faccio una select per trovare l'email associata
   /*
   connection.query('SELECT * FROM responsibles_auth WHERE email = ' + connection.escape(qr) + ' and password = ' + connection.escape(req.body.pass), function (error, results, fields) {
      if (error) throw error;

      if(results.length == 1) {

         //DA CRIPTARE LA PSWD perchè si salva nel client
         res.send({ error: false, message: results[0] });
      } else {
         res.send({ error: true, message: false });
      }
   });
   */

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


app.post('/importCsv/:id_course', function (req, res) {
   var idCorso = req.params.id_course
   var data = req.body.data
   connection.query("DELETE FROM `students` WHERE id_course=" + idCorso, function (error, results, fields) {
      if (error) throw error;
   });
   try {
      // split the contents by new line
      const lines = data.split(/\r?\n/);

      for (let i = 0; i < lines.length - 1; i++) {

         // splitta ogni riga in vari campi ai quali si può accedere così: name= lines[i].split(',')[7]
         const lineaSplittata = lines[i].split(',')
         const email = tools.stringLowerCase(tools.stringTrim(lineaSplittata[22]));
         const firstName = tools.stringLowerCase(tools.stringTrim(lineaSplittata[7]));
         const lastName = tools.stringLowerCase(tools.stringTrim(lineaSplittata[8]));
         const birth = tools.stringLowerCase(tools.stringTrim(lineaSplittata[10]));
         const residence = tools.stringLowerCase(tools.stringTrim(lineaSplittata[15]));
         const fiscalCode = lineaSplittata[3];
         var query = "INSERT INTO `students`(`email`, `first_name`, `last_name`, `date_of_birth`, `residence`, `fiscal_code`, `id_course`, `ritirato`) VALUES (" + email + "," + firstName + "," + lastName + "," + birth + "," + residence + "," + fiscalCode + "," + idCorso + ",0)";

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

app.get('/listTeachers', function (req, res) {
   try {
      var data = []
      connection.query("SELECT name,first_name,ritirato,last_name,teachers.companies_id as companies_id,teachers.email_responsible as email_responsible FROM teachers left join signatures_teachers on signatures_teachers.email_responsible=teachers.email_responsible join companies on companies.id = teachers.companies_id group by teachers.email_responsible", function (error, results, fields) {
         if (error) throw error;
         results.forEach(element => {
            data.push(
               {
                  name: element.name,
                  firstName: element.first_name,
                  ritirato: element.ritirato,
                  lastName: element.last_name,
                  emailTeacher: element.email_responsible,
                  companyId: element.companies_id,
               })
         })
         return res.send({ error: true, data: data, message: 'ok' });
      });
   } catch (error) {
      return res.send({ error: true, data: error, message: 'ko' });
   }
});

app.get('/teacherDetails', function (req, res) {
   try {
      var data = []
      var query = "SELECT name,l.lesson,first_name,ritirato,last_name,t.companies_id as company_id,t.email_responsible as email,sum(s.hours_of_lessons) as hourOfLessons,( SELECT SUM(total_hours) FROM lessons where lesson = l.lesson ) AS totalHours FROM teachers t JOIN companies c ON t.companies_id = c.id LEFT JOIN signatures_teachers s ON s.email_responsible = t.email_responsible LEFT JOIN lessons l ON l.id = s.id_lesson GROUP BY t.email_responsible, l.lesson"
      connection.query(query, function (error, results, fields) {
         if (error) throw error;

         results.forEach(element => {
            data.push(
               {
                  name: element.name,
                  lesson: element.lesson,
                  firstName: element.first_name,
                  lastName: element.last_name,
                  ritirato: element.ritirato,
                  companyId: element.company_id,
                  emailTeacher: element.email,
                  hoursOfLessons: tools.formattedDecimal(element.hourOfLessons),
                  totalHours: tools.formattedDecimal(element.totalHours),
               })
         })
         // return res.send({error: true, data:data, message: 'ok'}); 
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

app.post('/createTeacher', function (req, res) {

   var firstName = req.body.firstName
   var lastName = req.body.lastName
   var emailDocente = req.body.emailDocente
   var idCorso = req.body.idCorso
   var companyName = req.body.companyName
   var company = []
   var password = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

   var objectEmail = 'Credenziali Fitstic'
   var textEmail = 'Gentile ' + firstName + ' ' + lastName + ', le comunichiamo che il suo account fitstic è stato abilitato, potrà accedervi con la seguente password:' + password

   var salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(password.toString(), salt);

   connection.query("SELECT * FROM teachers where email_responsible='" + emailDocente + "'", function (e, row, fields) {
      if (e) throw error;
      if (row.length == 0) {
         connection.query("SELECT * FROM companies where name='" + companyName + "'", function (error, items, fields) {
            if (error) throw error;
            if (items.length > 0) {
               items.forEach(element => {
                  company.push(
                     {
                        id: element.id,
                        name: element.name,
                     })
               })
               connection.query("INSERT INTO `teachers`(`email_responsible`, `first_name`, `last_name`, `id_course`, `companies_id`, `ritirato`) VALUES ('" + emailDocente + "','" + firstName + "','" + lastName + "'," + idCorso + "," + company[0].id + ",0) ", function (error, result, fields) {
                  if (error) throw error;
                  sendEmails(emailDocente, objectEmail, textEmail)
                  connection.query("INSERT INTO `responsibles_auth`(`email`, `password`, `responsible_level`) VALUES ('" + emailDocente + "','" + hash + "',4)", function (errorAuth, resultAuth, fields) {
                     if (errorAuth) throw errorAuth;
                  });
                  return res.send({ error: false, result: result, message: 'ok' });
               });
            } else {
               connection.query("INSERT INTO `companies` (`name`) VALUES ('" + companyName + "')", function (error, result, fields) {
                  if (error) throw error;
               });
               connection.query("SELECT * FROM companies where name='" + companyName + "'", function (error, results, fields) {
                  if (error) throw error;
                  if (results.length > 0) {
                     results.forEach(element => {
                        company.push(
                           {
                              id: element.id,
                              name: element.name,
                           })
                     })
                     connection.query("INSERT INTO `teachers`(`email_responsible`, `first_name`, `last_name`, `id_course`, `companies_id`, `ritirato`) VALUES ('" + emailDocente + "','" + firstName + "','" + lastName + "'," + idCorso + "," + company[0].id + ",0)", function (error, result, fields) {
                        if (error) throw error;
                        sendEmails(emailDocente, objectEmail, textEmail)
                        connection.query("INSERT INTO `responsibles_auth`(`email`, `password`, `responsible_level`) VALUES ('" + emailDocente + "','" + hash + "',4)", function (errorAuth, resultAuth, fields) {
                           if (errorAuth) throw errorAuth;
                        });
                        return res.send({ error: false, result: result, message: 'ok' });
                     });
                  }
               });
            }
         });
      }
      else {
         return res.send({ error: false, message: 'esistente' });
      }
   });
});



app.put('/modifyPassword', function (req, res) {

   var password1 = req.body.password1
   var password2 = req.body.password2
   var email = req.body.email
   console.log(password1)
   console.log(password2)
   console.log(email)
   var salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(password1.toString(), salt);
   if (password1 === password2) {
      connection.query("UPDATE `responsibles_auth` SET `password`=? WHERE email=?", [hash, email], function (error, result, fields) {
         if (error) throw error;
         return res.send({ error: false, data: result, message: 'ok' });
      });
   } else {
      return res.send({ error: false, message: 'ko' });
   }
});

app.put('/forgotPassword', function (req, res) {
   var email = req.body.email
   var firstName = req.body.firstName
   var lastName = req.body.lastName

   var password = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
   var objectEmail = 'Credenziali Fitstic'
   var textEmail = 'Le comunichiamo che in seguito alla sua richiesta la password è stata resettata. La nuova password è : ' + password

   var salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(password.toString(), salt);


   connection.query("SELECT * FROM teachers where email_responsible='" + email + "'", function (e, row, fields) {
      if (e) throw error;
      if (row.length == 1) {
         connection.query("UPDATE `responsibles_auth` SET `password`=? WHERE email=?", [hash, email], function (error, result, fields) {
            if (error) throw error;
            sendEmails(email, objectEmail, textEmail)
            return res.send({ error: false, data: result, message: 'ok' });
         });
      } else {
         return res.send({ error: false, message: 'ko' });
      }
   })
});


app.put('/updateSignature/:id_lesson', function (req, res) {

   try {
      var data = []
      var email = req.body.email
      var id_lesson = req.params.id_lesson
      var startTime = req.body.startTime
      var endTime = req.body.endTime
      var dateOfModify = tools.formattedDate(new Date())

      var query = "UPDATE `signatures_students` SET `final_start_time`=?,`final_end_time`=?, `hours_of_lessons`=?, `modify_date`=? WHERE `id_lesson`= '" + id_lesson + "'  and `email_student`='" + email + "'"

      connection.query(query, [startTime, endTime, endTime - startTime, dateOfModify], function (error, results, fields) {
         if (error) throw error;
         data = results
         return res.send({ error: false, data: data, message: 'ok' });
      });
   } catch (error) {
      return res.send({ error: false, data: error, message: 'ko' });
   }
});



app.get('/lessons/:date/:id_course', function (req, res) {
   var data = [];
   var date_appoggio = req.params.date
   var id_course = req.params.id_course

   var data_Scelta = date_appoggio.split('-');
   var dataFinale = data_Scelta[2] + '-' + data_Scelta[1] + '-' + data_Scelta[0]
   connection.query("SELECT * FROM lessons WHERE date= '" + (dataFinale) + "' and id_course=" + id_course + "", function (error, results, fields) {
      if (error) throw error;
      results.forEach(element => {
         data.push(
            {
               email: element.email_signature,
               classroom: element.classroom,
               id: element.id,
               lesson: element.lesson,
               startTime: tools.formattedDecimal(element.start_time),
               endTime: tools.formattedDecimal(element.end_time)
            })
      })
      res.send(JSON.stringify(data));
   });
});


app.get('/lessonsTeacher/:id_company', function (req, res) {
   var data = [];
   var id_company = req.params.id_company

   connection.query("SELECT lessons.date,classroom,lessons.id,lesson,start_time,end_time,sum(hours_of_lessons) as hours_of_lessons, count(lessons.date) as numberStudents, lessons.total_hours as total_hours FROM lessons left join signatures_students on lessons.id= signatures_students.id_lesson WHERE companies_id=" + id_company + " GROUP by lessons.date, classroom, lessons.id", function (error, results, fields) {
      if (error) throw error;
      results.forEach(element => {
         data.push(
            {
               date: tools.formattedDate(element.date),
               classroom: element.classroom,
               id: element.id,
               lesson: element.lesson,
               startTime: tools.formattedDecimal(element.start_time),
               endTime: tools.formattedDecimal(element.end_time),
               percentuale: (element.hours_of_lessons / (element.numberStudents * element.total_hours)) * 100
            })
      })
      res.send(JSON.stringify(data));
   });
});

app.get('/listSignaturesStudents/:data_scelta/:id_course', function (req, res) {
   var data = []
   var date_appoggio = req.params.data_scelta
   var id_course = req.params.id_course
   var data_Scelta = date_appoggio.split('-');
   var dataFinale = data_Scelta[2] + '-' + data_Scelta[1] + '-' + data_Scelta[0]

   connection.query("SELECT final_start_time,final_end_time,mattinaPomeriggio,first_name,last_name,id_lesson,email from students join signatures_students on signatures_students.email_student=students.email where signatures_students.date='" + dataFinale + "' and ritirato=0 and id_course=" + id_course, function (error, results, fields) {
      if (error) throw error;
      results.forEach(element => {

         data.push(
            {
               mattinaPomeriggio: element.mattinaPomeriggio,
               firstName: element.first_name,
               lastName: element.last_name,
               email: element.email,
               idLesson: element.id_lesson,
               emailStudent: element.email,
               startTime: tools.formattedDecimal(element.final_start_time) != 1 ? tools.formattedDecimal(element.final_start_time) : 'assente',
               endTime: tools.formattedDecimal(element.final_end_time) != 1 ? tools.formattedDecimal(element.final_end_time) : 'assente'
            })
      })
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
   connection.query("SELECT first_name,last_name,email,residence,SUM(hours_of_lessons) as hours_of_lessons,SUM(lost_hours) as lost_hours,fiscal_code,date_of_birth,ritirato FROM students left join signatures_students on students.email=signatures_students.email_student where id_course= " + id_course + " GROUP BY email", function (error, results, fields) {
      if (error) throw error;

      results.forEach(element => {
         var percentage = ((element.hours_of_lessons * 100) / totalHours[0].totalHours).toFixed(0)

         data.push(
            {
               firstName: element.first_name,
               lastName: element.last_name,
               email: element.email,
               fiscalCode: element.fiscal_code,
               dateOfBirth: element.date_of_birth,
               residence: element.residence,
               hoursOfLessons: tools.formattedDecimal(element.hours_of_lessons),
               percentage: (percentage) ? (percentage) + " %" : '0',
               ritirato: element.ritirato
            })
      })
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
      console.log("arrivo", email)
      var ritirato = req.body.ritirato

      var query = "UPDATE `students` SET `ritirato` = ? WHERE `email` = ?";
      console.log(query)
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
   const courseID = escape(req.body.corso);


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

         if (tokenExpire < (new Date())) {
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
         const queryProf = 'SELECT id FROM companies WHERE name like "%' + teacher + '%" ';
         connection.query(queryProf, function (errorProf, resultsProf, fields) {
            if (errorProf) { throw reject(new Error(errorProf)); }
            if (resultsProf.length == 0) { resolve(false); } else { resolve(resultsProf[0].id); }
         });
      });
   }


   let LeassonCheck = (lessontype) => {
      return new Promise(function (resolve, reject) {
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
         singleEvents: true,
         orderBy: 'startTime',
      }, async (err, resu) => {
         if (err) return console.log('The API returned an error: ' + err);
         const events = resu.data.items;

         var errori = [];
         var datiInsert = [];

         if (events.length) {

            events.map(async (event, i) => {
               var riga = {}

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
                  const checkLeasson = lessontype;

                  if (checkProf === false) {
                     riga.prof = "Sconosciuto";
                  }

                  if (Object.entries(riga).length !== 0) {
                     riga.dataStart = dateStart;
                     riga.dataEnd = dateEnd;
                     errori.push(riga);
                  } else {
                     datiInsert.push([lessontype, checkProf, classroom, courseID, tools.formattedDate(dateStart), timeStart, timeEnd, totalHours, tools.formattedDate()])
                  }

               } catch (err) {
                  return res.send({ error: false, data: err, message: 'Errore di salvataggio dei dati' });
               }
            }); //fine map

         } else {
            return res.send({ error: false, message: 'Non sono stati trovanti eventi salvati nel calendario' });
         }

         var interval = setInterval(() => {
            if (errori.length === 0) {

               const queryIns = 'INSERT INTO lessons (`lesson`, `companies_id`,`classroom`,`id_course`,`date`,`start_time`,`end_time`,`total_hours`,`creation_date`) VALUES ?';

               connection.query(queryIns, [datiInsert], function (errorIns, itemsIns, fields) {
                  if (errorIns) throw errorIns;

               });
               clearInterval(interval)
               return res.send({ error: false, message: 'calendaroOk' });
            }
            else {
               clearInterval(interval)
               return res.send({ error: false, data: errori, message: 'calendarioKo' });
            }
         }, 500);
      });
   }
});


var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})