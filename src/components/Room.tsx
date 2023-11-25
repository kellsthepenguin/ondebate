import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IRoom from '@/interfaces/Room'

export default function Room({
  room,
  onClick,
}: {
  room: IRoom
  onClick: (id: number) => void
}) {
  return (
    <div
      className='rounded-md w-96 h-32 min-w-[24rem] bg-gray-100 pt-3 pl-4 flex flex-col'
      onClick={() => onClick(room.id)}
    >
      <span className='inline-block font-bold'>
        {room.topic}{' '}
        <span className='font-normal pl-1 text-gray-400'>@{room.owner.id}</span>
      </span>
      <p className='text-gray-500'>{room.description}</p>

      <div className='mt-auto mb-3'>
        <p className='text-gray-400'>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span className='pl-2' suppressHydrationWarning={true}>
            {new Date().toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  )
}
