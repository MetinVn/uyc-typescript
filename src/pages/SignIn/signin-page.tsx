import withLazyLoad from "../lazy-load-pages";

const SignInPageWrapper = withLazyLoad(() => import("./signin-page-chunk"), "Loading signin page...");

export default SignInPageWrapper;
