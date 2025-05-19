This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Guide to set up React Native with Checkout.com's Flow SDK for iOS and Android
This guide provides a complete walkthrough for setting up a React Native development environment and integrating [Checkout.com's Android Flow SDK](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app/get-started-with-flow-for-mobile) for both iOS and 🔜 Android. It includes detailed instructions, common troubleshooting steps, and essential tips to ensure a smooth and efficient setup process for your project.

# iOS

## 📦 1. Requirements

Before you begin, ensure the following tools and dependancies are installed:

- React Native `0.73+`
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) `15+` (tested with `16.3`)
- [CocoaPods](https://cocoapods.org/)
- Swift 5.5+


To check if your environment is properly set up, run : 
    ```
        npx react-native doctor
    ```
In my case the output reported:

iOS
 ✓ Xcode - Required for building and installing your app on iOS
 ✓ Ruby - Required for installing iOS dependencies
 ✓ CocoaPods - Required for installing iOS dependencies
 ✓ .xcode.env - File to customize Xcode environment

---

## 🚀 2. Add the CKO iOS SDK 

### **2.1 Open the iOS Project in Xcode**

1. Navigate to the `ios` folder inside your React Native project.
    
    ```bash
    cd ios
    ```
    
2. Open the project workspace in Xcode:
    
    ```bash
    open YourProjectName.xcworkspace
    ```
    
    - If the `.xcworkspace` file doesn't exist, run:
        
        ```bash
        pod install
        ```       

### **2.2 Add the Checkout SDK via Swift Package Manager (SPM)**

1. In Xcode, select your project from the left sidebar.
2. Go to **Project > Package Dependencies**.
3. Click the **+** button.
4. In the URL field, enter:
    
    ```
    https://github.com/checkout/checkout-ios-components
    ```
    
5. Set **Dependency Rule** to **Up to Exact Version and input: 1.0.0-beta-6 (this is the latest version at the moment)**
6. Set Add to Project to YourProjectName
7. Click **Add Package**.
8. Verify installation:
    1. In the left panel, under Package dependencies section, you should see CheckoutComponents 
    2. In the left panel, click on the first YourProjectName, then go to Project>YourProjectName, under Package Dependencies tab, you should see checkout-ios-components listed
    3. In the left panel, click on the first YourProjectName, then go to Targets>YourProjectName, in the Link Binary with Libraries section, you should see CheckoutComponents. If not, add it by clicking on the plus icon, and searching for it.

If everything looks good, you can proceed with 3. **Creating the bridge for CKO Flow SDK** in your project.

## 🌁 3. Creating the bridge for CKO Flow SDK 

### 3.1 Add Swift to the Project

### **Step 1: Add a Swift Bridging Header**

1. In Xcode, right-click on your project folder (e.g., `YourProjectName`) and select **New File...**
2. Choose **Swift File** and name it `Dummy.swift`
3. When prompted "Would you like to configure an Objective-C bridging header?", click **Create Bridging Header**
4. This will create:
    - A `Dummy.swift` file (can be empty)
    - A `YourProjectName-Bridging-Header.h` file

### **Step 2: Update the Bridging Header**

Open your bridging header file (`YourProjectName-Bridging-Header.h`) and add:

```objectivec
//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTUtils.h>
#import <React/RCTConvert.h>

```

### 3.2 Create the CheckoutFlowManager Swift module

Create a new Swift file named `CheckoutFlowManager.swift`:

1. Right-click on your project folder in Xcode
2. Select **New File from Template**
3. Choose **Swift File**
4. Name it `CheckoutFlowManager.swift`
5. Copy and paste the code from `CheckoutFlowManager.swift` file within the repository

> Important: Remember to use your own Checkout.com public key.
> 

### 3.3 Create the Objective-C Bridge

Create a new Objective-C file to expose your Swift module to React Native:

1. Right-click on your project folder and select **New File from Template**
2. Choose **Objective-C File**
3. Name it `CheckoutFlowManagerBridge.m`
4. Add the following code:

```objectivec
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CheckoutFlowManager, NSObject)

// Declare methods exposed to JavaScript with promise support
RCT_EXTERN_METHOD(initialize:(NSDictionary *)paymentSession
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(renderFlow:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Optional test method
RCT_EXTERN_METHOD(test:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

@end

```

### 3.4 Update the AppDelegate.swift

In your `AppDelegate.swift` file, ensure the module name is properly registered:

```objectivec
import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let moduleName = "TestProject" // Must match your React Native Project Name

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
        let rootView = RCTRootView(bridge: bridge!, moduleName: moduleName, initialProperties: nil)

        let rootViewController = UIViewController()
        rootViewController.view = rootView

        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = rootViewController
        window?.makeKeyAndVisible()

        return true
    }
}

extension AppDelegate: RCTBridgeDelegate {
  func sourceURL(for bridge: RCTBridge) -> URL? {
#if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackExtension: nil)
#else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
    }
}

@end

```

> Important:
>
> 1. Ensure `moduleName = @"YourProjectName";` matches your React Native project name
> 2. Do not modify the rest of the AppDelegate template code unless you know what you're doing

## 💰 4. Adding a Payment session

### 4.1 Before you start

Please check the requirements mentioned in the [CKO documentation](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app/get-started-with-flow-for-mobile#Before_you_start) before requesting a session.

### 4.2 Create a payment session

In your .tsx file, please call your `create payment session` function within your backend.

```tsx
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
    console.error("Failed to create a payment session:", error.message || error);
    return null;
  }
}

```
Then retrieve the payment session details and start the payment:

```tsx
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
```

## 🏵️ 5. Customizing Flow component

### 5.1 Tokenization only

In your CheckoutFlowManager.swift file, please set the `paymentButtonAction` component key to `.tokenization`

```objectivec
let flowComponent = try checkoutComponents.create(.
                flow(options: [
                    .card(// ...
                          paymentButtonAction: .tokenization, // .tokenization: for tokenization-only -  .payment: for payments
                         ),
                    // ....
                  ]))
```

### 5.2 Use your own button

In your CheckoutFlowManager.swift file, please set to `false` the `showPayButton` component

```objectivec
let flowComponent = try checkoutComponents.create(.
                flow(options: [
                    .card(showPayButton: false, // if true: display built-in button - if false: show your own pay button
                          // ...
                         ),
                    // ....
                  ]))
```

### 5.3 Remove cardholder name section 

⚠️ Not available on mobile for the moment

## ⌛️ 6. Run the App

### 6.1 In project root

Check again your environment: 
    ```
        npx react-native doctor
    ```

Start your application:
    ``` 
        npx react-native start --reset-cache
    ```

### 6.2 In another terminal

Run ios:
    ``` 
        npx react-native run-ios
    ```

## 🎯 Troubleshooting

[Check out the Flow error codes you can encounter](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app/flow-for-mobile-library-reference/ios/checkouterror)

# Android

# 🔗 Useful Links

- [Checkout Flow for Mobile iOS SDK](https://github.com/checkout/checkout-ios-components)
- [Accept payments on your mobile app](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app)
- [Get started with Flow for mobile](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app/get-started-with-flow-for-mobile)
- [Customize Flow for mobile](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app/customize-flow-for-mobile)
- [Add localization to Flow for mobile](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-mobile-app/add-localization-to-flow-for-mobile)

<!-- ios/
├── AppDelegate.swift # Swift-based app delegate
├── CheckoutFlowManager.swift # Native module implemented in Swift
├── CheckoutFlowManagerBridge.m # React Native bridge for the Swift module
├── TestProject-Bridging-Header.h # Bridging header for React Native types -->