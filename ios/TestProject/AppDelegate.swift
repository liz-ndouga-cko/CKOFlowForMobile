import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let moduleName = "TestProject" // Make sure this matches AppRegistry.registerComponent(...)

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
