import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'ghost' | 'primary' | 'danger' | 'outline'
type Size = 'sm' | 'md'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>

const base =
  'inline-flex items-center justify-center rounded-md border font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900/20 disabled:opacity-50 disabled:pointer-events-none'

const sizes: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2',
}

const variants: Record<Variant, string> = {
  ghost: 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
  outline: 'border-slate-300 bg-transparent text-slate-800 hover:bg-slate-50',
  primary: 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800',
  danger: 'border-red-300 bg-white text-red-700 hover:bg-red-50',
}

export function Button({ variant = 'ghost', size = 'sm', className = '', ...p }: Props) {
  return <button {...p} className={[base, sizes[size], variants[variant], className].join(' ')} />
}

type IconProps = ButtonHTMLAttributes<HTMLButtonElement>
export function IconButton({ className = '', ...p }: IconProps) {
  return (
    <button
      {...p}
      className={[
        base,
        'px-2 py-1 text-sm border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
        className,
      ].join(' ')}
    />
  )
}
