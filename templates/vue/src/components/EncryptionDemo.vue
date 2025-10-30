<template>
  <div class="card">
    <h2>Encryption Demo</h2>

    <div class="form-group">
      <label>Contract Address</label>
      <input
        type="text"
        v-model="contractAddress"
        placeholder="0x..."
      />
    </div>

    <div class="form-group">
      <label>Value to Encrypt (uint32)</label>
      <input
        type="number"
        v-model="value"
        placeholder="Enter a number"
      />
    </div>

    <button
      @click="handleEncrypt"
      :disabled="!value || isEncrypting"
      class="primary"
    >
      {{ isEncrypting ? 'Encrypting...' : 'Encrypt Value' }}
    </button>

    <div v-if="encryptedData" class="result">
      <h3>Encrypted Result:</h3>
      <pre>{{ encryptedData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FhevmClient } from '@fhevm-toolkit/sdk';

const props = defineProps<{
  client: FhevmClient | null;
}>();

const value = ref('');
const contractAddress = ref('0x0000000000000000000000000000000000000000');
const encryptedData = ref<string>('');
const isEncrypting = ref(false);

const handleEncrypt = async () => {
  if (!props.client || !value.value) return;

  try {
    isEncrypting.value = true;
    const result = await props.client.encryptInput({
      value: parseInt(value.value),
      type: 'uint32',
      contractAddress: contractAddress.value,
    });

    encryptedData.value = JSON.stringify(result, null, 2);
  } catch (err) {
    console.error('Encryption error:', err);
    alert('Encryption failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
  } finally {
    isEncrypting.value = false;
  }
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

button.primary {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button.primary:hover:not(:disabled) {
  background: #2563eb;
}

button.primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.result {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 6px;
}

.result h3 {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.result pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>
