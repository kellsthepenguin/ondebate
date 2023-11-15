import { useRef } from 'react'
import Input from './Input'
import PrimaryButton from './PrimaryButton'
import { Socket } from 'socket.io-client'
import DebatePage from './DebatePage'
import ReactDOM from 'react-dom'

export default function CreateDebate({ socket }: { socket: Socket }) {
  const topicRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)
  const firstGroupRef = useRef<HTMLInputElement>(null)
  const secondGroupRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)

  const handleOnClick = async () => {
    const topic = topicRef.current!.value
    const description = descriptionRef.current!.value
    const firstGroup = firstGroupRef.current!.value
    const secondGroup = secondGroupRef.current!.value
    const time = timeRef.current!.value

    const { room, error } = await (
      await fetch('/api/debates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          topic,
          description,
          groups: [firstGroup, secondGroup],
          time: parseInt(time),
        }),
      })
    ).json()

    if (error) {
      return alert(error)
    }

    ReactDOM.render(
      <DebatePage socket={socket} room={room} />,
      document.getElementById('root')
    )
  }

  return (
    <div className='w-96 h-[32rem] bg-gray-200 rounded-md p-5'>
      <p className='text-3xl font-bold'>새 토론 만들기</p> <br />
      <p className='font-semibold'>논제</p>
      <Input type='text' placeholder='짜장면 vs 짬뽕' innerRef={topicRef} />
      <p className='pt-2 font-semibold'>설명</p>
      <Input
        type='text'
        placeholder='짜장면이 더 맛있는지 짬뽕이 더 맛있는지 토론을 나눕니다.'
        innerRef={descriptionRef}
      />
      <p className='pt-2 font-semibold'>1번 집단</p>
      <Input type='text' placeholder='짜장면' innerRef={firstGroupRef} />
      <p className='pt-2 font-semibold'>2번 집단</p>
      <Input type='text' placeholder='짬뽕' innerRef={secondGroupRef} />
      <p>시간(분)</p>
      <Input type='number' placeholder='50' innerRef={timeRef} /> <br />
      <PrimaryButton onClick={handleOnClick}>토론 만들기</PrimaryButton>
    </div>
  )
}
