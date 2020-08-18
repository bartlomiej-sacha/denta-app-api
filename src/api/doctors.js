import express from 'express'
import pool from '../helpers/connection'
import daysOfWorkRouter from './daysOfWork';

const doctorsRouter = express.Router();

doctorsRouter.use('/:doctorId/days-Of-work', function (req, res, next) {
    req.doctorId = req.params.doctorId;
    next();
}, daysOfWorkRouter);

//callback for route parameter which attaches doctor returned from database to request object
doctorsRouter.param('doctorId', (req, res, next, doctorId) => {
    pool.query(`SELECT * FROM doctors WHERE doctors.id = '${doctorId}'`, function (error, doctor) {
        if (error) {
            next(error)
        } else if (doctor) {
            req.doctor = doctor;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

//return single doctor by id
doctorsRouter.get('/:doctorId', (req, res, next) => {
    res.status(200).json(req.doctor);
});

//return all doctors
doctorsRouter.get("/", (req, res, next) => {
    pool.query('SELECT * FROM doctors', function (error, doctors, fields) {
        if (error) {
            next(error);
        }
        res.status(200).json({ doctors: doctors })
    });
})

export default doctorsRouter;