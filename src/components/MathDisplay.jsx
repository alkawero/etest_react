import React,{useEffect,useRef} from 'react'
import loadScript from 'load-script'

const MathDisplay = ({value, type}) => {
    const displayEl = useRef(null);

    const url = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML'
    
    loadScript(url,(err, script)=>{
      window.MathJax.Hub.Config({
          asciimath2jax: {
            delimiters: [['`','`'], ['$','$']]
          }
        });        
        
    })
    useEffect(() => {
      if(window.MathJax){
        window.MathJax.Hub.Queue(
          window.MathJax.Hub.Queue(["Typeset",window.MathJax.Hub,displayEl.current])          
        );
      }
      
      
    },[value]); 

    
    return (
        <div ref={displayEl} dangerouslySetInnerHTML={{ __html: value }}>        
          
        </div>
    );
}

export default MathDisplay;