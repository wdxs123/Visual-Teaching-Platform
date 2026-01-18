import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePasswordResetStore = defineStore('passwordReset', () => {
  const resetToken = ref('');
  const email = ref('');

  const setResetToken = (token) => {
    resetToken.value = token;
  };

  const setEmail = (emailValue) => {
    email.value = emailValue;
  };

  const clear = () => {
    resetToken.value = '';
    email.value = '';
  };

  return {
    resetToken,
    email,
    setResetToken,
    setEmail,
    clear
  };
});
