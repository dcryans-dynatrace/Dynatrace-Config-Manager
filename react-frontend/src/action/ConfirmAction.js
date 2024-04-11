/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance with the License. 
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS, 
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
See the License for the specific language governing permissions and 
limitations under the License.
*/

import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField, Typography } from '@mui/material';

export const MIN_DESTROY_TO_CONFIRM = 20
const DESTROY_WORD = "DESTROY"

export default function ConfirmAction({ open, handleClose, label, descLabel, tenantLabel, handlePost, destroyCount = 0 }) {

    const [destroyConfirmation, setDestroyConfirmation] = React.useState("")

    const handlePostAndClose = React.useMemo(() => {
        return () => {
            handlePost()
            handleClose()
        }
    }, [handlePost, handleClose])

    const handleChangeDestroyConfirmation = React.useCallback((event) => {
        setDestroyConfirmation(event.target.value)
    }, [setDestroyConfirmation])

    const unconfirmed = React.useMemo(() => {
        if (destroyCount >= MIN_DESTROY_TO_CONFIRM) {
            return destroyConfirmation !== DESTROY_WORD
        }
        return false
    }, [destroyCount, destroyConfirmation])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">
                {label + "?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {descLabel}
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                    {tenantLabel}
                </DialogContentText>
            </DialogContent>
            {destroyCount >= MIN_DESTROY_TO_CONFIRM ? (
                <Box sx={{ mx: 3 }}>
                    <Typography variant="h7" color="error.main">
                        You are about to <b>destroy {destroyCount} configurations.</b>
                        <br /> - If it is by purpose, type <b>{DESTROY_WORD}</b> in the field below.
                        <br /> - If not, consider re-running OneTopology & TerraComposer using the <b>Skip destroy actions</b> option.
                    </Typography>
                    <FormControl fullWidth>
                        <TextField id={"destroy-confirmation-field"} variant="standard"
                            label="Destroy Confirmation" value={destroyConfirmation} onChange={handleChangeDestroyConfirmation} />
                    </FormControl>
                </Box>
            ) : null}
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handlePostAndClose} autoFocus disabled={unconfirmed}>
                    Proceed
                </Button>
            </DialogActions>
        </Dialog>
    )
}