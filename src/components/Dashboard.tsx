import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import Assets from './Assets';
import Transactions from './Transactions';

interface DashboardProps {
  defaultWallet?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ defaultWallet = '' }) => {
  const [walletAddress, setWalletAddress] = useState<string>(defaultWallet);
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);
  const { publicKey } = useWallet();
  const { authState } = useAuth();

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Solana address validation
    setIsValidAddress(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card
        className="bg-gradient-to-br from-primary-900/20 to-secondary-900/20 backdrop-blur-sm border-none"
        shadow="sm"
      >
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Connect Wallet</h2>
              <WalletMultiButton />
            </div>
            {!publicKey && (
              <form onSubmit={handleWalletSubmit} className="flex gap-4">
                <Input
                  classNames={{
                    input: 'bg-transparent',
                    inputWrapper: 'bg-default-100/50',
                  }}
                  size="lg"
                  variant="bordered"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter Solana wallet address"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">SOL</span>
                    </div>
                  }
                />
                <Button
                  color="primary"
                  type="submit"
                  className="bg-gradient-to-tr from-primary-500 to-secondary-500"
                >
                  Analyze
                </Button>
              </form>
            )}
          </div>
        </CardBody>
      </Card>

      {(isValidAddress || publicKey) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="col-span-2">
            <CardHeader>
              <h2 className="text-xl font-bold">Overview</h2>
            </CardHeader>
            <CardBody>{/* Add account overview stats */}</CardBody>
          </Card>

          <div className="space-y-6">
            <Transactions
              walletAddress={publicKey?.toBase58() || walletAddress}
            />
          </div>
          <div className="space-y-6">
            <Assets walletAddress={publicKey?.toBase58() || walletAddress} />
          </div>
        </motion.div>
      )}

      {authState.user?.is_token_issuer && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Token Management</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4">
              <Button color="primary">Create Token</Button>
              <Button color="secondary">Manage Tokens</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </motion.div>
  );
};

export default Dashboard;
