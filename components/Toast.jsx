import { useEffect, useState } from "react"

function Toast({ toast }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if(toast) {
            setVisible(true)

            const hideTimer = setTimeout(() => {
                setVisible(false)
            }, 2500)

            return () => clearTimeout(hideTimer)
        }
    }, [toast])

    if (!toast && !visible) return null

    return (
        <div className={`toast ${visible ? "show" : ""} ${toast.type}`}>
            {toast?.message}
        </div>
    )
}

export default Toast