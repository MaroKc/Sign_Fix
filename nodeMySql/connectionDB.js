var mysql = require('mysql');

exports.createConnectionDB = () => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "fox",
        password: "taglierino2000",
        database: "sign_fix"
      });
    return con;
  }
