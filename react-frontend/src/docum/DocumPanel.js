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
import DocumAPIToken from './DocumAPIToken';
import TabPanelBar, { genTabConfig } from '../navigation/TabPanelBar';


const tabConfig = [
    genTabConfig("Access Tokens", <DocumAPIToken />),
]

export default function DocumPanel() {
    const [tabIdx, setTabIdx] = React.useState(0);

    return (
        <TabPanelBar tabConfig={tabConfig} tabIdx={tabIdx} setTabIdx={setTabIdx} />
    )
}

