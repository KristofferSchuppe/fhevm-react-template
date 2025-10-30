'use client';

import { FHEProvider } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <FHEProvider>
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            FHE Evidence Manager
          </h1>
          <p className="text-xl text-blue-200">
            Privacy-Preserving Judicial Evidence System
          </p>
          <p className="text-lg text-blue-300 mt-2">
            Powered by Fully Homomorphic Encryption
          </p>
        </header>

        <div className="grid gap-8">
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Key Management</h2>
            <KeyManager />
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Encryption Demo</h2>
            <EncryptionDemo />
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Homomorphic Computation</h2>
            <ComputationDemo />
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Real-World Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-2xl font-bold text-white mb-4">Banking Application</h3>
                <BankingExample />
              </Card>
              <Card>
                <h3 className="text-2xl font-bold text-white mb-4">Medical Records</h3>
                <MedicalExample />
              </Card>
            </div>
          </section>
        </div>
      </main>
    </FHEProvider>
  );
}
