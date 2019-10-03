import React from 'react'


const Conditional = (props) => {
    if(props.condition===true){
      return(
        <>
        {props.children}
        </>
        )
    }else{
      return null
    }
    
}

export default Conditional;

