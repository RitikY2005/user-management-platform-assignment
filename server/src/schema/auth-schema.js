import z from "zod";

export const AdminRegisterSchema=z.object({
    body:z.object({
        name:z.string().trim().min(2,"name must be atleast 2 characters").max(50,"name cannot be above 50 characters long.."),
        email:z.email("Invalid email"),
        password:z.string().trim().min(6,"password must be min 6 characters").max(50,"password is tooo long..")
    })
});

export const LoginSchema=z.object({
    body:z.object({
        email:z.email("Invalid email"),
        password:z.string().trim().min(6,"password must be min 6 characters").max(50,"password is tooo long..")
    })
});