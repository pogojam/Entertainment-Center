import React, { useEffect, useState, useRef, useCallback } from "react"

export const pipe = input => (...args) =>
    args.reduce((acc, func) => func(acc), input)

export const generateKey = pre => {
    return `${pre}_${new Date().getTime()}`
}

export const useObserver = ({ root = null, rootMargin, threshold = 0 }) => {
    const [entry, updateEntry] = useState({})
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
        currentObserver.disconnect()

        if (node) currentObserver.observe(node)

        return () => currentObserver.disconnect()
    }, [node])

    return [setNode, entry]
}

export const useSceanState = state => {
    const [list, setList] = useState([])
    const [current, setCurrentScean] = useState(null)

    useEffect(() => {
        state && setList(state)
    }, [])

    const setScean = input => {
        setCurrentScean(input)
    }

    return [setScean, current]
}

export const getDistance = (x1, y1, x2, y2) => {
    let xDistance = x1 - x2
    let yDistance = y1 - y2

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

export const changeTo = (com, type) => {
    com.target = type
    return com
}

export const withProps = (Component, { children, ...props }) => (
    <Component { ...props } > { children } < /Component>
)

export const buildThresholdList = numSteps => {
    let thresholds = []

    for (let i = 1.0; i <= numSteps; i++) {
        let ratio = i / numSteps
        thresholds.push(ratio)
    }

    thresholds.push(0)
    return thresholds
}

export const locateTo = location => {
    window.location.href = location
}

export const wrapComponent = (C1, C2) => {
    return ({ children, ...props }) => (
        <C2>
        <C1 { ...props } > { children } < /C1>
        < /C2>
    )
}


export const useToggle = (initialState = false) => {
    const [state, setState] = useState(initialState)
    const toggle = useCallback(() => setState(state => !state), [])

    return [state, toggle]
}
export function useSize(ref) {
    const obs = useRef()
    const [ignored, setIgnored] = useState(0)
    const [size, setSize] = useState({ width: null, height: null })

    useEffect(() => {
        function observe(entries) {
            const { width, height } = entries[0].contentRect
            setSize(s =>
                s.width !== width || s.height !== height ? { width, height } : s
            )
        }
        const RObserver =
            window.ResizeObserver || require("resize-observer-polyfill").default
        obs.current = new RObserver(observe)
        return () => obs.current.disconnect()
    }, [])

    useEffect(() => {
        const forceUpdate = () => setIgnored(c => c + 1)
        const item = ref.current
        if (item) {
            obs.current.observe(item)
            window.setTimeout(forceUpdate, 0)
        }
        return () => item && obs.current.unobserve(item)
    }, [obs, ref])

    return size
}

export const useGroup = (name, group) => {
    let output
    if (group) {
        output = `${group.groupName}[${group.index}]` + `[${name}]`
    } else {
        output = name
    }
    return [output]
}

const subscriptions = []
export const useSubscribe = () => {
    const [node, setNode] = useState(null)

    useEffect(() => {
        subscriptions.push(node)
    }, [node])

    return [setNode, subscriptions]
}
