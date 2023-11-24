export default function PrimaryButton({
  className,
  children,
  onClick,
  isDisabled,
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  isDisabled?: boolean
}) {
  return (
    <button
      type='button'
      className={
        isDisabled
          ? 'text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center ' +
            className
          : 'text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none ' +
            className
      }
      onClick={onClick}
    >
      {children}
    </button>
  )
}
