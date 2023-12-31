export default function Chat({
  name,
  color,
  text,
}: {
  name: string
  color: string
  text: string
}) {
  return (
    <div className='flex items-center text-xl'>
      <span className={'font-bold ' + color}>&nbsp;{name}</span>
      <span className='ml-2'>&nbsp;{text}</span>
    </div>
  )
}
