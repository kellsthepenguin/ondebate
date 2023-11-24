import Room from '@/interfaces/Room'
import TopBar from './TopBar'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import Bubble from './Bubble'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Home from '@/pages'
import ReactDOM from 'react-dom'
import ChatInput from './ChatInput'

export default function DebateWaitingPage({
  socket,
  room: _room,
}: {
  socket: Socket
  room: Room
}) {
  const [room, setRoom] = useState(_room)
  const [bubbles, setBubbles] = useState<JSX.Element[]>([])
  const [phase, setPhase] = useState<number>(1)
  const [isChatDisabled, setIsChatDisabled] = useState<boolean>(false)
  const phaseTexts = [
    `${room.groups[0]} 팀 입론`,
    `${room.groups[1]} 팀 확인 질문`,
    `${room.groups[1]} 팀 입론`,
    `${room.groups[0]} 팀 확인 질문`,
    `${room.groups[0]} 팀 반박`,
    `${room.groups[1]} 팀 반박`,
    '투표',
  ]

  useEffect(() => {
    const id = JSON.parse(
      atob(localStorage.getItem('token')?.split('.')[1]!)
    ).id
    const user = room.users.find((user) => user.id === id)!

    if (room.groups[1] === user.group) setIsChatDisabled(true)
    if (user.isSpectator) setIsChatDisabled(true)

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
      if (user.isSpectator) return
      if (
        (room.groups[0] === user.group && phase === 2) ||
        phase === 3 ||
        phase === 6
      ) {
        setIsChatDisabled(true)
      } else if (
        (room.groups[1] === user.group && phase === 1) ||
        phase === 4 ||
        phase === 5
      ) {
        setIsChatDisabled(true)
      } else {
        setIsChatDisabled(false)
      }

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
        <span className='text-3xl font-bold pl-5'>{phaseTexts[phase - 1]}</span>
      </div>
      <div className='ml-auto p-5 h-[calc(100vh-113.6px)]'>
        <div className='outline outline-gray-400 h-full rounded-md p-5 flex flex-col'>
          <div className='flex flex-col-reverse overflow-y-auto h-full'>
            {bubbles.toReversed()}
          </div>
          <ChatInput
            isDisabled={isChatDisabled}
            onSendTriggered={onSendTriggered}
          />
        </div>
      </div>
    </div>
  )
}
