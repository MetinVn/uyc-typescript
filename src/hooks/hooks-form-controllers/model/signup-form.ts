import { z } from "zod";
import { useFormController } from "../controller/form-controller";

import { useMemo } from "react";

const signUpSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .trim()
    .nonempty("Password can't be empty")
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().min(6, "Password must be at least 6 characters")),
  displayName: z.string().trim().min(6, "Display name too short").nonempty("Display name cannot be empty"),
});
export type SignUpFormData = z.infer<typeof signUpSchema>;

export const useSignUpForm = () => {
  const initialValues = useMemo(() => ({ email: "", password: "", displayName: "" }), []);

  return useFormController<SignUpFormData>(signUpSchema, initialValues);
};
