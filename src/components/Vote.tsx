import Room from '@/interfaces/Room'
import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

export default function DebateWaitingPage({
  socket,
  room: room,
}: {
  socket: Socket
  room: Room
}) {
  const [result, setResult] = useState([0, 0])
  const [isEnded, setIsEnded] = useState(false)
  const winnerTeamIndex = result.findIndex((n) => n === Math.max(...result))
  const winnerTeam = room.groups[winnerTeamIndex]

  useEffect(() => {
    socket.on('end', (result) => {
      setResult(result)
      setIsEnded(true)
    })
  })

  const vote = async (group: string) => {
    const { error, ok } = await (
      await fetch('/api/vote', {
        method: 'POST',
        body: JSON.stringify({ token: localStorage.getItem('token'), group }),
      })
    ).json()

    if (!ok) return alert(error)
    alert('투표 성공')
  }

  return (
    <div>
      {!isEnded ? (
        <div className='mt-16 text-center'>
          <p className='text-5xl font-bold'>투표 진행중</p>

          <div className='mt-2 flex justify-center gap-2'>
            <button
              className='px-8 py-5 bg-red-500 text-white rounded'
              onClick={() => vote(room.groups[0])}
            >
              {room.groups[0]}
            </button>
            <button
              className='px-8 py-5 bg-blue-500 text-white rounded'
              onClick={() => vote(room.groups[1])}
            >
              {room.groups[1]}
            </button>
          </div>
        </div>
      ) : (
        <div className='mt-16 text-center'>
          <p className='text-5xl font-bold mb-32'>투표 종료</p>
          <p className='text-6xl font-bold'>
            {result[0] === result[1] ? (
              '무승부!'
            ) : (
              <span>
                {winnerTeamIndex === 0 ? (
                  <span className='text-red-500'>{winnerTeam}</span>
                ) : (
                  <span className='text-blue-500'>{winnerTeam}</span>
                )}{' '}
                &nbsp; <span>승리!</span>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
