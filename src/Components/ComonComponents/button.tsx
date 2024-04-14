import React from 'react'

import { Button } from "../../Components/ui/button"
 interface ButtonProps{
    name:string,
    width:string,
    colour:string
 }
export function ButtonDemo({name,width,colour}:ButtonProps) {
  return <Button className={`${width} ${colour}`}>{name}</Button>
}

