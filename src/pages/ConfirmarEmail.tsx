import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, TrendingUp, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Status = 'loading' | 'success' | 'error';

export default function ConfirmarEmail() {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Supabase redirects with hash params after email confirmation
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type') || searchParams.get('type');
    const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

    if (errorDescription) {
      setStatus('error');
      setErrorMessage(
        errorDescription.includes('expired')
          ? 'O link de confirmação expirou. Solicite um novo abaixo.'
          : 'Link de confirmação inválido. Solicite um novo abaixo.'
      );
      return;
    }

    if (type === 'signup' || type === 'email') {
      setStatus('success');
    } else {
      // Check if session exists (auto-confirmed via redirect)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setStatus('success');
        } else {
          // Give a moment for the auth state to settle
          setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session: s } }) => {
              setStatus(s ? 'success' : 'error');
              if (!s) setErrorMessage('Não foi possível confirmar o email. Solicite um novo link abaixo.');
            });
          }, 2000);
        }
      });
    }
  }, [searchParams]);

  const handleResend = async () => {
    if (!resendEmail) {
      toast({ title: 'Informe seu email', variant: 'destructive' });
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email: resendEmail });
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível reenviar. Tente novamente.', variant: 'destructive' });
    } else {
      toast({ title: 'Email reenviado!', description: 'Verifique sua caixa de entrada.' });
    }
    setResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            Lupa <span className="text-gradient">Financeira</span>
          </span>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Confirmando seu email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Email confirmado!</h1>
            <p className="text-muted-foreground">
              Sua conta foi verificada com sucesso. Agora você pode fazer login.
            </p>
            <Link to="/login">
              <Button className="w-full py-6 text-base font-semibold">
                Ir para o login
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Erro na confirmação</h1>
            <p className="text-muted-foreground">{errorMessage}</p>

            <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Reenviar email de confirmação</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resendEmail">Seu email</Label>
                <Input
                  id="resendEmail"
                  type="email"
                  placeholder="seu@email.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="py-5"
                />
              </div>
              <Button onClick={handleResend} disabled={resending} className="w-full">
                {resending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Reenviar link
              </Button>
            </div>

            <Link to="/login">
              <Button variant="ghost" className="w-full">Voltar para o login</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
