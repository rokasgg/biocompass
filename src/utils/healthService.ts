import { NativeModules, Platform } from 'react-native';
import AppleHealthKit, {
    HealthKitPermissions,
    HealthInputOptions,
    HealthValue
} from 'react-native-health';

// Kai kurios bibliotekos versijos reikalauja pasiekti per NativeModules
const { AppleHealthKit: NativeModule } = NativeModules;

export const HealthService = {
    /**
     * Saugus inicializavimas
     */
    authorize: (): Promise<boolean> => {
        return new Promise((resolve) => {
            // 1. Patikrinam, ar tai išvis iOS
            if (Platform.OS !== 'ios') {
                console.warn('[HealthService] HealthKit veikia tik iOS.');
                return resolve(false);
            }

            // 2. Patikrinam, ar natyvus modulis „prikabintas“
            // Tikrinam tiek importą, tiek tiesioginį NativeModule
            const HealthKit = AppleHealthKit || NativeModule;

            if (!HealthKit || typeof HealthKit.initHealthKit !== 'function') {
                console.error(
                    '[HealthService] AppleHealthKit nerastas. \n' +
                    'Sprendimas: Sustabdyk Metro, terminale paleisk "cd ios && pod install", ' +
                    'tada Xcode vėl spausk PLAY (HabTra scheme).'
                );
                return resolve(false);
            }

            // 3. Tik dabar saugiai sukuriam permissions, nes modulis tikrai egzistuoja
            const permissions: HealthKitPermissions = {
                permissions: {
                    read: [
                        HealthKit.Constants.Permissions.Steps,
                        HealthKit.Constants.Permissions.StepCount,
                        HealthKit.Constants.Permissions.SleepAnalysis,
                    ],
                    write: [],
                },
            };

            HealthKit.initHealthKit(permissions, (error) => {
                if (error) {
                    console.error('[HealthService] Apple Health leidimų klaida:', error);
                    return resolve(false);
                }
                console.log('[HealthService] Leidimai sėkmingai gauti/patikrinti');
                resolve(true);
            });
        });
    },

    getSteps: (date: Date = new Date()): Promise<number> => {
        return new Promise((resolve) => {
            const HealthKit = AppleHealthKit || NativeModule;
            if (!HealthKit?.getStepCount) return resolve(0);

            const options: HealthInputOptions = {
                date: date.toISOString(),
            };

            HealthKit.getStepCount(options, (err, results) => {
                if (err || !results) resolve(0);
                else resolve(results.value);
            });
        });
    },

    getSleepDuration: (): Promise<number> => {
        return new Promise((resolve) => {
            const HealthKit = AppleHealthKit || NativeModule;
            if (!HealthKit?.getSleepSamples) return resolve(0);

            const options = {
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString(),
            };

            HealthKit.getSleepSamples(options, (err, results: HealthValue[]) => {
                if (err || !results || results.length === 0) return resolve(0);

                const totalMinutes = results.reduce((acc, sample) => {
                    const validTypes = ['ASLEEP', 'ASLEEP_CORE', 'ASLEEP_DEEP', 'ASLEEP_REM'];
                    if (validTypes.includes(sample.value as string)) {
                        const start = new Date(sample.startDate).getTime();
                        const end = new Date(sample.endDate).getTime();
                        return acc + (end - start) / (1000 * 60);
                    }
                    return acc;
                }, 0);

                resolve(Number((totalMinutes / 60).toFixed(1)));
            });
        });
    },

    getDailySnapshot: async () => {
        try {
            const isAuthorized = await HealthService.authorize();
            if (!isAuthorized) return { steps: 0, sleep: 0 };

            const [steps, sleep] = await Promise.all([
                HealthService.getSteps(),
                HealthService.getSleepDuration(),
            ]);

            return { steps, sleep };
        } catch (e) {
            console.error('[HealthService] Klaida gaunant Snapshot:', e);
            return { steps: 0, sleep: 0 };
        }
    }
};