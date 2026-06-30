/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  HeartHandshake, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  Check, 
  ShoppingCart,
  TrendingUp,
  ShoppingBag,
  Database,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { authService, UserSession, supabaseConfig } from './services/auth';
import { MainDashboard } from './components/MainDashboard';
import { CompararScreen } from './components/CompararScreen';

export default function App() {
  // Routing states
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState<UserSession | null>(null);
  
  // Form submission validation state
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // App mode simulation states
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'whatsapp' | null>(null);

  // Validation RegEx for email
  const isEmailValid = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isPasswordValid = (val: string) => {
    return val.length >= 6;
  };

  // Submit Handler for traditional email login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    setErrorMsg('');

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      setErrorMsg('Por favor, corrija os erros de validação antes de continuar.');
      return;
    }

    setIsLoading(true);
    setAuthMethod('email');

    try {
      const session = await authService.login(email, password);
      setUser(session);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro de autenticação inexperado.');
    } finally {
      setIsLoading(false);
      setAuthMethod(null);
    }
  };

  // Handler for simulated WhatsApp or Google Auth login
  const handleOAuthLogin = async (method: 'google' | 'whatsapp') => {
    setErrorMsg('');
    setIsLoading(true);
    setAuthMethod(method);

    try {
      let session;
      if (method === 'google') {
        session = await authService.loginWithGoogle();
      } else {
        session = await authService.loginWithWhatsApp();
      }
      setUser(session);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Falha na integração OAuth.');
    } finally {
      setIsLoading(false);
      setAuthMethod(null);
    }
  };

  // Autocomplete developer shortcut credentials for testing
  const fillTestCredentials = () => {
    setEmail('gestor.bellamassa@comprainteligente.com.br');
    setPassword('senha123');
    setEmailTouched(true);
    setPasswordTouched(true);
    setErrorMsg('');
  };

  return (
    <div id="main_viewport" className="min-h-screen bg-slate-50 flex flex-col font-sans text-[#0F172A] antialiased select-none">
      
      {/* Inject Keyframe animations for background layout */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes coin-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(10deg); }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-coin-1 {
          animation: coin-float 4s ease-in-out infinite;
        }
        .animate-coin-2 {
          animation: coin-float 5s ease-in-out infinite 1s;
        }
        .animate-coin-3 {
          animation: coin-float 6s ease-in-out infinite 2s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>

      {/* RENDER LOGIN OR DASHBOARD */}
      {!user ? (
        /* ==================== LOGIN VIEW (TWO COLUMNS DESKTOP) ==================== */
        <div id="login_container" className="flex-1 flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-green-50/40 via-white to-green-50/20">
          
          {/* LEFT COLUMN: INSTITUTIONAL AND RICH VISUAL COMPOSITION */}
          <div id="brand_hero_column" className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative overflow-hidden bg-gradient-to-b from-[#EBFBF2] to-white lg:border-r border-[#E2E8F0]">
            {/* Background elements for premium feel */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            {/* Header: Logo and Brand Name */}
            <div className="flex items-center space-x-3 z-10 relative">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#009B4E] text-white shadow-lg shadow-green-500/20 transform hover:scale-105 transition-all duration-300">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3H5L5.4 5M5.4 5H21L19 13H7M5.4 5L7 13M7 13L5.5 19H19M7 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 17.5C17 18.3284 16.3284 19 15.5 19C14.6716 19 14 18.3284 14 17.5C14 16.6716 14.6716 16 15.5 16C16.3284 16 17 16.6716 17 17.5Z" fill="currentColor"/>
                  <path d="M9 17.5C9 18.3284 8.32843 19 7.5 19C6.67157 19 6 18.3284 6 17.5C6 16.6716 6.67157 16 7.5 16C8.32843 16 9 16.6716 9 17.5Z" fill="currentColor"/>
                  <path d="M11 7L13 5L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">Compra</span>
                <span className="font-extrabold text-xl tracking-tight text-[#009B4E]"> Inteligente</span>
                <div className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase mt-[-2px]">Plataforma B2B</div>
              </div>
            </div>

            {/* Middle Section: Copy and Benefits */}
            <div className="my-10 lg:my-0 z-10 relative space-y-8 max-w-xl">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-green-100 text-[#007A3D] text-xs font-semibold mb-4 border border-green-200 shadow-sm animate-pulse-slow">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Economize de 15% a 30% em insumos</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15] mb-4">
                  Compre melhor.<br />
                  Compare fornecedores.<br />
                  <span className="text-[#009B4E] relative inline-block">
                    Economize sempre.
                    <span className="absolute left-0 bottom-1 w-full h-2 bg-[#009B4E]/10 -z-10 rounded-full"></span>
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-medium">
                  A plataforma inteligente que compara preços entre fornecedores, analisa oportunidades e ajuda o seu negócio a economizar todos os dias.
                </p>
              </div>

              {/* Grid of Benefit Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-[#009B4E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A] mb-1">Compare em segundos</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">Veja o melhor preço consolidado entre diversos fornecedores em tempo real.</p>
                </div>

                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-[#009B4E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A] mb-1">Listas inteligentes</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">Crie, importe e organize suas listas de insumos periódicos de forma automatizada.</p>
                </div>

                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-[#009B4E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="w-4.5 h-4.5" stroke="currentColor" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A] mb-1">Economia real</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">Relatórios completos com histórico de flutuações e sugestão de melhor compra.</p>
                </div>

                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-[#009B4E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A] mb-1">Mais controle</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">Decisões baseadas em dados confiáveis com auditoria de faturamento de pedidos.</p>
                </div>
              </div>

              {/* RICH VISUAL COMPOSITION (SVG illustration, laptop and float items) */}
              <div id="visual-composition" className="relative h-64 sm:h-72 w-full max-w-lg mx-auto bg-green-900/5 rounded-3xl p-6 border border-green-500/10 flex items-center justify-center overflow-hidden">
                {/* Floating graphic grids */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#009B4E_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>

                {/* Left Floating Box & Basket and elements */}
                <div className="absolute left-6 bottom-8 z-20 flex flex-col items-center animate-float-slow">
                  {/* Green Basket Container */}
                  <div className="w-16 h-12 bg-emerald-600 rounded-b-xl rounded-t-sm flex flex-col justify-between p-1.5 relative shadow-md border border-emerald-500">
                    {/* Basket Handle */}
                    <div className="absolute -top-3 left-3 right-3 h-4 border-t-2 border-x-2 border-emerald-500 rounded-t-full"></div>
                    {/* Food Items inside basket */}
                    <div className="flex justify-around items-end h-5 z-10">
                      <div className="w-3.5 h-3.5 bg-red-500 rounded-full relative">
                        <div className="w-0.5 h-1 bg-amber-700 absolute -top-0.5 left-1.5"></div>
                      </div>
                      <div className="w-4 h-5 bg-green-400 rounded-t-full"></div>
                      <div className="w-3.5 h-6 bg-amber-500 rounded-t-md rotate-12"></div>
                    </div>
                    {/* Grid bars of basket */}
                    <div className="grid grid-cols-4 gap-0.5 h-2.5 opacity-30 mt-1">
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                      <div className="bg-white rounded-sm"></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#007A3D] mt-1 bg-green-100 px-1.5 py-0.5 rounded-full shadow-sm">Insumos</span>
                </div>

                {/* Right Floating Cart with Boxes */}
                <div className="absolute right-6 top-8 z-20 animate-float-slow" style={{ animationDelay: '2.5s' }}>
                  <div className="flex flex-col items-center">
                    {/* Custom Cardboard Delivery Box */}
                    <div className="w-14 h-11 bg-amber-600/90 rounded-md relative shadow-md flex items-center justify-center border border-amber-700/50">
                      <div className="absolute top-0 bottom-0 left-1/2 w-2.5 bg-amber-700/60 -translate-x-1/2"></div>
                      <div className="absolute left-0 right-0 top-1/2 h-2.5 bg-amber-700/40 -translate-y-1/2"></div>
                      <span className="text-white text-[8px] font-extrabold z-10 tracking-widest bg-[#009B4E] px-1 rounded">B2B</span>
                    </div>
                    {/* Shopping cart underneath */}
                    <div className="flex space-x-1.5 items-center mt-1">
                      <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      <span className="text-[9px] font-bold text-[#64748B]">Fornecedor C</span>
                    </div>
                  </div>
                </div>

                {/* Centered Laptop showing Mini Dashboard Mockup */}
                <div className="w-56 sm:w-64 bg-[#0F172A] rounded-xl p-2.5 shadow-2xl relative border border-[#334155] z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  {/* Laptop Screen Content */}
                  <div className="bg-slate-900 rounded-lg p-2 h-28 flex flex-col justify-between overflow-hidden relative text-white">
                    {/* Dashboard Header inside screen */}
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-[7px] text-slate-400 font-bold ml-1">compra_inteligente_db</span>
                      </div>
                      <div className="bg-[#009B4E] text-[7px] px-1 rounded font-bold text-white flex items-center space-x-0.5 animate-pulse">
                        <Percent className="w-1.5 h-1.5" />
                        <span>Economia 24%</span>
                      </div>
                    </div>

                    {/* Chart / Graphs illustration in Screen */}
                    <div className="flex-1 flex flex-col justify-end py-1">
                      <div className="space-y-1.5">
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[6px] text-slate-400">
                            <span>Farinha - Distr. Aliança</span>
                            <span className="font-bold text-red-400">R$ 82,50</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-400 h-full rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[6px] text-slate-400">
                            <span>Farinha - Nac. Alimentos</span>
                            <span className="font-bold text-[#009B4E]">R$ 74,20</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#009B4E] h-full rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini card indicator overlay */}
                    <div className="absolute right-1.5 bottom-12 bg-slate-800/95 backdrop-blur-sm p-1 rounded border border-slate-700 flex items-center space-x-1 shadow-md">
                      <div className="w-3 h-3 rounded bg-green-500/20 text-[#009B4E] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <div className="text-[6px]">
                        <p className="text-white font-extrabold text-[5px]">Melhor Opção</p>
                        <p className="text-[#009B4E] font-bold">-R$ 8,30 / un</p>
                      </div>
                    </div>

                    {/* Dashboard Status Footer inside screen */}
                    <div className="flex justify-between items-center text-[6px] text-slate-500 mt-1 border-t border-slate-800/60 pt-1">
                      <span>Análise Consolidada</span>
                      <span className="text-emerald-400 font-bold">● Pronto</span>
                    </div>
                  </div>

                  {/* Laptop Keyboard / Base hinge */}
                  <div className="w-full h-2 bg-slate-700 rounded-b-md mt-1 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-slate-800 rounded"></div>
                  </div>
                </div>

                {/* Floating Coins */}
                <div className="absolute left-1/4 top-6 z-20 text-yellow-500 animate-coin-1 bg-amber-50 p-1 rounded-full shadow-md border border-amber-200">
                  <span className="font-bold">$</span>
                </div>
                <div className="absolute right-12 bottom-10 z-20 text-yellow-500 animate-coin-2 bg-amber-50 p-1.5 rounded-full shadow-md border border-amber-200">
                  <span className="font-bold text-xs">$</span>
                </div>
                <div className="absolute left-12 bottom-20 z-20 text-yellow-500 animate-coin-3 bg-amber-50 p-1 rounded-full shadow-sm border border-amber-200">
                  <span className="font-bold text-[10px]">$</span>
                </div>
              </div>

            </div>

            {/* Footer indicators inside Hero Side */}
            <div id="hero_footer_indicators" className="border-t border-green-500/15 pt-6 mt-6 z-10 relative">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[#0F172A]/90">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-green-100 text-[#009B4E]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Dados protegidos</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-green-100 text-[#009B4E]">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <span>Atualização diária</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-green-100 text-[#009B4E]">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>+1.000 negócios</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-green-100 text-[#009B4E]">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span>Suporte especializado</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MODERN PREMIUM LOGIN CARD */}
          <div id="login_card_column" className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
            
            {/* Supabase status micro-banner */}
            <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-200 shadow-sm">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Status Auth:</span>
              {supabaseConfig.isConfigured ? (
                <span className="text-[#009B4E] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009B4E] mr-1 inline-block animate-pulse"></span>
                  Supabase Ativo
                </span>
              ) : (
                <span className="text-amber-600 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 inline-block animate-pulse"></span>
                  Simulador Ativo
                </span>
              )}
            </div>

            {/* Main Premium Card */}
            <div id="auth_card" className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[24px] shadow-xl p-8 relative overflow-hidden transition-all duration-300">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-[100px] pointer-events-none"></div>
              
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  Bem-vindo <span className="text-[#009B4E]">de volta!</span>
                </h2>
                <p className="text-sm text-[#64748B] mt-1.5 font-medium">
                  Faça login para acessar sua conta e economizar.
                </p>
              </div>

              {/* Validation alert banner if login has errors */}
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-start space-x-2.5">
                  <div className="p-0.5 bg-red-100 text-red-600 rounded-md mt-0.5 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="leading-normal">{errorMsg}</p>
                </div>
              )}

              {/* Core Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label htmlFor="email_input" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    E-mail do seu negócio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email_input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailTouched) setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="seu@email.com"
                      className={`w-full pl-10 pr-4 py-3 bg-[#FCFDFD] border rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] font-medium outline-none transition-all duration-300
                        ${emailTouched && !email 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                          : emailTouched && !isEmailValid(email)
                          ? 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
                          : 'border-[#E2E8F0] focus:border-[#009B4E] focus:ring-2 focus:ring-green-100'
                        }`}
                      disabled={isLoading}
                    />
                  </div>
                  {emailTouched && !email && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center space-x-1">
                      <span>• Campo obrigatório</span>
                    </p>
                  )}
                  {emailTouched && email && !isEmailValid(email) && (
                    <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                      • Por favor, insira um formato de e-mail válido
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password_input" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                      Sua senha segura
                    </label>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => alert('Recuperação de senha enviada para ' + (email || 'o e-mail do seu negócio.'))}
                      className="text-xs font-bold text-[#009B4E] hover:text-[#007A3D] transition-colors focus:outline-none"
                    >
                      Esqueci minha senha?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password_input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordTouched) setPasswordTouched(true);
                      }}
                      onBlur={() => setPasswordTouched(true)}
                      placeholder="Digite sua senha"
                      className={`w-full pl-10 pr-10 py-3 bg-[#FCFDFD] border rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] font-medium outline-none transition-all duration-300
                        ${passwordTouched && !password 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : passwordTouched && !isPasswordValid(password)
                          ? 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100'
                          : 'border-[#E2E8F0] focus:border-[#009B4E] focus:ring-2 focus:ring-green-100'
                        }`}
                      disabled={isLoading}
                    />
                    <button
                      id="toggle_password_btn"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#0F172A] transition-colors"
                      title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordTouched && !password && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center space-x-1">
                      <span>• Campo obrigatório</span>
                    </p>
                  )}
                  {passwordTouched && password && !isPasswordValid(password) && (
                    <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                      • A senha deve ter no mínimo 6 caracteres
                    </p>
                  )}
                </div>

                {/* Remember me row */}
                <div className="flex items-center justify-between pt-1">
                  <label id="remember_me_container" className="flex items-center space-x-2 cursor-pointer group select-none">
                    <input
                      id="remember_me_checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E2E8F0] text-[#009B4E] focus:ring-[#009B4E] cursor-pointer"
                      disabled={isLoading}
                    />
                    <span className="text-xs text-[#64748B] group-hover:text-[#0F172A] font-semibold transition-colors">
                      Lembrar de mim neste dispositivo
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  id="login_submit_btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#009B4E] hover:bg-[#007A3D] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-green-500/10 hover:shadow-green-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-85 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isLoading && authMethod === 'email' ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Verificando credenciais...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar na plataforma</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>

              {/* DEMO ACCOUNTS HELPER */}
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between text-xs text-[#007A3D] font-medium">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#009B4E]" />
                  <span>Deseja testar rápido?</span>
                </span>
                <button
                  id="fill_test_btn"
                  onClick={fillTestCredentials}
                  className="px-2.5 py-1 bg-white hover:bg-green-100 text-[#007A3D] border border-green-200 rounded-lg font-bold shadow-xs hover:shadow-xs transition-all active:scale-[0.95]"
                >
                  Preencher dados de teste
                </button>
              </div>

              {/* Separator block */}
              <div className="my-5 flex items-center justify-between text-xs text-[#64748B] font-semibold">
                <div className="w-full h-[1px] bg-[#E2E8F0]"></div>
                <span className="px-3 whitespace-nowrap">ou continue com</span>
                <div className="w-full h-[1px] bg-[#E2E8F0]"></div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="google_oauth_btn"
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-[#E2E8F0] hover:bg-slate-50 rounded-xl text-xs font-bold text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100 cursor-pointer disabled:opacity-50"
                >
                  {isLoading && authMethod === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#009B4E]" />
                  ) : (
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  <span>Google</span>
                </button>

                <button
                  id="whatsapp_oauth_btn"
                  type="button"
                  onClick={() => handleOAuthLogin('whatsapp')}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-[#E2E8F0] hover:bg-green-50 rounded-xl text-xs font-bold text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-green-100 cursor-pointer disabled:opacity-50"
                >
                  {isLoading && authMethod === 'whatsapp' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#009B4E]" />
                  ) : (
                    <svg className="w-4.5 h-4.5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.975 14.068 1.01 11.999 1.01c-5.437 0-9.861 4.371-9.865 9.8.001 1.944.522 3.84 1.511 5.511l-.994 3.63 3.738-.971c1.558.85 3.23 1.285 4.168 1.284zm7.906-6.104c-.331-.164-1.955-.953-2.256-1.061-.3-.109-.519-.164-.737.164-.219.328-.847 1.061-1.039 1.28-.192.218-.383.245-.714.082-.33-.164-1.396-.508-2.66-1.625-.983-.865-1.648-1.933-1.841-2.26-.192-.328-.02-.505.145-.668.148-.146.331-.383.497-.574.166-.191.22-.328.331-.546.11-.218.055-.409-.027-.573-.082-.164-.737-1.751-1.011-2.407-.267-.633-.539-.546-.737-.556-.191-.01-.41-.01-.629-.01-.218 0-.574.082-.875.409-.3.328-1.148 1.109-1.148 2.701 0 1.593 1.176 3.13 1.339 3.349.164.218 2.313 3.493 5.6 4.887.781.332 1.39.53 1.866.681.785.246 1.498.211 2.062.128.629-.093 1.954-.789 2.228-1.551.274-.762.274-1.417.192-1.551-.08-.135-.298-.218-.629-.382z" fill="currentColor"/>
                    </svg>
                  )}
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Bottom Card Register link */}
              <div className="mt-6 text-center text-xs font-semibold text-[#64748B]">
                Não tem uma conta?{' '}
                <button
                  id="signup_redirect_btn"
                  type="button"
                  onClick={() => alert('Para criar sua conta de fornecedor ou comprador, as inscrições reabrirão em breve! Por favor use o botão "Preencher dados de teste" para navegar imediatamente pelo Dashboard.')}
                  className="text-[#009B4E] hover:text-[#007A3D] font-bold underline transition-colors"
                >
                  Criar conta gratuita
                </button>
              </div>

              {/* Protection notice */}
              <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-center space-x-1.5 text-[10px] font-bold text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-[#009B4E]" />
                <span>Seus dados estão protegidos com criptografia de ponta a ponta.</span>
              </div>
            </div>

            {/* Copyright layout */}
            <div className="mt-8 text-center text-[11px] font-bold text-[#64748B]">
              © 2026 Compra Inteligente. Todos os direitos reservados.
            </div>
          </div>

        </div>
      ) : currentPath === '/comparar' ? (
        <CompararScreen 
          user={user} 
          onLogout={() => { setUser(null); navigateTo('/'); }} 
          onNavigateHome={() => navigateTo('/')}
          onNavigateTab={(tab) => {
            if (tab === 'inicio') {
              navigateTo('/');
            } else {
              navigateTo('/');
            }
          }}
        />
      ) : (
        /* ==================== REAL DYNAMIC SUPABASE DASHBOARD ==================== */
        <MainDashboard 
          user={user} 
          onLogout={() => setUser(null)} 
          onNavigateComparar={() => navigateTo('/comparar')}
        />
      )}

    </div>
  );
}
