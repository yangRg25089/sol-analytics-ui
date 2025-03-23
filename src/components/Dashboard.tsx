import React, { useState } from 'react';
import { Input, Button, Card, CardBody, useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import Transactions from './Transactions';
import Assets from './Assets';

interface DashboardProps {
  defaultWallet?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ defaultWallet = '' }) => {
  const [walletAddress, setWalletAddress] = useState<string>(defaultWallet);
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);

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
          <form onSubmit={handleWalletSubmit} className="flex gap-4">
            <Input
              classNames={{
                input: "bg-transparent",
                inputWrapper: "bg-default-100/50",
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
        </CardBody>
      </Card>

      {isValidAddress && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Transactions walletAddress={walletAddress} />
          <Assets walletAddress={walletAddress} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
