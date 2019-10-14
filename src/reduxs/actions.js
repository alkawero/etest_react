/*
function name = action name
author alka@2019
*/

export function login(user){
    return{type:'login', payload:user}
}

export function setUserLogin(user){
    return{type:'setUserLogin', payload:user}
}

export function logout(){
    return{type:'logout'}
}

//available v 'success', 'warning', 'error', 'info'
export function showSnackbar(v,t){
    return{type:'showSnackbar',payload:{v:v,t:t}}
}

export function successSnackbar(t){
    return{type:'showSnackbar',payload:{v:'success',t:t}}
}

export function errorSnackbar(t){
    return{type:'showSnackbar',payload:{v:'error',t:t}}
}

export function infoSnackbar(t){
    return{type:'showSnackbar',payload:{v:'info',t:t}}
}

export function hideSnackbar(){
    return{type:'hideSnackbar'}
}

export function loading(bool){
    return{type:'loading',payload:bool}
}

export function setActivePage(page){
    return{type:'setActivePage',payload:page}
}

export function setTahunPelajaran(tahun){
    return{type:'setTahunPelajaran',payload:tahun}
}

export function setExamsData(exam){
    return{type:'setExamsData',payload:exam}
}

export function setExamStatus(status){
    return{type:'setExamStatus',payload:status}
}


