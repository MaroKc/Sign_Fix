var mysql = require('mysql');

exports.createConnectionDB = () => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "sign_fix"
      });
    return con;
  }
