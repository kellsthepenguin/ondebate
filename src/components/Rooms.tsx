import IRoom from '@/interfaces/Room'
import Room from './Room'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DebateBox({
  type,
  roomClickHandler,
}: {
  type: string
  roomClickHandler: (id: number) => void
}) {
  const {
    data: rooms,
    error,
    isLoading,
  }: {
    data: IRoom[] | undefined
    error: Error | undefined
    isLoading: boolean
  } = useSWR('/api/debates', fetcher)

  if (error) return <div>error</div>

  return (
    <div className='flex gap-2 flex-wrap h-[408px] max-h-[408px] overflow-y-auto'>
      {!isLoading ? (
        rooms!.map((room) => {
          if (type === 'recruiting') {
            if (room.phase === 0) {
              return <Room room={room} onClick={roomClickHandler} />
            }
          } else {
            if (room.phase !== 0) {
              return <Room room={room} onClick={roomClickHandler} />
            }
          }
        })
      ) : (
        <div>loading</div>
      )}
    </div>
  )
}
