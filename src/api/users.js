import express from 'express'
import pool from '../helpers/connection'
import bcrypt from 'bcrypt'
import { generateTokens, secret } from '../helpers/tokens'
import jwt from 'jsonwebtoken'
import appointmentsRouter from './appointments'

const usersRouter = express.Router({ mergeParams: true });
usersRouter.use('/:userId/appointments', appointmentsRouter);

//callback for route parameter which attaches user returned from database to request object
usersRouter.param('userId', (req, res, next, userId) => {
    pool.query(`SELECT * FROM users WHERE users.id = '${userId}'`, function (error, user) {
        if (error) {
            return res.status(500).json(error);
        } else if (user) {
            req.user = user;
            next();
        } else {
            return res.sendStatus(404);
        }
    });
});

//splits authorization header and attaches decoded token to request object
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const decoded = jwt.verify(bearerToken, secret.TOKEN_SECRET_JWT);
        req.decodedToken = decoded;
        next();
    } else {
        // Forbidden
        return res.sendStatus(403);
    }
}

//return decoded token
usersRouter.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({ response: req.decodedToken.data });
});

//handle response for user logging
usersRouter.post("/login", (req, res, next) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        return res.status(500).json({ response: 'Please fill input fields!' });
    }

    pool.query(`SELECT * FROM users WHERE user_name = '${user_name}'`, function (error, results, fields) {
        if (error) {
            return res.status(404);
        }
        try {
            const hash = results[0].password;
            if (bcrypt.compareSync(password, hash)) {
                const tokens = generateTokens(req, user_name)
                res.cookie('token', tokens, { httpOnly: true });
                res.json({ tokens, response: "Login sucessful!", id: results[0].id });
            } else {
                res.status(404).json({ error: "Wrong password!" })
            }
        } catch (error) {
            res.status(404).json({ error: "Wrong user name!" })
        }
    });
})

//handle response for user registration
usersRouter.post("/", (req, res, next) => {
    const { user_name, first_name, last_name, birth_date, city, street, house_number, postal_code, phone_number } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10)

    if (!user_name || !first_name || !last_name || !birth_date || !password || !city || !street || !house_number || !postal_code || !phone_number) {
        return res.sendStatus(403);
    }

    var sql = "INSERT INTO users SET ?";
    var values = {
        user_name, first_name, last_name, birth_date, password, city, street, house_number, postal_code, phone_number
    }

    pool.query(sql, values, function (error, results, fields) {
        if (error) {
            return res.status(409).json({ error: 'User name exists!' })
        }
        res.status(200).json({ response: 'Registration complete!', results })
    });
})

export default usersRouter;