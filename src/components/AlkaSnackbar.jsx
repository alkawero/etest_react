import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';

const AlkaSnackbar = (props) => {
    return(        
        <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={props.show}
            autoHideDuration={6000}
            onClose={props.close}
        >
            <SnackbarContentWrapper
            onClose={props.close}
            variant={props.variant}
            message={props.txt}
            />
        </Snackbar>
    )
}

export default AlkaSnackbar
