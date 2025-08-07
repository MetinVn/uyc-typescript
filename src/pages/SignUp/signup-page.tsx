import withLazyLoad from "../lazy-load-pages";

const SignUpPageWrapper = withLazyLoad(() => import("./signup-page-chunk"), "Loading signin page...");

export default SignUpPageWrapper;
