var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var crypto = require('crypto')


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


let PrimoAccesso = (studentEmail) => {
   return new Promise(function (resolve, reject) {

      var shasum = crypto.createHash('sha1')
      shasum.update(studentEmail)
      const codice = shasum.digest('hex');

      const queryPrimo = "INSERT INTO authentications (email_student, code) VALUES (?, ?)";
      connection.query(queryPrimo, [studentEmail, codice], function (errorPrimo, resultsPrimo, fields) {
         if (errorPrimo) { throw reject(new Error(errorPrimo)); }
         if (resultsPrimo.length == 0) {
            resolve({ error: true, message: false });
         } else {
            resolve(
               {
                  error: false,
                  code: codice
               });
         }
      });
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

         connection.query("SELECT id_course, email, email_fitstic, code, first_name, last_name FROM students s LEFT JOIN authentications a ON a.email_student = s.email WHERE email_fitstic ='" + email + "'", async function (error, items, fields) {

            if (error) throw error;

            if (items.length > 0) {
               var codice = null;

               if (items[0].code === null) {
                  var tmp = await PrimoAccesso(items[0].email);
                  codice = tmp.code;
               } else {
                  codice = items[0].code;
               }

               return (
                  res.send({ error: false, data: items[0], message: 'Studente trovato' })
               );
            } else {
               return res.send({ error: false, data: {email : false, emailFit: email}, message: 'Utente Non Presente' });
            }
         })

      });

   }
   verify().catch(console.error);
});


app.get('/fitsticEmail/:email', function (req, res) {

   var emailStu = req.params.email;
   connection.query("SELECT id_course, email, email_fitstic FROM students s WHERE email = ?", [emailStu], async function (error, items, fields) {
      if (error) throw error;

      if (items.length > 0) {
         try {

            var codice = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            var objectEmail = 'Conferma Mail'
            var textEmail = 'Il Codice per confermare l\'identità è il seguente : ' + codice
            sendEmails(emailStu, objectEmail, textEmail)

            connection.query("UPDATE students SET codice_conferma = ? WHERE email = ?", [codice, emailStu], function (error, result, fields) {
               if (error) throw error;
               if (result.changedRows == 1) {
                  return (res.send({ error: false, message: 'Codice Inviato' }));
               } else {
                  return (res.send({ error: true, message: 'Righe Duplicate' }));
               }
            });

         } catch (error) {
            return (res.send({ error: true, message: 'Errore Generico' }));
         }

      } else {
         return res.send({ error: true, message: 'Email Non Presente' });
      }
   })
})

app.post('/fitsticEmail', function (req, res) {

   const emailFit = req.body.emailFit;
   const email = req.body.email;
   const codice = req.body.codice;

   connection.query("UPDATE students SET email_fitstic = ? WHERE email = ? and codice_conferma = ?", [emailFit, email, codice], async function (error, items, fields) {
      if (error) throw error;
      if (items.changedRows == 1) {
         return (res.send({ error: false, message: 'Email Collegata' }));
      } else {
         return (res.send({ error: true, message: 'Righe Duplicate' }));
      }
   })
})


app.post('/auth', function (req, res) {
   var pass = req.body.pass
   var query = 'SELECT * FROM responsibles_auth WHERE email = ?'
   connection.query(query, [req.body.email], function (error, results, fields) {
      if (error) {
         throw error;
      } else {
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


let LeassonExist = (studentEmail, Data, ora, timeExtraEntrata, timeExtraUscita) => {
   return new Promise(function (resolve, reject) {

      const queryLeasson = "SELECT l.id, l.start_time, l.end_time, l.date, k.id as sign, l.total_hours FROM lessons l LEFT JOIN students s ON s.id_course = l.id_course LEFT JOIN signatures_students k ON k.id_lesson = l.id and k.email_student = s.email where s.email = '" + studentEmail + "' and l.date = '" + Data + "' and (l.start_time - " + timeExtraEntrata + " <= " + ora + " and end_time + " + timeExtraUscita + " >= " + ora + ")";
      connection.query(queryLeasson, function (errorLeasson, resultsLeasson, fields) {
         if (errorLeasson) { throw reject(new Error(errorLeasson)); }
         if (resultsLeasson.length == 0) {
            resolve({ error: true, message: false });
         } else {
            resolve(
               {
                  error: false,
                  message: {
                     id: resultsLeasson[0].id,
                     start: resultsLeasson[0].start_time,
                     end: resultsLeasson[0].end_time,
                     date: resultsLeasson[0].date,
                     sign: resultsLeasson[0].sign,
                     hour: resultsLeasson[0].total_hours
                  }
               }
            );
         }
      });
   });
}

app.post('/badge', function (req, res) {

   const qr = req.body.qr;
   const datetimeNow = new Date();
   const Data = tools.formattedDate(datetimeNow);
   const ora = datetimeNow.getHours() + (datetimeNow.getMinutes() / 0.6) / 100;
   //DA FARE IN SETTINGS
   const timeExtraEntrata = 0.25;
   const timeExtraUscita = 1;

   //Una volta che ho il QR faccio una select per trovare l'email associata
   connection.query('SELECT * FROM authentications WHERE Code = ' + connection.escape(qr), async function (error, results, fields) {
      if (error) throw error;

      if (results.length == 1) {

         const email = results[0].email_student;
         const dati = await LeassonExist(email, Data, ora, timeExtraEntrata, timeExtraUscita);
         var firma = null;

         if (!dati.error) {

            if (dati.message.sign === null) {
               (dati.message.start <= ora ? firma = dati.message.start : firma = Math.ceil(ora / 5) * 5)
               const queryIns = 'INSERT INTO signatures_students (email_student, date, current_start_time, final_start_time, id_lesson) VALUES (?, ?, ?, ?, ?)';
               connection.query(queryIns, [email, Data, datetimeNow, firma, dati.message.id], function (errorIns, itemsIns, fields) {
                  if (errorIns) throw errorIns;
                  res.send({ error: false, message: "Entrata registrata" });
               });
            } else {
               (dati.message.end <= ora ? firma = dati.message.end : firma = (Math.ceil(ora / 5) * 5) - 5)
               var query = "UPDATE signatures_students SET current_end_time = ?, final_end_time = ?, hours_of_lessons = ?, lost_hours = ? WHERE id = ?";
               connection.query(query, [datetimeNow, firma, firma + ' - final_start_time', dati.message.end + ' - ' + firma + ' - final_start_time', dati.message.sign], function (error, results, fields) {
                  if (error) throw error;
                  res.send({ error: false, message: "Uscita registrata" });
               });
            }

         } else {
            res.send({ error: true, message: false });
         }
      } else {
         res.send({ error: true, message: false });
      }
   });
});


app.get('/getCode/:email', function (req, res) {

   var email =req.params.email
   //var ruolo = 1;
      connection.query("SELECT * FROM `authentications` WHERE email_student='"+email+"'", function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: true, data: results, message: 'ok' });
      });
})


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

app.post('/studentBadge', function (req, res) {

   const email = req.body.email;
   const datetimeNow = new Date();
   const Data = tools.formattedDate(datetimeNow);
   const ora = datetimeNow.getHours() + (datetimeNow.getMinutes() / 0.6) / 100;
   //DA FARE IN SETTINGS
   const timeExtraEntrata = 0.25;
   const timeExtraUscita = 1;

   //Una volta che ho il QR faccio una select per trovare l'email associata
   connection.query("SELECT * FROM students WHERE email = '" + email+"'", async function (error, results, fields) {
      if (error) throw error;

      if (results.length == 1) {

         const email = results[0].email_student;
         const dati = await LeassonExist(email, Data, ora, timeExtraEntrata, timeExtraUscita);
         var firma = null;

         if (!dati.error) {

            if (dati.message.sign === null) {
               (dati.message.start <= ora ? firma = dati.message.start : firma = Math.ceil(ora / 5) * 5)
               const queryIns = 'INSERT INTO signatures_students (email_student, date, current_start_time, final_start_time, id_lesson) VALUES (?, ?, ?, ?, ?)';
               connection.query(queryIns, [email, Data, datetimeNow, firma, dati.message.id], function (errorIns, itemsIns, fields) {
                  if (errorIns) throw errorIns;
                  res.send({ error: false, message: "Entrata registrata" });
               });
            } else {
               (dati.message.end <= ora ? firma = dati.message.end : firma = (Math.ceil(ora / 5) * 5) - 5)
               var query = "UPDATE signatures_students SET current_end_time = ?, final_end_time = ?, hours_of_lessons = ?, lost_hours = ? WHERE id = ?";
               connection.query(query, [datetimeNow, firma, firma + ' - final_start_time', dati.message.end + ' - ' + firma + ' - final_start_time', dati.message.sign], function (error, results, fields) {
                  if (error) throw error;
                  res.send({ error: false, message: "Uscita registrata" });
               });
            }

         } else {
            res.send({ error: true, message: false });
         }
      } else {
         res.send({ error: true, message: false });
      }
   });
});


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

app.get('/getCode/:email', function (req, res) {

   var email =req.params.email
   //var ruolo = 1;
      connection.query("SELECT * FROM `authentications` WHERE email_student='"+email+"'", function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: true, data: results, message: 'ok' });
      });
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

app.get('/getTeacher', function (req, res) {
   var data = []

   try {
      /*
      var emailMattina = req.body.emailMattina
      var emailPomeriggio = req.body.emailPomeriggio
*/
      connection.query("SELECT name FROM companies JOIN teachers ON companies.id = teachers.companies_id WHERE email_responsible =?", ['matteo@info.com'], function (error, results, fields) {
         if (error) throw error;
         results.forEach(element => { data.push({ name: element.name, email: 'pippa' }) }
         )
      });
      connection.query("SELECT name FROM companies JOIN teachers ON companies.id = teachers.companies_id WHERE email_responsible =?", ['matteo@info.com'], function (error, results, fields) {
         if (error) throw error;
         results.forEach(element => { data.push({ name: element.name, email: 'pippo' }) }
         )
         return res.send({ error: true, data: data, message: 'ok' });

      });

   } catch (error) {
      return res.send({ error: true, data: error, message: 'ko' });
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
      var company_name = req.body.company_name

      var query = "UPDATE `teachers` SET `first_name`=?,`last_name`=? WHERE `email_responsible` = ?";
      connection.query(query, [first_name, last_name, email], function (error, result, fields) {
         if (error) throw error;
         connection.query("SELECT companies_id FROM teachers WHERE email_responsible ='" + email + "'", function (errore, results, fields) {
            if (errore) throw errore;
            connection.query("UPDATE companies SET name=? WHERE id=?", [company_name, results[0].companies_id], function (err, item, fields) {
               if (err) throw err;
               res.send({ error: true, message: 'ok' });
            })
         })
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
   var textEmail = 'Gentile ' + firstName + ' ' + lastName + ', le comunichiamo che il suo account fitstic è stato abilitato, potrà accedervi all\'indirizzo : http://164.68.110.63/sing_fix/  con la seguente password:' + password

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

   var password = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
   var objectEmail = 'Credenziali Fitstic';
   var text = 'In seguito alla sua richiesta la password è stata resettata. Nuova password: ' + password;

   // var html = "<div>In seguito alla sua richiesta la password è stata resettata. Nuova PASSWORD: <b> {{password}} </b></div>";
   var salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(password.toString(), salt);

   connection.query("SELECT * FROM teachers where email_responsible='" + email + "'", function (e, row, fields) {
      if (e) throw error;
      if (row.length == 1) {
         connection.query("UPDATE `responsibles_auth` SET `password`=? WHERE email=?", [hash, email], function (error, result, fields) {
            if (error) throw error;
            sendEmails(email, objectEmail, text)
            return res.send({ error: false, data: result, message: 'ok' });
         });
      } else {
         return res.send({ error: false, message: 'ko' });
      }
   })
});

/*
app.post('/studentBadge', function (req, res) {
   try {
      const datetimeNow = new Date();
      const Data = tools.formattedDate(datetimeNow);
      const ora = datetimeNow.getHours() + (datetimeNow.getMinutes() / 0.6) / 100;
      //DA FARE IN SETTINGS
      const timeExtraEntrata = 0.25;
      const timeExtraUscita = 1;
      const email = req.body.email;

      const dati = await LeassonExist(email,Data,ora,timeExtraEntrata,timeExtraUscita);
      var firma = null;

      if (!dati.error) {

         if (dati.message.sign === null) {
            (dati.message.start <= ora ? firma = dati.message.start : firma = Math.ceil(ora/5)*5)
            const queryIns = 'INSERT INTO signatures_students (email_student, date, current_start_time, final_start_time, id_lesson) VALUES (?, ?, ?, ?, ?)';
            connection.query(queryIns, [email, Data, datetimeNow, firma, dati.message.id], function (errorIns, itemsIns, fields) {
               if (errorIns) throw errorIns;
               res.send({ error: false, message: "Entrata registrata" });
            });
         } else {
            (dati.message.end <= ora ? firma = dati.message.end : firma = (Math.ceil(ora/5)*5) - 5)
            var query = "UPDATE signatures_students SET current_end_time = ?, final_end_time = ?, hours_of_lessons = ?, lost_hours = ? WHERE id = ?";
            connection.query(query, [datetimeNow, firma, firma + ' - final_start_time', dati.message.end + ' - ' + firma + ' - final_start_time', dati.message.sign], function (error, results, fields) {
               if (error) throw error;
               res.send({ error: false, message: "Uscita registrata" });
            });
         }

      } else {
         res.send({ error: true, message: 'ko' });
      }
     
   } catch (error) {
      return res.send({ error: false, data: error, message: 'ko' });
   }
});
*/

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


app.put('/teacherBadge', function (req, res) {
   try {
      var email = req.body.email
      var date = req.body.date
      var startTime = tools.formattedToDecimal(req.body.startTime)
      var endTime = tools.formattedToDecimal(req.body.endTime)
      var lessonId = req.body.lessonId
      var hourOfLessons = endTime - startTime
      /*
      var email= 'capaneo92@gmail.com'
      var date = '2020-02-20'
      var startTime = tools.formattedToDecimal('13: 30')
      var endTime = tools.formattedToDecimal('17: 00')
      var lessonId =1
      var hourOfLessons = endTime - startTime
      */

      var query = "INSERT INTO `signatures_teachers`(`email_responsible`, `date`, `final_start_time`, `final_end_time`, `id_lesson`, `hours_of_lessons`) VALUES (?,?,?,?,?,?)"

      connection.query(query, [email, date, startTime, endTime, lessonId, hourOfLessons], function (error, result, fields) {
         if (error) throw error;
         if (result) {
            connection.query("UPDATE `lessons` SET  `email_signature`=? where `id` = ?", [email, lessonId], function (error, result, fields) {
               if (error) throw error;
               return res.send({ error: false, message: 'ok' });
            });
         }
      });

   } catch (error) {
      return res.send({ error: false, data: error, message: 'ko' });
   }
});


app.get('/getSignature', function (req, res) {
   connection.query("SELECT email_signature, id FROM lessons WHERE DATE(date) = CURDATE()", function (error, items, fields) {
      if (error) throw error;
      return res.send({ error: false, data: items, message: 'users list.' });
   });
});


app.get('/lessons/:date/:id_course', function (req, res) {
   var data = [];
   var dataFinale = req.params.date
   var id_course = req.params.id_course
   
   connection.query("SELECT name,email_signature,classroom,lessons.id,lesson,start_time,end_time FROM lessons join companies on lessons.companies_id=companies.id  WHERE date= '" + (dataFinale) + "' and id_course=" + id_course + "", function (error, results, fields) {
      if (error) throw error;
      results.forEach(element => {
         data.push(
            {
               name: element.name,
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
   var dataFinale = req.params.data_scelta
   var id_course = req.params.id_course


   connection.query("SELECT s.final_start_time, s.final_end_time, a.first_name, a.last_name,l .id as id_lesson, a.email FROM students a LEFT JOIN lessons l ON l.id_course = a.id_course LEFT JOIN signatures_students s ON s.email_student = a.email AND s.id_lesson= l.id where ritirato=0 and a.id_course=" + id_course + " and l.date='" + dataFinale + "'", function (error, results, fields) {
      if (error) throw error;
      results.forEach(element => {
         data.push(
            {
              // mattinaPomeriggio: element.final_start_time > 12 ? 1 : 0,
               firstName: element.first_name,
               lastName: element.last_name,
               email: element.email,
               idLesson: element.id_lesson,
               emailStudent: element.email,
               startTime: tools.formattedDecimal(element.final_start_time) != '0' ? tools.formattedDecimal(element.final_start_time) : 'assente',
               endTime: tools.formattedDecimal(element.final_end_time) != '0' ? tools.formattedDecimal(element.final_end_time) : 'assente'
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
               totalHours: totalHours[0].totalHours ? totalHours[0].totalHours : 0,
               percentage: isNaN(percentage) ? 0 :(percentage) ,
               ritirato: element.ritirato
            })
      })
      return res.send(JSON.stringify(data));
   });
});


app.get('/StudentPercentage/:email/:id', function (req, res) {
   var data = []
   try {
      //var email= 'dmycockf@posterous.com'
      var courseId = req.params.id
      var email = req.params.email
      var query = "SELECT lesson, sum(total_hours) as total_hours ,sum(hours_of_lessons)as hours_of_lessons FROM lessons l LEFT JOIN ( SELECT * FROM signatures_students where email_student = '"+email+"' ) s ON l.id = s.id_lesson where l.date <= CURRENT_DATE  and l.id_course ="+courseId+" GROUP by lesson"
      connection.query(query, [email], function (error, results, fields) {
         if (error) throw error;
         if (results.length !== 0) {
            results.forEach(element => {
               data.push({
                  lessonName: element.lesson,
                  totalHours: element.total_hours,
                  hoursOfLessons: element.hours_of_lessons,
                  percentage: ((element.hours_of_lessons * 100) / element.total_hours).toFixed(0)
               })
            });
            return res.send({ error: false, data: data, message: 'ok' });
         }
         else {
            return res.send({ error: false, message: 'Errore' });
         }

      });

   } catch (error) {
      return res.send({ error: false, message: 'ko' });
   }
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
            // console.log('Token Non Trovato');
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
               // console.log("Acces Token Refreshato e Salvato");
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
         var datierrore= false;

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
                  const checkLesson = lessontype;

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
                  datierrore= true
               }
            }); //fine map

            if (datierrore===true){
               return res.send({ error: true, message: 'Errore di inserimento' });
            }

         } else {
            return res.send({ error: true, message: 'Non sono stati trovanti eventi salvati nel calendario' });
         }

         var interval = setInterval(() => {
            if (errori.length === 0) {
               let curdata=new Date().toISOString().replace(/\T.+/, '')
               connection.query("DELETE  FROM lessons where id_course ="+courseID+" and date> '"+curdata+"'", function (errorIns, itemsIns, fields) {
                  if (errorIns) throw errorIns;

               });

               const queryIns = 'INSERT INTO lessons (`lesson`, `companies_id`,`classroom`,`id_course`,`date`,`start_time`,`end_time`,`total_hours`,`creation_date`) VALUES ?';

               connection.query(queryIns, [datiInsert], function (errorIns, itemsIns, fields) {
                  if (errorIns) throw errorIns;

               });

               clearInterval(interval)
               connection.query("UPDATE courses set token_calendar= '"+idCalendar+"' where id ="+courseID, function (errorIns, itemsIns, fields) {
                  if (errorIns) throw errorIns;

               });
               return res.send({ error: false, message: 'Il calendario è stato importato correttamente' });
            }
            else {
               clearInterval(interval)
               return res.send({ error: true, data: errori, message: 'Ci sono stati errori nell\'inserimento dei seguenti dati: '+errori });
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
