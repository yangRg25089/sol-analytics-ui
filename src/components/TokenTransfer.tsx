import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TokenTransferProps {
  tokenId: string;
  balance: number;
  onTransfer: () => void;
}

export const TokenTransfer: React.FC<TokenTransferProps> = ({
  tokenId,
  balance,
  onTransfer,
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transferData, setTransferData] = useState({
    toAddress: '',
    amount: '',
  });

  const handleTransfer = async () => {
    try {
      const response = await fetch(`/api/tokens/${tokenId}/transfer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toAddress: transferData.toAddress,
          amount: parseFloat(transferData.amount),
        }),
      });

      if (response.ok) {
        onTransfer();
        onClose();
        setTransferData({ toAddress: '', amount: '' });
      }
    } catch (error) {
      console.error('Error transferring token:', error);
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        {t('token.transfer')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{t('token.transferTitle')}</ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {t('token.balance')}: {balance}
              </p>
            </div>
            <Input
              label={t('token.toAddress')}
              value={transferData.toAddress}
              onChange={(e) =>
                setTransferData({ ...transferData, toAddress: e.target.value })
              }
              placeholder="Enter Solana address"
            />
            <Input
              type="number"
              label={t('token.amount')}
              value={transferData.amount}
              onChange={(e) =>
                setTransferData({ ...transferData, amount: e.target.value })
              }
              placeholder="Enter amount"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onPress={handleTransfer}
              isDisabled={!transferData.toAddress || !transferData.amount}
            >
              {t('token.confirmTransfer')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
