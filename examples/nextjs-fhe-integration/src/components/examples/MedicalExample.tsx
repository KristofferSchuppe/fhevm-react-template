'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface MedicalRecord {
  id: number;
  patientName: string;
  diagnosis: string;
  encrypted: boolean;
}

export function MedicalExample() {
  const [records, setRecords] = useState<MedicalRecord[]>([
    { id: 1, patientName: 'Patient A', diagnosis: 'Confidential', encrypted: true },
    { id: 2, patientName: 'Patient B', diagnosis: 'Confidential', encrypted: true },
  ]);
  const [patientName, setPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleAddRecord = () => {
    if (!patientName || !diagnosis) return;

    const newRecord: MedicalRecord = {
      id: records.length + 1,
      patientName,
      diagnosis,
      encrypted: true
    };

    setRecords([...records, newRecord]);
    setPatientName('');
    setDiagnosis('');
  };

  return (
    <Card title="Confidential Medical Records Example">
      <div className="space-y-4">
        <div className="p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-200">Use Case</h4>
          <p className="text-sm text-blue-100">
            This example shows how FHE protects sensitive medical data. Patient diagnoses
            are encrypted on-chain, ensuring privacy while still allowing authorized
            healthcare providers to access and update records securely.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Patient Name</label>
          <Input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Diagnosis (Will be Encrypted)</label>
          <Input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
          />
        </div>

        <Button
          onClick={handleAddRecord}
          disabled={!patientName || !diagnosis}
          fullWidth
        >
          Add Encrypted Record
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Medical Records</h3>
          <div className="space-y-2">
            {records.map((record) => (
              <div
                key={record.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{record.patientName}</p>
                    <p className="text-sm text-gray-400">
                      Diagnosis: {record.encrypted ? '🔒 Encrypted' : record.diagnosis}
                    </p>
                  </div>
                  {record.encrypted && (
                    <span className="px-3 py-1 bg-green-900/50 border border-green-600 rounded-full text-xs text-green-300">
                      FHE Protected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
