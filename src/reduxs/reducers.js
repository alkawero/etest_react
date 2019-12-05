/*
author alka@2019
*/
import produce from "immer";
const initial  = {
    user:null,
    ui:{
        snack_show:false,
        snack_txt:'',
        snack_var:'info',
        loading:false,
        error:''        
    },
    role_access_map:[],
    exam:{
        taken_exams:[]    
    } ,
    setting:{

    },
    
}

export default function appReducer(prev=initial,action){
    switch (action.type) {
        case 'setUserLogin':
        return produce(prev, state =>{
            state.user= action.payload
        })

        case 'logout':
        return produce(prev, state =>{
            state.user= null
            state.ui={
                snack_show:false,
                snack_txt:'',
                snack_var:'info',
                loading:false,
                error:''        
            }
        })
        
        case 'showSnackbar':
        return produce(prev, state =>{
            state.ui= {
                ...state.ui,
                snack_show:true,
                snack_txt:action.payload.t,
                snack_var:action.payload.v}
        })

        case 'hideSnackbar':
        return produce(prev, state =>{
            state.ui= {
                ...state.ui,
                snack_show:false}
        })
        
        case 'loading':
        return produce(prev, state =>{
            state.ui= {
                ...state.ui,
                loading:action.payload}
        })

        case 'setActivePage':
        return produce(prev, state =>{
            state.ui= {
                ...state.ui,
                active_page:action.payload}
        })

        case 'setTahunPelajaran':
        return produce(prev, state =>{
            state.setting= {
                ...state.setting,
                tahunPelajaran:action.payload}
        })
        
        case 'setExamsData':
        return produce(prev, state =>{
            state.exam= {
                ...state.exam,
                exam_data:action.payload}
        })

        case 'setExamStatus':
        return produce(prev, state =>{
            state.exam= {
                ...state.exam,
                exam_status:action.payload}
        })
        
        case 'setGlobalError':
        return produce(prev, state =>{
            state.ui= {
                ...state.ui,
                error:action.payload}
        })        
        case 'addTakenExam':
        return produce(prev, state =>{
            state.exam= {
                ...state.exam,
                taken_exams:[...state.exam.taken_exams,action.payload]
            }
        })
        
        case 'setExamDone':
            return produce(prev, state =>{
                state.user= {...state.user,status:1}
            })

        default:
            return prev
    }
}
