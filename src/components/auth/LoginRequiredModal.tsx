import { useEffect } from 'react';
import { LOGIN_REQUIRED_EVENT, LoginRequiredDetail } from '../../lib/loginPrompt';
import { openAuthModal } from '../../lib/authModal';

/**
 * Global listener for the legacy `jm:login-required` event.
 * Instead of showing its own dialog, it now delegates to the unified AuthModal.
 * Mount once, inside the Router.
 */
export const LoginRequiredModal: React.FC = () => {
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<LoginRequiredDetail>).detail ?? {};
      openAuthModal({
        view: 'login',
        tab: detail.as ?? 'santri',
        from: 'guest',
      });
    };
    window.addEventListener(LOGIN_REQUIRED_EVENT, onOpen);
    return () => window.removeEventListener(LOGIN_REQUIRED_EVENT, onOpen);
  }, []);

  return null;
};
