export default function TopBar() {
  return (
    <div className='flex items-center mb-[-12px]'>
      <a href='/'>
        <img src='logo-full.svg' width={175} height={50.92} className='p-4' />
      </a>
      <a className='font-bold text-blue-500 ml-[-5px]' href='/login'>
        로그인
      </a>
    </div>
  )
}
