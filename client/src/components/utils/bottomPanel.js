import React, { useState } from 'react';
import {FaDiceD20} from 'react-icons/fa'
import {TiWeatherPartlySunny} from 'react-icons/ti'
import {RiSoundModuleLine} from 'react-icons/ri'

function BottomPanel() {
  // Define a state variable called "count" with an initial value of 0
  const [count, setCount] = useState(0);


  return (
    <span className='utils-bar absolute bottom-0 flex justify-items-center flex-row w-full'>
      <span><FaDiceD20/></span>
      <span><TiWeatherPartlySunny/></span>
      <span><RiSoundModuleLine/></span>
    </span>
  );
}

export default BottomPanel;
