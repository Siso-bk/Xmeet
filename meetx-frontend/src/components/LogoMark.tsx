import Icon from './Icon'

type LogoMarkProps = {
  size?: number
}

export default function LogoMark({ size = 42 }: LogoMarkProps) {
  return (
    <div
      className="brand-mark"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon name="crown" style={{ width: size * 0.55, height: size * 0.55 }} />
    </div>
  )
}
