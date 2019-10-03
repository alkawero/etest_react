import axios from 'axios'
import store from 'reduxs/store'
import {loading,showSnackbar} from 'reduxs/actions'

let host = process.env.REACT_APP_BACKEND_MODE ==='DEV' ?  process.env.REACT_APP_DEV_API : process.env.REACT_APP_LOCAL_API

export const api_host = host+'/api/'

export const doGetExternalApi = async(url) =>{
  store.dispatch(loading(true))  
  return await axios.get(url)
      .then((rsp)=>{         
        store.dispatch(loading(false))
        return{data:rsp.data, error:''}      
        })
      .catch((error)=>{
        store.dispatch(loading(false))
        return {data:'', error:error}
        });  
}

export const doGet = async(path,params={}) =>{
  store.dispatch(loading(true))
  return await axios.get(api_host+path,{
    params:params
  })
      .then((rsp)=>{         
        store.dispatch(loading(false))
        return{data:rsp.data}      
        })
      .catch((error)=>{
        console.log(path)
        console.log(error)
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error','ups something wrong, let IT team fix this'))
        return {error:error}
        });  
}


export const doPost = async(path,payload,activity) =>{
  store.dispatch(loading(true))  
  return await axios({
        method: 'post',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('success',activity+' success'))
        return {data:rsp.data}})
      .catch((error)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error',activity+' error'))
        console.log(error)
      })
}


export const doUpload = async(path,payload) =>{
  return await axios({
        method: 'post',
        url: api_host+path,
        data: payload,
        headers:{'content-type': 'multipart/form-data' }
      })
      .then((rsp)=>{        
        return rsp
      })
      .catch((error)=>{
        
        console.log(error)
      })
}

export const doPut = async(path,payload,activity) =>{
  store.dispatch(loading(true))  
  return await axios({
        method: 'put',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('success',activity+' success'))
        return {data:rsp.data}})
      .catch((error)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error',activity+' error'))
        console.log(error)
      })
}

export const doPatch = async(path,payload,activity) =>{
  store.dispatch(loading(true))  
  return await axios({
        method: 'patch',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('success',activity+' success'))
        return {data:rsp.data}})
      .catch((error)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error',activity+' error'))
        console.log(error)
      })
}

export const doDelete = async(path,payload,activity) =>{
  store.dispatch(loading(true))  
  return await axios({
        method: 'delete',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('success',activity+' success'))
        return {data:rsp.data}})
      .catch((error)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error',activity+' error'))
        console.log(error)
      })
}