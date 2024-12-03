import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import Home from './home';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();


const config  = getDefaultConfig({
  appName: 'Time Locked Messages',
  chains: [sepolia],
  projectId: 'cac38d65f99eb494a730ee1e1a3f852a',
  ssr: false, // If your dApp uses server side rendering (SSR)
});

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Home />
        </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
