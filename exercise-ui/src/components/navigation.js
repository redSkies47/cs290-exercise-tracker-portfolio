import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav class="crumbs">
        <ol>
            <li class="appName">Exercise Tracker</li>
            <li class="crumb"><Link to="/">Home</Link></li>
            <li class="crumb"><Link to="/add-exercise">Add</Link></li>
        </ol>
    </nav>
  );
}

export default Navigation;