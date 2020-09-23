/*
author alka@2019
*/
export const isLogged = (user) =>{    
    if(user!==null && user.pages && user.pages){
        return true
    }else{
        return false
    }
}

