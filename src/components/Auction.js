import React, { useState, useEffect, Fragment } from 'react';
import P5Sandbox from './P5Sandbox';
import styled from "styled-components";
import axios from "axios";

const AuctionPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const AuctionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 6px;
    width: 500px;
`;

export default function Auction(props) {
    const [lastMintedTokenIdKey, setLastMintedTokenIdKey] = useState(null);
    const [currentGenerativeCodeHashKey, setCurrentGenerativeCodeHashKey] = useState(null);
    const [lastSalePriceKey, setLastSalePriceKey] = useState(null);
    const [lastSaleTimeKey, setLastSaleTimeKey] = useState(null);



    const [loading, setLoading] = useState(true);
    const [buyEnabled, setBuyEnabled] = useState(true);
    const [stackId, setStackId] = useState(null);

    const [currentGenerativeCode, setCurrentGenerativeCode] = useState( `
    function setup() {
    createCanvas(400, 400);
    background(0);
}

function draw() {
    background(220);
    stroke(255, 204, 0);
    strokeWeight(4);
        rect(200,200,200,200)
}
`);
    const { drizzle, drizzleState } = props
    const { FuckoPops } = drizzleState.contracts

    console.log("FuckoPops: ", FuckoPops);
    console.log("drizzleContracts: ", drizzle.contracts)

    const [time, setTime] = useState(Date.now());

    useEffect(() => {
      const interval = setInterval(() => setTime(Date.now()), 1000);
      return () => {
        clearInterval(interval);
      };
    }, []);

    useEffect( 
        () => {
          const contract = drizzle.contracts.FuckoPops
          // let drizzle know we want to watch the `myString` method
          const key = contract.methods["lastMintedTokenId"].cacheCall()
          // save the `dataKey` to local component state for later reference
          setLastMintedTokenIdKey(key)
        }, [lastMintedTokenIdKey, drizzle.contracts.FuckoPops])

    useEffect( 
        () => {
            const contract = drizzle.contracts.FuckoPops
            // let drizzle know we want to watch the `myString` method
            const key = contract.methods["currentGenerativeCodeHash"].cacheCall()
            // save the `dataKey` to local component state for later reference
            setCurrentGenerativeCodeHashKey(key)
        }, [currentGenerativeCodeHashKey, drizzle.contracts.FuckoPops])

    useEffect( 
        () => {
            const contract = drizzle.contracts.FuckoPops
            // let drizzle know we want to watch the `myString` method
            const key = contract.methods["lastSalePrice"].cacheCall()
            // save the `dataKey` to local component state for later reference
            setLastSalePriceKey(key)
        }, [lastSalePriceKey, drizzle.contracts.FuckoPops])

    useEffect( 
        () => {
            const contract = drizzle.contracts.FuckoPops
            // let drizzle know we want to watch the `myString` method
            const key = contract.methods["lastSaleTime"].cacheCall()
            // save the `dataKey` to local component state for later reference
            setLastSaleTimeKey(key)
        }, [lastSaleTimeKey, drizzle.contracts.FuckoPops])

    useEffect(
       () => {
            if (FuckoPops.currentGenerativeCodeHash[currentGenerativeCodeHashKey]) {
                setLoading(true);
                console.log("hash changed: ", FuckoPops.currentGenerativeCodeHash[currentGenerativeCodeHashKey]);
                axios.get("https://cloudflare-ipfs.com/ipfs/" + FuckoPops.currentGenerativeCodeHash[currentGenerativeCodeHashKey].value).then((res) => {
                    console.log("res: ", res);
                    if(res && res.data && res.data.code) {
                        setCurrentGenerativeCode(res.data.code);
                        setLoading(false);
                    }
                })
            }
        }, [FuckoPops.currentGenerativeCodeHash[currentGenerativeCodeHashKey]]
    )
    
    const lastTokenId = FuckoPops.lastMintedTokenId[lastMintedTokenIdKey] ? FuckoPops.lastMintedTokenId[lastMintedTokenIdKey].value : "NaN";
    const currentGenerativeCodeHash = FuckoPops.currentGenerativeCodeHash[currentGenerativeCodeHashKey] ? FuckoPops.currentGenerativeCodeHash[currentGenerativeCodeHashKey].value : "unknown";
    
    const lastSaleTime = FuckoPops.lastSaleTime[lastSaleTimeKey]?.value;
    const lastSalePrice = FuckoPops.lastSalePrice[lastSalePriceKey]?.value;

    const now = Math.round(Date.now() / 1000);
    const secondsToEndOfSale = 84600 - (now - lastSaleTime);
    const basePrice = 1000000000000000000;
    console.log("seconds to end of sale: ", secondsToEndOfSale); 
    let minValueEstimate = basePrice;
    if (secondsToEndOfSale > 0) {
        minValueEstimate = basePrice + (secondsToEndOfSale*lastSalePrice*2) / 84600;
    }
    
    // console.log("myString: ", lastTokenId);
    // console.log("currentGenerativeCodeHash: ", currentGenerativeCodeHash);
    // console.log("code: ", currentGenerativeCode);

        if (loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
    return (
        <AuctionPageContainer>
        <AuctionContainer>
            <h2>Auction - {parseInt(lastTokenId) + 1}</h2>
            <P5Sandbox isPlaying={true} width="420px" height="420px" code={currentGenerativeCode} blockNum={4000}/>
    <span>{"EST Price in ETH: " + minValueEstimate / 1000000000000000000}</span>
            <button disabled={!buyEnabled} onClick={async () => {
                console.log("drizzleState: ", drizzleState);
                const stackId1 = drizzle.contracts.FuckoPops.methods.mintFucko.cacheSend("0xcEC56F1D4Dc439E298D5f8B6ff3Aa6be58Cd6Fdf", { value: minValueEstimate + ""});
                setStackId(stackId1)
            }}>BUY</button>
        </AuctionContainer>
        </AuctionPageContainer>
    )
}