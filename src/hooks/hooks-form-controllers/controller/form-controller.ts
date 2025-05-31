import { useState } from "react";
import { ZodSchema } from "zod";

export function useFormController<T extends Record<string, any>>(schema: ZodSchema<T>, initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): T | null => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof T;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  const resetForm = () => {
    setFormData(initialValues);
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    resetForm,
    setErrors,
    setFormData,
  };
}
