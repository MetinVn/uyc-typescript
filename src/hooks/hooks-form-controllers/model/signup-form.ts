import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(35, "Password can't exceed 35 characters"),
  displayName: z.string().min(6, "Display name too short").max(20, "Display name can not exceed 20 characters"),
});
export type SignUpFormData = z.infer<typeof signUpSchema>;

export function useSignUpForm() {
  return useFormController<SignUpFormData>(signUpSchema, {
    email: "",
    password: "",
    displayName: "",
  });
}
