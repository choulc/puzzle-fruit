import { useCallback, useEffect, useState } from "react";

const useCountDown = (props) => {

    const { initTime } = props


    const [timeLeft, setTimeLeft] = useState(0)
    const [isTimeOut, setIsTimeOut] = useState(false)
    const [start, setStart] = useState(false)
    const [pause, setPause] = useState(false)

    useEffect(() => {
        setTimeLeft(initTime)
    }, [initTime])

    useEffect(() => {

        let countDown

        if (!pause && start) {
            countDown = setInterval(() => {
                timeLeft > 0 && setTimeLeft(timeLeft - 1)
            }, 1000);
        }

        return () => clearInterval(countDown)

    }, [pause, start, timeLeft])

    useEffect(() => {

        timeLeft === 0 ? setIsTimeOut(true) : setIsTimeOut(false)

    }, [timeLeft])

    const pauseCountDown = useCallback(() => {
        setPause(true)
    }, [])

    const resumeCountDown = useCallback(() => {
        setPause(false)
    }, [])

    const startCountDown = useCallback(() => {
        setStart(true)
        setPause(false)
    }, [])

    return { timeLeft, pause, isTimeOut, pauseCountDown, resumeCountDown, startCountDown, setTimeLeft }
}

export default useCountDown;