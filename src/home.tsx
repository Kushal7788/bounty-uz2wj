import React, { useState } from 'react';
import { useAccount, useWriteContract, useTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TimeLockedMessageABI from '../contracts/TimeLockedMessage.json';

const CONTRACT_ADDRESS = '0x99772A7bF122e2D0EeE3D2d4C9635B6Eedbdb3de';

export default function Home() {
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [unlockDelay, setUnlockDelay] = useState('');
  
  const { address } = useAccount();
  
  const { writeContract, data: hash } = useWriteContract();
  
  const { isLoading, isSuccess } = useTransaction({
    hash: hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !recipient || !unlockDelay) return;
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: TimeLockedMessageABI,
        functionName: 'storeMessage',
        args: [message, recipient, BigInt(Number(unlockDelay) * 3600)],
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
        
        {isSuccess && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Message sent successfully!
          </div>
        )}
      </form>
    </div>
  );
}