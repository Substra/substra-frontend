import config from 'config';

// copy from https://cdn.ravenjs.com/3.22.2/raven.min.js
// + Raven.config('${config.apps.frontend.raven_url}').install();
export default `
<script src="raven.min.js"></script>
<script type="text/javascript">
Raven.config('${config.apps.frontend.raven_url}').install();
</script>
`;
