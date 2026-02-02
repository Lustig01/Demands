import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { exchangeCodeForTokens, consumeReturnTo } from './tokenManager';
import { useAuth } from './AuthContext';
import LoadingScreen from './LoadingScreen';

export default function AuthCallback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      setError(t('auth.callbackError'));
      return;
    }

    (async () => {
      try {
        await exchangeCodeForTokens(code, state);
        await completeLogin();
        const returnTo = consumeReturnTo();
        navigate(returnTo, { replace: true });
      } catch {
        setError(t('auth.callbackError'));
      }
    })();
  }, [navigate, completeLogin, t]);

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-bg">
        <p className="text-danger text-sm">{error}</p>
      </div>
    );
  }

  return <LoadingScreen />;
}
