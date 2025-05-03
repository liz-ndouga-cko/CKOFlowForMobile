import React, { useEffect, useState } from 'react';
import { SafeAreaView, Button, StyleSheet, Platform, Text, View } from 'react-native';
import { NativeModules } from 'react-native';

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

      const paymentSessionID = 'ps_2wbJQhokDgrMQ5NHhL8grL6fF1n';
      const paymentSessionToken = 'YmFzZTY0:eyJpZCI6InBzXzJ3YkpRaG9rRGdyTVE1TkhoTDhnckw2ZkYxbiIsImVudGl0eV9pZCI6ImVudF9wY2RjN2ZsbjZtdGpzajZtZWtleTJ1Z3RnZSIsImV4cGVyaW1lbnRzIjp7fSwicHJvY2Vzc2luZ19jaGFubmVsX2lkIjoicGNfNGRjbGFsNHBsNDR1dmFqNHRxbWV0M3NkZzQiLCJhbW91bnQiOjEwMDAsImxvY2FsZSI6ImVuLUdCIiwiY3VycmVuY3kiOiJHQlAiLCJwYXltZW50X21ldGhvZHMiOlt7InR5cGUiOiJjYXJkIiwiY2FyZF9zY2hlbWVzIjpbIlZpc2EiLCJNYXN0ZXJjYXJkIiwiQW1leCIsIkpDQiIsIkRpbmVycyBDbHViIiwiRGlzY292ZXIiLCJDYXJ0ZXMgQmFuY2FpcmVzIl0sInNjaGVtZV9jaG9pY2VfZW5hYmxlZCI6dHJ1ZSwic3RvcmVfcGF5bWVudF9kZXRhaWxzIjoiZGlzYWJsZWQifSx7InR5cGUiOiJhcHBsZXBheSIsImRpc3BsYXlfbmFtZSI6IkxJWi1DS08iLCJjb3VudHJ5X2NvZGUiOiJHQiIsImN1cnJlbmN5X2NvZGUiOiJHQlAiLCJtZXJjaGFudF9jYXBhYmlsaXRpZXMiOlsic3VwcG9ydHMzRFMiXSwic3VwcG9ydGVkX25ldHdvcmtzIjpbInZpc2EiLCJtYXN0ZXJDYXJkIiwiYW1leCIsImpjYiIsImRpc2NvdmVyIiwiY2FydGVzQmFuY2FpcmVzIl0sInRvdGFsIjp7ImxhYmVsIjoiTElaLUNLTyIsInR5cGUiOiJmaW5hbCIsImFtb3VudCI6IjEwIn19LHsidHlwZSI6Imdvb2dsZXBheSIsIm1lcmNoYW50Ijp7ImlkIjoiQkNSMkRONFRRR1I3TDZMSyIsIm5hbWUiOiJMSVotQ0tPIiwib3JpZ2luIjoiaHR0cHM6Ly9leGFtcGxlLmNvbSJ9LCJ0cmFuc2FjdGlvbl9pbmZvIjp7InRvdGFsX3ByaWNlX3N0YXR1cyI6IkZJTkFMIiwidG90YWxfcHJpY2UiOiIxMCIsImNvdW50cnlfY29kZSI6IkdCIiwiY3VycmVuY3lfY29kZSI6IkdCUCJ9LCJjYXJkX3BhcmFtZXRlcnMiOnsiYWxsb3dlZF9hdXRoX21ldGhvZHMiOlsiUEFOX09OTFkiLCJDUllQVE9HUkFNXzNEUyJdLCJhbGxvd2VkX2NhcmRfbmV0d29ya3MiOlsiVklTQSIsIk1BU1RFUkNBUkQiLCJBTUVYIiwiSkNCIiwiRElTQ09WRVIiXX19XSwiZmVhdHVyZV9mbGFncyI6WyJhbmFseXRpY3Nfb2JzZXJ2YWJpbGl0eV9lbmFibGVkIiwiY2FyZF9maWVsZHNfZW5hYmxlZCIsImdldF93aXRoX3B1YmxpY19rZXlfZW5hYmxlZCIsImxvZ3Nfb2JzZXJ2YWJpbGl0eV9lbmFibGVkIiwicmlza19qc19lbmFibGVkIiwidXNlX25vbl9iaWNfaWRlYWxfaW50ZWdyYXRpb24iXSwicmlzayI6eyJlbmFibGVkIjpmYWxzZX0sIm1lcmNoYW50X25hbWUiOiJMSVotQ0tPIiwicGF5bWVudF9zZXNzaW9uX3NlY3JldCI6InBzc185MmY2YjA2MS0zYTI1LTQ4OTQtYjgzOS1jNmMxZGQ5NGJhMTMiLCJpbnRlZ3JhdGlvbl9kb21haW4iOiJhcGkuc2FuZGJveC5jaGVja291dC5jb20ifQ==';
      const paymentSessionSecret = 'pss_92f6b061-3a25-4894-b839-c6c1dd94ba13';

      // Sample payment session data
      const paymentSession = {
        id: 'ps_2wbJQhokDgrMQ5NHhL8grL6fF1n',
        payment_session_secret: 'pss_92f6b061-3a25-4894-b839-c6c1dd94ba13'
      };

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
          // console.error('iOS payment error:', iosError);
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
    } catch (error) {
      console.error('General payment error:', error);
      setError(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus('Error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CKO Flow Demo</Text>

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
        <Text>iOS Module: {CheckoutFlowManager ? '✅ Available' : '❌ Missing'}</Text>
        <Text>Android Module: {FlowModule ? '✅ Available' : '❌ Missing'}</Text>
        <Text>Current Platform: {Platform.OS}</Text>
      </View>

      <Button
        title="Start Payment Session"
        onPress={startPayment}
        disabled={status === 'Processing...'}
      />
    </SafeAreaView>
  );
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
    width: '100%',
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
});

// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   /*
//    * To keep the template simple and small we're adding padding to prevent view
//    * from rendering under the System UI.
//    * For bigger apps the recommendation is to use `react-native-safe-area-context`:
//    * https://github.com/AppAndFlow/react-native-safe-area-context
//    *
//    * You can read more about it here:
//    * https://github.com/react-native-community/discussions-and-proposals/discussions/827
//    */
//   const safePadding = '5%';

//   return (
//     <View style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         style={backgroundStyle}>
//         <View style={{paddingRight: safePadding}}>
//           <Header/>
//         </View>
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//             paddingHorizontal: safePadding,
//             paddingBottom: safePadding,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
