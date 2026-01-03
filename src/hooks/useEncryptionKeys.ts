import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/runtimeClient';
import {
  generateSymmetricKey,
  generateKeyPair,
  storeSymmetricKey,
  storeKeyPair,
  retrieveSymmetricKey,
  retrieveKeyPair,
  getStoredPublicKey,
  encryptData,
  decryptData,
  exportPublicKey,
  importPublicKey,
  encryptSymmetricKeyForRecipient,
  decryptSymmetricKeyFromSender,
  clearAllKeys,
} from '@/lib/encryption';

interface EncryptionKeys {
  symmetricKey: CryptoKey | null;
  keyPair: CryptoKeyPair | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useEncryptionKeys() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<EncryptionKeys>({
    symmetricKey: null,
    keyPair: null,
    isReady: false,
    isLoading: true,
    error: null,
  });

  // Initialize or retrieve keys when user logs in
  useEffect(() => {
    const initializeKeys = async () => {
      if (!user) {
        setKeys({
          symmetricKey: null,
          keyPair: null,
          isReady: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      setKeys(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Try to retrieve existing keys from IndexedDB
        let symmetricKey = await retrieveSymmetricKey();
        let keyPair = await retrieveKeyPair();

        // If no keys exist, generate new ones
        if (!symmetricKey) {
          symmetricKey = await generateSymmetricKey();
          await storeSymmetricKey(symmetricKey);
        }

        if (!keyPair) {
          keyPair = await generateKeyPair();
          await storeKeyPair(keyPair);
          
          // Sync public key to database
          const publicKeyBase64 = await exportPublicKey(keyPair);
          await syncPublicKeyToDatabase(user.id, publicKeyBase64);
        } else {
          // Ensure public key is synced to database
          const storedPublicKey = await getStoredPublicKey();
          if (storedPublicKey) {
            await syncPublicKeyToDatabase(user.id, storedPublicKey);
          }
        }

        setKeys({
          symmetricKey,
          keyPair,
          isReady: true,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        console.error('Error initializing encryption keys:', err);
        setKeys(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Failed to initialize encryption',
        }));
      }
    };

    initializeKeys();
  }, [user]);

  // Sync public key to database
  const syncPublicKeyToDatabase = async (userId: string, publicKey: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ public_key: publicKey })
        .eq('user_id', userId);

      if (error) {
        console.error('Error syncing public key:', error);
      }
    } catch (err) {
      console.error('Error syncing public key:', err);
    }
  };

  // Encrypt data with user's symmetric key
  const encrypt = useCallback(async (data: any): Promise<string | null> => {
    if (!keys.symmetricKey) {
      console.error('No symmetric key available for encryption');
      return null;
    }
    return encryptData(data, keys.symmetricKey);
  }, [keys.symmetricKey]);

  // Decrypt data with user's symmetric key
  const decrypt = useCallback(async (encryptedData: string): Promise<any | null> => {
    if (!keys.symmetricKey) {
      console.error('No symmetric key available for decryption');
      return null;
    }
    try {
      return await decryptData(encryptedData, keys.symmetricKey);
    } catch (err) {
      console.error('Decryption failed:', err);
      return null;
    }
  }, [keys.symmetricKey]);

  // Encrypt data for sharing with a recipient
  const encryptForSharing = useCallback(async (
    data: any,
    recipientPublicKeyBase64: string
  ): Promise<{ encryptedData: string; encryptedKey: string } | null> => {
    if (!keys.symmetricKey) {
      console.error('No symmetric key available');
      return null;
    }

    try {
      // Generate a new symmetric key specifically for this share
      const shareKey = await generateSymmetricKey();
      
      // Encrypt the data with the share key
      const encryptedData = await encryptData(data, shareKey);
      
      // Encrypt the share key with recipient's public key
      const recipientPublicKey = await importPublicKey(recipientPublicKeyBase64);
      const encryptedKey = await encryptSymmetricKeyForRecipient(shareKey, recipientPublicKey);
      
      return { encryptedData, encryptedKey };
    } catch (err) {
      console.error('Error encrypting for sharing:', err);
      return null;
    }
  }, [keys.symmetricKey]);

  // Decrypt shared data using own private key
  const decryptShared = useCallback(async (
    encryptedData: string,
    encryptedKey: string
  ): Promise<any | null> => {
    if (!keys.keyPair?.privateKey) {
      console.error('No private key available for decryption');
      return null;
    }

    try {
      // Decrypt the symmetric key with our private key
      const shareKey = await decryptSymmetricKeyFromSender(encryptedKey, keys.keyPair.privateKey);
      
      // Decrypt the data with the share key
      return await decryptData(encryptedData, shareKey);
    } catch (err) {
      console.error('Error decrypting shared data:', err);
      return null;
    }
  }, [keys.keyPair]);

  // Fetch recipient's public key from database
  const getRecipientPublicKey = useCallback(async (email: string): Promise<string | null> => {
    try {
      // First get the user_id from profiles by matching with auth.users email
      // We need to query profiles and join with calculation shares to find users
      const { data, error } = await supabase
        .from('profiles')
        .select('public_key, user_id')
        .not('public_key', 'is', null);

      if (error) throw error;

      // Since we can't directly query by email from profiles, 
      // we need to check the shares table or use a different approach
      // For now, return null if no public key found - share will work when recipient logs in
      
      // This is a simplified approach - in production you might want a more robust solution
      return null;
    } catch (err) {
      console.error('Error fetching recipient public key:', err);
      return null;
    }
  }, []);

  // Clear keys (for logout or key reset)
  const clearKeys = useCallback(async () => {
    try {
      await clearAllKeys();
      setKeys({
        symmetricKey: null,
        keyPair: null,
        isReady: false,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error clearing keys:', err);
    }
  }, []);

  return {
    isReady: keys.isReady,
    isLoading: keys.isLoading,
    error: keys.error,
    encrypt,
    decrypt,
    encryptForSharing,
    decryptShared,
    getRecipientPublicKey,
    clearKeys,
    hasKeys: !!keys.symmetricKey && !!keys.keyPair,
  };
}
