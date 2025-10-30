<template>
  <div class="container">
    <div v-if="error" class="error">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button @click="initializeFHE">Retry</button>
    </div>

    <div v-else-if="!isInitialized" class="hero">
      <h1>FHEVM Vue Template</h1>
      <p>Fully Homomorphic Encryption on Ethereum</p>
      <button @click="initializeFHE" class="primary">
        Connect Wallet & Initialize
      </button>
    </div>

    <div v-else>
      <header>
        <h1>FHEVM SDK Demo</h1>
        <p>Vue Template with Encryption Support</p>
      </header>

      <nav class="tabs">
        <button
          :class="{ active: activeTab === 'encryption' }"
          @click="activeTab = 'encryption'"
        >
          Encryption Demo
        </button>
        <button
          :class="{ active: activeTab === 'keys' }"
          @click="activeTab = 'keys'"
        >
          Key Management
        </button>
      </nav>

      <main>
        <EncryptionDemo v-if="activeTab === 'encryption'" :client="client" />
        <div v-else class="card">
          <h2>Key Management</h2>
          <p>Key management features coming soon...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFHE } from './composables/useFHE';
import EncryptionDemo from './components/EncryptionDemo.vue';

const { client, isInitialized, error, initializeFHE } = useFHE();
const activeTab = ref<'encryption' | 'keys'>('encryption');
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  color: #666;
  font-size: 1.1rem;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.tabs button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.tabs button:hover {
  color: #111827;
}

.tabs button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.error {
  text-align: center;
  padding: 2rem;
  background: #fee2e2;
  border-radius: 8px;
  color: #991b1b;
}

.error h2 {
  margin-bottom: 1rem;
}

.error button {
  margin-top: 1rem;
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

button.primary:hover {
  background: #2563eb;
}
</style>
