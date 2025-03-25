import React, { useState } from 'react';
import { Card, CardBody, Button, Input, Textarea, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  ownerId: string;
  createdAt: string;
}

export const TokenManagement: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newToken, setNewToken] = useState({
    name: '',
    symbol: '',
    totalSupply: 0,
  });

  const handleCreateToken = async () => {
    try {
      // TODO: 调用后端 API 创建代币
      const response = await fetch('/api/tokens/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newToken),
      });
      
      if (response.ok) {
        const token = await response.json();
        setTokens([...tokens, token]);
        onClose();
        setNewToken({ name: '', symbol: '', totalSupply: 0 });
      }
    } catch (error) {
      console.error('Error creating token:', error);
    }
  };

  const handleMintToken = async (tokenId: string, amount: number) => {
    try {
      // TODO: 调用后端 API 增发代币
      const response = await fetch(`/api/tokens/${tokenId}/manage/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'mint', amount }),
      });
      
      if (response.ok) {
        // 更新代币列表
        const updatedToken = await response.json();
        setTokens(tokens.map(token => 
          token.id === tokenId ? updatedToken : token
        ));
      }
    } catch (error) {
      console.error('Error minting token:', error);
    }
  };

  const handleBurnToken = async (tokenId: string, amount: number) => {
    try {
      // TODO: 调用后端 API 销毁代币
      const response = await fetch(`/api/tokens/${tokenId}/manage/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'burn', amount }),
      });
      
      if (response.ok) {
        // 更新代币列表
        const updatedToken = await response.json();
        setTokens(tokens.map(token => 
          token.id === tokenId ? updatedToken : token
        ));
      }
    } catch (error) {
      console.error('Error burning token:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('tokenManagement.title')}</h1>
        <Button color="primary" onPress={onOpen}>
          {t('tokenManagement.createToken')}
        </Button>
      </div>

      <Card>
        <CardBody>
          <Table aria-label="Token management table">
            <TableHeader>
              <TableColumn>{t('tokenManagement.name')}</TableColumn>
              <TableColumn>{t('tokenManagement.symbol')}</TableColumn>
              <TableColumn>{t('tokenManagement.totalSupply')}</TableColumn>
              <TableColumn>{t('tokenManagement.actions')}</TableColumn>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell>{token.name}</TableCell>
                  <TableCell>{token.symbol}</TableCell>
                  <TableCell>{token.totalSupply}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="success"
                        onPress={() => handleMintToken(token.id, 1000)}
                      >
                        {t('tokenManagement.mint')}
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onPress={() => handleBurnToken(token.id, 1000)}
                      >
                        {t('tokenManagement.burn')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{t('tokenManagement.createNewToken')}</ModalHeader>
          <ModalBody>
            <Input
              label={t('tokenManagement.name')}
              value={newToken.name}
              onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
            />
            <Input
              label={t('tokenManagement.symbol')}
              value={newToken.symbol}
              onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
            />
            <Input
              type="number"
              label={t('tokenManagement.totalSupply')}
              value={newToken.totalSupply.toString()}
              onChange={(e) => setNewToken({ ...newToken, totalSupply: parseInt(e.target.value) })}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              {t('common.cancel')}
            </Button>
            <Button color="primary" onPress={handleCreateToken}>
              {t('common.create')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}; 