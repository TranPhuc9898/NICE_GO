#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
// Firebase
#import <Firebase/Firebase.h>
#import <GoogleMaps/GoogleMaps.h>
#import <UserNotifications/UserNotifications.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{


  [FIRApp configure];
  [application registerForRemoteNotifications];
  self.moduleName = @"CarBooking";
  [GMSServices provideAPIKey:@"AIzaSyAvJPWrJD-dGpcKH1Tdp0kdKYT7N4OVHW8"];

  
  #if DEBUG
    // Enable debugging in DEBUG mode
    [RCTBundleURLProvider sharedSettings].jsLocation = @"localhost";
    // You can also specify the port if needed
    // [RCTBundleURLProvider sharedSettings].jsPort = 8081;
  #endif
  
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
  #if DEBUG
    // For debugging
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  #else
    // For release builds
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
}

// ADDITION: This method registers the APNS token with Firebase
- (void)application:(UIApplication *)application
 didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
 [FIRMessaging messaging].APNSToken = deviceToken;
}



@end
