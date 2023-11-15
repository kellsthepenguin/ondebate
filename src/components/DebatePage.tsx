import Room from '@/interfaces/Room'
import TopBar from './TopBar'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton'
import Input from './Input'
import Bubble from './Bubble'

export default function DebatePage({
  socket,
  room: _room,
}: {
  socket: Socket
  room: Room
}) {
  const [room, setRoom] = useState(_room)
  const [bubbles, setBubbles] = useState<JSX.Element[]>([])

  useEffect(() => {
    socket.on('join', (user) => {
      const newRoom = Object.assign({}, room)
      newRoom.users.push(user)

      setRoom(newRoom)
    })

    socket.on('chat', (chat) => {
      setBubbles([...bubbles, <Bubble name={chat.id} text={chat.text} />])
    })
  }, [])

  return (
    <div>
      <TopBar />
      <p className='p-5 text-3xl font-bold'>{room.topic}</p>
      <div className='flex flex-row gap-5'>
        <div className='pl-5'>
          <p className='mt-3 mb-2 text-3xl font-bold text-red-500'>
            {room.groups[0]}
          </p>
          <div className='w-[30vw] h-[calc(80vh-73.6px)] outline outline-gray-400 rounded-md p-5'>
            {room.users.map((user) => {
              if (user.group === room.groups[0]) {
                return (
                  <div className='outline outline-black p-2 text-red-500 w-40'>
                    {user.id}
                  </div>
                )
              }
            })}
          </div>
        </div>
        <div>
          <p className='mt-3 mb-2 text-3xl font-bold text-blue-500'>
            {room.groups[1]}
          </p>
          <div className='w-[30vw] h-[calc(80vh-73.6px)] outline outline-gray-400 rounded-md p-5'>
            {room.users.map((user) => {
              if (user.group === room.groups[1]) {
                return (
                  <div className='outline outline-black p-2 text-blue-500 w-40'>
                    {user.id}
                  </div>
                )
              }
            })}
          </div>
        </div>
        <div className='ml-auto pr-5'>
          <p className='mt-3 mb-2 text-3xl font-bold'>채팅</p>
          <div className='w-[35vw] h-[calc(80vh-73.6px)] outline outline-gray-400 rounded-md p-5 flex flex-col'>
            <div className='flex flex-col-reverse h-full mb-3'>{bubbles}</div>
            <Input type='text' placeholder='채팅' className='mt-auto' />
          </div>
        </div>
      </div>
      <div className='absolute b-0 pl-5 pt-3'>
        <PrimaryButton>토론 시작하기</PrimaryButton>
      </div>
    </div>
  )
}
