import { Statsig as StatsigInternal } from 'statsig-react';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
const packageJson = require('../package.json');
import type { StatsigUser, StatsigOptions, UUID } from 'statsig-react';
import { staticImplements, StatsigStatic } from 'statsig-react';

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
          sdkVersion: packageJson?.version || '4.3.0',
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
