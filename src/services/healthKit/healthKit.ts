import * as AppleHealthKitModule from 'react-native-health';

const AppleHealthKit = (AppleHealthKitModule as any).default || AppleHealthKitModule;
console.log('VISAS MODULIS:', JSON.stringify(AppleHealthKitModule));
type InitResult = {
    success: boolean
    error?: string
}

// const HealthKitPermissions = {
//     permissions: {
//         read: [AppleHealthKit.Constants.Permissions.HeartRate, AppleHealthKit.Constants.Permissions.StepCount],
//         write: [AppleHealthKit.Constants.Permissions.Steps],
//     },
// }


export const initHealthKit = (): Promise<InitResult> => {
    return new Promise((resolve) => {
        // Patikrinam ar modulis išvis egzistuoja
        if (!AppleHealthKit || !AppleHealthKit.initHealthKit) {
            console.error('[HealthKit] Native module is not available');
            resolve({ success: false, error: 'Native module not found' });
            return;
        }

        const permissions = {
            permissions: {
                read: [
                    AppleHealthKit.Constants.Permissions.HeartRate,
                    AppleHealthKit.Constants.Permissions.StepCount,
                    // AppleHealthKit.Constants.Permissions.SleepAnalysis // Pridėk jei reikės vėliau
                ],
                write: [
                    AppleHealthKit.Constants.Permissions.Steps
                ],
            },
        };

        AppleHealthKit.initHealthKit(permissions, (error) => {
            if (error) {
                console.log('[HealthKit] Init error:', error);
                resolve({ success: false, error });
                return;
            }
            resolve({ success: true });
        });
    });
}
export const getSteps = (startDate: string, endDate?: string) => {
    return new Promise((resolve) => {
        // VISADA pridėk šitą patikrą prieš kviečiant funkciją
        if (!AppleHealthKit || typeof AppleHealthKit.getDailyStepCountSamples !== 'function') {
            console.warn('[HealthKit] getDailyStepCountSamples nerasta!');
            return resolve([]);
        }

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