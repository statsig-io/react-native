import 'react-native-get-random-values';
import statsig from 'statsig-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

statsig._setReactNativeDependencies(
  {
    sdkType: require('./package.json')?.name,
    sdkVersion: require('./package.json')?.version,
  },
  AsyncStorage,
  AppState,
  NativeModules,
  Platform,
  DeviceInfo,
  null,
  null
);

export default statsig;
