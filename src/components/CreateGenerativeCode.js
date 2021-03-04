import React, { useState, useEffect, Fragment } from 'react';
import P5Sandbox from './P5Sandbox';
import styled from "styled-components";
import axios from "axios";

const CreateGenerativeCodeContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const JustUserInput = styled.div`
    display: flex;
    flex-direction: column;
`;

const CodeArea = styled.textarea`
    width: 300px;
    height: 280px;
`;

const BigContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const STARTING_CODE = 
`function setup() {
    randomSeed($BLOCK_NUM)
    createCanvas(400, 400);
    background(0);
}
function draw() {

}`;

export default function CreateGenerativeCode(props) {
   
    const [blockNum, setBlockNum] = useState(1001);
    const [uniqueCode, setUniqueCode] = useState(STARTING_CODE)
    const [response, setResponse] = useState("");

    return (
        <BigContainer>
            <CreateGenerativeCodeContainer>
                <JustUserInput>
                    <span>Block Number:</span>
                    <input value={blockNum} onChange={(e) => setBlockNum(parseInt(e.target.value))} />
                    <span>Code:</span>
                    <CodeArea rows={18} columns={80} type="textarea" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} />
                </JustUserInput>
                <P5Sandbox isPlaying={true} width="420px" height="420px" code={uniqueCode} blockNum={parseInt(blockNum)} />
            </CreateGenerativeCodeContainer>
            <button onClick={async () => {
                setResponse("");
                const response = await axios.post("http://localhost:4000/save-code", uniqueCode, { headers: {
                    "content-type": "text/plain"
                }});
                //const response = await axios({method: "post", url: "http://localhost:4000/save-code", data: uniqueCode});
                console.log("response: ", response);
                setResponse(response);
            }}>Save code to IPFS</button>
        </BigContainer>
    )
}