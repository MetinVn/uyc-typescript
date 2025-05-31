import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const forgotPassSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type ForgotPasswordData = z.infer<typeof forgotPassSchema>;

export function useForgotPasswordForm() {
  return useFormController<ForgotPasswordData>(forgotPassSchema, {
    email: "",
  });
}
