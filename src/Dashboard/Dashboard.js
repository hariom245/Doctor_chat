import React, { useEffect, useRef, useState } from 'react'
import Input from "../components/Input"
import {io} from 'socket.io-client';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userDetail')));
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({})
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([]);
  const [socket,setSocket]=useState(null)
  const messageRef=useRef()

useEffect(() => {
  setSocket(io('http://localhost:8000'))

}, [])

useEffect(() => {
  socket?.emit('addUser',user?.id)
  socket?.on('getUser',users=>{
  console.log('users:>>',users)
  })
  socket?.on('getMessage',data=>{
    console.log(data)
    setMessages(prev=>({
       ...prev,
       messages:[...prev.messages,{user:data.user,message:data.message}]
    }))
  })

}, [socket])

useEffect(() => {
 messageRef?.current?.scrollIntoView({behaviour:'smooth'})
}, [messages?.messages])


  useEffect(() => {
    const loggedinUser = JSON.parse(localStorage.getItem('userDetail'));
    const fetchConversation = async () => {
      const res = await fetch(`http://localhost:5000/api/conversation/${loggedinUser?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const response = await res.json();
      setConversations(response);
    }
    fetchConversation()
  }, [])

  useEffect(() => {
    const fetchusers = async () => {
      const res = await fetch(`http://localhost:5000/api/users/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const resusersa = await res.json();
      setUsers(resusersa);
    }
    fetchusers();
  }, [])

  const fetchMessage = async ( conversationId, reciever ) => {
    const res = await fetch(`http://localhost:5000/api/messages/${conversationId}?senderId=${user?.id}&&recieverId=${reciever?.recieverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const resData = await res.json();
    setMessages({ messages: resData, reciever, conversationId });

  }

  const sendMessage = async (e) => {
    socket?.emit('sendMessage',{
      conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        recieverId: messages?.reciever?.recieverId
    })
    const res = await fetch('http://localhost:5000/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        recieverId: messages?.reciever?.recieverId
      })
    })
    setMessage('');

  }




  return (
    <div className='w-screen flex'>
      <div className='w-[25%]  h-screen bg-secondary'>
        <div className='flex justify-center items-center my-8  '>
          <div style={{ border: "inset" }} className="border p-[2px] rounded-full"><img style={{ borderRadius: "50%" }} src="https://th.bing.com/th/id/OIP.O-l--JTRTS09vxklqe4jywHaHa?rs=1&pid=ImgDetMain" alt="error" width={75} height={75} /></div>
          <div className="ml-4">
            <div className='text-2xl'>Personal </div>
            <p className='text-lg'>Your Account</p>
          </div>
        </div>
        <hr />
        <div className='ml-14 mt-10 '>
          <div className='text-primary ml-10'>Messages</div>
          <div>
            {
              conversations.map(({ conversationId, user }) => {
                return (
                  <div className='flex items-center py-5 border-b border-b-gray-300 cursor-pointer' onClick={() => fetchMessage( conversationId, user )}>
                    <div style={{ border: "inset" }} className="border p-[2px] rounded-full"><img style={{ borderRadius: "50%" }} src='https://th.bing.com/th/id/OIP.O-l--JTRTS09vxklqe4jywHaHa?rs=1&pid=ImgDetMain' width={50} height={50} alt="error" /></div>
                    <div className='ml-4'>
                      <div className='text-lg'>{user?.fullname}</div>
                      <p className='text-sm font-light text-gray-400'>{user?.email}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* Right */}
      <div className='w-[50%] bg-white h-screen flex flex-col items-center'>
        {
          messages?.reciever?.fullname &&
          <div className="w-[75%] h-[80px] rounded-full mt-14  bg-secondary flex items-center px-10">
            <div><img style={{ borderRadius: "50%" }} src="https://th.bing.com/th/id/OIP.O-l--JTRTS09vxklqe4jywHaHa?rs=1&pid=ImgDetMain" alt="error" width={50} height={50} /></div>
            <div className="flex flex-col">
              <div className='text-xl font-bold ml-4'>   {messages.reciever.fullname}  </div>
              <div className='text-sm ml-4 text-gray-400'> {messages.reciever.email}</div>
            </div>
          </div>
        }

        <div className='w-full h-[75%] px-10 py-14 overflow-auto '>

          <div >
            {
              messages?.messages?.length > 0 ?
                messages.messages.map(({ message, user: { id } = {} }) => {
                   return (
                    <>
                      <div className={`max-w-[40%]  mb-4  p-2 rounded-b-xl ${id===user?.id ?'rounded-tl-xl ml-auto  bg-secondary':'bg-primary text-white rounded-tr-xl'}`}>{message}</div>
                      <div ref={messageRef}></div>
                      </>
                    )
                  
                }) : <div className='text-center text-lg font-semibold mt-14'>No Messages</div>
            }
          </div>
        </div>
        {
          messages?.reciever?.fullname &&
          <div className=' p-12 w-full flex '>

            <Input placeholder='Type a message ....' value={message} onChange={(e) => { setMessage(e.target.value) }} inputClassname=' w-[160%] p-4 border-0 shadow-md rounded full bg-light outline-none ' />
            <i className={`fa-solid fa-paper-plane m-auto cursor-pointer ${!message?'hidden':''}`} onClick={(e) => sendMessage(e)}></i>

          </div>
        }

      </div>

      <div className='w-[25%]  h-screen px-8 py-10 bg-secondary overflow-scroll'>
        <div className='bg-primary'>Doctors</div>
        <div>
          {users.length > 0 ?
            users.map(({ user }) => {
              // console.log(user)
              return (
                <div className='flex items-center py-5 border-b border-b-gray-300 cursor-pointer' onClick={() => fetchMessage('new', user)}>
                  <div style={{ border: "inset" }} className="border p-[2px] rounded-full"><img style={{ borderRadius: "50%" }} src='https://th.bing.com/th/id/OIP.O-l--JTRTS09vxklqe4jywHaHa?rs=1&pid=ImgDetMain' width={50} height={50} alt="error" /></div>
                  <div className='ml-4'>
                    <div className='text-lg'>{user?.fullname}</div>
                    <p className='text-sm font-light text-gray-400'>{user?.email}</p>
                  </div>
                </div>
              )
            }) : <div className='text-center text-lg font-semibold mt-14'>No Messages</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
