import { useState } from 'react';
import { useFHE } from '../hooks/useFHE';

export function EncryptionDemo() {
  const { client } = useFHE();
  const [value, setValue] = useState('');
  const [contractAddress, setContractAddress] = useState('0x0000000000000000000000000000000000000000');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleEncrypt = async () => {
    if (!client || !value) return;

    try {
      setIsEncrypting(true);
      const result = await client.encryptInput({
        value: parseInt(value),
        type: 'uint32',
        contractAddress,
      });

      setEncryptedData(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Encryption failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="card">
      <h2>Encryption Demo</h2>

      <div className="form-group">
        <label>Contract Address</label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x..."
        />
      </div>

      <div className="form-group">
        <label>Value to Encrypt (uint32)</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
        />
      </div>

      <button onClick={handleEncrypt} disabled={!value || isEncrypting} className="primary">
        {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
      </button>

      {encryptedData && (
        <div className="result">
          <h3>Encrypted Result:</h3>
          <pre>{encryptedData}</pre>
        </div>
      )}
    </div>
  );
}
