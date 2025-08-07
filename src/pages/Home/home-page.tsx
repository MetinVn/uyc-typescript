import withLazyLoad from "../lazy-load-pages";

const HomePageWrapper = withLazyLoad(() => import("./home-chunk"), "Loading home page...");

export default HomePageWrapper;
