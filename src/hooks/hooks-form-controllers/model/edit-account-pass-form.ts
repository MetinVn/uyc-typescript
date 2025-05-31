import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const editProfilePassSchema = z.object({
  currentPassword: z.string().min(6, "Password too short").max(35, "Password too long"),
  password: z.string().min(6, "Password too short"),
});

export type EditProfilePassFormData = z.infer<typeof editProfilePassSchema>;

export function useEditProfilePassForm() {
  return useFormController<EditProfilePassFormData>(editProfilePassSchema, {
    currentPassword: "",
    password: "",
  });
}
