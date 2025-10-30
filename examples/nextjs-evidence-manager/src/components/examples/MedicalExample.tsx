/**
 * Medical Example Component
 * Demonstrates FHE use case for secure medical data handling
 */

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';
import { useComputation } from '@/hooks/useComputation';
import { EncryptedData } from '@/types/fhe';

interface MedicalRecord {
  id: string;
  type: string;
  encryptedValue: EncryptedData | null;
  decryptedValue?: string;
  unit: string;
}

export function MedicalExample() {
  const [records, setRecords] = useState<MedicalRecord[]>([
    { id: '1', type: 'Heart Rate', encryptedValue: null, unit: 'bpm' },
    { id: '2', type: 'Blood Pressure (Systolic)', encryptedValue: null, unit: 'mmHg' },
    { id: '3', type: 'Blood Sugar', encryptedValue: null, unit: 'mg/dL' },
    { id: '4', type: 'Temperature', encryptedValue: null, unit: '°F' },
  ]);

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
    '1': '72',
    '2': '120',
    '3': '95',
    '4': '98',
  });

  const [showDecrypted, setShowDecrypted] = useState<{ [key: string]: boolean }>({});
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const { encrypt, decrypt, isEncrypting, isDecrypting, isReady } = useEncryption();
  const { compare, isComputing } = useComputation();

  /**
   * Encrypt a medical value
   */
  const handleEncryptValue = async (recordId: string) => {
    const value = inputValues[recordId];
    if (!value) return;

    try {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        alert('Please enter a valid number');
        return;
      }

      const encrypted = await encrypt(numValue, 'euint16');

      setRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? { ...record, encryptedValue: encrypted }
            : record
        )
      );
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  /**
   * Decrypt and view a medical value
   */
  const handleViewValue = async (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (!record || !record.encryptedValue) return;

    try {
      const decrypted = await decrypt(record.encryptedValue);

      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? { ...r, decryptedValue: decrypted.toString() }
            : r
        )
      );

      setShowDecrypted((prev) => ({ ...prev, [recordId]: true }));

      // Hide after 5 seconds
      setTimeout(() => {
        setShowDecrypted((prev) => ({ ...prev, [recordId]: false }));
      }, 5000);
    } catch (err) {
      console.error('Decryption failed:', err);
    }
  };

  /**
   * Perform health analysis on encrypted data
   */
  const handleHealthAnalysis = async () => {
    const heartRateRecord = records.find((r) => r.type === 'Heart Rate');
    const bloodPressureRecord = records.find((r) => r.type === 'Blood Pressure (Systolic)');

    if (!heartRateRecord?.encryptedValue || !bloodPressureRecord?.encryptedValue) {
      alert('Please encrypt Heart Rate and Blood Pressure first');
      return;
    }

    try {
      // Create threshold values (encrypted)
      const normalHeartRateMax = await encrypt(100, 'euint16'); // Normal HR < 100
      const normalBPMax = await encrypt(140, 'euint16'); // Normal BP < 140

      // Compare encrypted values with thresholds
      const hrComparison = await compare(heartRateRecord.encryptedValue, normalHeartRateMax);
      const bpComparison = await compare(bloodPressureRecord.encryptedValue, normalBPMax);

      // Decrypt results
      const hrAboveNormal = await decrypt(hrComparison);
      const bpAboveNormal = await decrypt(bpComparison);

      // Generate analysis result
      let result = 'Health Analysis:\n\n';
      result += `Heart Rate: ${hrAboveNormal ? 'Above Normal Range' : 'Within Normal Range'}\n`;
      result += `Blood Pressure: ${bpAboveNormal ? 'Above Normal Range' : 'Within Normal Range'}\n\n`;

      if (hrAboveNormal || bpAboveNormal) {
        result += 'Recommendation: Please consult with your healthcare provider.';
      } else {
        result += 'All vital signs are within normal range.';
      }

      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Health analysis failed. Please try again.');
    }
  };

  /**
   * Encrypt all records
   */
  const handleEncryptAll = async () => {
    try {
      for (const record of records) {
        const value = inputValues[record.id];
        if (value && !record.encryptedValue) {
          await handleEncryptValue(record.id);
        }
      }
    } catch (err) {
      console.error('Batch encryption failed:', err);
    }
  };

  /**
   * Clear all data
   */
  const handleClearAll = () => {
    setRecords((prev) =>
      prev.map((record) => ({
        ...record,
        encryptedValue: null,
        decryptedValue: undefined,
      }))
    );
    setShowDecrypted({});
    setAnalysisResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure Medical Records Example</CardTitle>
        <CardDescription>
          Store and analyze medical data securely using FHE encryption
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Medical Records */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Patient Vital Signs</h4>
          {records.map((record) => (
            <div
              key={record.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{record.type}</h5>
                  {record.encryptedValue && (
                    <span className="text-xs text-green-600 font-semibold">
                      Encrypted
                    </span>
                  )}
                </div>
                {showDecrypted[record.id] && record.decryptedValue && (
                  <div className="text-xl font-bold text-blue-600">
                    {record.decryptedValue} {record.unit}
                  </div>
                )}
              </div>

              {!record.encryptedValue ? (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={inputValues[record.id] || ''}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        [record.id]: e.target.value,
                      }))
                    }
                    placeholder={`Enter ${record.type.toLowerCase()}`}
                    disabled={isEncrypting || isDecrypting}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleEncryptValue(record.id)}
                    disabled={!inputValues[record.id] || !isReady || isEncrypting}
                  >
                    Encrypt
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border border-gray-200">
                    <p className="text-xs text-gray-600">Encrypted Handle:</p>
                    <p className="text-xs font-mono break-all text-gray-800">
                      {record.encryptedValue.handle.substring(0, 30)}...
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewValue(record.id)}
                    disabled={isDecrypting}
                    isLoading={isDecrypting}
                    className="w-full"
                  >
                    View Value
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Batch Actions */}
        <div className="flex space-x-3">
          <Button
            onClick={handleEncryptAll}
            disabled={!isReady || isEncrypting}
            isLoading={isEncrypting}
            className="flex-1"
          >
            Encrypt All Values
          </Button>
          <Button
            onClick={handleClearAll}
            variant="ghost"
            className="flex-1"
          >
            Clear All
          </Button>
        </div>

        {/* Health Analysis */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">
            Encrypted Health Analysis
          </h4>
          <Button
            onClick={handleHealthAnalysis}
            variant="secondary"
            disabled={isComputing || isEncrypting || isDecrypting}
            isLoading={isComputing}
            className="w-full"
          >
            Run Analysis on Encrypted Data
          </Button>

          {analysisResult && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <pre className="text-sm text-green-900 whitespace-pre-wrap">
                {analysisResult}
              </pre>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">
            HIPAA-Compliant Privacy:
          </h4>
          <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
            <li>Patient data is encrypted before storage</li>
            <li>Health analysis runs on encrypted data</li>
            <li>Medical staff never see raw patient values</li>
            <li>Only authorized parties can decrypt results</li>
            <li>Complies with healthcare privacy regulations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
