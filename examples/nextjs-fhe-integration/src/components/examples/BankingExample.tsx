'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function BankingExample() {
  const [balance, setBalance] = useState('1000');
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
  const [result, setResult] = useState<string | null>(null);

  const handleTransaction = () => {
    const currentBalance = parseInt(balance);
    const transactionAmount = parseInt(amount);

    if (operation === 'deposit') {
      const newBalance = currentBalance + transactionAmount;
      setBalance(newBalance.toString());
      setResult(`Deposited $${transactionAmount}. New balance: $${newBalance}`);
    } else {
      if (currentBalance >= transactionAmount) {
        const newBalance = currentBalance - transactionAmount;
        setBalance(newBalance.toString());
        setResult(`Withdrew $${transactionAmount}. New balance: $${newBalance}`);
      } else {
        setResult('Insufficient funds!');
      }
    }
    setAmount('');
  };

  return (
    <Card title="Confidential Banking Example">
      <div className="space-y-4">
        <div className="p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-200">Use Case</h4>
          <p className="text-sm text-blue-100">
            This example demonstrates how FHE enables confidential financial transactions.
            Your balance and transaction amounts remain encrypted on-chain while still
            allowing computations like deposits, withdrawals, and balance checks.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Current Balance (Encrypted)</label>
          <div className="p-4 bg-gray-800 rounded-lg text-green-400 font-mono text-xl">
            ${balance}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Transaction Type</label>
          <div className="flex gap-4">
            <Button
              onClick={() => setOperation('deposit')}
              variant={operation === 'deposit' ? 'primary' : 'secondary'}
            >
              Deposit
            </Button>
            <Button
              onClick={() => setOperation('withdraw')}
              variant={operation === 'withdraw' ? 'primary' : 'secondary'}
            >
              Withdraw
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <Button
          onClick={handleTransaction}
          disabled={!amount}
          fullWidth
        >
          Execute {operation === 'deposit' ? 'Deposit' : 'Withdrawal'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded-lg">
            <p className="text-green-200">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
