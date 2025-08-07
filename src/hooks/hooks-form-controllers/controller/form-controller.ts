import { useState, useCallback, useMemo, useEffect } from "react";
import { ZodType } from "zod";

export const useFormController = <T extends Record<string, any>>(schema: ZodType<T>, initialValues: T) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  useEffect(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = useCallback((): T | null => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof T;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  }, [schema, formData]);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const setErrorsCallback = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(newErrors);
  }, []);

  const setFormDataCallback = useCallback((data: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  return useMemo(
    () => ({
      formData,
      errors,
      handleChange,
      validateForm,
      resetForm,
      setErrors: setErrorsCallback,
      setFormData: setFormDataCallback,
    }),
    [formData, errors, handleChange, validateForm, resetForm, setErrorsCallback, setFormDataCallback]
  );
};
