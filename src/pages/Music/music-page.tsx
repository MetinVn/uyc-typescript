import withLazyLoad from "../lazy-load-pages";

const MusicPageWrapper = withLazyLoad(() => import("./music-chunk"), "Loading music page...");

export default MusicPageWrapper;
