import { z } from "zod";
import { useFormController } from "../controller/form-controller";

import { useMemo } from "react";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .trim()
    .nonempty("Password can't be empty")
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().min(6, "Password must be at least 6 characters")),
});
export type SignInFormData = z.infer<typeof signInSchema>;

export const useSignInForm = () => {
  const initialValues = useMemo(() => ({ email: "", password: "" }), []);

  return useFormController<SignInFormData>(signInSchema, initialValues);
};
