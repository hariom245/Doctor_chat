import React from 'react'

const  Input=({
    label = '',
    name='',
    placeholder='',
    type='text',
    isRequired = false,
    className='',
    value='',
    inputClassname='',
    onChange=()=>{}
})=> {
  return (
    <div className='w-1/2'>
        <label htmlFor={name} className='block  text-sm font-medium text-gray-900 ' > {label}</label>
        <input id={name}  type={type} placeholder={placeholder} className={`bg-grey-50 border border-gray-300 te xt-gray-900 text-sm rounded-lg
         focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className} ${inputClassname}`} onChange={onChange} value={value} required={isRequired}/>
    </div>
  )
}
export default Input
