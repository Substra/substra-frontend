# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Fixed

### Changed

-   Works with orchestrator-powered backends only (#100)
-   Removed the "Timeline" section for tasks and compute plan that was "coming soon" (#111)

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

### Changed

-   Display channel name in header instead of node ID (#97)
-   Add out_model key and permissions in Sider (#98)
-   Always group series by lowercase metric name (#95)

## [0.1.0] - 2021-08-04

[unreleased]: https://github.com/owkin/connect-frontend/compare/0.1.0...HEAD
