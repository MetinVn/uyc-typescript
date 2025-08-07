import { z } from "zod";
import { useMemo } from "react";
import { useFormController } from "../controller/form-controller";

const editProfileNameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name must be at most 50 characters")
    .nonempty("Name cannot be empty"),
});

export type EditProfileNameFormData = z.infer<typeof editProfileNameSchema>;

export const useEditProfileNameForm = (initialDisplayName?: string) => {
  const initialValues = useMemo(() => ({ displayName: initialDisplayName || "" }), [initialDisplayName]);

  return useFormController<EditProfileNameFormData>(editProfileNameSchema, initialValues);
};
