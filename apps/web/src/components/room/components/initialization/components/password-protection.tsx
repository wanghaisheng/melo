"use client";

import { useState } from 'react';
import { Button } from '@melo/ui/ui/button';
import { Input } from '@melo/ui/ui/input';
import { KeyRound, Loader2 } from 'lucide-react';
import type { FirestoreRoom } from '@melo/types';
import { compare } from 'bcryptjs';
import Loader from '@/web/components/room/components/loader';

interface PasswordProtectionProps {
  children: React.ReactNode;
  room: FirestoreRoom;
}

export default function PasswordProtection({
  room,
  children,
}: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const verifyPassword = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const isCorrect = await compare(password, room.password);
      
      if (isCorrect) {
        setIsVerified(true);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (_) {
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPassword();
  };

  if (isVerified) {
    return children;
  }

  return (
    <div className='flex'>
      <Loader title="Password Protected!" subtitle="The owner set the room to be password protected." className="flex-[3] px-0 mx-0 hidden md:flex"/>
      
      <div className="flex flex-col justify-center h-screen flex-[2]">
        <h1 className="text-4xl font-thin text-gray-600 mb-1">Password Protected</h1>
        
        <p className="text-xs text-gray-500 mb-4">
          Enter the password to join room &quot;{room.name}&quot;
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 w-64">
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter room password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              disabled={isVerifying}
            />
            <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button 
            type="submit" 
            className="bg-lime-500 hover:bg-lime-600"
            disabled={!password || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Join Room'
            )}
          </Button>
        </form>
      </div>

    </div>
  );
}