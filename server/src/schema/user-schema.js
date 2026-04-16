import z from "zod";

export const updateMeSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, "name must be atleast 2 characters").max(50, "name cannot be above 50 characters long..").optional(),
        password: z.string().trim().min(6, "password must be min 6 characters").max(50, "password is tooo long..").optional()
    })
});

export const getUsersSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),

        role: z.string().optional(),
        status: z.string().optional(),
        search: z.string().trim().optional()
    })
});

export const getUserSchema = z.object({
    params: z.object({
        userId: z.string(),
    })
});

export const createUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, "name must be atleast 2 characters").max(50, "name cannot be above 50 characters long.."),
        email: z.email("Invalid email"),
        password: z.string().trim().min(6, "password must be min 6 characters").max(50, "password is tooo long..")
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().trim().min(2, "name must be atleast 2 characters").max(50, "name cannot be above 50 characters long..").optional(),
        email: z.email("Invalid email").optional(),
        password: z.string().trim().min(6, "password must be min 6 characters").max(50, "password is tooo long..").optional()
    }),
    params: z.object({
        userId: z.string(),
    })
});

export const deleteUserSchema = z.object({
    params: z.object({
        userId: z.string(),
    })
});