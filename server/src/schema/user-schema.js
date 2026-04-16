import z from "zod";

export const updateMeSchema=z.object({
    body:z.object({
        name:z.string().trim().min(2,"name must be atleast 2 characters").max(50,"name cannot be above 50 characters long..").optional(),
        password:z.string().trim().min(6,"password must be min 6 characters").max(50,"password is tooo long..").optional()
    })
});