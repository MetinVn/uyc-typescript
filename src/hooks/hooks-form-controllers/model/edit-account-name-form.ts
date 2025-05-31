import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const editProfileNameSchema = z.object({
  displayName: z.string().min(6, "Name must be at least 6 characters"),
});

export type EditProfileNameFormData = z.infer<typeof editProfileNameSchema>;

export function useEditProfileNameForm(initialDisplayName: string) {
  return useFormController<EditProfileNameFormData>(editProfileNameSchema, {
    displayName: initialDisplayName || "",
  });
}
