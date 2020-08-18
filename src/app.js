import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import errorhandler from 'errorhandler'
import apiRouter from './api/api'

const app = express()
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(errorhandler());

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({ nope: true });
    } else {
        next();
    }
}

app.use(ignoreFavicon);
app.use('/api', apiRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))