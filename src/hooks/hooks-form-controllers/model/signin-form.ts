import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(25, ""),
});
export type SignInFormData = z.infer<typeof signInSchema>;

export function useSignInForm() {
  return useFormController<SignInFormData>(signInSchema, {
    email: "",
    password: "",
  });
}
