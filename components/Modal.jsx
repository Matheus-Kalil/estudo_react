import { useEffect, useState } from "react"

function Modal({ isOpen, onClose, children }) {
    const [show, setShow] = useState(false)
    const [animate, setAnimate] = useState(false)
    
    useEffect(() => {
        if (isOpen) {
            setShow(true)

            setTimeout(() => setAnimate(true), 30)
        } else {
            setAnimate(false)

            setTimeout(() => setShow(false), 300) // tempo de animação
        }
    }, [isOpen])

    if (!show) return null
    
    return (
        <div
            className={`modal-overlay ${animate ? "open" : ""}`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose()
                }
            }}
        >
            <div
                className={`modal ${animate ? "open" : ""}`}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal