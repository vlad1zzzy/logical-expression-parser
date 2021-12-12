import React, {useEffect, useMemo, useRef, useState} from 'react';
import './App.css';
import 'react-tree-graph/dist/style.css'
import Parser from "./parser/src/Parser";
import Tree from "./parser/src/Tree";
import TreeVisual from "react-d3-tree";
import {generateCorrectExpressions, generateIncorrectExpressions} from "./tests/test-generator";

function App() {
    const [state, setState] = useState("(a and b) or not (c xor (a or not b))");
    const [err, setErr] = useState('')
    const [data, setData] = useState<Tree>(new Tree(''))
    const inputRef = useRef<HTMLInputElement>(null);

    const testsValid = useMemo(() => generateCorrectExpressions(), []);
    const testsInvalid = useMemo(() => generateIncorrectExpressions(), []);

    useEffect(() => {
        try {
            setErr('')
            inputRef.current!.classList.remove('warn');
            const result: Tree = new Parser().parse(state);
            setData(result);
            inputRef.current!.classList.add('success');
        } catch (e) {
            inputRef.current!.classList.remove('success');
            inputRef.current!.classList.add('warn');
            // @ts-ignore
            setErr(e.message)
        }
    }, [state])

    const calc = () => {
        setState(inputRef.current!.value);
    }

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            calc()
        }
    }

    const onSuggestClick = (tests: string[]) => {
        inputRef.current!.value = tests[Math.floor(Math.random() * tests.length)];
        calc();
    }

    return (
        <div className="App">
            {
                data &&
                <div id="treeWrapper" style={{width: '100vw', height: '100vh'}}>
                    <TreeVisual
                        data={data}
                        rootNodeClassName="node__root"
                        branchNodeClassName="node__branch"
                        leafNodeClassName="node__leaf"
                        orientation="vertical"
                    />
                </div>
            }
            <div className="input_expression">
                <div className="suggests">
                    <button onClick={() => onSuggestClick(testsValid)}>GENERATE VALID</button>
                    <button onClick={() => onSuggestClick(testsInvalid)}>GENERATE INVALID</button>
                </div>
                <input type="text" defaultValue={state} ref={inputRef} onKeyDown={handleKeyDown}/>
                <div className="error">{err}</div>
            </div>
        </div>
    );
}

export default App;
