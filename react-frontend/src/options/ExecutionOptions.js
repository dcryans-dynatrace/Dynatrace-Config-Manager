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

import { Box, Button, Divider, FormControl, Grid, Switch, TextField, ToggleButton, Typography } from '@mui/material';
import * as React from 'react';
import { useExecutionOptionsState } from '../context/ExecutionContext';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';


export default function ExecutionOptions() {

    const { enableDashboards, enableOmitDestroy, terraformParallelism, enableUltraParallel, setEnableDashboards, setEnableOmitDestroy, setTerraformParallelism, setEnableUltraParallel } = useExecutionOptionsState()

    const [terraformParallelismInput, setTerraformParallelismInput] = React.useState(terraformParallelism)

    const handleEnableDashboardsToggle = React.useCallback((forceValue = null) => {
        handleToggle(forceValue, enableDashboards, setEnableDashboards)
    }, [setEnableDashboards, enableDashboards])

    const handleEnableOmitDestroy = React.useCallback((forceValue = null) => {
        handleToggle(forceValue, enableOmitDestroy, setEnableOmitDestroy)
    }, [setEnableOmitDestroy, enableOmitDestroy])

    const handleEnableUltraParallelToggle = React.useCallback((forceValue = null) => {
        handleToggle(forceValue, enableUltraParallel, setEnableUltraParallel)
    }, [setEnableUltraParallel, enableUltraParallel])

    const handleSetTerraformParallelism = React.useCallback((event) => {
        let newValue = event.target.value
        setTerraformParallelismInput(newValue)
        if (!newValue || newValue === "" || newValue < 1) {
            newValue = "1"
        }
        setTerraformParallelism(Number(newValue))
    }, [setTerraformParallelism])

    return (
        <React.Fragment>
            <Divider sx={{ borderBottomWidth: 3, mb: 2 }} />
            <Grid container direction={'row'} style={{ textAlign: "center" }} sx={{ mt: 1 }}>
                <Grid item xs="5">
                    <Typography variant="h6">Custom Behavior</Typography>
                </Grid>
                <Grid item xs="2">
                    <React.Fragment />
                </Grid>
                <Grid item xs="5">
                    <Typography variant="h6">Default Behavior</Typography>
                </Grid>
            </Grid>
            <Divider variant="middle" />
            {genToggle(ENABLE_DASHBOARDS, enableDashboards, handleEnableDashboardsToggle)}
            <Divider variant="middle" />
            {genToggle(ENABLE_OMIT_DESTROY, enableOmitDestroy, handleEnableOmitDestroy)}
            <Divider variant="middle" />
            {genToggle(ENABLE_ULTRA_PARALLEL, enableUltraParallel, handleEnableUltraParallelToggle)}
            <Divider sx={{ borderBottomWidth: 3, my: 2 }} />
            <FormControl fullWidth>
                <TextField id={"terraformParallelism-field"}
                    type="number"
                    variant="standard"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Terraform parallelism parameter, or threads (5: lower Memory usage, 15: faster processing)" value={terraformParallelismInput}
                    onChange={handleSetTerraformParallelism} />
            </FormControl>
            <Divider sx={{ borderBottomWidth: 3, my: 2 }} />
        </React.Fragment>
    );
}

function handleToggle(forceValue, currentValue, setValue) {
    if (typeof forceValue === "boolean") {
        if (forceValue === currentValue) {
            return
        } else {
            setValue(forceValue)
        }
    } else {
        setValue(!currentValue)
    }
}

function genToggle(label, isEnabled, handleFunction) {
    return (
        <Grid container direction={'row'} style={{ textAlign: "center" }} sx={{ my: 1 }}>
            <Grid item xs="5">
                <FormControl fullWidth>
                    <Button onClick={() => { handleFunction(false) }} {...genButtonProps(isEnabled, false)}>{genButtonText(label, false)}</Button>
                    <Typography>{genInfoText(label, isEnabled, false)}</Typography>
                </FormControl>
            </Grid>
            <Grid item xs="2">
                <Box>
                    <Switch onClick={handleFunction} checked={isEnabled}>
                        {isEnabled ? <ToggleOnIcon fontSize='large' /> : <ToggleOffIcon fontSize='large' />}
                    </Switch>
                </Box>
            </Grid>
            <Grid item xs="5">
                <FormControl fullWidth>
                    <Button onClick={() => { handleFunction(true) }} {...genButtonProps(isEnabled, true)}>{genButtonText(label, true)}</Button>
                    <Typography>{genInfoText(label, isEnabled, true)}</Typography>
                </FormControl>
            </Grid>
        </Grid>
    )
}

function genButtonProps(isEnabled, expected = null) {
    if (expected === null || isEnabled === expected) {
        // pass
    } else {
        return {}
    }

    if (isEnabled) {
        return { variant: "contained", color: "secondary" }
    }

    return { variant: "contained", color: "primary" }
}

const ENABLE_DASHBOARDS = 'enableDashboards'
const ENABLE_OMIT_DESTROY = 'enableOmitDestroy'
const ENABLE_ULTRA_PARALLEL = 'enableUltraParallel'


const ON_LABELS = {
    [ENABLE_DASHBOARDS]: "Process Dashboards",
    [ENABLE_OMIT_DESTROY]: "Skip Destroy Actions",
    [ENABLE_ULTRA_PARALLEL]: "Ultra Parallel Mode",
}
const OFF_LABELS = {
    [ENABLE_DASHBOARDS]: "Exclude Dashboards",
    [ENABLE_OMIT_DESTROY]: "Keep Destroy Actions",
    [ENABLE_ULTRA_PARALLEL]: "Create Individual TF Files",
}
const ON_INFO_TEXT = {
    [ENABLE_DASHBOARDS]: "Processing will be a bit slower",
    [ENABLE_OMIT_DESTROY]: "Less risky Apply All action, but omits the deletion of a default config for example",
    [ENABLE_ULTRA_PARALLEL]: "Runs much faster, exponential gains beyond 20'000 configs",
}
const OFF_INFO_TEXT = {
    [ENABLE_DASHBOARDS]: "Speeds up the process",
    [ENABLE_OMIT_DESTROY]: "Achieves a complete sync, but could delete configs already present in the target environment",
    [ENABLE_ULTRA_PARALLEL]: "Creates a single tf file per resource, making it easier to use outside of the tool",
}

function genButtonText(label, isEnabled) {
    if (isEnabled) {
        return ON_LABELS[label]
    }

    return OFF_LABELS[label]
}
function genInfoText(label, isEnabled, expected) {
    let infoText = OFF_INFO_TEXT[label]

    if (expected) {
        infoText = ON_INFO_TEXT[label]
    }

    if (isEnabled === expected) {
        return (<b>{infoText}</b>)
    } else {
        return infoText
    }
}