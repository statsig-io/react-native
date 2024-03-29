import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';
import { AppState, NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import 'react-native-get-random-values';
import type { StatsigOptions, StatsigUser, UUID } from 'statsig-react';
import { StatsigProvider as InternalProvider } from 'statsig-react';
import { version as sdkVersion } from './SDKVersion';

export declare type UpdateUserFunc = React.Dispatch<React.SetStateAction<StatsigUser>>;

/**
 * Properties required to initialize the Statsig React SDK
 */
type Props = {
  children: React.ReactNode | React.ReactNode[];

  /**
   * A client SDK key from the Statsig Console
   */
  sdkKey: string;

  /**
   * A Statsig User object.  Changing this will update the user and Gate values, causing a re-initialization
   */
  user: StatsigUser;

  /**
   * Options for initializing the SDK, shared with the statsig-js SDK
   */
  options?: StatsigOptions;

  /**
   * Waits for the SDK to load any cached values before rendering child components
   */
  waitForCache?: boolean;

  /**
   * Waits for the SDK to initialize with updated values from the network before rendering child components
   */
  waitForInitialization?: boolean;

  /**
   * Pass in react-native-uuid to replace uuid if your project does not work with uuid @see https://www.npmjs.com/package/react-native-uuid
   */
  reactNativeUUID?: UUID;

  /**
   * A key for stable mounting/unmounting when updating the user.  If this key is set and changes when the user object changes
   * (or if it is not provided) Then the children of StatsigProvider will unmount/remount with the async update.
   * If this key is set and does not change, then the children of StatsigProvider will continue to be mounted,
   * and it will trigger a rerender after updateUser completes
   */
  mountKey?: string;

  /**
   * If set to true, will automatically call shutdown() on Statsig to flush logs when the provider is unmounted
   */
  shutdownOnUnmount?: boolean;

  /**
   * A loading component to render iff waitForInitialization is set to true, and the SDK is initializing
   */
  initializingComponent?: ReactNode | ReactNode[];
  
  /**
  * A function to keep your reference to a StatsigUser in-sync with Statsig's reference.
  * This is required if you want to use the useUpdateUser hook.
  */
  setUser?: UpdateUserFunc;
};

/**
 * The StatsigProvider is the top level component from which all React SDK components derive
 * It initializes the SDK so child components can use FeatureGate and DynamicConfig values
 *
 * The provider accepts the same SDK initialization parameters as the statsig-js SDK.
 *
 * We recommend you place this at the entry point of your app and pass waitForInitialization = true
 * to ensure the SDK is initialized and all values are up to date prior to rendering anything.
 * @param props
 * @returns
 */
export default function StatsigProvider({
  children,
  sdkKey,
  user,
  options,
  waitForCache,
  waitForInitialization,
  reactNativeUUID,
  mountKey,
  shutdownOnUnmount,
  initializingComponent,
  setUser,
}: Props): JSX.Element {
  return (
    <InternalProvider
      sdkKey={sdkKey}
      user={user}
      options={options}
      waitForCache={waitForCache}
      waitForInitialization={waitForInitialization}
      initializingComponent={initializingComponent}
      // @ts-ignore
      _reactNativeDependencies={{
        SDKPackageInfo: {
          sdkType: 'react-native-client',
          sdkVersion,
        },
        AsyncStorage: AsyncStorage,
        AppState: AppState,
        NativeModules: NativeModules,
        Platform: Platform,
        RNDevice: DeviceInfo,
        Constants: null,
        ExpoDevice: null,
        ReactNativeUUID: reactNativeUUID ?? null,
      }}
      mountKey={mountKey}
      shutdownOnUnmount={shutdownOnUnmount}
      setUser={setUser}
    >
      {children}
    </InternalProvider>
  );
}
