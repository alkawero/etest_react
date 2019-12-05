/*
author alka@2019
*/
import {setUserLogin,setTahunPelajaran,setExamsData,setExamStatus,setGlobalError, setExamDone} from './actions'
import {call, put, takeEvery,takeLatest,all} from 'redux-saga/effects'
import {doGet,doPost,doSilentPost} from 'apis/api-service'
import {doGetDummy} from 'tests/api-dummy'

let api = process.env.REACT_APP_BACKEND_MODE ==='DEV' ?  process.env.REACT_APP_DEV_API : process.env.REACT_APP_LOCAL_API

export const api_url = api+'/api/'

export function* rootSaga(){
yield all([
    takeEvery('login',login),
    takeEvery('getExamsData',getExamsData),  
    takeEvery('finishExam',finishExam),      
    ])
}

export function* login(action){    
    try {
        let response = null
        if(action.payload.role && action.payload.role==='student'){
            response  = yield doGet('user/student/',action.payload)                        
        }else{
            //const user = yield doGet('user/'+action.payload.username)
            response = yield doSilentPost('loginx',action.payload)            
        }
        if(!response.data.error){
            yield put(setGlobalError(''));
            yield put(setUserLogin(response.data));
            yield getTahunPelajaran()            
        }else{
            yield put(setGlobalError(response.data.error));
        }
        
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

export function* getExamsData(action){   
    try {        
        const response = yield doGet('exam/detail/'+action.payload.id)
        const soals = response.data.rancangan.soals        
        let soal_nums = Array.from(Array(soals.length),(x,index)=> ++index);
        soal_nums.sort(() => Math.random() - 0.5);
        let i = 0;
        const randomSoals = soals.map(soal=>{
            return {...soal,soal_num:soal_nums[i++]}}
            )
        const examData = {...response.data,soals:randomSoals}
        yield put(setExamsData(examData))
        yield put(setExamStatus('start'))
    } catch (e) {
        console.log(e)
    }
}

export function* finishExam(action){   
    try {        
        const params = action.payload        
        const response = yield doSilentPost('exam/finish',params)
        
        yield put(setExamDone())
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

