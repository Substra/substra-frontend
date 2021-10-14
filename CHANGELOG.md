# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Add nodePort config for K8s service (#174)
-   Refactor tables with Chakra (#147)
-   Add missing dependency `buffer` (#156)
-   Add download button for the data sample keys in dataset sider (#151)
-   Add Fullscreen mode on the charts in the Compute Plans comparison page (#149)
-   Filter by status on compute plan tasks page (#169)
-   Download model button in chart tooltip (#145)
-   Support for multi-metric testtuples (#119)
-   New filters (#180)

### Fixed

-   Fix broken imports when using chakra UI components (#162)
-   Removed console error about unknown component props (#163)
-   Automated redirects now replace history state instead of creating a new one (#161)
-   Table filters do not cancel each other (#168)
-   Add ellipsis to the Performance card title when it is too long (#182)
-   Fix routing issue with deprecated /compute_plan/ route (#197)

### Changed

-   Dropped CSS reset and Lato font in favor of a full Chakra theme (#159)
-   Include key in filename when downloading a model (#160)
-   Made /compute_plans the landing page (#161)
-   New visual style for navigation on compute plan page (#158)
-   New style for searchbar (#164)
-   Simplify layout (no more vertical/horizontal scroll wrappers) and tables (#166)
-   Only collapse header height for deep routes (#167)
-   New design for metrics table (#170)
-   New design for datasets table (#171)
-   New style for the Compute Plans page (#172)
-   Dataset sider replaced by independent page (#175)
-   New layout for compute plan tasks (#177)
-   New design for compute plan tasks table (#178)
-   New design for algos table and drawer (#187)
-   New design for tasks table (#186)
-   Make tasks the default compute plan tab (#195)
-   New design for compute plan tasks drawer (#179)
-   Switch to "Permissions" from "Downloadable by / Processable by" (#200)

## [0.3.0] - 2021-10-04

### Added

-   Ability to zoom and pan on performance charts (#115)
-   Support for testtuples which parent is an aggregatetuple (#113)
-   Expired credentials will try to be renewed before triggering a log out (#112)
-   Display both "download" and "process" permissions (#110)
-   Download button for models (#110)
-   Add CSV export (#117)
-   Compute Plans comparison page (#130)
-   Owner section in compute plan sider (#140)
-   Display backend version (#143)
-   Filters on worker in tasks and compute plan tasks pages (#144)

### Fixed

-   Sider scroll not preserved across different assets anymore (#114)
-   Handle deleted intermediary models (#118)
-   Removed emotion warning about non-boolean attribute (#121)
-   Display short commit sha in user menu (#122)
-   Listing of a compute plan's datasets when building series (#123)
-   Default chart styles for unknown nodes (#132)
-   Add missing marker to perf chart legend (#136)
-   Fix cropped Jpeg export (#138)
-   Header now contains Node ID or channel name depending on logged in status (#137)
-   Security issues in dependencies (#139)
-   Fix Markdown style in production (#141)

### Changed

-   Works with orchestrator-powered backends only (#100)
-   Removed the "Timeline" section for tasks and compute plan that was "coming soon" (#111)
-   Use dedicated sub asset routes to retrieve compute plan tuples (#116, #120)
-   Use dedicated sub asset routes to list all tuples from a compute plan (#127)
-   Only fetch testtuples when building charts (#135)
-   Chart tooltips are now interactive (#142)
-   All algos are now listed in the same table (#128)
-   Display current node id on login page (#148)
-   New navigation menu (#150)

## [0.2.0] - 2021-09-02

### Added

-   Add the name of the current node to the account menu (#96)
-   Add Chakra UI as a UI library (#106)
-   Add GitHub style to the markdown content (#103)
-   Add JPEG export (#94)
-   Add routes for compute plan details page's tabs (#104)

### Fixed

-   Patch circular import in mdast-util-to-hast dependency (#99)
-   Display intermediary state while checking credentials (#102)
-   Applying filters on a list moves back to the first page of results (#105)
-   In Chart, display node separation option only for numerous series (#101)
-   Add the task type for failed task (#124)

### Changed

-   Display channel name in header instead of node ID (#97)
-   Add out_model key and permissions in Sider (#98)
-   Always group series by lowercase metric name (#95)

## [0.1.0] - 2021-08-04

[unreleased]: https://github.com/owkin/connect-frontend/compare/0.1.0...HEAD
