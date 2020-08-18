const express = require('express');
import pool from '../helpers/connection'
import timeslotsRouter from './timeslots'

const daysOfWorkRouter = express.Router({ mergeParams: true });
daysOfWorkRouter.use('/:date/timeslots', timeslotsRouter);

//callback for route parameter which attaches day selected by date and doctor id from days_of_work table to request object
daysOfWorkRouter.param('date', (req, res, next, date) => {
    const doctorId = req.params.doctorId;

    pool.query(`SELECT * FROM days_of_work WHERE days_of_work.date = '${date}' AND days_of_work.doctor_id = ${doctorId} LIMIT 1`, function (error, day) {
        if (error) {
            res.status(500).json(error);
        } else if (day.length !== 0) {
            req.day = day;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

//return single day
daysOfWorkRouter.get('/:date', (req, res, next) => {
    res.status(200).json({ day: req.day[0] });
});

export default daysOfWorkRouter;