import type { ButtonInterface } from "../types/types.types"

const Button = (props: ButtonInterface) => {
    const {children, onClick} = props   
    return (
        <button onClick={() => onClick()}>{children}</button>
    )
}
export default Button