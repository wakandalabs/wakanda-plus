import React, {StrictMode} from "react"
import ReactDOM from "react-dom"
import {createWeb3ReactRoot, Web3ReactProvider} from "@web3-react/core"
import App from "./pages/App"
import {NetworkContextName} from "./constants/misc"
import {RecoilRoot} from "recoil"
import {BrowserRouter} from "react-router-dom"
import reportWebVitals from "./reportWebVitals"
import {ChakraProvider} from "@chakra-ui/react"
import theme from "./theme"
import Blocklist from "./components/Blocklist"
import getLibrary from "./utils/getLibrary"
import "focus-visible/dist/focus-visible"

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <Blocklist>
                <App/>
              </Blocklist>
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
