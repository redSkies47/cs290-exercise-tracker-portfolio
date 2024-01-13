import 'dotenv/config';
import * as exercises from './exercise_model.mjs';
import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

/**
 * Create a new exercise with the name, reps, weight, unit, and date provided in the body
 */
app.post('/exercises', 
// name must be string of at least one character
body('name').isLength({ min: 1 }),
// reps & weight must be an integer greater than 0
body('reps').isInt({ gt: 0 }),
body('weight').isInt({ gt: 0}), 
// unit must be string of either 'kgs' or 'lbs'
body('unit').isIn(['kgs', 'lbs']),
// date must be a string in the format MM-DD-YY
(req, res) => {

    // Find the validation errors in this request and wraps them in an object with handy function
    const errors = validationResult(req);
    if (!errors.isEmpty() || !isDateValid(req.body.date)) {
        return res.status(400).json({ Error: 'Invalid request' });
    }

    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: 'Invalid request' });
        });
});

/**
* Validates if the string provided is in a valid date format
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseID = req.params._id;
    exercises.findExerciseById(exerciseID)
        .then (exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Retrieve exercises.
 * If the query parameters include a name, reps, weight, unit, and date, then only the movies
 * matching that are returned.
 * Otherwise, all exercises are returned.
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    // Is there a query parameter named _ ? If so add a filter based on its value.
    // EDIT THIS!!
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.json(exercises);
        })
        .catch(error => {
            console.error(error);
            res.status(404).json({ Error: 'Not found' });
        });
});

/**
 * Update the exercise whose ID is provided in the path parameter and set
 * its name, reps, weight, unit, and date to the values provided in the body.
 */
app.put('/exercises/:_id', 
// name must be string of at least one character
body('name').isLength({ min: 1 }),
// reps & weight must be an integer greater than 0
body('reps').isInt({ gt: 0 }),
body('weight').isInt({ gt: 0}), 
// unit must be string of either 'kgs' or 'lbs'
body('unit').isIn(['kgs', 'lbs']),
// date must be a string in the format MM-DD-YY
(req, res) => {

    const errors2 = validationResult(req);
    if (!errors2.isEmpty() || !isDateValid(req.body.date)) {
        return res.status(400).json({ Error: 'Invalid request' });
    }

    // Find the validation erros in this request and wraps them in an object with handy function
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({_id: req.params._id, 
                    name: req.body.name, 
                    reps: req.body.reps, 
                    weight: req.body.weight, 
                    unit: req.body.unit, 
                    date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Invalid request' });
        });
});

/**
 * Delete the exercise whose ID is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});