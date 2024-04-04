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
import { TERRAFORM_CHECK, backendGet } from '../backend/backend';
import { Box, Button, Typography } from '@mui/material';

export function useTerraformExecDetails() {
    const [terraformExecDetails, setTerraformExecDetails] = React.useState(null)

    React.useEffect(() => {
        backendGet(TERRAFORM_CHECK, null,
            promise =>
                promise
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        setTerraformExecDetails(data)
                    })
        )

    }, [])

    return React.useMemo(() => {

        let terraformInfo = ""
        let isTerraformError = false
        let terraformErrorComponent = []

        if (terraformExecDetails) {
            // pass
        } else {
            return { isTerraformError, terraformErrorComponent, terraformInfo }
        }

        const {
            is_terraform_installed_locally, is_terraform_executable_locally,
            is_terraform_installed, is_terraform_executable,
            absolute_terraform_exec_path_local, local_terraform_path,
            is_darwin, is_terraform_provider_executable, is_terraform_provider_runnable,
            absolute_terraform_provider_exec_path_local
        } = terraformExecDetails

        if (is_terraform_installed_locally && is_terraform_executable_locally) {
            terraformInfo = "* Using locally installed terraform executable"
        } else if (is_terraform_installed_locally) {
            isTerraformError = true
            terraformErrorComponent.push(
                <React.Fragment>
                    <Typography sx={{ mt: 6 }} variant="h5" color="error.main" align='center'>
                        Terraform installed locally but not executable
                    </Typography>

                    {absolute_terraform_exec_path_local ? (
                        <Typography sx={{ my: 6 }} variant="h5" color="error.main" align='center'>
                            Please run this command:
                            <br /> {"chmod +x " + absolute_terraform_exec_path_local}
                        </Typography>
                    ) : null}
                </React.Fragment >
            )
        } else if (is_terraform_installed && is_terraform_executable) {
            // pass
        } else {
            isTerraformError = true
            terraformErrorComponent.push(
                <React.Fragment>
                    <Typography sx={{ mt: 6 }} variant="h5" color="error.main" align='center'>Terraform executable not found</Typography>
                    <Box align='center'>
                        <Button href={"https://developer.hashicorp.com/terraform/downloads"} target="_blank" rel=" noopener noreferrer">
                            Download terraform from Hashicorp
                        </Button>
                    </Box >
                    <Typography sx={{ mt: 6 }} variant="h5" color="error.main" align='center'>Please download the terraform executable and add it to your PATH environment variable.  <br /> (requires restarting the app with updated PATH)</Typography>

                    {local_terraform_path ? (
                        <Typography sx={{ my: 6 }} variant="h5" color="error.main" align='center'>
                            Alternative: Copy the terraform executable locally to this directory:
                            <br /> {local_terraform_path}
                        </Typography>
                    ) : null}

                </React.Fragment >
            )
        }

        if (is_darwin) {
            if (is_terraform_provider_runnable) {
                // pass
            } else {
                isTerraformError = true
                terraformErrorComponent.push(
                    <React.Fragment>
                        <Typography sx={{ mt: 6 }} variant="h5" color="error.main" align='center'>
                            Terraform Provider needs to be allowed.
                        </Typography>
                        <Typography sx={{ mt: 6 }} variant="h5" color="error.main">
                            Open a Terminal and run this command:
                        </Typography>
                        <Box
                            sx={{
                                mt: 0.5,
                                overflowX: 'auto',
                            }}
                        >
                            <Typography component="pre" display="block" style={{ wordWrap: "break-word" }}>
                                {absolute_terraform_provider_exec_path_local}
                            </Typography>
                        </Box>


                        <Typography variant="h5" color="error.main">
                            Click OK
                            <br /> Go to System Settings &gt; Privacy & Security &gt; Security where it should be listed.
                            <br /> Click on Allow Anyway next to the provider
                            <br /> Run the above command again
                            <br /> Click on Open
                            <br /> Refresh this page
                        </Typography>
                    </React.Fragment >
                )
            }
        } else if (is_terraform_provider_executable) {
            // pass
        } else {
            isTerraformError = true
            terraformErrorComponent.push(
                <React.Fragment>
                    <Typography sx={{ mt: 6 }} variant="h5" color="error.main" align='center'>
                        Terraform Provider not executable
                    </Typography>

                    {absolute_terraform_provider_exec_path_local ? (
                        <Typography sx={{ my: 6 }} variant="h5" color="error.main" align='center'>
                            Please run this command:
                            <br /> {"chmod +x " + absolute_terraform_provider_exec_path_local}
                        </Typography>
                    ) : null}

                </React.Fragment >
            )
        }

        return { isTerraformError, terraformErrorComponent, terraformInfo }
    }, [terraformExecDetails])

}
