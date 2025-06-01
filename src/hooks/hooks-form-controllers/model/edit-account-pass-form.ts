import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const editProfilePassSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(35, "Password can't exceed 35 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type EditProfilePassFormData = z.infer<typeof editProfilePassSchema>;

export function useEditProfilePassForm() {
  return useFormController<EditProfilePassFormData>(editProfilePassSchema, {
    currentPassword: "",
    password: "",
  });
}
