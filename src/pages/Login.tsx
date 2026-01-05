import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, BarChart3, Newspaper, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const getErrorMessage = (error: any) => {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'Email not confirmed': 'Por favor, confirme seu email antes de fazer login',
      'User already registered': 'Este email já está cadastrado',
    };
    return errorMessages[error.message] || 'Ocorreu um erro. Tente novamente.';
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse({ email, password });
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

    const { error } = await signInWithEmail(email, password);

    if (error) {
      toast({
        title: "Erro ao fazer login",
        description: getErrorMessage(error),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Login realizado!",
      description: "Bem-vindo de volta à Lupa Financeira",
    });
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
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
              Bem-vindo de volta!
            </h1>
            <p className="text-xl opacity-90 mb-12 max-w-md">
              Acesse suas ferramentas profissionais de análise financeira
            </p>
            
            <div className="space-y-4 text-left max-w-sm mx-auto">
              <div className="flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-xl p-4">
                <FileText className="w-6 h-6" />
                <span>Relatórios personalizados</span>
              </div>
              <div className="flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-xl p-4">
                <BarChart3 className="w-6 h-6" />
                <span>Cotações em tempo real</span>
              </div>
              <div className="flex items-center gap-4 bg-background/10 backdrop-blur-sm rounded-xl p-4">
                <Newspaper className="w-6 h-6" />
                <span>Notícias do mercado</span>
              </div>
            </div>
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

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-muted-foreground">
              Acesse sua conta e continue sua jornada financeira
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            variant="outline"
            className="w-full py-6 text-base font-medium mb-6 hover:shadow-lg transition-all duration-300"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continuar com Google
          </Button>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-sm">ou</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-6 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Lembrar de mim
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/recuperar-senha"
              className="text-sm text-primary hover:underline"
            >
              Esqueceu a senha?
            </Link>
            <p className="text-sm text-muted-foreground">
              Não tem conta?{' '}
              <Link to="/assinatura" className="text-primary hover:underline font-medium">
                Assine agora
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
