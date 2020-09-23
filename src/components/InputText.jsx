import React,{useState,useEffect} from 'react'
import TextField from "@material-ui/core/TextField";
import { useDebounce } from 'react-use';


const InputText = (props) => {
    const [text, setText] = useState("");
    const [debouncedText, setDebouncedText] = useState('')
    useDebounce(
        () => {
            props.onChange(text)
        },
        500,
        [text]
      );
    const handleChange=(e)=>{
        if(!props.readOnly)
        setText(e.target.value)
    }

    useEffect(() => {
        if(props.input){
            setText(props.input)
        }
      }, [props.input]);
    return(
        <TextField margin="dense" label="Judul" fullWidth value={text} onChange={handleChange}/>       
    )
}

export default InputText;

