import { z } from "zod";

// 1. Reusable validation atoms

// 1. Reusable validation atoms
const emailValidation = z.email({ message: "Invalid email address" });

const passwordValidation = z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Requires at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Requires at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Requires at least one number" })
    .regex(/[@$!%*?&]/, { message: "Requires at least one special character" });

// 2. LOGIN SCHEMA
export const loginSchema = z.object({
    email: emailValidation,
    password: z.string().min(1, { message: "Password is required" }),
});

// 3. SIGN UP SCHEMA
export const signUpSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// 4. RESET / CHANGE PASSWORD SCHEMA
export const passwordSchema = z.object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// 5. PROFILE / SETTINGS SCHEMA
export const profileSchema = z.object({
    firstName: z.string().min(2, { message: "First name is too short" }),
    lastName: z.string().min(2, { message: "Last name is too short" }),
    phone: z.string().min(7, { message: "Invalid phone number" }),

    // Naudojame z.any() ir tada transformuojame į Date. 
    // Tai "apgauna" TS, kad jis nesikabinėtų prie įvesties tipo.
    birthDate: z.any()
        .transform((val) => new Date(val))
        .pipe(
            z.date({ message: "Invalid date" })
                .max(new Date(), { message: "Birth date cannot be in the future" })
                .refine((date) => {
                    const age = new Date().getFullYear() - date.getFullYear();
                    return age >= 13;
                }, { message: "You must be at least 13 years old" })
        )
});

// --- TYPES ---
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;