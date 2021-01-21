/*
author alka@2019
*/
import {setUserLogin,setTahunPelajaran,setExamsData,setExamStatus,setGlobalError, setExamDone} from './actions'
import {call, put, takeEvery,takeLatest,all} from 'redux-saga/effects'
import {api_host, doGet,doPost,doSilentPost} from 'apis/api-service'
import {doGetDummy} from 'tests/api-dummy'

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
            response  = yield doGet('user/student',action.payload)
        }else{
            //const user = yield doGet('user/'+action.payload.username)
            response = yield doSilentPost('loginx',action.payload)
        }
        if(!response.data.error){
            yield put(setGlobalError(''));
            yield put(setUserLogin(response.data));
            yield getTahunPelajaran(response.data)
        }else{
            yield put(setGlobalError(response.data.error));
        }

    } catch (e) {
        console.log(e)
    }
}

export function* getTahunPelajaran(user){
    const params ={group:'tahun_pelajaran', status:1,single:'single'}
    try {
        let header = {"Authorization": user.token}
        const response = yield doGet("param", params, header);
        yield put(setTahunPelajaran(response.data));
    } catch (e) {
        console.log(e)
    }
}

export function* getExamsData(action){
    try {
        yield put(setExamsData(null))
        let header = {"Authorization": action.payload.user.token}
        const response = yield doGet('exam/detail/'+action.payload.exam.id, {}, header)
        const soals = response.data.rancangan.soals
        let soal_nums = Array.from(Array(soals.length),(x,index)=> ++index);
        soal_nums.sort(() => Math.random() - 0.5);
        let i = 0;
        const randomSoals = soals.map(soal=>{
            return {
                id:soal,
                soal_num:soal_nums[i++],                
            }
        })
        const examData = {...response.data,soals:randomSoals}
        yield put(setExamsData(examData))
        yield put(setExamStatus('start'))
    } catch (e) {
        console.log(e)
    }
}

export function* finishExam(action){
    try {
        let header = {"Authorization": action.payload.user.token}
        const params = action.payload
        const response = yield doSilentPost('exam/finish',params,header)

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
