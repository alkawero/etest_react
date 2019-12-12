import React from "react";

const Protected = ({ current, only, children, access,ownerOnly,current_user,owner }) => {
  
  if(ownerOnly){
    if(current_user===owner){
      return <>{children}</>;
    }else{
      return null
    }
  }
  
  if (access) {
    let granted = false;
    current.forEach(cur => {
      if (access.includes(cur)) {
        granted = true;
      }
    });

    if (granted === true) return <>{children}</>;
  }

  if (current.includes(only)) {
    return <>{children}</>;
  }else{
    return null
  } 

  
};

export default Protected;
