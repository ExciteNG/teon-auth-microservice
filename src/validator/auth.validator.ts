import z from 'zod';

// export const offtakerSignupSchema = z.object({
//   body: z.object({
//     country: z.string(),
//     email: z.string().email(),
//     password: z.string().min(8, 'password must have a minimum of 8 characters'),
//     userType: z.string(),
//   }),
// });

// export type offtakerSignupDto = z.infer<typeof offtakerSignupSchema>;

export const signupSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string().optional(),
    country: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8, 'password must have a minimum of 8 characters'),
    username: z.string(),
    gender: z.enum(['Male', 'Female']),
    language: z.string().optional(),
  }),
});

export type signupDto = z.infer<typeof signupSchema>;

export const verifyUserSchema = z.object({
  params: z.object({
    confirmationCode: z.string(),
  }),
});

export type verifyUserDto = z.infer<typeof verifyUserSchema>;

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export type resendVerificationDto = z.infer<typeof resendVerificationSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export type loginDto = z.infer<typeof loginSchema>;
