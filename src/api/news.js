const express = require('express');
import pool from '../helpers/connection'

const newsRouter = express.Router();

newsRouter.get("/", (req, res, next) => {
    pool.query('SELECT * FROM news', function (error, news, fields) {
        if (error) {
            next(error)
        }
        res.status(200).json({ news: news })
    });
})

export default newsRouter;