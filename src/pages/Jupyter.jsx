import React from 'react'

const Jupyter = () => {
  return (
    <div className='w-full' > 
        <iframe
        src="https://jupyterlite.github.io/demo/lab/index.html"
        width="100%"
        height="750px"
      >
      </iframe>
    </div>
  )
}

export default Jupyter