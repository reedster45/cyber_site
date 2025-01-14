
import { fileURLToPath } from 'url';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser'


const app = express();
const port = 3000;

// Convert the current module URL to a file path and derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());






// home.ejs
app.get('/', async (req, res) => {
    res.render('home');
});




// listening on port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});