import axios from 'axios'
import {user,pages,accesses,users} from './dummyData'

export const doGetDummy = (dummy_data) =>{
  if(dummy_data==='user'){
    return user
  }
  else if(dummy_data==='pages'){
    return pages
  }
  else if(dummy_data==='accesses'){
    return accesses
  }
  else if(dummy_data==='users'){
    return users
  }

  
}
export const fakeGet = (url,payload) =>{
    axios.get(`${url}/${payload}`)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });  
}

export const fakePost = (url,payload) =>{
    axios({
        method: 'post',
        url: url,
        data: {
          satu: payload.satu,
          dua: payload.dua
        }
      });
}



