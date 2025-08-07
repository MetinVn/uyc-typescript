import { z } from "zod";
import { useMemo } from "react";
import { useFormController } from "../controller/form-controller";

const deleteProfileSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .nonempty("Password can't be empty")
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().min(6, "Password must be at least 6 characters")),
});

export type DeleteProfileFormData = z.infer<typeof deleteProfileSchema>;

export const useDeleteProfileForm = () => {
  const initialValues = useMemo(() => ({ currentPassword: "" }), []);

  return useFormController<DeleteProfileFormData>(deleteProfileSchema, initialValues);
};
