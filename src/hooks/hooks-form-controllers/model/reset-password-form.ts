import { z } from "zod";
import { useFormController } from "../controller/form-controller";

import { useMemo } from "react";

const forgotPassSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type ForgotPasswordData = z.infer<typeof forgotPassSchema>;

export const useForgotPasswordForm = () => {
  const initialValues = useMemo(() => ({ email: "" }), []);

  return useFormController<ForgotPasswordData>(forgotPassSchema, initialValues);
};
