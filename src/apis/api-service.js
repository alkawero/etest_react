import axios from 'axios'
import store from 'reduxs/store'
import {loading,showSnackbar} from 'reduxs/actions'

let host = process.env.REACT_APP_BACKEND_MODE ==='PROD' ?  process.env.REACT_APP_API_PROD : process.env.REACT_APP_API_LOCAL

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
    params:params,
    headers: {'Accept': '*/*'}
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

export const doSilentPost = async(path,payload) =>{
  store.dispatch(loading(true))
  return await axios({
        method: 'post',
        url: api_host+path,
        data: payload
      })
      .then((rsp)=>{
        store.dispatch(loading(false))
        return {data:rsp.data}})
      .catch((error)=>{
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error','posting error'))
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
        store.dispatch(showSnackbar('success','upload to server success'))
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

export const doDownloadPdf = async(path,params={}) =>{
  store.dispatch(loading(true))
  return await axios.get(api_host+path,{
    params:params,
    responseType: 'blob'
  })
      .then((rsp)=>{
        store.dispatch(loading(false))
        const url = window.URL.createObjectURL(new Blob([rsp.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
        })
      .catch((error)=>{
        console.log(path)
        console.log(error)
        store.dispatch(loading(false))
        store.dispatch(showSnackbar('error','ups something wrong, let IT team fix this'))
        return {error:error}
        });
}
