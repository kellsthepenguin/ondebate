import { MutableRefObject } from 'react'

export default function Input({
  isDisabled,
  type,
  className,
  placeholder,
  innerRef,
}: {
  isDisabled?: boolean
  type: string
  className?: string
  placeholder: string
  innerRef?: MutableRefObject<HTMLInputElement | null>
}) {
  return (
    <input
      type={type}
      className={
        (isDisabled
          ? 'bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed '
          : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ') +
          className || ''
      }
      ref={innerRef}
      placeholder={placeholder}
      disabled={isDisabled}
    />
  )
}
