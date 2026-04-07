import type { ButtonInterface } from "../types/Types.types.ts"

const Button = (props: ButtonInterface) => {
    const {children, onClick} = props   
    return (
        <button onClick={() => onClick()} className="cursor-pointer">{children}</button>
    )
}
export default Button