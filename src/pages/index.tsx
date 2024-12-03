import { useState } from 'react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { Contract } from 'ethers';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export default function Home() {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [unlockDelay, setUnlockDelay] = useState('');
  
  const { address } = useAccount();
  
  const { write, data } = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: TimeLockedMessageABI,
    functionName: 'storeMessage',
  });
  
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !recipient || !unlockDelay) return;
    
    write({
      args: [message, recipient, BigInt(Number(unlockDelay) * 3600)],
    });
  };

  return (
    <div className="min-h-screen p-8">
      <ConnectButton />
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Recipient ENS or address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        
        <input
          type="number"
          placeholder="Unlock delay (hours)"
          value={unlockDelay}
          onChange={(e) => setUnlockDelay(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        
        <button
          type="submit"
          disabled={!address || isLoading}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}