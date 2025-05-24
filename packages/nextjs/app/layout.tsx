import type { Metadata } from 'next';
import { ScaffoldStarkAppWithProviders } from '~~/components/ScaffoldStarkAppWithProviders';
import '~~/styles/globals.css';
import { ThemeProvider } from '~~/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'NichtaDex',
  description: 'Decentralized Exchange',
  icons: '/favicon-32x32.png',
};

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider enableSystem>
          <ScaffoldStarkAppWithProviders>
            {children}
          </ScaffoldStarkAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
