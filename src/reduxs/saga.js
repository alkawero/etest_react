/*
author alka@2019
*/
import {setUserLogin,setTahunPelajaran} from './actions'
import {call, put, takeEvery,takeLatest,all} from 'redux-saga/effects'
import {doGet,doPost} from 'apis/api-service'
import {doGetDummy} from 'tests/api-dummy'

let api = process.env.REACT_APP_BACKEND_MODE ==='DEV' ?  process.env.REACT_APP_DEV_API : process.env.REACT_APP_LOCAL_API

export const api_url = api+'/api/'

export function* rootSaga(){
yield all([
    takeEvery('login',login),
    ])
}

export function* login(action){
    
    try {
        const user = yield doGet('user/'+action.payload.username)
        yield put(setUserLogin(user.data));
        yield getTahunPelajaran()
    } catch (e) {
        console.log(e)
    }
}

export function* getTahunPelajaran(){
    const params ={group:'tahun_pelajaran', status:1,single:'single'}
    try {
        const response = yield doGet('param',params)
        yield put(setTahunPelajaran(response.data));
    } catch (e) {
        console.log(e)
    }
}

//still not used, may be used later
export function* getRoleAccessMap(action){
    try{
        const role_access_map = [
            {   role:'super',
                pages:['student_dashboard','pages1'],
             },
            {role:'std',
            pages:['student_dashboard','pages2']}
        ]
    }
    catch(e){
        console.log(e)
    }
}

