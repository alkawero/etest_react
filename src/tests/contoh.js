import { doGet, doPost } from '../../apis/api-service';
import {doGetDummy} from 'tests/api-dummy'

//async
const click = async() =>{
    let a = await doGetExternalApi('https://reqres.in/api/users/2')
    console.log(a.data.data)
    const payload = {
        "name": "morpheus",
        "job": "leader"
    }
    let b = await doPost('https://reqres.in/api/users',payload)
    console.log(b)

    let c = await doGet('/api/users/2')
}

//contoh push history
const goTo = (link)=>{
    props.history.push(link)
}

const show = () =>{
    props.showSnackbar('success','ini hanya info')
}

const closeSnackBar = () => {props.hideSnackbar()}
    

//ambil data dummy
const response = doGetDummy('pages');


<p onClick={()=>show()}>open snackbar</p>
        
//css after
const style = {'&:after':{
    left: '100%',
    top: '25%',
    border: 'solid transparent',
    content: "' '",
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none',
    borderColor: 'rgba(255, 255, 255, 0)',
    borderLeftColor: '#ffffff',
    borderWidth: '10px',
    marginTop: '-10px',
}
}