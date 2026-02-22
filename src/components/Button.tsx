import React from 'react'

export interface ButtonProps {
  /** Text shown on the button */
  name: string
  /** Color of the button text (e.g. '#fff' or 'white') */
  textColor?: string
  /** Button background color (e.g. '#333') */
  backgroundColor?: string
  /** Button background color when clicked (e.g. '#555') */
  activeColor?: string
}

export function Button({
  name,
  textColor,
  backgroundColor,
  activeColor,
}: ButtonProps) {
  const style: React.CSSProperties & Record<string, string> = {}
  if (textColor) style['--btn-text-color'] = textColor
  if (backgroundColor) style['--btn-bg'] = backgroundColor
  if (activeColor) style['--btn-active-bg'] = activeColor

  return (
    <button type="button" className="app-button" style={style}>
      {name}
    </button>
  )
}
