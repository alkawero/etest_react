/*
author alka@2019
*/
import React from 'react';
import { Link } from "react-router-dom";


const NotFoundPage = () => {
    return(
        <div>
            ups, sorry ... the page you want is not found,{' '}
            <Link to='/'>back to home</Link>
        </div>
    )
}

export default NotFoundPage