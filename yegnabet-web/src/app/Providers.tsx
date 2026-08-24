import { type ReactNode } from 'react'
import ThemeProvider from '../features/theme/ThemeProvider';

interface ProviderProps {
    children: ReactNode;
}

const Providers = ({children} : ProviderProps) => {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    );
}

export default Providers