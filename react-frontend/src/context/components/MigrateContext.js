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

import { HistoryContextDispatch, HistoryContextState, useHistoryContextReducer } from "../HistoryContext";
import { ResultContextDispatch, ResultContextState, useResultContextReducer } from "../ResultContext";


export default function MigrateContext(props) {
    const [historyState, historyDispatch] = useHistoryContextReducer()
    const [resultState, resultDispatch] = useResultContextReducer()

    return (
        <HistoryContextState.Provider value={historyState}>
            <HistoryContextDispatch.Provider value={historyDispatch}>
                <ResultContextState.Provider value={resultState}>
                    <ResultContextDispatch.Provider value={resultDispatch}>
                        {props.children}
                    </ResultContextDispatch.Provider>
                </ResultContextState.Provider>
            </HistoryContextDispatch.Provider>
        </HistoryContextState.Provider>
    )
}

