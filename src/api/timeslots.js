const express = require('express');
import pool from '../helpers/connection'

const timeslotsRouter = express.Router({ mergeParams: true });

//return all timeslots appointed at param day
timeslotsRouter.get("/", (req, res, next) => {
    pool.query(`SELECT * FROM timeslots WHERE timeslots.days_of_work_id= '${req.day[0].id}' `, function (error, timeslots, fields) {
        if (error) {
            next(error)
        }
        res.status(200).json({ timeslots: timeslots })
    });
})

//post booked timeslot
timeslotsRouter.post("/", (req, res, next) => {

    const { timeslot_start, timeslot_end, is_available } = req.body
    const days_of_work_id = req.day[0].id

    if (!days_of_work_id || !timeslot_start || !timeslot_end || !is_available) {
        return res.sendStatus(403);
    }

    var sql = "INSERT INTO timeslots SET";
    var values = {
        days_of_work_id,
        timeslot_start,
        timeslot_end,
        is_available
    }

    pool.query(sql, values, function (error, results, fields) {
        if (error) {
            next(error)
        }
        res.status(200).json({ response: "Appointment has been Booked!" })
    });

})

export default timeslotsRouter;