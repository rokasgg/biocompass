import { useEffect, useState } from 'react'
import { initHealthKit, getHeartRate } from '../services/healthKit/healthKit'

export const useHealthKit = () => {
    const [ready, setReady] = useState(false)
    const [heartRate, setHeartRate] = useState<any[]>([])

    useEffect(() => {
        const setup = async () => {
            const result = await initHealthKit()

            if (!result.success) {
                return
            }

            setReady(true)

            const data = await getHeartRate(
                new Date(2020, 1, 1).toISOString()
            )

            setHeartRate(data)
        }

        setup()
    }, [])

    return {
        ready,
        heartRate,
    }
}