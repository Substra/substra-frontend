# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Ability to zoom and pan on performance charts (#115)
-   Support for testtuples which parent is an aggregatetuple (#113)
-   Expired credentials will try to be renewed before triggering a log out (#112)
-   Display both "download" and "process" permissions (#110)
-   Download button for models (#110)
-   Add CSV export (#117)

### Fixed

-   Sider scroll not preserved across different assets anymore (#114)
-   Handle deleted intermediary models (#118)
-   Removed emotion warning about non-boolean attribute (#121)
-   Display short commit sha in user menu (#122)
-   Listing of a compute plan's datasets when building series (#123)
-   Default chart styles for unknown nodes (#132)

### Changed

-   Works with orchestrator-powered backends only (#100)
-   Removed the "Timeline" section for tasks and compute plan that was "coming soon" (#111)
-   Use dedicated sub asset routes to retrieve compute plan tuples (#116, #120)
-   Use dedicated sub asset routes to list all tuples from a compute plan (#127)
-   Only fetch testtuples when building charts (#135)

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
