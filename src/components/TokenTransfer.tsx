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
  Spinner,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_BASE_URL } from '../config/constants';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTransfer = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 在开发环境中使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟
        console.log('Transfer simulation:', {
          tokenId,
          toAddress: transferData.toAddress,
          amount: parseFloat(transferData.amount),
        });
        onTransfer();
        onClose();
        setTransferData({ toAddress: '', amount: '' });
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/tokens/${tokenId}/transfer/`,
        {
          toAddress: transferData.toAddress,
          amount: parseFloat(transferData.amount),
        },
      );
      onTransfer();
      onClose();
      setTransferData({ toAddress: '', amount: '' });
    } catch (error) {
      console.error('Error transferring token:', error);
      setError(error instanceof Error ? error.message : t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        {t('assets.transfer')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{t('token.transferTitle')}</ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <p className="text-sm text-default-400">
                {t('assets.total')}: {balance.toFixed(4)}
              </p>
            </div>
            <Input
              label={t('token.toAddress')}
              value={transferData.toAddress}
              onChange={(e) =>
                setTransferData({ ...transferData, toAddress: e.target.value })
              }
              placeholder={t('token.enterAddress')}
              className="mb-4"
              isDisabled={isLoading}
            />
            <Input
              type="number"
              label={t('token.amount')}
              value={transferData.amount}
              onChange={(e) =>
                setTransferData({ ...transferData, amount: e.target.value })
              }
              placeholder={t('token.enterAmount')}
              min={0}
              max={balance}
              step="0.0001"
              isDisabled={isLoading}
            />
            {error && <p className="text-danger text-sm mt-2">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              isDisabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              color="primary"
              onPress={handleTransfer}
              isDisabled={
                !transferData.toAddress || !transferData.amount || isLoading
              }
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="white" />
                  {t('common.processing')}
                </div>
              ) : (
                t('token.confirmTransfer')
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
