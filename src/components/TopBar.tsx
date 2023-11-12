export default function TopBar() {
  return (
    <div className='flex items-center mb-[-12px]'>
      <img src='logo-full.svg' width={175} height={50.92} className='p-4' />
      <a className='font-bold text-blue-500 ml-[-5px]' href='/login'>
        Login
      </a>
    </div>
  )
}
