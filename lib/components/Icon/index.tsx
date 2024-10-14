import React from 'react'

export type IconProps = {
  src: string
  alt: string
  width: number
  height: number
}
const Icon: React.FC<IconProps> = ({ src, alt, width, height }) => {
  return <img src={src} alt={alt} width={width} height={height} />
}

export default Icon
