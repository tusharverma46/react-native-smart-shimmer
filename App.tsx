/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme, } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Example } from './example/Example';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Example/>
      
    </SafeAreaProvider>
  );
}

export default App;
