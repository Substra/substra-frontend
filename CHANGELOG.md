# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Support for Google Analytics (#XXX)

### Changed

-   Removed task categories from the frontend (#119)
-   Open task drawer directly in cp details page (#122)

## [0.36.0] - 2022-10-03

### Changed

-   CP workflow graph is now built independently of the task categories (#114)

### Fixed

-   Display user description after role update (#117)
-   Empty task inputs make drawer crash (#120)

### Changed

-   Container build error logs are now accessible

## [0.35.0] - 2022-09-26

## Added

-   Prevent the last admin from being deleted
-   Rename Users Management by Users
-   Missing deletion feedback in user management
-   Disable edit user button if no change detected and rename it update

### Fixed

-   Fix rank tooltip on perfcards in CP performances page (#108)
-   Fix outdated refresh route in withRetry (#112)
-   Fix users management link in menu (#113)
-   Update task drawer inputs (#106)

## [0.34.0] - 2022-09-13

## Added

-   Cypress tests for compute plan pages Workflow and Performances

### Fixed

-   Handle both gcr and ghcr manifest not found error in release workflow ci

## [0.33.0] - 2022-09-12

## Added

-   Users management v1
-   Added license file
-   Removed references to close-source items

### Changed

-   Change Customize Columns items icon color
-   Increase page size to 30
-   CP Workflow graph: Allow a higher min zoom to show more tasks
-   CP Workflow graph: update layout for predict tasks and test tasks
-   Change Connect branding to Substra
-   Add capital letter R to reset zoom button
-   Rename Connect to Substra in code and ci files
-   Change primary color from teal to blue
-   Keep filtering/ordering setup when refreshing an asset list page
-   Display all General customize columns by default

### Fixed

-   Elements being highlighted when drag and drop Customize Columns items
-   Can edit by deleting the input number in CP duration filter
-   CP duration filter is broken on refresh and for below mode
-   Use correct login url in cypress tests
-   Display all general columns by default in CP page
-   Broken unselection of CPs in comparison page
-   CP columns and favorites disappear on logout

### Removed

-   Model category

## [0.32.1] - 2022-08-24

### Changed

-   Task inputs section overhauled for generic tasks

### Fixed

-   fix: use route tasks path for task drawer in compute plan page
-   Duration filter mode "Between" don't jump to other filtering mode

## [0.32.0] - 2022-08-17

### Added

-   Ability to edit asset names

### Changed

-   Remove existing circular dependencies

### Fixed

-   Use route tasks path for task drawer

## [0.31.0] - 2022-08-09

### Added

-   Support for log scale display
-   Allow selection of non-metadata columns in custom columns

### Changed

-   Custom columns modal style improvements
-   Add new ESLint rules to ensure code quality
-   Use max rank and round from perf endpoint stats

### Fixed

-   Overflow issue on task drawer dataset section

## [0.30.0] - 2022-08-01

### Fixed

-   Do not trigger omnisearch for empty search strings
-   Spacing between and around filter tags
-   Duration's active filter dot does not appear on filter popover
-   Prevent task drawer dataset's dropdown from expanding/collapsing on dataset download
-   Column width issue on tasks table
-   Clear all filters button not clearing all filters
-   Center no tasks message on dataset table
-   Added missing actions on CP workflow page
-   Wrong page title on compute plan workflow

### Changed

-   Refactoring of duration format functions
-   Wording update for deleted models in output
-   Refactoring of DrawerHeader extra buttons
-   Some UI improvements for cancel CP feature
-   Display disabled cancel CP button when user is not owner of the current CP
-   Filtering by favorites when not having any will return an empty table
-   Add outputs section in task drawer adapted to generic task

## [0.29.0] - 2022-07-25

### Added

-   Zoom controls on compute plan workflows

### Fixed

-   Add "kind" label for algo performance output
-   Tooltips are now displayed on performance charts
-   Prevent the tooltip from being partly hidden on performance charts
-   Params disappearing when clicking twice on a navigation tab
-   Tuples links in OmniSearch were not redirecting to the tuple

### Changed

-   Add Hadolint to CI
-   Reset compute plan filters when clicking on a refresh button
-   Add ESLint rule to enforce PascalCase and precise suffixes for types
-   Stack applied filters vertically instead of using ellipsis
-   Add simplified display for duration applied filter

## [0.28.0] - 2022-07-11

### Added

-   Support for predict tasks
-   Cancel compute plan button
-   Add tuples to OmniSearch

### Changed

-   Upgrade caniuse-lite
-   Put current user info into /me module
-   Updated owner information style in drawers

## [0.27.0] - 2022-07-05

### Added

-   Display algo inputs and outputs in drawer
-   Download buttons for algos, datasets and metrics in task drawers
-   Duration filters
-   ComputePlan Workflow Graph view

### Fixed

-   Newsfeed items link now redirecting to correct asset

### Changed

-   Split the TableFilters components into multiple components
-   Removed the metrics concept

## [0.26.0] - 2022-06-20

### Added

-   Metadata filters

### Changed

-   Upgrade outdated dependencies packages and upgrade to React 18
-   Removed algo category

## [0.25.0] - 2022-06-14

### Added

-   Actualizer & Refresh Banner

### Changed

-   Compute plan name from metadata is deprecated, use cp name directly
-   Share metadata configuration
-   Remove metadata modal from compute plan detail
-   Rename node to organization

### Fixed

-   Type guard in OmniSearch failing for null values

### Fixed

-   Include days in durations

## [0.24.0] - 2022-05-31

### Changed

-   Replace compute plan unknown status by empty status

### Added

-   Proper UI for customizing columns
-   OmniSearch

### Fixed

-   Prevent the dataset details sidebar from being crushed
-   Display correctly Markdown titles
-   Dockerfile now include package-lock.json for better reproducibility

## [0.23.0] - 2022-05-23

### Added

-   Indicate active filters in the popover
-   News feed notifications

### Fixed

-   Removed date filters glitch
-   Consistent date filters - after and before

### Changed

-   Tasks and compute plans status sort is now alphabetical

## [0.22.0] - 2022-05-16

### Added

-   Mailto links in error alerts
-   Download buttons on ComputePlans page
-   Add a manual refresh button

### Fixed

-   Proper labels for status ordering
-   Ordering options in table header dropdowns
-   Alignment issue with PerfBrowser checkboxes

### Changed

-   Explicit keyboard shortcuts
-   Empty API params aren't sent to the API anymore
-   Added check on dependencies
-   Moved cypress to a dedicated package
-   Use the name field of Compute Plans instead of tag
-   Algo sorting by category is based on category names
-   Removed concept of hyperparameters in favor of metadata

## [0.21.0] - 2022-05-09

### Added

-   Permission filters

### Fixed

-   Trailing pagination focus
-   Correct date filter params sent to backend
-   Synced state handling for empty values are arrays
-   Reset searchbar when clearing applied filters

### Changed

-   Use csv url params values when filtering on multiple values for all fields
-   Change all references to eu.gcr.io to gcr.io in skaffold configs
-   Removed deadcode
-   Mutualize synced state declarations
-   Removed use of the search parameter
-   Handle new metric type
-   Add ESLint to React hooks
-   Improved filter tags display
-   Favorites only now synced in URL as a boolean flag

## [0.20.0] - 2022-05-03

### Added

-   Add rounds as x axis on perf charts
-   Display logs permissions on datasets table and details page
-   New filters

### Fixed

-   Make "Permissions" row top aligned in drawers and sidebars
-   Add empty state message in performance chart filter
-   Synced state init issue
-   Switch icons & wordings for ordering
-   Close news feed on blur
-   Hide "Customize columns" button if no hyperparameters are defined
-   Bad redirects breaking browsers back buttons

### Changed

-   Use paginated results for the newsfeed
-   Newsfeed card icon for canceled compute plans
-   More explicit download button in perf browser
-   Updated layout with 1200px min width
-   Rename master branch into main
-   Removed all MELLODDY specific code and features

## [0.19.0] - 2022-04-19

## Changed

-   Restrict filtering option only for concerned table columns

## [0.18.1] - 2022-04-14

### Fixed

-   Fix search by name and key on datasets page
-   Fix localStorage migration issue for hyperparameters

### Changed

-   Use a separate store for computePlans compare

## [0.18.0] - 2022-04-11

### Added

-   Allow keyboard interaction with the chart
-   Ordering
-   Favorites filter
-   Bulk selection

### Fixed

-   Hide show diff button in single cp page
-   Fix brand-logo-black svg by putting back proper width & height
-   Glitchy selected compute plans on compare page
-   Handle invalid statuses
-   Open node settings on click in box
-   Hide clear button when no filters are applied in hp modal
-   Max updated depth issue on ComputePlanChart
-   Favorites management in compare page
-   useSyncedState hook doesn't remove param from url on unmount
-   localStorage values not loaded after login

### Changed

-   Fix version of vite-plugin-svgr-component dependency
-   Hooks cleanup (removed dead code)
-   Change favicon svg
-   Use performance endpoint
-   Remove "Select all" option from filters in performance page and hide clear icon when no filters are applied
-   Favorite stays at their place in the cp list
-   Search filter now searches in both name and key

## [0.17.0] - 2022-03-24

### Fixed

-   Faulty favorites count when filter are applied
-   Fixed security issues in axios & nth-check dependencies

### Changed

-   Filters also apply to favorites
-   Favorites / selected compute plan rows are collapsible
-   Replace compute plan key by its name in news feed

## [0.16.1] - 2022-03-24

### Added

-   Hyperparameters columns in cp list are customizable
-   Hyperparameters modal now draggable
-   Sticky columns on compute plans page
-   Hyperparameters modal now resizable
-   Change drag zoom background color
-   Add buttons to show diffs only & clear filters in hp modal

### Fixed

-   Get compute plan index from PerfBrowserContext in HP modal
-   Remove warning related to breadcrumb component on dataset page
-   Fix large border into chart zoom button group
-   Rename csv files downloaded from the comparison interface
-   Close hyperparameters list on modal escape

### Changed

-   In PerfBrowser, an empty node filters list means all node are displayed

## [0.16.0] - 2022-03-10

### Added

-   Add a news feed for compute plan task events
-   Show hyperparameters on the compare page
-   Favorite and selected compute plans are updated when new data is available
-   Hyperparameters columns in cp list table
-   Full text search on CP list
-   Drag to zoom on charts

### Fixed

-   Inject hyperparameters at deploy time

## [0.15.0] - 2022-03-03

### Added

-   New PerfBrowser layout and behavior

### Fixed

-   Add missing space in Timing component
-   Restore clickable table headers on Compute Plans page
-   Fix rank/epoch switch
-   Uniqueness issue of average series IDs
-   Sort point by score in tooltip summary
-   Set a max height for filter menu
-   Highlight only related node on hover in comparison mode

### Changed

-   Do not display copy/download buttons for empty data sample lists

## [0.14.0] - 2022-02-24

### Added

-   Add to favorite button in CP details page
-   Add metrics to breadcrumb in CP chart page
-   Nodes settings in Compute Plan Chart page
-   Add zoom buttons on charts
-   Breadcrumb and actions for Compare page

### Fixed

-   Rank/epoch typo in perf chart tooltip
-   Add channel namespace to values stored in localStorage
-   Catch cancel error when voluntarily aborting CP details calls
-   Improve responsiveness of charts

### Changed

-   Removed loading of compute plan counts and statuses in separate calls (reverts #383 and #390)
-   Improved the PerfSidebarSettingsNodes component
-   Removed dynamic average
-   Auto cancel pending HTTP calls when changing route or url params
-   Changed wording and controls in perf chart settings
-   Move all PerfBrowser inner state to PerfBrowserContext
-   Enabled filters on compute plans page

## [0.13.0] - 2022-02-17

### Added

-   Tooltip hover compute plan pin icon
-   Support for epochs as X Axis values
-   Custom markers on charts

### Fixed

-   Logout loop because of planned calls
-   Restore "Download as CSV" button on compare perf details page

### Changed

-   Align duration display in cp details with the one in cp list
-   Increase toast font size
-   Upgrade chartjs to 3.7.1
-   Make full PerfBrowser sidebar section clickable
-   Page title issue on perf chart with task drawer open

## [0.12.0] - 2022-02-10

### Added

-   Compute plans selected for comparison are now persisted (same as pinned items)

### Fixed

-   Alignment issue between checkboxes and their labels
-   Scroll on performance legend overlaps on header "Rank X"
-   Restore metadata section to task drawers

### Changed

-   Put status "done" in first position in progress bar
-   Compute plan performance opens task drawer in the performance screen
-   Perf tab on Compute Plan page is enabled during loading
-   Load compute plans task counts and status in separate calls
-   Handle errors returned by the backend on list calls as if there was no results for the call
-   Retrieve compute plans task counts and status sequentially

## [0.11.0] - 2022-02-03

### Added

### Fixed

-   Handle perf rank detail Y overflow
-   Race conditions in compare page

### Changed

-   Disable performance chart for waiting/todo CP
-   Use 3 decimals instead of 2 for performance value
-   Naming: display organization instead of node
-   Chart: hovering a legend item should highlight the related line and values
-   Use click instead of shift+click to pan

## [0.10.0] - 2022-01-27

### Added

-   Added API_URL env var
-   UI: add loading state into drawers
-   MELLODDY: new pharma_average series

### Fixed

-   Added space around nodes tags in PerfBrowser
-   zIndex of perf chart tooltip
-   Full height layout on NotFound, Compare and CP chart pages
-   Perf tooltip position now depends on content size and position of canvas
-   Repeating key in PerfList that was causing lots of bugs
-   Broken metric name comparison causing perf browser to show as empty
-   Broken highlight / selection of rank 0 in perf charts
-   Broken clear button on compute plans page
-   Browser's previous page fixed on compute plans list page

### Changed

-   Add spacing below navigation
-   No more delay before hiding tooltip on perf chart cards
-   Removed redundant spaces in tables
-   Compute plan ID label now "#" instead of "CP"

## [0.9.2] - 2022-01-25

### Added

### Fixed

-   Fix typos, textarea width and style on feedback & help modal
-   Correct large5/small5 groups

### Changed

-   Make table headers clickable

## [0.9.1] - 2022-01-21

### Added

### Fixed

-   MELLODDY: Removed pseudonymization from frontend (it will be done on backend side)

### Changed

## [0.9.0] - 2022-01-20

### Added

-   Tooltips for chart thumbnails
-   MELLODDY: add hardcoded node labels
-   Tooltip over the average switch
-   MELLODDY: add hardcoded average series
-   Error logs
-   Link to documentation in help modal
-   Pseudonymize asset names

### Fixed

-   Do not include zoom and help buttons on chart JPEG export
-   Misc alignment issues
-   Fix overflow on metric name
-   Case insensitive sort of node labels

### Changed

-   Only display "reset zoom" button when the chart is zoomed in
-   Lazy load code highlighter and markdown formatter components
-   Sort nodes alphabetically on perf browser
-   Change request timeout from 10s to 2min
-   Change wording for ErrorAlert messages

## [0.8.0] - 2022-01-07

### Added

-   Button to download the perfs of multiple charts at once
-   Buttons to download the tested models in a test task drawer
-   Hierarchy background to PerfBrowser compute plan filters
-   MELLODDY flag to extract compute plan name from metadata

### Fixed

### Changed

-   Updated drawers and sidebars look and feel
-   Improved look for the PerfBrowser loading state
-   Improved look for the PerfBrowser empty state

## [0.7.0] - 2022-01-06

### Added

-   Preserve filters across task types
-   Explicit messages for why models cannot be downloaded
-   New help & feedback modal
-   Add support for Microsoft Clarity (optional) with a cookie banner
-   Display estimation end date for compute plan
-   Highlight task category containing failed tasks in compute plan details
-   Settings page
-   Disable current page pagination button
-   Added specific routes for each task category
-   Display test task performances in task drawer
-   Add link to compute plan in tasks list and tasks drawer
-   New and improved empty table message

### Fixed

-   Fixed status filter displayed value and date/duration layout
-   Fixed race condition that resulted in an infinite redirect loop
-   Fixed spacing around permissions
-   Fix vertical align in drawer
-   Fixed pagination when there are no results
-   Fixed padding in drawers
-   Fix dark theme issue by disabling it
-   Reduce font size on "download as" menu items
-   Uniformize file extension across the app
-   Prevents URL params to leak from computeplan list page to computeplan details page
-   Fixed warning in console
-   Remove old theme used before chakra
-   Removed "Other" label in compute plan settings when not necessary
-   Fix time collapsed on a CP when training - no end_date
-   Fix outmodel message color when model is not downloadable
-   Fix useless ellipsis on asset key in drawers
-   Add failed tasks to progress count in CP progression bar
-   Center "No data to display" message on CPs page when it's empty
-   Increased searchbar's width to prevent keys from being cutted
-   Fix focus color on searchbar
-   Fixed unexpected zoom reset when hovering perf rank details
-   Fix varying widthes for tables
-   Do not display parent task section in drawers if there are no parent tasks
-   Fixed font size in popover menus
-   Remove unnecessary padding in drawer tables
-   Disable Dark theme for Markdown content
-   Fix Header width in drawer + markdown width
-   Fix broken link in perf chart rank details
-   Handle non available perfs on testtuples

### Changed

-   Update internal type for compute plan list
-   Changed file structure for dockerfile
-   Better empty table message
-   Removed "unknown" task status and renamed "unknown" compute plan status in "empty"
-   Hovering charts highlights rank instead of points
-   Better page titles
-   Update Cypress version
-   Remove number of parent tasks in TaskTable
-   Switch train and test tasks tabs
-   Add capital letter to frontend in the about modal
-   General improvements of the perf browser component
-   Added ellipsis to too long links
-   New logo
-   Align TaskDrawer children to the left
-   Change Download button appearance
-   Added ellipsis to too long link
-   Disable interpretation of dates on CP table

## [0.6.0] - 2021-12-01

### Added

-   New login page
-   Ability to pin compute plans to the top of the table
-   About modal that opens from the user menu
-   New page not found page
-   Open assets links in task drawer in a new tab
-   Tasks details popover in compute plans table
-   New layout for performance charts
-   Help popover on charts
-   New filters on compare compute plans
-   Add start date and end date on compute plan's tasks
-   Start and end dates for compute plans
-   Description for status in table filters
-   Display tasks' duration

### Fixed

-   Fix rounding for progression percentage
-   Fix error in console due to bad markup
-   Removed warning in the console
-   Fix infinite load on the train tasks compute plan on first load
-   Added min width to compute plans table columns to fix display when there are no results
-   Truncate TableDrawerSectionKeyEntry value when too long
-   Set minWidth on a compute plan tag in order to avoid to many multilines
-   Avoid NaN progression percentage
-   Fix the Inter font
-   Add fixed version package for `@cypress/request`
-   Fix filter tags behavior
-   Fix missing "unknown" status for compute plans

### Changed

-   New design for compute plan performance page
-   On compute plan table, the click area for the checkboxes is the full cell
-   Updated all dependencies to latest versions
-   Improve chart style
-   Wording update composite tasks now labeled as "Composite train"
-   New branding
-   Display N/A when there is no parent task in the drawer
-   Zoom on charts works on full chart and not just axes

## [0.5.0] - 2021-11-02

### Added

-   New filters
-   Focus on first tab when opening filters

### Fixed

-   Add ellipsis to the Performance card title when it is too long
-   Fix routing issue with deprecated /compute_plan/ route
-   Dataset details page now takes full available height
-   Removed warning and errors in the console
-   Fix number of columns in the compute plan table
-   Removed double borders at the bottom of tables
-   Added rounded top corners in tasks table

### Changed

-   New design for datasets table
-   New style for the Compute Plans page
-   Dataset sider replaced by independent page
-   New layout for compute plan tasks
-   New design for compute plan tasks table
-   Owkin logo link now points to homepage
-   New design for algos table and drawer
-   New design for tasks table
-   Make tasks the default compute plan tab
-   New design for compute plan tasks drawer
-   Switch to "Permissions" from "Downloadable by / Processable by"
-   Layout improvements on Compute Plans page
-   Add clear button to searchbar
-   Small visual changes

## [0.4.0] - 2021-10-19

### Added

-   Add nodePort config for K8s service
-   Refactor tables with Chakra
-   Add missing dependency `buffer`
-   Add download button for the data sample keys in dataset sider
-   Add Fullscreen mode on the charts in the Compute Plans comparison page
-   Filter by status on compute plan tasks page
-   Download model button in chart tooltip
-   Support for multi-metric testtuples

### Fixed

-   Fix broken imports when using chakra UI components
-   Removed console error about unknown component props
-   Automated redirects now replace history state instead of creating a new one
-   Table filters do not cancel each other

### Changed

-   Dropped CSS reset and Lato font in favor of a full Chakra theme
-   Include key in filename when downloading a model
-   Made /compute_plans the landing page
-   New visual style for navigation on compute plan page
-   New style for searchbar
-   Simplify layout (no more vertical/horizontal scroll wrappers) and tables
-   Only collapse header height for deep routes
-   New design for metrics table

## [0.3.0] - 2021-10-04

### Added

-   Ability to zoom and pan on performance charts
-   Support for testtuples which parent is an aggregatetuple
-   Expired credentials will try to be renewed before triggering a log out
-   Display both "download" and "process" permissions
-   Download button for models
-   Add CSV export
-   Compute Plans comparison page
-   Owner section in compute plan sider
-   Display backend version
-   Filters on worker in tasks and compute plan tasks pages

### Fixed

-   Sider scroll not preserved across different assets anymore
-   Handle deleted intermediary models
-   Removed emotion warning about non-boolean attribute
-   Display short commit sha in user menu
-   Listing of a compute plan's datasets when building series
-   Default chart styles for unknown nodes
-   Add missing marker to perf chart legend
-   Fix cropped Jpeg export
-   Header now contains Node ID or channel name depending on logged in status
-   Security issues in dependencies
-   Fix Markdown style in production

### Changed

-   Works with orchestrator-powered backends only
-   Removed the "Timeline" section for tasks and compute plan that was "coming soon"
-   Use dedicated sub asset routes to retrieve compute plan tuples
-   Use dedicated sub asset routes to list all tuples from a compute plan
-   Only fetch testtuples when building charts
-   Chart tooltips are now interactive
-   All algos are now listed in the same table
-   Display current node id on login page
-   New navigation menu

## [0.2.0] - 2021-09-02

### Added

-   Add the name of the current node to the account menu
-   Add Chakra UI as a UI library
-   Add GitHub style to the markdown content
-   Add JPEG export
-   Add routes for compute plan details page's tabs

### Fixed

-   Patch circular import in mdast-util-to-hast dependency
-   Display intermediary state while checking credentials
-   Applying filters on a list moves back to the first page of results
-   In Chart, display node separation option only for numerous series
-   Add the task type for failed task

### Changed

-   Display channel name in header instead of node ID
-   Add out_model key and permissions in Sider
-   Always group series by lowercase metric name

## [0.1.0] - 2021-08-04
