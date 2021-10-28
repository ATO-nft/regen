import { useRef, useState, useEffect } from 'react';

export default function InputSpeed(props) {
  const inputRef = useRef();
  const [validChange, setValidChange] = useState();
  const svgSpeed = props;
  
  useEffect(() => {
    setValidChange(svgSpeed);
    console.log('ValidChange in InputSpeed: ', svgSpeed);
    //inputRef.current.focus();
  }, [svgSpeed]);

  const handleChange = (svgData, e) => {
    if (e.target.name == "speed"){
        setValidChange(e.target.value);
        console.log("svgSetSpeed handleChange: ", svgSpeed);
    }
    if (e.target.name == "colorStart"){
      svgSetColorStart = e.target.value;
      console.log("svgSetColorStart handleChange: ", svgSetColorStart);
    }
    if (e.target.name == "colorEnd"){
      svgSetColorEnd = e.target.value;
      console.log("svgSetColorEnd handleChange: ", svgSetColorEnd);
    }
  }

  // Logs `undefined` during initial rendering
  console.log(inputRef.current);
  
  return <input style={{ color: '#000', width: '50%' }} type="number" name="speed" min="0" max="30" defaultValue={svgSpeed} onChange={(e) => { handleChange(0, e); }} />;
}