import Input from '@/components/Input'
import PrimaryButton from '@/components/PrimaryButton'
import TopBar from '@/components/TopBar'

export default function Login() {
  return (
    <div>
      <TopBar />
      <div className='flex justify-center items-center h-[calc(100vh-73.6px)]'>
        <div className='w-[32rem] h-72 rounded-md outline outline-gray-400 p-5'>
          <p className='text-3xl font-bold'>로그인</p> <br />
          <p>ID</p>
          <Input
            type={'text'}
            className='w-80'
            placeholder={'kellsthepenguin'}
          />
          <p>비밀번호</p>
          <Input
            type={'password'}
            className='w-80'
            placeholder={'password'}
          />{' '}
          <br />
          <PrimaryButton>로그인</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
