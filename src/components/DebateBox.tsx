import Room from '@/interfaces/Room'
import Debate from './Debate'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DebateBox({ type }: { type: string }) {
  const {
    data: rooms,
    error,
    isLoading,
  }: {
    data: Room[] | undefined
    error: Error | undefined
    isLoading: boolean
  } = useSWR('/api/debates', fetcher)

  if (error) return <div>error</div>

  return (
    <div className='flex gap-2 flex-wrap h-[408px] max-h-[408px] overflow-y-auto'>
      {!isLoading ? (
        rooms!.map((room) => {
          if (type === 'recruiting') {
            if (room.isOngoing === false) {
              return (
                <Debate
                  topic={room.topic}
                  description={room.description}
                  ownerId={room.owner.id}
                  minutes={room.time}
                  date={new Date()}
                />
              )
            }
          } else {
            if (room.isOngoing === true) {
              return (
                <Debate
                  topic={room.topic}
                  description={room.description}
                  ownerId={room.owner.id}
                  minutes={room.time}
                  date={new Date()}
                />
              )
            }
          }
        })
      ) : (
        <div>loading</div>
      )}
    </div>
  )
}
