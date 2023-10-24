import React, { useState } from 'react';

function LeftPanel() {
  // Define a state variable called "count" with an initial value of 0
  const [count, setCount] = useState(0);


  return (
    <div className='bg-red=500 w-[20%]'>
      LEFT
    </div>
  );
}

export default LeftPanel;
