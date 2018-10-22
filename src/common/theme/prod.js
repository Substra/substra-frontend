import {createMuiTheme} from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
    palette: {
        primary: indigo, // Purple and green play nicely together.
    },
    typography: {
        useNextVariants: true,
    },
});

export default theme;
