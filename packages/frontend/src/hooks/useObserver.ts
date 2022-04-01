import { useState, useRef, useEffect } from "react"

export const useObserver = ({ root = null, rootMargin, threshold = 0 }: { root?: any, rootMargin?: number, threshold?: number | Array<number> }) => {
    const [entry, updateEntry] = useState({} as any)
    const [node, setNode] = useState(null)
    const isWindow = typeof window !== `undefined`

    const observer = useRef(
        isWindow
            ? new window.IntersectionObserver(([entry]) => updateEntry(entry), {
                root,
                rootMargin,
                threshold,
            })
            : null
    )

    useEffect(() => {
        const { current: currentObserver } = observer
        if (currentObserver) {
            currentObserver.disconnect()
            if (node) currentObserver.observe(node)
            return () => currentObserver.disconnect()
        }
    }, [node])

    return [setNode, entry]
}