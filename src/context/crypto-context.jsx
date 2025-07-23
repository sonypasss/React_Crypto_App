import { createContext, useContext, useEffect, useState } from "react";
import { fakeFetchCrypto, fetchAssets } from '../api';
import { percentDiffrence } from '../utills'


const CryptoContext = createContext({
    asserts: [],
    crypto: [],
    loading: false,
})


export function CryptoContextProvider({ children }) {
    const [loading, setLoading] = useState(false)
    const [crypto, setCrypto] = useState([])
    const [assets, setAssets] = useState([])

    useEffect(() => {
        async function preload() {
        setLoading(true)
        const { result } = await fakeFetchCrypto()
        const assets = await fetchAssets()

        setAssets(
        assets.map(asset => {
            const coin = result.find((c) => c.id === asset.id)
            return {
            grow: asset.price < coin.price,
            growPercent: percentDiffrence(asset.price, coin.price),
            totalAmount: asset.amount * coin.price, // количество криптовалюты умножаем на текущую стоимость
            totalProfit: asset.amount * coin.price - asset.amount * asset.price, // сколько заработали: сколько заработали и вычитаем то кол-во денег, за которое покупали крипту 
            ...asset,
            }
        })
        )
        setCrypto(result)
        setLoading(false)
        }
        preload()
    }, [])
    return (
        <CryptoContext.Provider value={{loading, crypto, assets}}>
            {children}
        </CryptoContext.Provider>
    )
}

export default CryptoContext

export function useCrypto() {
    return useContext(CryptoContext)
}