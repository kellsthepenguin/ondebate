import Input from './Input'
import PrimaryButton from './PrimaryButton'

export default function CreateDebate() {
  return (
    <div className='w-96 h-[28rem] bg-gray-200 rounded-md p-5'>
      <p className='text-3xl font-bold'>새 토론 만들기</p> <br />
      <p className='font-semibold'>논제</p>
      <Input type='text' placeholder='짜장면 vs 짬뽕' />
      <p className='pt-2 font-semibold'>1번 집단</p>
      <Input type='text' placeholder='짜장면' />
      <p className='pt-2 font-semibold'>2번 집단</p>
      <Input type='text' placeholder='짬뽕' />
      <p>시간(분)</p>
      <Input type='number' placeholder='50' /> <br />
      <PrimaryButton>토론 만들기</PrimaryButton>
    </div>
  )
}
