import React from 'react';
import ExerciseList from '../components/ExerciseList';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage({ setExerciseToEdit }) {
    const [exercises, setExercises] = useState([]);
    const history = useHistory();

    const onDelete = async _id => {
        const response = await fetch(`/exercises/${_id}`, {method: 'DELETE'});
        if (response.status === 204) {
            // const newMovies = movies.filter(m => m._id !== _id);
            // setMovies(newMovies);
            setExercises(exercises.filter(m => m._id !== _id));
        } else {
            console.error(`Failed to delete movie with _id = ${_id}, status code = ${response.status}`);
        }
    };

    const onEdit = async exerciseToEdit => {
        setExerciseToEdit(exerciseToEdit);
        history.push('/edit-exercise');
    }

    const loadExercises = async () => {
        const response = await fetch('/exercises');
        const data = await response.json();
        setExercises(data);
    }

    useEffect( () => {
        loadExercises();
    }, []);

    return (
        <body>
            <p>Log an exercise by pressing <em>add</em> above.</p>
            <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit}></ExerciseList>
        </body>
    );
}

export default HomePage;