import React from 'react';

const Protected = ({current,only,children}) => { 
    if(current.includes(only)){
        return  (<>{children}</>);
    }else{
        return null
    }
}



export default Protected;