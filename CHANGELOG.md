# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Newsfeed notifications (#588)

### Fixed

-   Removed date filters glitch (#585)
-   Consistent date filters - after and before (#590)

## [0.22.0] - 2022-05-16

### Added

-   Indicate active filters in the popover (#582)

## [0.22.0] - 2022-05-16

### Added

-   Mailto links in error alerts (#572)
-   Download buttons on ComputePlans page (#581)
-   Add a manual refresh button (#583)

### Fixed

-   Proper labels for status ordering (#574)
-   Ordering options in table header dropdowns (#575)
-   Alignment issue with PerfBrowser checkboxes (#576)

### Changed

-   Explicit keyboard shortcuts (#573)
-   Empty API params aren't sent to the API anymore (#571)
-   Added check on dependencies (#579)
-   Moved cypress to a dedicated package (#577)
-   Use the name field of Compute Plans instead of tag (#578)
-   Algo sorting by category is based on category names (#584)
-   Removed concept of hyperparameters in favor of metadata (#580)

## [0.21.0] - 2022-05-09

### Added

-   Permission filters (#562)

### Fixed

-   Trailing pagination focus (#563)
-   Correct date filter params sent to backend (#565)
-   Synced state handling for empty values are arrays (#567)
-   Reset searchbar when clearing applied filters (#568)

### Changed

-   Use csv url params values when filtering on multiple values for all fields (#561)
-   Change all references to eu.gcr.io to gcr.io in skaffold configs (#474)
-   Removed deadcode (#560)
-   Mutualize synced state declarations (#557)
-   Removed use of the search parameter (#556)
-   Handle new metric type (#544)
-   Add ESLint to React hooks (#494)
-   Improved filter tags display (#566)
-   Favorites only now synced in URL as a boolean flag (#569)

## [0.20.0] - 2022-05-03

### Added

-   Add rounds as x axis on perf charts (#549)
-   Display logs permissions on datasets table and details page (#551)
-   New filters (#516)

### Fixed

-   Make "Permissions" row top aligned in drawers and sidebars (#540)
-   Add empty state message in performance chart filter (#541)
-   Synced state init issue (#543)
-   Switch icons & wordings for ordering (#545)
-   Close news feed on blur (#546)
-   Hide "Customize columns" button if no hyperparameters are defined (#550)
-   Bad redirects breaking browsers back buttons (#552)

### Changed

-   Use paginated results for the newsfeed (#524)
-   Newsfeed card icon for canceled compute plans (#525)
-   More explicit download button in perf browser (#547)
-   Updated layout with 1200px min width (#554)
-   Rename master branch into main (#541)
-   Removed all MELLODDY specific code and features (#555)

## [0.19.0] - 2022-04-19

## Changed

-   Restrict filtering option only for concerned table columns (#523)

## [0.18.1] - 2022-04-14

### Fixed

-   Fix search by name and key on datasets page (#520)
-   Fix localStorage migration issue for hyperparameters (#521)

### Changed

-   Use a separate store for computePlans compare (#513)

## [0.18.0] - 2022-04-11

### Added

-   Allow keyboard interaction with the chart (#482)
-   Ordering (#446)
-   Favorites filter (#510)
-   Bulk selection (#517)

### Fixed

-   Hide show diff button in single cp page (#492)
-   Fix owkin-logo-black svg by putting back proper width & height (#493)
-   Glitchy selected compute plans on compare page (#491)
-   Handle invalid statuses (#490)
-   Open node settings on click in box (#496)
-   Hide clear button when no filters are applied in hp modal (#498)
-   Max updated depth issue on ComputePlanChart (#502)
-   Favorites management in compare page (#507)
-   useSyncedState hook doesn't remove param from url on unmount (#509)
-   localStorage values not loaded after login (#515)

### Changed

-   Fix version of vite-plugin-svgr-component dependency (#489)
-   Hooks cleanup (removed dead code) (#499)
-   Change favicon svg (#503)
-   Use performance endpoint (#504)
-   Remove "Select all" option from filters in performance page and hide clear icon when no filters are applied (#505)
-   Favorite stays at their place in the cp list (#506)
-   Search filter now searches in both name and key (#508)

## [0.17.0] - 2022-03-24

### Fixed

-   Faulty favorites count when filter are applied (#480)
-   Fixed security issues in axios & nth-check dependencies (#487)

### Changed

-   Filters also apply to favorites (#469)
-   Favorites / selected compute plan rows are collapsible (#470)
-   Replace compute plan key by its name in news feed (#495)

## [0.16.1] - 2022-03-24

### Added

-   Hyperparameters columns in cp list are customizable (#453)
-   Hyperparameters modal now draggable (#467)
-   Sticky columns on compute plans page (#468)
-   Hyperparameters modal now resizable (#475)
-   Change drag zoom background color (#478)
-   Add buttons to show diffs only & clear filters in hp modal (#481)

### Fixed

-   Get compute plan index from PerfBrowserContext in HP modal (#448)
-   Remove warning related to breadcrumb component on dataset page (#458)
-   Fix large border into chart zoom button group (#459)
-   Rename csv files downloaded from the comparison interface (#476)
-   Close hyperparameters list on modal escape (#477)

### Changed

-   In PerfBrowser, an empty node filters list means all node are displayed (#460)

## [0.16.0] - 2022-03-10

### Added

-   Add a news feed for compute plan task events (#336)
-   Show hyperparameters on the compare page (#434)
-   Favorite and selected compute plans are updated when new data is available (#428)
-   Hyperparameters columns in cp list table (#450)
-   Full text search on CP list (#452)
-   Drag to zoom on charts (#455)

### Fixed

-   Inject hyperparameters at deploy time (#445)

## [0.15.0] - 2022-03-03

### Added

-   New PerfBrowser layout and behavior (#411)

### Fixed

-   Add missing space in Timing component (#424)
-   Restore clickable table headers on Compute Plans page (#425)
-   Fix rank/epoch switch (#426)
-   Uniqueness issue of average series IDs (#437)
-   Sort point by score in tooltip summary (#441)
-   Set a max height for filter menu (#442)
-   Highlight only related node on hover in comparison mode (#444)

### Changed

-   Do not display copy/download buttons for empty data sample lists (#427)

## [0.14.0] - 2022-02-24

### Added

-   Add to favorite button in CP details page (#404)
-   Add metrics to breadcrumb in CP chart page (#410)
-   Nodes settings in Compute Plan Chart page (#413)
-   Add zoom buttons on charts (#415)
-   Breadcrumb and actions for Compare page (#418)

### Fixed

-   Rank/epoch typo in perf chart tooltip (#408)
-   Add channel namespace to values stored in localStorage (#412)
-   Catch cancel error when voluntarily aborting CP details calls (#414)
-   Improve responsiveness of charts (#423)

### Changed

-   Removed loading of compute plan counts and statuses in separate calls (reverts #383 and #390) (#400)
-   Improved the PerfSidebarSettingsNodes component (#402)
-   Removed dynamic average (#407)
-   Auto cancel pending HTTP calls when changing route or url params (#409)
-   Changed wording and controls in perf chart settings (#416)
-   Move all PerfBrowser inner state to PerfBrowserContext (#417)
-   Enabled filters on compute plans page (#421)

## [0.13.0] - 2022-02-17

### Added

-   Tooltip hover compute plan pin icon (#368)
-   Support for epochs as X Axis values (#394)
-   Custom markers on charts (#386)

### Fixed

-   Logout loop because of planned calls (#397)
-   Restore "Download as CSV" button on compare perf details page (#405)

### Changed

-   Align duration display in cp details with the one in cp list (#393)
-   Increase toast font size (#395)
-   Upgrade chartjs to 3.7.1 (#399)
-   Make full PerfBrowser sidebar section clickable (#401)
-   Page title issue on perf chart with task drawer open (#403)

## [0.12.0] - 2022-02-10

### Added

-   Compute plans selected for comparison are now persisted (same as pinned items) (#372)

### Fixed

-   Alignment issue between checkboxes and their labels (#376)
-   Scroll on performance legend overlaps on header "Rank X" (#381)
-   Restore metadata section to task drawers (#384)

### Changed

-   Put status "done" in first position in progress bar (#374)
-   Compute plan performance opens task drawer in the performance screen (#380)
-   Perf tab on Compute Plan page is enabled during loading (#385)
-   Load compute plans task counts and status in separate calls (#383)
-   Handle errors returned by the backend on list calls as if there was no results for the call (#387)
-   Retrieve compute plans task counts and status sequentially (#390)

## [0.11.0] - 2022-02-03

### Added

### Fixed

-   Handle perf rank detail Y overflow (#370)
-   Race conditions in compare page (#373)

### Changed

-   Disable performance chart for waiting/todo CP (#365)
-   Use 3 decimals instead of 2 for performance value (#366)
-   Naming: display organization instead of node (#367)
-   Chart: hovering a legend item should highlight the related line and values (#369)
-   Use click instead of shift+click to pan (#375)

## [0.10.0] - 2022-01-27

### Added

-   Added API_URL env var (#358)
-   UI: add loading state into drawers (#359)
-   MELLODDY: new pharma_average series (#362)

### Fixed

-   Added space around nodes tags in PerfBrowser (#346)
-   zIndex of perf chart tooltip (#347)
-   Full height layout on NotFound, Compare and CP chart pages (#351)
-   Perf tooltip position now depends on content size and position of canvas (#352)
-   Repeating key in PerfList that was causing lots of bugs (#353)
-   Broken metric name comparison causing perf browser to show as empty (#354)
-   Broken highlight / selection of rank 0 in perf charts (#355)
-   Broken clear button on compute plans page (#357)
-   Browser's previous page fixed on compute plans list page (#356)

### Changed

-   Add spacing below navigation (#348)
-   No more delay before hiding tooltip on perf chart cards (#352)
-   Removed redundant spaces in tables (#361)
-   Compute plan ID label now "#" instead of "CP" (#363)

## [0.9.2] - 2022-01-25

### Added

### Fixed

-   Fix typos, textarea width and style on feedback & help modal (#301)
-   Correct large5/small5 groups (#349)

### Changed

-   Make table headers clickable (#332)

## [0.9.1] - 2022-01-21

### Added

### Fixed

-   MELLODDY: Removed pseudonymization from frontend (it will be done on backend side) (#344)

### Changed

## [0.9.0] - 2022-01-20

### Added

-   Tooltips for chart thumbnails (#327)
-   MELLODDY: add hardcoded node labels (#337)
-   Tooltip over the average switch (#335)
-   MELLODDY: add hardcoded average series (#338)
-   Error logs (#329)
-   Link to documentation in help modal (#330)
-   Pseudonymize asset names (#342)

### Fixed

-   Do not include zoom and help buttons on chart JPEG export (#324)
-   Misc alignment issues (#325)
-   Fix overflow on metric name (#334)
-   Case insensitive sort of node labels (#340)

### Changed

-   Only display "reset zoom" button when the chart is zoomed in (#326)
-   Lazy load code highlighter and markdown formatter components (#328)
-   Sort nodes alphabetically on perf browser (#333)
-   Change request timeout from 10s to 2min (#341)
-   Change wording for ErrorAlert messages (#388)

## [0.8.0] - 2022-01-07

### Added

-   Button to download the perfs of multiple charts at once (#312)
-   Buttons to download the tested models in a test task drawer (#319)
-   Hierarchy background to PerfBrowser compute plan filters (#321)
-   MELLODDY flag to extract compute plan name from metadata (#322)

### Fixed

### Changed

-   Updated drawers and sidebars look and feel (#315)
-   Improved look for the PerfBrowser loading state (#318)
-   Improved look for the PerfBrowser empty state (#320)

## [0.7.0] - 2022-01-06

### Added

-   Preserve filters across task types (#265)
-   Explicit messages for why models cannot be downloaded (#263)
-   New help & feedback modal (#273)
-   Add support for Microsoft Clarity (optional) with a cookie banner (#241)
-   Display estimation end date for compute plan (#280)
-   Highlight task category containing failed tasks in compute plan details (#285)
-   Settings page (#283)
-   Disable current page pagination button (#288)
-   Added specific routes for each task category (#299)
-   Display test task performances in task drawer (#303)
-   Add link to compute plan in tasks list and tasks drawer (#302)
-   New and improved empty table message (#309)

### Fixed

-   Fixed status filter displayed value and date/duration layout (#257)
-   Fixed race condition that resulted in an infinite redirect loop (#259)
-   Fixed spacing around permissions (#262)
-   Fix vertical align in drawer (#266)
-   Fixed pagination when there are no results (#267)
-   Fixed padding in drawers (#268)
-   Fix dark theme issue by disabling it (#271)
-   Reduce font size on "download as" menu items (#261)
-   Uniformize file extension across the app (#264)
-   Prevents URL params to leak from computeplan list page to computeplan details page (#282)
-   Fixed warning in console (#284)
-   Remove old theme used before chakra (#286)
-   Removed "Other" label in compute plan settings when not necessary (#260)
-   Fix time collapsed on a CP when training - no end_date (#287)
-   Fix outmodel message color when model is not downloadable (#289)
-   Fix useless ellipsis on asset key in drawers (#291)
-   Add failed tasks to progress count in CP progression bar (#292)
-   Center "No data to display" message on CPs page when it's empty (#293)
-   Increased searchbar's width to prevent keys from being cutted (#294)
-   Fix focus color on searchbar (#297)
-   Fixed unexpected zoom reset when hovering perf rank details (#290)
-   Fix varying widthes for tables (#298)
-   Do not display parent task section in drawers if there are no parent tasks (#304)
-   Fixed font size in popover menus (#300)
-   Remove unnecessary padding in drawer tables (#295)
-   Disable Dark theme for Markdown content (#306)
-   Fix Header width in drawer + markdown width (#307)
-   Fix broken link in perf chart rank details (#310)
-   Handle non available perfs on testtuples (#316)

### Changed

-   Update internal type for compute plan list (#254)
-   Changed file structure for dockerfile (#256)
-   Better empty table message (#270)
-   Removed "unknown" task status and renamed "unknown" compute plan status in "empty" (#269)
-   Hovering charts highlights rank instead of points (#272)
-   Better page titles (#275)
-   Update Cypress version (#276)
-   Remove number of parent tasks in TaskTable (#277)
-   Switch train and test tasks tabs (#278)
-   Add capital letter to frontend in the about modal (#278)
-   General improvements of the perf browser component (#279)
-   Added ellipsis to too long links (#274)
-   New logo (#281)
-   Align TaskDrawer children to the left (#305)
-   Change Download button appearance (#308)
-   Added ellipsis to too long link (#314)
-   Disable interpretation of dates on CP table (#313)

## [0.6.0] - 2021-12-01

### Added

-   New login page (#220)
-   Ability to pin compute plans to the top of the table (#222)
-   About modal that opens from the user menu (#223)
-   New page not found page (#224)
-   Open assets links in task drawer in a new tab (#232)
-   Tasks details popover in compute plans table (#233)
-   New layout for performance charts (#226)
-   Help popover on charts (#228)
-   New filters on compare compute plans (#243)
-   Add start date and end date on compute plan's tasks (#227)
-   Start and end dates for compute plans (#249)
-   Description for status in table filters (#251)
-   Display tasks' duration (#252)

### Fixed

-   Fix rounding for progression percentage (#218)
-   Fix error in console due to bad markup (#213)
-   Removed warning in the console (#221)
-   Fix infinite load on the train tasks compute plan on first load (#225)
-   Added min width to compute plans table columns to fix display when there are no results (#229)
-   Truncate TableDrawerSectionKeyEntry value when too long (#234)
-   Set minWidth on a compute plan tag in order to avoid to many multilines (#235)
-   Avoid NaN progression percentage (#238)
-   Fix the Inter font (#244 & #245)
-   Add fixed version package for `@cypress/request` (#247)
-   Fix filter tags behavior (#248)
-   Fix missing "unknown" status for compute plans (#249)

### Changed

-   New design for compute plan performance page (#203)
-   On compute plan table, the click area for the checkboxes is the full cell (#214)
-   Updated all dependencies to latest versions (#216)
-   Improve chart style (#215)
-   Wording update composite tasks now labeled as "Composite train" (#230)
-   New branding (#231)
-   Display N/A when there is no parent task in the drawer (#239)
-   Zoom on charts works on full chart and not just axes (#228)

## [0.5.0] - 2021-11-02

### Added

-   New filters (#180)
-   Focus on first tab when opening filters (#207)

### Fixed

-   Add ellipsis to the Performance card title when it is too long (#182)
-   Fix routing issue with deprecated /compute_plan/ route (#197)
-   Dataset details page now takes full available height (#202)
-   Removed warning and errors in the console (#202)
-   Fix number of columns in the compute plan table (#199)
-   Removed double borders at the bottom of tables (#210)
-   Added rounded top corners in tasks table (#211)

### Changed

-   New design for datasets table (#171)
-   New style for the Compute Plans page (#172)
-   Dataset sider replaced by independent page (#175)
-   New layout for compute plan tasks (#177)
-   New design for compute plan tasks table (#178)
-   Owkin logo link now points to homepage (#184)
-   New design for algos table and drawer (#187)
-   New design for tasks table (#186)
-   Make tasks the default compute plan tab (#195)
-   New design for compute plan tasks drawer (#179)
-   Switch to "Permissions" from "Downloadable by / Processable by" (#200)
-   Layout improvements on Compute Plans page (#206)
-   Add clear button to searchbar (#209)
-   Small visual changes (#208)

## [0.4.0] - 2021-10-19

### Added

-   Add nodePort config for K8s service (#174)
-   Refactor tables with Chakra (#147)
-   Add missing dependency `buffer` (#156)
-   Add download button for the data sample keys in dataset sider (#151)
-   Add Fullscreen mode on the charts in the Compute Plans comparison page (#149)
-   Filter by status on compute plan tasks page (#169)
-   Download model button in chart tooltip (#145)
-   Support for multi-metric testtuples (#119)

### Fixed

-   Fix broken imports when using chakra UI components (#162)
-   Removed console error about unknown component props (#163)
-   Automated redirects now replace history state instead of creating a new one (#161)
-   Table filters do not cancel each other (#168)

### Changed

-   Dropped CSS reset and Lato font in favor of a full Chakra theme (#159)
-   Include key in filename when downloading a model (#160)
-   Made /compute_plans the landing page (#161)
-   New visual style for navigation on compute plan page (#158)
-   New style for searchbar (#164)
-   Simplify layout (no more vertical/horizontal scroll wrappers) and tables (#166)
-   Only collapse header height for deep routes (#167)
-   New design for metrics table (#170)

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
