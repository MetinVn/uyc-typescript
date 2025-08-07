import { z } from "zod";
import { useFormController } from "../controller/form-controller";

import { useMemo } from "react";

const editProfilePassSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .nonempty("Password can't be empty")
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().min(6, "Password must be at least 6 characters")),
  password: z
    .string()
    .trim()
    .nonempty("New password can't be empty")
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().min(6, "New password must be at least 6 characters")),
});

export type EditProfilePassFormData = z.infer<typeof editProfilePassSchema>;

export const useEditProfilePassForm = () => {
  const initialValues = useMemo(() => ({ currentPassword: "", password: "" }), []);

  return useFormController<EditProfilePassFormData>(editProfilePassSchema, initialValues);
};
