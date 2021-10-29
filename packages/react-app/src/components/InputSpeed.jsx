import { /*useRef,*/ useState } from 'react';
import {svgNumForm, svgSpeed, svgColor, svgSetColorStart, colorsTabs} from "../App";

export let inputSvgSpeed = 0;
export let inputSvgColorStart = '';
export let inputSvgColorEnd  = '';
let svgState = true;

export function setSpeedTrue() {
  svgState = true;
}

export function InputSpeed(props) {
  const { svgSpeedInternal, svgColorStartInternal, svgColorEndInternal, svgNumFormInternal } = props;
  const [speedChange, setSpeedChange] = useState();
  const [colorStartChange, setColorStartChange] = useState();
  const [colorEndChange, setColorEndChange] = useState();

  let title = ['FACE TOP', 'FACE BOTTOM', 'BACKGROUND', 'DISK BOTTOM', 'DISK TOP'];

/*   const colorsTabs = [
    ['#04006C', '#640C98', '#9C005E', '#E1005E', '#D3162E', '#EE0C0E'],
    ['#04006C', '#0419D1', '#00C4FF', '#00E6FF', '#00F8FF', '#00FFE8'],
    ['#04006C', '#2000A2', '#371BA4', '#1114BF', '#0C0E80', '#2830FF'],
    ['#04006C', '#5647B2', '#9991D1', '#BBB6E0', '#DDDAF0', '#FAEBF0'],
    ['#04006C', '#04466C', '#04909A', '#40C2AE', '#6FD1C2', '#CFF0EB']
  ]; */

  if (svgState) {
    inputSvgSpeed = svgSpeed[svgNumForm];
    inputSvgColorStart = svgColor[(svgNumForm * 2)];
    inputSvgColorEnd = svgColor[(svgNumForm * 2) + 1];
    setSpeedChange(svgSpeed[svgNumForm]);
    setColorStartChange(svgColor[(svgNumForm * 2)]);
    setColorEndChange(svgColor[(svgNumForm * 2) + 1]);
    svgState = false;
  }

  const handleChange = (svgData, e) => {
    if (e.target.name == "speed"){
        inputSvgSpeed = e.target.value;
        //console.log("svgSetSpeed handleChange: ", inputSvgSpeed);
        setSpeedChange(inputSvgSpeed);
    }
    if (e.target.name == "colorStart"){
        inputSvgColorStart = e.target.value;
        //console.log("inputSvgColorStart : ", inputSvgColorStart);
        setColorStartChange(inputSvgColorStart);
    }
    if (e.target.name == "colorEnd"){
        inputSvgColorEnd = e.target.value;
        //console.log("inputSvgColorEnd handleChange: ", inputSvgColorEnd);
        setColorEndChange(inputSvgColorEnd);
    }  }

  //console.log("InputSpeed svgSpeed[svgNumForm]: ",svgSpeed[svgNumForm]);{ svgSetColorStart }

  return (
    <div>
        <div style={{ paddingTop: 10, paddingBottom: 10 }}><h4>Animate Color: {title[svgNumForm]}</h4></div>
        <div className="row" style={{ marginBottom: 10 }}>
        <div className="col-6 justify-content-end" style={{ paddingRight: 10 }} ><label>Speed:</label></div>
        <div className="col-6 justify-content-start">
            <input key={svgSpeedInternal} style={{ color: '#000', width: '50%' }} type="number" name="speed" min="0" max="30" defaultValue={inputSvgSpeed} onChange={(e) => { handleChange(0, e); }} />
        </div>
        </div>

        <div className="row style={{marginBottom: 5}}">
            <div className="col-6 justify-content-end"><label style={{ paddingRight: 10 }} >Color Start:</label></div>
            <div className="col-3 justify-content-start">
            <select key={svgColorStartInternal} style={{ color: '#000', width: '90%' }} name="colorStart" defaultValue={inputSvgColorStart} onChange={(e) => { handleChange(1, e); }} >
                {colorsTabs[svgNumForm].map(i => (
                    <option key={i} value={i}>
                        {i}
                    </option>
                ))}

            </select>
            </div>
            <div className="col-3 justify-content-start PopupColorPreview" style={{backgroundColor: `${inputSvgColorStart}`, minWith: 50, maxWidth: 70, border: 'solid', borderWidth: '1px', borderColor: 'white' }}>&nbsp;</div>
        </div>

        <div className="row style={{marginBottom: 5}}">
            <div className="col-6 justify-content-end"><label style={{ paddingRight: 10 }} >Color End:</label></div>
            <div className="col-3 justify-content-start">
                <select key={svgColorEndInternal} style={{ color: '#000', width: '90%' }} name="colorEnd" defaultValue={inputSvgColorEnd} onChange={(e) => { handleChange(2, e); }} >
                    {colorsTabs[svgNumForm].map(i => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-3 justify-content-start" style={{ backgroundColor: `${inputSvgColorEnd}`, minWith: 50, maxWidth: 70, border: 'solid', borderWidth: '1px', borderColor: 'white' }}>&nbsp;</div>
        </div>

    </div>
);

}