import AppleHealthKit from 'react-native-health'

type InitResult = {
    success: boolean
    error?: string
}

const HealthKitPermissions = {
    permissions: {
        read: [AppleHealthKit.Constants.Permissions.HeartRate, AppleHealthKit.Constants.Permissions.StepCount],
        write: [AppleHealthKit.Constants.Permissions.Steps],
    },
}


export const initHealthKit = (): Promise<InitResult> => {
    return new Promise((resolve) => {
        AppleHealthKit.initHealthKit(HealthKitPermissions, (error) => {
            if (error) {
                console.log('[HealthKit] Init error:', error)

                resolve({
                    success: false,
                    error,
                })
                return
            }

            resolve({ success: true })
        })
    })
}
export const getSteps = (startDate: string, endDate?: string) => {
    return new Promise((resolve) => {
        const options = {
            startDate,
            endDate: endDate || new Date().toISOString(),
        }

        AppleHealthKit.getDailyStepCountSamples(options, (error, results) => {
            if (error) {
                console.log('[HealthKit] steps error', error)
                resolve([])
                return
            }

            resolve(results)
        })
    })
}

export const getHeartRate = (startDate: string) => {
    return new Promise((resolve) => {
        const options = {
            startDate,
        }

        AppleHealthKit.getHeartRateSamples(options, (error, results) => {
            if (error) {
                console.log('[HealthKit] Heart rate error:', error)
                resolve([])
                return
            }

            resolve(results)
        })
    })
}