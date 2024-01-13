import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const AddExercisePage = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');

    const history = useHistory();

    const addExercise = async () => {
        const newExercise = {name, reps, weight, unit, date};
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 201) {
            alert("Successfully added the exercise");
        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        history.push('/')
    };

    return (
        <body>
            <h3>Add an exercise</h3>
            <fieldset>
                <input 
                    type="text"
                    placeholder="Enter name here"
                    value={name}
                    onChange={e => setName(e.target.value)} />
                <input
                    type="Number"
                    placeholder="Enter reps here"
                    value={reps}
                    onChange={e => setReps(e.target.value)} />
                <input 
                    type="number"
                    placeholder="Enter weight here"
                    value={weight}
                    onChange={e => setWeight(e.target.value)} />
                <select value={unit} onChange={e => setUnit(e.target.value)}>
                    <option value="kgs">kgs</option>
                    <option value="lbs">lbs</option>  
                </select>
                <input
                    type="text"
                    placeholder="Enter date as MM-DD-YY"
                    value={date}
                    onChange={e => setDate(e.target.value)} />
                <button
                    onClick={addExercise}
                >Save</button>
            </fieldset>
        </body>
    );
}

export default AddExercisePage;