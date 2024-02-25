import React, { useState } from 'react'
import Input from './Input'
import Button from './Button'
import { useNavigate } from 'react-router-dom'

export default function Form({
    isSigninPage = true,
}) {
    const [data, setdata] = useState({
        ...(isSigninPage && {
            fullname: ''
        }),
        email: '',
        password: ''
    })
    
    const navigate=useNavigate()

    const handleSubmit=async(e)=>{
        e.preventDefault();
        const res=await fetch(`http://localhost:5000/api/${isSigninPage?'createuser':'login'}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        })
        if(res.status===400) alert("fill correct credentials");
        if( isSigninPage && res.status===500) alert("user with same email id already exists");
        if(res.status===500) alert("login with correct credentials");
        else{
            const resData=await res.json();
            if(resData.token){
                localStorage.setItem('user:token',resData.token);
                localStorage.setItem('userDetail',JSON.stringify(resData.user));
                navigate('/');
            }
        }
        
    }

    return (
        <div className='bg-light h-screen flex justify-center items-center' onSubmit={(e)=>handleSubmit(e)}>
        <div className='bg-white w-[600px] h-[650px] border shadow-lg rounded-lg flex flex-col justify-center items-center'>
            <form className='w-full  flex flex-col justify-center items-center'>
            <div className='text-4xl font-extrabold'>{isSigninPage ? "Welcome" : "WelcomeBack"}</div>
            <div className='text-xl font-light mb-14'>SignUp to explore new</div>
            {isSigninPage && <Input label="Full Name" placeholder="Type your name" name="name" className="mb-6" value={data.fullname} onChange={(e)=> setdata({...data,fullname:e.target.value})}/>}
            <Input label="Email" placeholder="Type Your email" type='email' name="email" className="mb-6" value={data.email} onChange={(e)=> setdata({...data,email:e.target.value})} />
            <Input label="Password" placeholder="Type your password" name="password" className="mb-6" value={data.password} onChange={(e)=> setdata({...data,password:e.target.value})}/>
            <Button label={isSigninPage ? 'Sign in' : 'Sign up'} type='button' className='mb-14' />
            <div onClick={()=>{navigate(`/users/${isSigninPage?'signin':'signup'}`)}}>{isSigninPage ? 'Already have an account? ' : 'Dont have an account?  '}  <span className='text-primary cursor-pointer' >{isSigninPage ? 'Sign in' : 'Sign up'}</span></div>
            </form>
        </div>
        </div>
    )
}
