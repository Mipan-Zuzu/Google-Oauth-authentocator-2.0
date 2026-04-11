import type { ButtonInterface } from "../types/Types.types"

const Button = (props: ButtonInterface) => {
    const {children, onClick, disabled} = props   
    return (
        <button disabled={disabled} onClick={() => onClick()} className="cursor-pointer">{children}</button>
    )
}
export default Button