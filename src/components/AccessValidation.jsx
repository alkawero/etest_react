
import React from 'react';
import { Redirect } from "react-router-dom";
    
const AccessValidation = ({user}) => {
        let redirect = <Redirect to={{ pathname: "/login" }} />

        if(user.pages){
            if(user.pages.length > 0){
                redirect = null
            }
        }
        

        return redirect        
}

export default AccessValidation