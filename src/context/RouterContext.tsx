import React, { createContext, useContext, useState, useEffect } from 'react';

export type RoutePath =
  | '/'
  | '/services'
  | '/community'
  | '/resources'
  | '/contact'
  | '/privacy'
  | '/terms'
  | '/login'
  | '/portal';

interface RouterContextType {
  path: RoutePath;
  navigate: (to: RoutePath) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getValidPath = (pathname: string): RoutePath => {
    const validPaths: RoutePath[] = [
      '/',
      '/services',
      '/community',
      '/resources',
      '/contact',
      '/privacy',
      '/terms',
      '/login',
      '/portal',
    ];
    // Strip trailing slash if present (except root)
    const normalized = pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
    return validPaths.includes(normalized as RoutePath)
      ? (normalized as RoutePath)
      : '/';
  };

  const [path, setPath] = useState<RoutePath>(() => {
    if (typeof window !== 'undefined') {
      return getValidPath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(getValidPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: RoutePath) => {
    if (typeof window !== 'undefined') {
      if (to !== path) {
        window.history.pushState(null, '', to);
        setPath(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRouter = () => useContext(RouterContext);

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: RoutePath;
  children: React.ReactNode;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  onClick,
  ...rest
}) => {
  const { path, navigate } = useRouter();
  const isActive = path === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Permit default behavior for modifier keys (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
    navigate(href);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
};
