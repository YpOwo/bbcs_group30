// import required modules
const express = require('express'); // ease the data transfering system
const bodyParser = require('body-parser'); // to process the form in front-end
const mysql = require('mysql2'); // database
const multer = require('multer'); // upload images
const session = require('express-session'); // managing sessions
const flash = require('connect-flash'); // store and retrieve temporary messages (e.g. notifications, error messages)
const connection = require('./db'); // import the database connection

// creates express application
const app = express();
app.set('view engine', 'ejs'); // Setting EJS as the view engine
app.use(bodyParser.urlencoded({ extended: false})); // Middleware to parse request bodies
app.use(express.static('public/images')); // get images from file "public/images"
// set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware for session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: {maxAge: 1000 * 60 * 60 *24 * 7}
}));
// configuring flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error'); // make flash messages appear in template
    next();
})
// TO DO: later comeback when sign up page done to do a "validation function for new user signup"

/* mysql database test connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_c372',
    database: 'hoodmas'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});*/

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});



// get login, signup page
// get hoods
app.get('/login', (req, res) => {
    const sql = 'SELECT * FROM hoods ORDER BY hoods ASC'
    // Fetch data from MySQL
    connection.query( sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving hoods');
        }
        if (results.length === 0) {
            // Handle case when no data is returned
            return res.status(404).send('No hoods found in the database.');
        }
        // Render HTML page with data
        res.render('login', { hoods: results });
    });
});

// post sign up
app.post('/submit', (req, res) => {
    // Extract new user data from the request body
    const { username, email, password, userImage } = req.body;
    const sql = 'INSERT INTO users (username, email, password, userImage) VALUES (?, ?, ?, ?)';
    // insert the new user into the database
    connection.query( sql, [username, email, password, userImage], (error, results) => {
        if (error) {
            // handles any error that occurs during the database operation
            console.error("Error adding user:", error);
            res.status(500).send('Error adding user');
        } else {
            // Send a success response
            res.redirect('/login');
        }
    })
})

// login specific user (session)
app.get('/login', (req, res) => {

    res.render('login', {
        messages: req.flash('success'), // Retrieve success messages from the session and pass then to the view
        errors: req.flash('error') // Retrieve error messages from the session and pass them to the view
    });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // validate email and password
    if (!username || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/login');
    }

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            // Successful login
            req.session.user = results[0]; // store user in session
            req.flash('success', 'Login successful!');
            res.redirect('/');
        } else {
            // Invalid credentials
            req.flash('error', 'Invalid username or password.');
            res.redirect('/login');
        }
    });
});
// homepage after user login
app.get('/',(req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    // pass user data to homepage.ejs
    res.render('homepage', { users: req.session.user});
});
// logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


// under homepage
// games page
app.get('/games', (req, res) => {
    res.render('games');
});

// secret santa page
app.get('/secretsanta', (req, res) => {
    res.render('secret_santa');
});

// generosity corner page
app.get('/gencorner', (req, res) => {
    res.render('generositycorner');
});

// clothes page
app.get('/clothes', (req, res) => {
    res.render('clothes');
});

// food page
app.get('/food', (req, res) => {
    res.render('food');
});

// volunteer page
app.get('/volunteer', (req, res) => {
    res.render('volunteer');
});


