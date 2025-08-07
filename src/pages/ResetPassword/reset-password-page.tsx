import withLazyLoad from "../lazy-load-pages";

const ResetPasswordPageWrapper = withLazyLoad(() => import("./reset-password-chunk"), "Loading password reset page...");

export default ResetPasswordPageWrapper;
