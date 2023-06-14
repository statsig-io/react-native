import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import 'react-native-get-random-values';
import type { StatsigOptions, StatsigUser, UUID } from 'statsig-react';
import {
  Statsig as StatsigInternal,
  StatsigStatic,
  staticImplements,
} from 'statsig-react';
import { version as sdkVersion } from './SDKVersion';

@staticImplements<StatsigStatic>()
export default class Statsig extends StatsigInternal {
  public static override async initialize(
    sdkKey: string,
    user?: StatsigUser | null,
    options?: StatsigOptions | null,
    reactNativeUUID?: UUID | null,
  ): Promise<void> {
    try {
      if (!StatsigInternal.initializeCalled()) {
        StatsigInternal.setSDKPackageInfo({
          sdkType: 'react-native-client',
          sdkVersion,
        });
        StatsigInternal.setAsyncStorage(AsyncStorage);

        StatsigInternal.setAppState(AppState);
        StatsigInternal.setNativeModules(NativeModules);
        StatsigInternal.setPlatform(Platform);
        StatsigInternal.setRNDeviceInfo(DeviceInfo);
        StatsigInternal.setReactNativeUUID(reactNativeUUID);
      }
      return StatsigInternal.initialize(sdkKey, user, options);
    } catch (e) {
      if (process.env.REACT_APP_STATSIG_SDK_MODE !== 'silent') {
        throw e;
      }
    }
    return Promise.resolve();
  }
}
