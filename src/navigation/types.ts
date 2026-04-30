import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 1. Aprašai visus maršrutus ir ką jie turi gauti
export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    ForgotPassword: undefined;
    ResetPassword: undefined;
    Main: undefined;
    ChangePassword: undefined;
    VerifyCode: { email: string }
};

// 2.Globalus deklaravimas (kad nereikėtų useNavigation<...> rašinėti)
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

// 3. (Nebūtina, bet patogu) Tipai tavo ekranų Props'ams
export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;