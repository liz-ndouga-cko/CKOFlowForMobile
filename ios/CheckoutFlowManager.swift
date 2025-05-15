import SwiftUI
import React
import CheckoutComponentsSDK

@objc(CheckoutFlowManager)
class CheckoutFlowManager: NSObject {
    
    private var checkoutComponents: CheckoutComponents?
    private let publicKey = "pk_sbox_ha67guqlgehtv73bfcuvqr6o3qr" // /!\  Provide your own public key
    private let environment = CheckoutComponents.Environment.sandbox
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc func initialize(_ paymentSession: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let paymentSessionID = paymentSession["id"] as? String,
              let paymentSessionSecret = paymentSession["payment_session_secret"] as? String else {
            rejecter("ERROR", "Invalid payment session object", nil)
            return
        }
        
        // Create a task to handle the async initialization
        Task {
            do {
                // Create a PaymentSession instance
                let session = PaymentSession(id: paymentSessionID, paymentSessionSecret: paymentSessionSecret)
                
                // Configure the CheckoutComponents SDK
                let config = try await CheckoutComponents.Configuration(
                    paymentSession: session,
                    publicKey: publicKey,
                    environment: environment,
                    callbacks: CheckoutComponents.Callbacks(
                      onTokenized: { tokenDetails in
                        print("Tokenization successful: \(tokenDetails)")
                        print("Token: \(tokenDetails.token)")
                      },
                      onSuccess: { paymentMethod, paymentID in
                            print("Payment successful: \(paymentID)")
                      },
                      onError: { error in
                          print("Error: \(error)")
                      }
                    )
                )
                self.checkoutComponents = CheckoutComponents(configuration: config)
                print("CheckoutComponents initialized successfully for \(environment) environment.")
                
                // Resolve the promise on the main thread
                DispatchQueue.main.async {
                    resolver(["success": true])
                }
            } catch {
                print("Failed to initialize CheckoutComponents: \(error)")
                DispatchQueue.main.async {
                    rejecter("INIT_ERROR", "Failed to initialize: \(error.localizedDescription)", error as NSError)
                }
            }
        }
    }
    
    @objc func renderFlow(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let checkoutComponents = checkoutComponents else {
            rejecter("NOT_INITIALIZED", "CheckoutComponents not initialized", nil)
            return
        }
        
        DispatchQueue.main.async {
            guard let rootViewController = UIApplication.shared.connectedScenes
                .compactMap({ $0 as? UIWindowScene })
                .flatMap({ $0.windows })
                .first(where: { $0.isKeyWindow })?.rootViewController else {
                rejecter("NO_ROOT_VIEW", "Root view controller not found", nil)
                return
            }
            
            do {
                let flowComponent = try checkoutComponents.create(.
                flow(options: [
                    .card(showPayButton: true, // if true: display built-in button - if false: show your own pay button
                          paymentButtonAction: .tokenization, // .tokenization: for tokenization-only -  .payment: for payments
                         ),
                    // .applePay(merchantIdentifier: "your.merchant.ID")
                  ]))
                let flowView = flowComponent.render()
              
                let titledView = VStack(spacing: 16) {
                      Text("Pay with card")
                          .font(.title)
                          .bold()
                  
                      Text("Amount to pay: 10.00€ ")
                          .font(.subheadline)
                          .foregroundColor(.gray)
                          .multilineTextAlignment(.center)
                  
                      flowView
                  }
                  .padding()
                
                let hostingController = UIHostingController(rootView: titledView)
                hostingController.view.frame = rootViewController.view.bounds
                hostingController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                
                rootViewController.view.addSubview(hostingController.view)
                rootViewController.addChild(hostingController)
                hostingController.didMove(toParent: rootViewController)
                
                resolver(["success": true])
            } catch {
                print("Failed to render Flow component: \(error)")
                rejecter("RENDER_ERROR", "Failed to render Flow: \(error.localizedDescription)", error as NSError)
            }
        }
    }
}
