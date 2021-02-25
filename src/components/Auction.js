import React, { useState, useEffect, Fragment } from 'react';

export default function Auction(props) {
    const [dataKey, setDataKey] = useState(null)
    const { drizzle, drizzleState } = props
    const { FuckoPops } = drizzleState.contracts

    console.log("FuckoPops: ", FuckoPops);
    console.log("drizzleContracts: ", drizzle.contracts)

    useEffect( 
        () => {
          const contract = drizzle.contracts.FuckoPops
          // let drizzle know we want to watch the `myString` method
          const dataKey = contract.methods["currentGenerativeCodeHash"].cacheCall()
          // save the `dataKey` to local component state for later reference
          setDataKey(dataKey)
        }, [dataKey, drizzle.contracts.FuckoPops])
        
    const myString = FuckoPops.currentGenerativeCodeHash[dataKey];
    console.log("myString: ", myString);


    return (
        <div>
            Auction - {myString + 1}
        </div>
    )
}