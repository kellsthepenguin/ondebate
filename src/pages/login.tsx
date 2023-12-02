import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import TopBar from '@/components/TopBar'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useRef, useState } from 'react'

export default function Login() {
  const idRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const [hCaptchaToken, setHCaptchaToken] = useState('')

  const handleOnClick = async () => {
    const { token, error } = await (
      await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idRef.current!.value,
          pw: pwRef.current!.value,
          hCaptchaToken,
        }),
      })
    ).json()

    if (error) {
      return alert('오류 발생: ' + error)
    }

    alert('로그인 성공')
    localStorage.setItem('token', token)
    location.href = '/'
  }

  return (
    <div>
      <TopBar />
      <div className='flex justify-center items-center h-[calc(100vh-73.6px)]'>
        <div className='w-[32rem] h-88 rounded-md outline outline-gray-400 p-5'>
          <p className='text-3xl font-bold'>로그인</p> <br />
          <p>ID</p>
          <Input
            type={'text'}
            className='w-80'
            placeholder={'dandelions'}
            innerRef={idRef}
          />
          <p>비밀번호</p>
          <Input
            type={'password'}
            className='w-80'
            placeholder={'password'}
            innerRef={pwRef}
          />{' '}
          <br />
          <HCaptcha
            sitekey='5b7cce4c-90dc-4340-8280-6bdcb05d4578'
            onVerify={(token) => setHCaptchaToken(token)}
          />{' '}
          <br />
          <PrimaryButton onClick={handleOnClick}>로그인</PrimaryButton>
          또는 &nbsp;
          <a className='text-blue-500' href='/register'>
            회원가입
          </a>
        </div>
      </div>
    </div>
  )
}
