import { ReactNode, createContext, useContext, useState } from 'react';

interface BreadcrumbsContextProps {
  breadcrumbs: { url: string; title: string };
  setBreadcrumbs: React.Dispatch<
    React.SetStateAction<{ url: string; title: string }>
  >;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextProps | undefined>(
  undefined
);

export const BreadcrumbsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<{
    url: string;
    title: string;
  }>({ url: '', title: '' });

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);

  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }

  return context;
};
