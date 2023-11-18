import Room from '@/interfaces/Room'
import TopBar from './TopBar'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton'
import Bubble from './Bubble'
import ChatInput from './ChatInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Home from '@/pages'
import ReactDOM from 'react-dom'
import DebatePage from './DebatePage'

export default function DebateWaitingPage({
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
      setBubbles((prevBubbles) => [
        ...prevBubbles,
        <Bubble name={chat.author.id} text={chat.text} />,
      ])
    })

    socket.on('leave', (id) => {
      const newRoom = Object.assign({}, room)
      newRoom.users.splice(newRoom.users.findIndex((user) => user.id === id))

      setRoom(newRoom)
    })

    socket.on('disband', () => {
      alert('방이 해산되었습니다.')
      ReactDOM.render(<Home />, document.getElementById('root'))
    })

    socket.on('kick', () => {
      alert('방장에 의해 추방당했습니다.')
      ReactDOM.render(<Home />, document.getElementById('root'))
    })

    socket.on('start', () => {
      room.phase = 1
      ReactDOM.render(
        <DebatePage socket={socket} room={room} />,
        document.getElementById('root')
      )
    })
  }, [])

  const onSendTriggered = async (text: string) => {
    const { error, ok } = await (
      await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('token'), text }),
      })
    ).json()

    if (!ok) return alert(error)
  }

  const leave = async () => {
    const { error, ok } = await (
      await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('token') }),
      })
    ).json()

    if (!ok) return alert(error)
    ReactDOM.render(<Home />, document.getElementById('root'))
  }

  const start = async () => {
    const { error, ok } = await (
      await fetch('/api/phase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          phase: 1,
        }),
      })
    ).json()

    if (!ok) return alert(error)
    ReactDOM.render(
      <DebatePage socket={socket} room={room} />,
      document.getElementById('root')
    )
  }

  return (
    <div>
      <TopBar />
      <div className='flex flex-row h-10 items-center'>
        <span className='p-5 text-3xl font-bold'>{room.topic}</span>
        <button className='text-3xl' onClick={leave}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
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
            <div className='flex flex-col-reverse overflow-y-scroll h-full'>
              {bubbles.reverse()}
            </div>
            <ChatInput onSendTriggered={onSendTriggered} />
          </div>
        </div>
      </div>
      {room.owner.id ===
      JSON.parse(atob(localStorage.getItem('token')?.split('.')[1]!)).id ? (
        <div className='absolute b-0 pl-5 pt-3'>
          <PrimaryButton onClick={start}>토론 시작하기</PrimaryButton>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
