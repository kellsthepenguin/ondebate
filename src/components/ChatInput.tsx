import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Input from './Input'
import { useEffect, useRef } from 'react'

export default function ChatInput({
  onSendTriggered,
}: {
  onSendTriggered: (text: string) => void
}) {
  const chatInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chatInput.current!.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.stopImmediatePropagation()
        if (e.repeat) return
        onSendTriggered(chatInput.current!.value)
        chatInput.current!.value = ''
      }
    })
  })

  return (
    <div className='mt-auto flex gap-2 items-center bg-white'>
      <Input
        placeholder='채팅'
        type='text'
        className='relative inline'
        innerRef={chatInput}
      />
      <div
        className='max-sm:mx-[5%]'
        onClick={() => {
          onSendTriggered(
            (document.getElementById('chatInput') as HTMLInputElement).value
          )
          chatInput.current!.value = ''
        }}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          className='w-[25px] h-[25px] sm:hidden'
          color='#3b82f6'
        />
      </div>
    </div>
  )
}
