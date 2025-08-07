import withLazyLoad from "../lazy-load-pages";

const AccountPageWrapper = withLazyLoad(() => import("./account-chunk"), "Loading account page...");

export default AccountPageWrapper;
