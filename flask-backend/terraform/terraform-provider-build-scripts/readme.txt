Scripts to compile terraform-provider-dynatrace for the Config Manager:

    Change the value of WSL_HOME in these scripts to match your wsl username:
        build-linux.cmd
        build.cmd

    Make sure the Dynatrace-Config-Manager and the terraform-provider-dynatrace are checked out in the same main directory
        For me:
            C:\win-repos\Dynatrace-Config-Manager
            C:\win-repos\terraform-provider-dynatrace

    On wsl, you only need DTCM:
        $HOME\repos\Dynatrace-Config-Manager

    Copy these scripts at the root of terraform-provider-dynatrace
        C:\win-repos\terraform-provider-dynatrace

    Run build.cmd to update everything (for a release)
    Run "per-os" scripts if you are debugging (it's faster)
