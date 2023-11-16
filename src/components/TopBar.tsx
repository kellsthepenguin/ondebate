import useSWR from 'swr'

const fetcher = (url: string) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: localStorage.getItem('token') }),
  }).then((r) => r.json())
}

export default function TopBar() {
  const { data, error } = useSWR('/api/isJWTOk', fetcher)
  if (error) {
    console.log(error)
    return <div>ERROR</div>
  }

  return (
    <div className='flex items-center mb-[-12px]'>
      <a href='/'>
        <img src='logo-full.svg' width={175} height={50.92} className='p-4' />
      </a>
      <div className='font-bold'>
        {(data ? data.isJWTOk : false) ? (
          <div>
            <span>
              @
              {
                JSON.parse(atob(localStorage.getItem('token')?.split('.')[1]!))
                  .id
              }
            </span>{' '}
            &nbsp;
            <button
              onClick={() => {
                localStorage.setItem('token', '')
                location.href = '/'
              }}
              className='text-red-600'
            >
              로그아웃
            </button>
          </div>
        ) : (
          <a className='font-bold text-blue-500 ml-[-5px]' href='/login'>
            로그인
          </a>
        )}
      </div>
    </div>
  )
}
