import React,{useState,useEffect} from 'react'
import TextField from "@material-ui/core/TextField";
import { useDebounce } from 'react-use';


const DebouncedTextField = (props) => {
    const [text, setText] = useState("");

    useDebounce(
        () => {
            if(props.onChange){
              if(props.objectKey){
                props.onChange(props.objectKey,text)
              }else{
                props.onChange(text)
              }
            }
        },
        400,
        [text]
      );
    const handleChange=(e)=>{  
        if(!props.readOnly)setText(e.target.value)
    }

    useEffect(() => {
        if(props.value){
            setText(props.value)
        }else{
            setText("") //it will make the ui updating / render
        }

      }, [props.value]);

    return(
        <TextField
        type={props.type?props.type:"text"}
        id={props.id}
        margin={props.margin}
        label={props.label}
        fullWidth = {props.fullWidth}
        value={text}
        variant={props.variant}
        style={props.style}
        size={props.size}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        InputProps={props.InputProps}
        multiline = {props.multiline}
        rows={props.multiline?3:1}
        />
    )
}

export default DebouncedTextField;
