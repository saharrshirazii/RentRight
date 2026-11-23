import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string()
        .min(2, "Namnet måste vara minst 2 tecken långt")
        .max(50, "Namnet får max vara 50 tecken")
        .regex(/^[a-zA-ZåäöÅÄÖ\s]+$/, "Namnet får endast innehålla bokstäver")
        .trim(),

    email: z.string()
    .min(1, "E-post krävs")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Ogiltig e-postadress") // Denna ersätter .email()
    .toLowerCase()
    .trim(),

    role: z.enum(['guest', 'host', 'admin']).default('guest'),

    password: z.string()
        .min(8, "Lösenordet måste vara minst 8 tecken långt")
        .max(30, "Lösenordet får max vara 30 tecken")
        .regex(/[A-Z]/, "Lösenordet måste innehålla minst en stor bokstav")
        .regex(/\d/, "Lösenordet måste innehålla minst en siffra")
});

export const loginSchema = z.object({
    email: z.string()
        .min(1, "E-post krävs")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Ogiltig e-postadress")
        .toLowerCase()
        .trim(),
    password: z.string().min(1, "Lösenord krävs")
});

export const changepasswordSchema = z.object({
    currentPassword: z.string().min(1, "Nuvarande lösenord krävs"),
    newPassword: z.string()
        .min(8, "Det nya lösenordet måste vara minst 8 tecken långt")
        .max(30, "Det nya lösenordet får max vara 30 tecken")
        .regex(/[A-Z]/, "Det nya lösenordet måste innehålla minst en stor bokstav")
        .regex(/\d/, "Det nya lösenordet måste innehålla minst en siffra")
});