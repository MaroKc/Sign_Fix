var mysql = require('mysql');

exports.createConnectionDB = () => {
    var con = mysql.createConnection({
        host: "localhost",
        user: "",
        password: "",
        database: ''
      });
    return con;
  }
