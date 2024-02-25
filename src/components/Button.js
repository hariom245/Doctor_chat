import React from 'react'

const Button = ({
    label ='',
    className='',
    type=''
}) => {
    return (
        <button className={`text-white mt-6 bg-primary hover:bg-primary  focus:ring-4 focus:outline-none 
        focus:ring:blue-300 font-medium rounded-lg text-sm w-1/2  px-5 py-2.5 text-center {className}`}>{label}</button>
    )
}

export default Button
