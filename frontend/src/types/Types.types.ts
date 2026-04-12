import type { ReactNode } from "react"

export interface ButtonInterface  {
    children : string,
    onClick: () => void
    disabled: boolean
}

export interface props {
    children: ReactNode
}
