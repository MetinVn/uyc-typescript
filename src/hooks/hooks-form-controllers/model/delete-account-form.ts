import { z } from "zod";
import { useFormController } from "../controller/form-controller";

const deleteProfileSchema = z.object({
  currentPassword: z.string().min(6, "Invalid password"),
});

export type DeleteProfileFormData = z.infer<typeof deleteProfileSchema>;

export function useDeleteProfileForm() {
  return useFormController<DeleteProfileFormData>(deleteProfileSchema, {
    currentPassword: "",
  });
}
