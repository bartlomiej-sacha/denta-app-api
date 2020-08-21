import express from 'express'
import pool from '../helpers/connection'
import cookieParser from 'cookie-parser';

const appointmentsRouter = express.Router({ mergeParams: true });

//return user appointments
appointmentsRouter.get("/", (req, res, next) => {
    const userId = req.params.userId;
    pool.query(`SELECT timeslots.timeslot_start, timeslots.timeslot_end, doctors.first_name, doctors.last_name, days_of_work.appointment_duration, days_of_work.date, appointments.id
    FROM appointments
    INNER JOIN timeslots ON appointments.timeslots_id = timeslots.id
    INNER JOIN days_of_work ON timeslots.days_of_work_id = days_of_work.id
    INNER JOIN doctors ON days_of_work.doctor_id = doctors.id
    INNER JOIN users ON appointments.user_id = users.id
    WHERE appointments.user_id = ${userId}`, function (error, appointments, fields) {
        if (error) {
            next(error)
        } else {
            res.status(200).json({ appointments: appointments })
        }
    });
})

//post user appointment
appointmentsRouter.post("/", (req, res, next) => {
    const { date, timeslot_start, timeslot_end, is_available, doctor_id } = req.body;
    const userId = req.params.userId;

    if (!date || !timeslot_start || !timeslot_end || !is_available || !doctor_id || !userId) {
        return res.sendStatus(403);
    }

    //?transaction in future?
    //get day of 'to be created' appointment from days_of_work table by date & doctor id
    pool.query(`SELECT * FROM days_of_work WHERE days_of_work.date = '${date}' AND days_of_work.doctor_id = ${doctor_id}`, function (error, day) {
        if (error) {
            next(error)
        } else if (day.length !== 0) {

            const days_of_work_id = day[0].id;


            var sql = "INSERT INTO timeslots SET ?";
            var values = {
                days_of_work_id,
                timeslot_start,
                timeslot_end,
                is_available,
            };
            //?find a way to restructure it. operations on timeslots table in appointment router?//
            //insert timeslot related to the selected day 
            pool.query(sql, values, function (error, results, fields) {
                if (error) {
                    next(error)
                }

                const timeslots_id = results.insertId;

                var sql = "INSERT INTO appointments SET ?";
                var values = {
                    user_id: userId,
                    timeslots_id,
                }

                //insert appointment related to user and created timeslot
                pool.query(sql, values, function (error, results, fields) {
                    if (error) {
                        next(error)
                    }
                    res.status(200).json({ response: "Appointment has been Booked!" })
                });
            })
        } else {
            res.sendStatus(404);
        }
    });
})

export default appointmentsRouter;