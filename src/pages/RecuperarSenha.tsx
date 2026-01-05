import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

const emailSchema = z.string().email('Por favor, insira um email válido');

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: err.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar email de recuperação. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setEmailSent(true);
    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySEyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-background/20 backdrop-blur-sm flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
              <span className="font-heading font-bold text-3xl">
                Lupa Financeira
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Esqueceu sua senha?
            </h1>
            <p className="text-xl opacity-90 max-w-md">
              Sem problemas! Vamos ajudá-lo a recuperar o acesso à sua conta.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground">
              Lupa <span className="text-gradient">Financeira</span>
            </span>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>

          {emailSent ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Email enviado!
              </h2>
              <p className="text-muted-foreground mb-8">
                Enviamos um link de recuperação para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e spam.
              </p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full py-6"
              >
                Enviar novamente
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Esqueceu sua senha?
                </h2>
                <p className="text-muted-foreground">
                  Digite seu email e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-6"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Link de Recuperação'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Lembrou a senha?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
