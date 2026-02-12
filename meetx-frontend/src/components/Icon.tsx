import type { CSSProperties } from 'react'

type IconName = 'spark' | 'shield' | 'pulse' | 'globe' | 'compass' | 'crown'

type IconProps = {
  name: IconName
  className?: string
  style?: CSSProperties
}

export default function Icon({ name, className, style }: IconProps) {
  const props = { className, style, viewBox: '0 0 24 24', 'aria-hidden': true } as const

  if (name === 'spark') {
    return (
      <svg {...props}>
        <path
          d="M12 2 13.8 8.2 20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg {...props}>
        <path
          d="M12 2 20 5v6c0 5-3.4 9.5-8 11-4.6-1.5-8-6-8-11V5l8-3Zm0 4.2L6 8v3c0 3.5 2.1 6.7 6 8.2 3.9-1.5 6-4.7 6-8.2V8l-6-1.8Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'pulse') {
    return (
      <svg {...props}>
        <path
          d="M3 12h4l2.2-4.4L13 18l2.6-6H21"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === 'globe') {
    return (
      <svg {...props}>
        <path
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm7.6 9H16c-.2-2.3-1-4.4-2.2-6 2.7.7 4.8 3.1 5.8 6ZM12 4.3c1.4 1.5 2.3 3.8 2.5 6.7h-5C9.7 8.1 10.6 5.8 12 4.3ZM6.2 5c-1.2 1.6-2 3.7-2.2 6H4c1-2.9 3.1-5.3 5.8-6ZM4 13h3.9c.2 2.5 1 4.8 2.3 6.4C7.1 18.6 5 16 4 13Zm8 6.7c-1.4-1.6-2.3-3.9-2.6-6.7h5.1c-.2 2.8-1.1 5.1-2.5 6.7Zm3.8-.3c1.3-1.6 2.1-3.9 2.3-6.4H20c-1 3-3.1 5.6-5.8 6.4Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (name === 'compass') {
    return (
      <svg {...props}>
        <path
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm2.9 6.2-1.6 4.2-4.2 1.6 1.6-4.2 4.2-1.6Zm-2.9 9a6.2 6.2 0 1 1 0-12.4 6.2 6.2 0 0 1 0 12.4Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <path
        d="M12 3l2.4 4.7L19 8.4l-3.5 3.4L16.3 17 12 14.8 7.7 17l.8-5.2L5 8.4l4.6-.7L12 3Z"
        fill="currentColor"
      />
    </svg>
  )
}
