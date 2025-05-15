import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Platform, Text, View } from 'react-native';
import { NativeModules } from 'react-native';
import { SESSION_URL } from '@env';


const { FlowModule, CheckoutFlowManager } = NativeModules; // Import both modules


// Add logging to debug module availability
console.log('Available Native Modules:', Object.keys(NativeModules));
console.log('Checking CheckoutFlowManager:', CheckoutFlowManager);
console.log('Checking FlowModule:', FlowModule);

// Platform-specific module validation
if (Platform.OS === 'ios' && !CheckoutFlowManager) {
  console.error('CheckoutFlowManager is not linked properly for iOS.');
}

if (Platform.OS === 'android' && !FlowModule) {
  console.error('FlowModule is not linked properly for Android.');
}

function App(): React.JSX.Element {
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);

  const startPayment = async () => {
    setStatus('Processing...');
    setError(null);

    try {
      const paymentSession = await createSession()
      if (paymentSession) {
        const paymentSessionID = paymentSession.id
        const paymentSessionToken = paymentSession.payment_session_token
        const paymentSessionSecret = paymentSession.payment_session_secret

        if (Platform.OS === 'ios') {
          console.log('Initializing iOS payment flow...');
          try {
            // Use the promise-based approach for iOS
            const initResult = await CheckoutFlowManager.initialize(paymentSession);
            console.log('iOS initialization result:', initResult);

            const renderResult = await CheckoutFlowManager.renderFlow();
            console.log('iOS render result:', renderResult);

            setStatus('Payment flow started');
          } catch (iosError) {
            console.error(`iOS Error: ${iosError instanceof Error ? iosError.message : String(iosError)}`);
            setError(`iOS Error: ${iosError instanceof Error ? iosError.message : String(iosError)}`);
            setStatus('Error');
          }
        } else if (Platform.OS === 'android') {
          console.log('Initializing Android payment flow...');
          try {
            // For Android, use the existing implementation
            FlowModule.startPaymentSession(
              paymentSessionID,
              paymentSessionToken,
              paymentSessionSecret,
            );
            setStatus('Payment flow started');
          } catch (androidError) {
            console.error('Android payment error:', androidError);
            setError(`Android Error: ${androidError instanceof Error ? androidError.message : String(androidError)}`);
            setStatus('Error');
          }
        }
      }
      else if (!paymentSession) {
        console.error("Failed to get a payment session.");
        return;
      }
    } catch (error) {
      console.error('General payment error:', error);
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('Error');
    }
  };
  const isProcessing = status === 'Processing...';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CKO Flow for mobile Demo</Text>

      {/* Status display */}
      <View style={styles.statusContainer}>
        <Text>Status: </Text>
        <Text style={
          status === 'Error' ? styles.errorText :
            status === 'Processing...' ? styles.processingText :
              status === 'Payment flow started' ? styles.successText :
                styles.readyText
        }>
          {status}
        </Text>
      </View>

      {/* Error message if any */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Module detection info */}
      <View style={styles.moduleInfoContainer}>
        <Text>{Platform.OS.toUpperCase()} is your mobile os</Text>
      </View>

      <TouchableOpacity
        onPress={startPayment}
        disabled={isProcessing}
        style={[
          styles.button,
          isProcessing ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? 'Processing...' : 'Start Payment Session'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
type PaymentSessionResponse = {
  id: string;
  payment_session_token: string;
  payment_session_secret: string;
  _links: JSON
};

async function createSession(): Promise<PaymentSessionResponse | null> {
  const url = SESSION_URL;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data: PaymentSessionResponse = await response.json();

    return {
      id: data.id,
      payment_session_token: data.payment_session_token,
      payment_session_secret: data.payment_session_secret,
      _links: data._links,
    };
  } catch (error: any) {
    console.error("Failed to create session:", error.message || error);
    return null;
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
  },
  moduleInfoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    width: '50%',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  processingText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  readyText: {
    color: 'black',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonEnabled: {
    backgroundColor: '#007BFF',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
