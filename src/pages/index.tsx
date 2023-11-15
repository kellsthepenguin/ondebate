import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TopBar from '@/components/TopBar'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { DebateBox } from '@/components/Rooms'
import Popup from 'reactjs-popup'
import CreateDebate from '@/components/CreateDebate'
import useSWR from 'swr'
import { Socket, io } from 'socket.io-client'
import DebatePage from '@/components/DebatePage'
import ReactDOM from 'react-dom'

const fetcher = (url: string) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: localStorage.getItem('token') }),
  }).then((r) => r.json())
}

export default function Home() {
  const { data } = useSWR('/api/isJWTOk', fetcher)
  let socket: Socket

  if (data && data.isJWTOk) {
    socket = io({
      auth: {
        token: JSON.parse(atob(localStorage.getItem('token')?.split('.')[1]!))
          .id,
      },
    })
  }

  const roomClickHandler = async (id: number) => {
    const { room, error } = await (
      await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          roomId: id,
        }),
      })
    ).json()

    if (error) return alert('an error occurred ' + error)

    ReactDOM.render(
      <DebatePage socket={socket} room={room} />,
      document.getElementById('root')
    )
  }

  return (
    <div>
      <TopBar />
      <div className='pl-7 pt-3'>
        <div className='flex items-center'>
          <span className='font-semibold text-3xl'>모집중인 토론</span>
          <Popup
            trigger={
              <span className='pl-4 font-semibold text-blue-500'>
                <FontAwesomeIcon icon={faPlus} />
                &nbsp;
                <span>새 토론 만들기</span>
              </span>
            }
            overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            modal
          >
            {data && data.isJWTOk ? (
              <CreateDebate socket={socket!} />
            ) : (
              <div className='bg-white w-48 h-32'>먼저 로그인해주세요</div>
            )}
          </Popup>
        </div>
        <DebateBox type='recruiting' roomClickHandler={roomClickHandler} />{' '}
        <br />
        <span className='font-semibold text-3xl'>진행중인 토론</span>
        <DebateBox type='ongoing' roomClickHandler={roomClickHandler} />
      </div>
    </div>
  )
}
