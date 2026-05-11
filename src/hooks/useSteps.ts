import { useEffect, useState } from 'react'
import { initHealthKit, getSteps } from '../services/healthKit/healthKit'

export const useSteps = () => {
    const [steps, setSteps] = useState<any[]>([])
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const run = async () => {
            const ok = await initHealthKit()

            if (!ok) return

            setReady(true)

            const data = await getSteps(
                new Date(2024, 0, 1).toISOString()
            )

            setSteps(data)
        }

        run()
    }, [])

    return { steps, ready }
}