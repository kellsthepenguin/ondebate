export default function Chat({ name, text }: { name: string; text: string }) {
  return (
    <div className='flex items-center text-xl'>
      <span className='font-bold'>&nbsp;{name}</span>
      <span className='ml-2'>&nbsp;{text}</span>
    </div>
  )
}
