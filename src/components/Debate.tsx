import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Debate({
  topic,
  description,
  ownerId,
  minutes,
  date,
}: {
  topic: string
  description: string
  ownerId: string
  minutes: number
  date: Date
}) {
  return (
    <div className='rounded-md w-96 h-32 min-w-[24rem] bg-gray-200 pt-3 pl-4 flex flex-col'>
      <span className='inline-block font-bold'>
        {topic}{' '}
        <span className='font-normal pl-1 text-gray-400'>@{ownerId}</span>
      </span>
      <p className='text-gray-500'>{description}</p>

      <div className='mt-auto mb-3'>
        <p className='text-gray-400'>
          <FontAwesomeIcon icon={faClock} />
          <span className='pl-2'>{minutes}분</span>
        </p>
        <p className='text-gray-400'>
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span className='pl-2' suppressHydrationWarning={true}>
            {date.toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  )
}
