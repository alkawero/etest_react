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
        loading:false        
    },
    role_access_map:[],
    test:{
        end_time:'',
        start:false
    },
    setting:{

    }
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
        

        default:
            return prev
    }
}
