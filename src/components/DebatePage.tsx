import Room from '@/interfaces/Room'
import TopBar from './TopBar'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import Bubble from './Bubble'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Home from '@/pages'
import ReactDOM from 'react-dom'

export default function DebateWaitingPage({
  socket,
  room: _room,
}: {
  socket: Socket
  room: Room
}) {
  const [room, setRoom] = useState(_room)
  const [bubbles, setBubbles] = useState<JSX.Element[]>([])
  const [phase, setPhase] = useState<number[]>([])

  useEffect(() => {
    socket.on('chat', (chat) => {
      setBubbles((prevBubbles) => [
        ...prevBubbles,
        <Bubble
          name={chat.author.id}
          color={
            chat.author.group === room.groups[0]
              ? 'text-red-500'
              : 'text-blue-500'
          }
          text={chat.text}
        />,
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

    socket.on('phase', (phase) => {
      setPhase(phase)
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

  return (
    <div>
      <TopBar />
      <div className='flex flex-row h-10 items-center'>
        <span className='p-5 text-3xl font-bold'>{room.topic}</span>
        <button className='text-3xl' onClick={leave}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  )
}
