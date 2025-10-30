/**
 * Banking Example Component
 * Demonstrates FHE use case for secure banking operations
 */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';
import { useComputation } from '@/hooks/useComputation';
import { EncryptedData } from '@/types/fhe';

interface Account {
  id: string;
  name: string;
  encryptedBalance: EncryptedData | null;
  displayBalance?: string;
}

export function BankingExample() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Checking Account', encryptedBalance: null },
    { id: '2', name: 'Savings Account', encryptedBalance: null },
  ]);

  const [selectedAccount, setSelectedAccount] = useState<string>('1');
  const [amount, setAmount] = useState('');
  const [operationType, setOperationType] = useState<'deposit' | 'withdraw'>('deposit');

  const { encrypt, decrypt, isEncrypting, isDecrypting, isReady } = useEncryption();
  const { add, subtract, isComputing } = useComputation();

  /**
   * Initialize account with encrypted balance
   */
  const handleInitializeAccount = async (accountId: string, initialBalance: number) => {
    try {
      const encrypted = await encrypt(initialBalance, 'euint32');

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId
            ? { ...acc, encryptedBalance: encrypted }
            : acc
        )
      );
    } catch (err) {
      console.error('Failed to initialize account:', err);
    }
  };

  /**
   * View decrypted balance
   */
  const handleViewBalance = async (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (!account || !account.encryptedBalance) return;

    try {
      const balance = await decrypt(account.encryptedBalance);

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId
            ? { ...acc, displayBalance: balance.toString() }
            : acc
        )
      );

      // Clear display after 3 seconds
      setTimeout(() => {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId
              ? { ...acc, displayBalance: undefined }
              : acc
          )
        );
      }, 3000);
    } catch (err) {
      console.error('Failed to view balance:', err);
    }
  };

  /**
   * Perform transaction (deposit/withdraw)
   */
  const handleTransaction = async () => {
    if (!amount) return;

    const account = accounts.find((acc) => acc.id === selectedAccount);
    if (!account || !account.encryptedBalance) {
      alert('Please initialize the account first');
      return;
    }

    try {
      const transactionAmount = parseInt(amount, 10);
      if (isNaN(transactionAmount) || transactionAmount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      // Encrypt the transaction amount
      const encryptedAmount = await encrypt(transactionAmount, 'euint32');

      // Perform computation on encrypted data
      let newBalance: EncryptedData;
      if (operationType === 'deposit') {
        newBalance = await add(account.encryptedBalance, encryptedAmount);
      } else {
        newBalance = await subtract(account.encryptedBalance, encryptedAmount);
      }

      // Update account with new encrypted balance
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccount
            ? { ...acc, encryptedBalance: newBalance }
            : acc
        )
      );

      setAmount('');
      alert(`${operationType === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Transaction failed. Please try again.');
    }
  };

  /**
   * Transfer between accounts
   */
  const handleTransfer = async (fromId: string, toId: string, transferAmount: number) => {
    const fromAccount = accounts.find((acc) => acc.id === fromId);
    const toAccount = accounts.find((acc) => acc.id === toId);

    if (!fromAccount?.encryptedBalance || !toAccount?.encryptedBalance) {
      alert('Both accounts must be initialized');
      return;
    }

    try {
      const encryptedAmount = await encrypt(transferAmount, 'euint32');

      // Subtract from source account
      const newFromBalance = await subtract(fromAccount.encryptedBalance, encryptedAmount);

      // Add to destination account
      const newToBalance = await add(toAccount.encryptedBalance, encryptedAmount);

      // Update both accounts
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === fromId) return { ...acc, encryptedBalance: newFromBalance };
          if (acc.id === toId) return { ...acc, encryptedBalance: newToBalance };
          return acc;
        })
      );

      alert('Transfer successful!');
    } catch (err) {
      console.error('Transfer failed:', err);
      alert('Transfer failed. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure Banking Example</CardTitle>
        <CardDescription>
          Perform banking operations on encrypted account balances using FHE
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Your Accounts</h4>
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{account.name}</h5>
                <p className="text-sm text-gray-600">
                  Status:{' '}
                  {account.encryptedBalance ? (
                    <span className="text-green-600 font-semibold">Encrypted</span>
                  ) : (
                    <span className="text-yellow-600">Not initialized</span>
                  )}
                </p>
                {account.displayBalance && (
                  <p className="text-lg font-bold text-green-600 mt-1">
                    Balance: ${account.displayBalance}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                {!account.encryptedBalance ? (
                  <Button
                    size="sm"
                    onClick={() => handleInitializeAccount(account.id, 1000)}
                    disabled={!isReady || isEncrypting}
                  >
                    Initialize ($1000)
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewBalance(account.id)}
                    disabled={isDecrypting}
                    isLoading={isDecrypting}
                  >
                    View Balance
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Transaction Section */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Make a Transaction</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Account
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEncrypting || isComputing || isDecrypting}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="deposit"
                  checked={operationType === 'deposit'}
                  onChange={(e) => setOperationType(e.target.value as any)}
                  className="mr-2"
                  disabled={isEncrypting || isComputing || isDecrypting}
                />
                Deposit
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="withdraw"
                  checked={operationType === 'withdraw'}
                  onChange={(e) => setOperationType(e.target.value as any)}
                  className="mr-2"
                  disabled={isEncrypting || isComputing || isDecrypting}
                />
                Withdraw
              </label>
            </div>
          </div>

          <Input
            label="Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={isEncrypting || isComputing || isDecrypting}
          />

          <Button
            onClick={handleTransaction}
            disabled={!amount || isEncrypting || isComputing || !isReady}
            isLoading={isEncrypting || isComputing}
            className="w-full"
          >
            Execute Transaction
          </Button>
        </div>

        {/* Transfer Section */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Quick Transfer</h4>
          <Button
            onClick={() => handleTransfer('1', '2', 100)}
            variant="secondary"
            disabled={
              !accounts[0].encryptedBalance ||
              !accounts[1].encryptedBalance ||
              isComputing ||
              isEncrypting
            }
            isLoading={isComputing || isEncrypting}
            className="w-full"
          >
            Transfer $100 from Checking to Savings
          </Button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Privacy Features:</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Account balances are encrypted at all times</li>
            <li>Transactions are computed on encrypted data</li>
            <li>Server never sees actual balance amounts</li>
            <li>Only you can decrypt and view your balance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
