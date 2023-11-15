import Room from '@/interfaces/Room'
import TopBar from './TopBar'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

export default function DebatePage({
  socket,
  room: _room,
}: {
  socket: Socket
  room: Room
}) {
  const [room, setRoom] = useState(_room)
  useEffect(() => {
    socket.on('join', (user) => {
      const newRoom = Object.assign({}, room)
      newRoom.users.push(user)

      setRoom(newRoom)
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
          <div className='w-[30rem] h-[50rem] outline outline-gray-400 rounded-md p-5'>
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
          <div className='w-[30rem] h-[50rem] outline outline-gray-400 rounded-md p-5'>
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
      </div>
    </div>
  )
}
