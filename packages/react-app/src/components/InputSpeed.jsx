import { /*useRef,*/ useState, useEffect } from 'react';
import {svgNumForm, svgSpeed} from "../App";

export let inputSvgSpeed = 0;

export function InputSpeed(props) {
  //const inputRef = useRef();
  //const [validChange, setValidChange] = useState();
  //const { svgSpeed, svgNumForm} = props;
  const svgState = false;

  //const refInputSpeed = useRef();
  //refInputSpeed.current.defaultValue = svgSpeed[svgNumForm];
  
/*
  useEffect(() => {
    //setValidChange(svgSpeed);
    console.log('ValidChange in InputSpeed: ', svgSpeed);
    //inputRef.current.focus();
  }, [svgSpeed]);
*/

  const handleChange = (svgData, e) => {
    if (e.target.name == "speed"){
        //setValidChange(e.target.value);
        inputSvgSpeed = e.target.value;
        console.log("svgSetSpeed handleChange: ", inputSvgSpeed);
    }
    if (e.target.name == "colorStart"){
      svgSetColorStart = e.target.value;
      console.log("svgSetColorStart handleChange: ", svgSetColorStart);
    }
    if (e.target.name == "colorEnd"){
      svgSetColorEnd = e.target.value;
      console.log("svgSetColorEnd handleChange: ", svgSetColorEnd);
    }
    //setState(state => ({svgState: true}));
  }

  // Logs `undefined` during initial rendering
  //console.log(inputRef.current);
  console.log("svgSpeed[svgNumForm]: ",svgSpeed[svgNumForm]);

  return (
    <input style={{ color: '#000', width: '50%' }} type="number" name="speed" min="0" max="30" defaultValue={svgSpeed[svgNumForm]} onChange={(e) => { handleChange(0, e); }} />
  );

}