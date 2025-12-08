import React, { ReactNode } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { EmpleadoNavigator } from './src/navigator/EmpleadoNavigator';
const AppState = ( { children }: { children : ReactNode } ) => {
    return(
        <AuthProvider>
            { children }
        </AuthProvider>
    );
}

const App = () => {
    return(
        <NavigationContainer>
            <AppState>
                <EmpleadoNavigator/>
            </AppState>
        </NavigationContainer>
    );
}

export default App;
