const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_c372',
    database: 'hoodmas'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;