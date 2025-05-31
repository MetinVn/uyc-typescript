import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface IFormFieldsProps {
  formData: {
    displayName?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
  };
  showNameField: boolean;
  showEmailField: boolean;
  showPasswordField: boolean;
  showCurrentPasswordField?: boolean;
  showForgotCurrentPasswordLink?: boolean;
  showForgotPasswordLink: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLElement>) => void;
  errors: {
    displayName?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
  };
}

const FormFields = ({
  formData,
  showNameField,
  showEmailField,
  showPasswordField,
  showCurrentPasswordField,
  showForgotCurrentPasswordLink,
  showForgotPasswordLink,
  handleChange,
  onSubmit,
  errors,
}: IFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  return (
    <form autoComplete="on" onSubmit={onSubmit}>
      {showNameField && (
        <div className="mb-4">
          <label htmlFor="displayName" className="text-white text-sm block mb-1">
            Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
            className={`w-full p-3 bg-[#1f1f1f] border ${
              errors.displayName ? "border-red-400 focus:ring-red-500" : "border-[#444] focus:ring-[#777]"
            } text-white rounded-md focus:outline-none focus:ring-2`}
          />
          {errors.displayName && <p className="text-red-400 text-xs mt-1">{errors.displayName}</p>}
        </div>
      )}

      {showEmailField && (
        <div className="mb-4">
          <label htmlFor="email" className="text-white text-sm block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            className={`w-full p-3 bg-[#1f1f1f] border ${
              errors.email ? "border-red-400 focus:ring-red-500" : "border-[#444] focus:ring-[#777]"
            } text-white rounded-md focus:outline-none focus:ring-2`}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      )}

      {showCurrentPasswordField && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="currentPassword" className="text-white text-sm">
              Current Password
            </label>
            {showForgotCurrentPasswordLink && (
              <Link
                to={ROUTES.FORGOT_PASSWORD + "?fromAccount=true"}
                className="text-xs text-white hover:text-[#7c7c7c] hover:underline transition"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              className={`w-full p-3 bg-[#1f1f1f] border ${
                errors.currentPassword ? "border-red-400 focus:ring-red-500" : "border-[#444] focus:ring-[#777]"
              } text-white rounded-md focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
              aria-label={showPassword ? "Hide currrent password" : "Show current password"}
              tabIndex={-1}
            >
              {showCurrentPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-red-400 text-xs mt-1">{errors.currentPassword}</p>}
        </div>
      )}

      {showPasswordField && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="text-white text-sm">
              Password
            </label>
            {showForgotPasswordLink && (
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-white hover:text-[#7c7c7c] hover:underline transition"
              >
                Forgot password?
              </Link>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full p-3 pr-10 bg-[#1f1f1f] border ${
                errors.password ? "border-red-400 focus:ring-red-500" : "border-[#444] focus:ring-[#777]"
              } text-white rounded-md focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
        </div>
      )}

      <button onClick={onSubmit} type="submit" className="sr-only" aria-hidden="true" tabIndex={-1}>
        submit
      </button>
    </form>
  );
};

export default FormFields;
