import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import TopBar from '@/components/TopBar'
import { useRef } from 'react'

export default function Register() {
  const idRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)

  const handleOnClick = async () => {
    const { ok, error } = await (
      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          id: idRef.current!.value,
          pw: pwRef.current!.value,
        }),
      })
    ).json()

    if (!ok) {
      return alert('오류 발생: ' + error)
    }

    alert('회원가입 성공')
    location.href = '/'
  }

  return (
    <div>
      <TopBar />
      <div className='flex justify-center items-center h-[calc(100vh-73.6px)]'>
        <div className='w-[32rem] h-80 rounded-md outline outline-gray-400 p-5'>
          <p className='text-3xl font-bold'>회원가입</p> <br />
          <p>ID</p>
          <Input
            type={'text'}
            className='w-80'
            placeholder={'kellsthepenguin'}
            innerRef={idRef}
          />
          <p>비밀번호</p>
          <Input
            type={'password'}
            className='w-80'
            placeholder={'password'}
            innerRef={pwRef}
          />
          <input className='mt-7' type='checkbox' />{' '}
          <a className='text-blue-500' href='/privacypolicy.html'>
            개인정보처리방침
          </a>
          에 동의합니다
          <br />
          <PrimaryButton onClick={handleOnClick}>회원가입</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
