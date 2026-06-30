/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Percent, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  User, 
  Bell, 
  LogOut, 
  Loader2, 
  ChevronRight, 
  Plus, 
  X, 
  Trash2, 
  Check, 
  DollarSign, 
  Building2, 
  Database,
  Grid,
  History,
  FileText,
  Barcode,
  Menu,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { supabaseConfig, UserSession } from '../services/auth';
import { fetchProducts } from '../services/supabaseData';

// Define Interface matching Supabase 'supplier_products'
export interface SupplierProduct {
  product_key: string;
  supplier: string;
  store_id?: string;
  store_slug?: string;
  location_label?: string;
  aisle?: string;
  product_id?: string;
  master_product_id?: string;
  name: string;
  description?: string;
  category_name?: string;
  unit_type?: string;
  price_brl: number;
  real_price_brl?: number;
  discount_fraction?: number;
  have_discount?: boolean;
  in_stock?: boolean;
  is_available?: boolean;
  stock?: number;
  image_url?: string;
  product_url?: string;
  captured_at?: string;
}

interface MainDashboardProps {
  user: UserSession;
  onLogout: () => void;
  onNavigateComparar?: () => void;
}

// Sample Simulated Products for fallback if Supabase table is empty or not configured
const fallbackProducts: SupplierProduct[] = [
  {
    product_key: 'fb-1',
    supplier: 'Assai Atacadista',
    name: 'Farinha de Trigo Especial Tipo 1',
    description: 'Farinha de trigo premium ideal para panificação de longa fermentação.',
    category_name: 'Secos',
    unit_type: 'Saco 25kg',
    price_brl: 74.20,
    real_price_brl: 89.90,
    discount_fraction: 0.17,
    have_discount: true,
    in_stock: true,
    is_available: true,
    stock: 45,
    image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T14:30:00Z'
  },
  {
    product_key: 'fb-2',
    supplier: 'SuperMuffato',
    name: 'Óleo de Soja Especial Cocamar',
    description: 'Óleo refinado de soja de alta qualidade para frituras.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 20 un',
    price_brl: 128.40,
    real_price_brl: 145.00,
    discount_fraction: 0.11,
    have_discount: true,
    in_stock: true,
    is_available: true,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T15:45:00Z'
  },
  {
    product_key: 'fb-3',
    supplier: 'Atacadão',
    name: 'Queijo Mussarela Fatiado Lactis',
    description: 'Mussarela de búfala pasteurizada com excelente derretimento.',
    category_name: 'Laticínios',
    unit_type: 'Peça ~3.5kg',
    price_brl: 108.50,
    real_price_brl: 139.90,
    discount_fraction: 0.22,
    have_discount: true,
    in_stock: true,
    is_available: true,
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-28T09:15:00Z'
  },
  {
    product_key: 'fb-4',
    supplier: 'Condor',
    name: 'Açúcar Refinado Alto Alegre',
    description: 'Açúcar refinado especial de rápida diluição para doces.',
    category_name: 'Secos',
    unit_type: 'Fardo 10x1kg',
    price_brl: 39.80,
    real_price_brl: 49.90,
    discount_fraction: 0.20,
    have_discount: true,
    in_stock: true,
    is_available: true,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T11:00:00Z'
  },
  {
    product_key: 'fb-5',
    supplier: 'Lejon Atacarejo',
    name: 'Café Tradicional Vácuo Melitta',
    description: 'Café torrado e moído extra forte vácuo embalado.',
    category_name: 'Bebidas',
    unit_type: 'Fardo 10x500g',
    price_brl: 182.50,
    real_price_brl: 182.50,
    discount_fraction: 0.0,
    have_discount: false,
    in_stock: true,
    is_available: true,
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T10:20:00Z'
  },
  {
    product_key: 'fb-6',
    supplier: 'Assai Atacadista',
    name: 'Leite Condensado Piracanjuba Moça',
    description: 'Leite condensado de consistência perfeita para sobremesas e caldas.',
    category_name: 'Laticínios',
    unit_type: 'Caixa c/ 27 un',
    price_brl: 142.00,
    real_price_brl: 185.00,
    discount_fraction: 0.23,
    have_discount: true,
    in_stock: true,
    is_available: true,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T12:00:00Z'
  }
];

export function MainDashboard({ user, onLogout, onNavigateComparar }: MainDashboardProps) {
  // Navigation
  const [activeTab, setRawActiveTab] = useState<'inicio' | 'comparar' | 'lista' | 'historico' | 'fornecedores'>('inicio');
  
  const setActiveTab = (tab: 'inicio' | 'comparar' | 'lista' | 'historico' | 'fornecedores') => {
    if (tab === 'comparar' && onNavigateComparar) {
      onNavigateComparar();
    } else {
      setRawActiveTab(tab);
    }
  };
  
  // Data State
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('todos');

  // Interactive States
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [shoppingList, setShoppingList] = useState<{product: SupplierProduct, quantity: number}[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Notifications Array
  const notifications = [
    { id: 1, title: 'Queda de Preço!', desc: 'O Leite Condensado no Assai caiu 23%.', time: '10 min atrás', read: false },
    { id: 2, title: 'Novo fornecedor', desc: 'Lejon Atacarejo agora está ativo no seu CEP.', time: '2h atrás', read: true },
    { id: 3, title: 'Economia semanal', desc: 'Sua pizzaria economizou R$ 420 esta semana.', time: '1 dia atrás', read: true },
  ];

  // Fetch real data from Supabase 'supplier_products' through the shared REST service.
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts();

      if (!data || data.length === 0) {
        setProducts([]);
        setIsDemoMode(false);
      } else {
        setProducts(data);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error('Erro ao carregar supplier_products:', err);
      setError(err?.message || 'Não foi possível ler a tabela supplier_products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger Demo Mode with high fidelity mock data if real Supabase isn't setup
  const activateDemoMode = () => {
    setProducts(fallbackProducts);
    setIsDemoMode(true);
    setError(null);
    setLoading(false);
  };

  // Format money to BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Calculate discount percentage
  const getDiscountPercent = (p: SupplierProduct) => {
    if (p.discount_fraction && p.discount_fraction > 0) {
      return Math.round(p.discount_fraction * 100);
    }
    if (p.real_price_brl && p.price_brl && p.real_price_brl > p.price_brl) {
      return Math.round(((p.real_price_brl - p.price_brl) / p.real_price_brl) * 100);
    }
    return 0;
  };

  // Initials for avatar icon
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // Find biggest discount product for the Header Highlight
  const getOpportunityBannerProduct = () => {
    if (products.length === 0) return null;
    const discounted = products.filter(p => p.price_brl && p.real_price_brl && p.real_price_brl > p.price_brl);
    if (discounted.length > 0) {
      return discounted.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))[0];
    }
    // Return newest
    return products[0];
  };

  const opportunityProduct = getOpportunityBannerProduct();

  // Shopping list management
  const addToShoppingList = (product: SupplierProduct, qty: number = 1) => {
    setShoppingList(prev => {
      const existing = prev.find(item => item.product.product_key === product.product_key);
      if (existing) {
        return prev.map(item => 
          item.product.product_key === product.product_key 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    alert(`Adicionado com sucesso: ${qty}x ${product.name}`);
  };

  const updateListQty = (productKey: string, val: number) => {
    if (val <= 0) {
      setShoppingList(prev => prev.filter(item => item.product.product_key !== productKey));
      return;
    }
    setShoppingList(prev => prev.map(item => 
      item.product.product_key === productKey ? { ...item, quantity: val } : item
    ));
  };

  const removeFromList = (productKey: string) => {
    setShoppingList(prev => prev.filter(item => item.product.product_key !== productKey));
  };

  const calculateListTotal = () => {
    return shoppingList.reduce((acc, item) => acc + (item.product.price_brl * item.quantity), 0);
  };

  const calculateListOriginalTotal = () => {
    return shoppingList.reduce((acc, item) => {
      const origPrice = item.product.real_price_brl || item.product.price_brl;
      return acc + (origPrice * item.quantity);
    }, 0);
  };

  const listTotal = calculateListTotal();
  const listOriginalTotal = calculateListOriginalTotal();
  const listSavings = listOriginalTotal - listTotal;

  // Search filter
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSupplier = selectedSupplier === 'todos' || p.supplier === selectedSupplier;
    return matchesSearch && matchesSupplier;
  });

  // Group unique suppliers
  const uniqueSuppliers: string[] = Array.from(
    new Set(
      products
        .map(p => p.supplier)
        .filter((s): s is string => typeof s === 'string' && s.length > 0)
    )
  );

  // Group products by supplier
  const productsBySupplier = uniqueSuppliers.reduce<Record<string, SupplierProduct[]>>((acc, s) => {
    acc[s] = products.filter(p => p.supplier === s);
    return acc;
  }, {});

  // Generate timeline opportunities dynamically
  const getTimelineEvents = () => {
    const events: { title: string, desc: string, date: string, type: 'discount' | 'new' }[] = [];
    products.forEach((p, idx) => {
      const disc = getDiscountPercent(p);
      const capDate = p.captured_at ? new Date(p.captured_at) : new Date();
      const relativeTime = idx === 0 ? 'Hoje' : idx === 1 ? 'Ontem' : 'Há 3 dias';

      if (disc > 0 && events.length < 3) {
        events.push({
          title: 'Grande queda de preço!',
          desc: `${p.name} no fornecedor ${p.supplier} teve queda incrível, saindo por ${formatBRL(p.price_brl)} (${disc}% OFF).`,
          date: relativeTime,
          type: 'discount'
        });
      } else if (events.length < 5) {
        events.push({
          title: 'Nova oferta capturada',
          desc: `Registrado preço estável para ${p.name} no fornecedor ${p.supplier}: ${formatBRL(p.price_brl)}.`,
          date: relativeTime,
          type: 'new'
        });
      }
    });
    return events;
  };

  const timelineEvents = getTimelineEvents();

  return (
    <div className="w-full min-h-screen bg-slate-100 lg:bg-[#F8FAFC] flex items-center justify-center lg:items-stretch lg:justify-start p-0 md:p-4 lg:p-0">
      {/* Mobile PWA shell becomes a full desktop workspace on large screens */}
      <div id="pwa_shell" className="w-full max-w-[480px] lg:max-w-none h-screen md:h-[850px] lg:h-auto lg:min-h-screen md:rounded-[40px] lg:rounded-none md:shadow-2xl lg:shadow-none md:border-8 lg:border-0 md:border-[#0F172A] bg-white lg:bg-[#F8FAFC] relative flex flex-col overflow-hidden lg:overflow-visible select-none scrollbar-none">
        
        {/* TOP STATUS ROW */}
        <div className="bg-gradient-to-r from-[#009B4E] to-[#007A3D] px-6 pt-6 pb-4 text-white flex items-center justify-between shadow-md relative z-10">
          <div className="flex items-center space-x-2">
            <Menu className="w-5 h-5 text-green-100 hover:text-white cursor-pointer transition-colors" onClick={() => setProfileOpen(!profileOpen)} />
            <div className="flex items-center space-x-1.5">
              <ShoppingBag className="w-4 h-4 text-green-200" />
              <span className="font-extrabold text-sm tracking-tight">Compra <span className="text-green-300">Inteligente</span></span>
              <span className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full text-white tracking-widest uppercase">B2B</span>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            {/* Supabase status circle indicator */}
            <div 
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border uppercase ${!isDemoMode && products.length > 0 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}
              title={!isDemoMode && products.length > 0 ? "Conectado ao Supabase Real" : "Modo de Demonstração / Sem Supabase"}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${!isDemoMode && products.length > 0 ? 'bg-emerald-400' : 'bg-amber-400'} inline-block animate-pulse`}></span>
              <span>{!isDemoMode && products.length > 0 ? "Real" : "Demo"}</span>
            </div>

            {/* Notifications Button */}
            <button 
              className="relative p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#009B4E]"></span>
            </button>

            {/* Profile Avatar Trigger */}
            <div 
              className="w-8 h-8 rounded-full bg-green-100 text-[#007A3D] border border-white/40 flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-105 transition-all"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {getInitials(user.name)}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS BOX OVERLAY */}
        {notificationsOpen && (
          <div className="absolute top-16 left-6 right-6 bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl p-4 z-40 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2.5 mb-2.5">
              <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                <Bell className="w-4 h-4 text-[#009B4E] mr-1.5" />
                Notificações em Tempo Real
              </h3>
              <button onClick={() => setNotificationsOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className={`p-2.5 rounded-xl text-xs transition-colors ${n.read ? 'bg-slate-50' : 'bg-green-50/50 border-l-2 border-[#009B4E]'}`}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-extrabold text-[#0F172A]">{n.title}</span>
                    <span className="text-[10px] text-[#64748B]">{n.time}</span>
                  </div>
                  <p className="text-[#64748B] font-medium leading-relaxed">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE SIDEBAR DRAWER OVERLAY */}
        {profileOpen && (
          <div className="absolute inset-0 bg-black/60 z-50 flex justify-start">
            <div className="w-4/5 max-w-[320px] bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-[#64748B] uppercase tracking-widest">Meu Perfil</span>
                  <button onClick={() => setProfileOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                    <X className="w-5 h-5 text-[#0F172A]" />
                  </button>
                </div>

                {/* Profile Header Card */}
                <div className="flex items-center space-x-3.5 p-3 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-12 h-12 rounded-full bg-[#009B4E] text-white flex items-center justify-center font-bold text-lg">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">{user.name}</h4>
                    <p className="text-xs text-[#007A3D] font-semibold">{user.businessName}</p>
                    <p className="text-[10px] text-[#64748B] font-medium">{user.role}</p>
                  </div>
                </div>

                {/* Nav list */}
                <div className="space-y-1">
                  <button 
                    onClick={() => { setActiveTab('inicio'); setProfileOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-3 ${activeTab === 'inicio' ? 'bg-green-50 text-[#007A3D]' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                    <span>Início & Ofertas</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('comparar'); setProfileOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-3 ${activeTab === 'comparar' ? 'bg-green-50 text-[#007A3D]' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Comparador Completo</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('lista'); setProfileOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-3 ${activeTab === 'lista' ? 'bg-green-50 text-[#007A3D]' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Nova Lista ({shoppingList.length})</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab('historico'); setProfileOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-3 ${activeTab === 'historico' ? 'bg-green-50 text-[#007A3D]' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <History className="w-4 h-4" />
                    <span>Histórico de Cotações</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Credenciais do Banco:</p>
                    <p className="text-[10px] text-slate-700 truncate"><b>URL:</b> {"Configurada via secrets públicas"}</p>
                    <p className="text-[10px] text-slate-700 truncate"><b>ANON_KEY:</b> {"Configurada (Oculta)"}</p>
                  </div>
                </div>
              </div>

              {/* Logout inside drawer */}
              <button
                onClick={() => { onLogout(); setProfileOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta B2B</span>
              </button>
            </div>
            <div className="flex-1" onClick={() => setProfileOpen(false)}></div>
          </div>
        )}

        {/* CORE CONTAINER SCROLLABLE AREA */}
        <div id="pwa_content" className="flex-1 overflow-y-auto lg:overflow-visible pb-24 lg:pb-10 lg:w-full lg:max-w-[1440px] lg:mx-auto">
          
          {/* SKELETON LOADING STATE */}
          {loading && (
            <div className="p-6 space-y-6">
              <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="h-36 w-full bg-slate-200 rounded-2xl animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-40 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* CONNECTION ERROR STATE (WITH BEAUTIFUL GUIDANCE AND RETRY/DEMO ACTIONS) */}
          {!loading && error && (
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-[#0F172A] text-sm">Conectando ao Banco Supabase...</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Não encontramos as chaves de conexão nos segredos do seu workspace. A tabela <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono text-amber-700">supplier_products</code> não pôde ser lida.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl text-left border border-amber-200 space-y-2">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase block">Como resolver agora:</span>
                  <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-1.5 leading-relaxed font-semibold">
                    <li>Copie as credenciais públicas no seu projeto Supabase.</li>
                    <li>No painel do AI Studio, adicione como Segredos:
                      <ul className="list-disc list-inside pl-3 mt-1 space-y-0.5 text-slate-500 font-medium">
                        <li><code className="font-mono text-[10px]">NEXT_PUBLIC_SUPABASE_URL</code></li>
                        <li><code className="font-mono text-[10px]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code></li>
                      </ul>
                    </li>
                    <li>Atualize a página ou clique em Recarregar abaixo.</li>
                  </ol>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={loadData}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tentar Novamente</span>
                  </button>

                  <button
                    onClick={activateDemoMode}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Usar Modo Demo</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && products.length === 0 && (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs mx-auto">
                <h3 className="font-extrabold text-[#0F172A] text-sm">Nenhum produto cadastrado</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Conectamos com sucesso ao seu Supabase, porém a tabela <code className="bg-slate-100 px-1 rounded font-mono">supplier_products</code> não possui nenhum produto inserido no momento.
                </p>
              </div>
              <div className="flex flex-col space-y-2 pt-2 max-w-xs mx-auto">
                <button
                  onClick={activateDemoMode}
                  className="py-2.5 bg-green-50 hover:bg-green-100 text-[#007A3D] font-bold text-xs rounded-xl border border-green-200 transition-all cursor-pointer"
                >
                  Carregar produtos de simulação
                </button>
                <button
                  onClick={loadData}
                  className="py-2 bg-white text-[#64748B] hover:text-[#0F172A] text-xs font-bold transition-colors cursor-pointer"
                >
                  Atualizar Conexão
                </button>
              </div>
            </div>
          )}

          {/* MAIN TAB: INICIO */}
          {!loading && !error && products.length > 0 && activeTab === 'inicio' && (
            <div className="space-y-5 lg:space-y-7 lg:py-6 animate-in fade-in duration-300">
              
              {/* WELCOME BANNER SECTION */}
              <div className="px-6 pt-5 lg:pt-0 flex justify-between items-start">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-extrabold text-[#0F172A]">Olá, Bella Massa Pizzaria 👋</h2>
                  <p className="text-xs text-[#64748B] font-semibold">Compare preços e aumente sua margem de lucro.</p>
                </div>
                <button 
                  onClick={() => setProfileOpen(true)}
                  className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-[#007A3D] rounded-full text-xs font-extrabold border border-green-200 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Meu Perfil</span>
                </button>
              </div>

              {/* SEARCH BAR WITH BARCODE SCANNER */}
              <div className="px-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar produtos, fornecedores ou categorias..."
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#009B4E] rounded-2xl text-xs text-[#0F172A] font-semibold outline-none transition-all shadow-xs"
                  />
                  <button 
                    onClick={() => {
                      setScannerOpen(true);
                      setScanResult(null);
                    }}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#009B4E] transition-colors"
                    title="Escanear Código de Barras"
                  >
                    <Barcode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* BARCODE SCANNER MOCK OVERLAY */}
              {scannerOpen && (
                <div className="px-6">
                  <div className="p-4 bg-[#0F172A] text-white rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => setScannerOpen(false)} 
                      className="absolute top-3 right-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center space-x-2 text-[#009B4E] font-bold text-xs">
                      <Barcode className="w-4 h-4" />
                      <span>Leitor de Código Inteligente</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      Aponte a câmera do dispositivo para o código de barras da embalagem para buscar ofertas.
                    </p>
                    
                    {/* Simulated Camera Square */}
                    <div className="w-full h-24 bg-slate-900 rounded-xl relative flex items-center justify-center border border-[#009B4E]/30">
                      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#009B4E]"></div>
                      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#009B4E]"></div>
                      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#009B4E]"></div>
                      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#009B4E]"></div>
                      
                      {/* Laser Line */}
                      <div className="absolute left-4 right-4 h-0.5 bg-red-500 top-1/2 -translate-y-1/2 animate-pulse shadow-sm shadow-red-500"></div>
                      
                      <span className="text-[9px] font-bold text-slate-500 tracking-widest animate-pulse">PROCURANDO CÓDIGO...</span>
                    </div>

                    <div className="flex justify-between items-center pt-1.5">
                      <button 
                        type="button"
                        onClick={() => {
                          const randomProduct = products[Math.floor(Math.random() * products.length)];
                          setScanResult(randomProduct.name);
                          setSearchTerm(randomProduct.name);
                          alert(`Código reconhecido: ${randomProduct.name}`);
                          setScannerOpen(false);
                        }}
                        className="text-[11px] font-bold text-[#009B4E] bg-green-950/40 px-3 py-1.5 rounded-lg border border-green-900 hover:bg-green-900/40 transition-all cursor-pointer"
                      >
                        Simular Detecção de Código
                      </button>
                      <span className="text-[10px] text-slate-400">Suporte EAN-13</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SUPPLIER QUICK FILTER BADGES */}
              <div className="px-6 flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1.5">
                <button
                  onClick={() => setSelectedSupplier('todos')}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all border cursor-pointer
                    ${selectedSupplier === 'todos' 
                      ? 'bg-[#009B4E] text-white border-[#009B4E] shadow-sm' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  Todos Fornecedores
                </button>
                {uniqueSuppliers.map(sup => (
                  <button
                    key={sup}
                    onClick={() => setSelectedSupplier(sup)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all border cursor-pointer
                      ${selectedSupplier === sup 
                        ? 'bg-[#009B4E] text-white border-[#009B4E] shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    {sup}
                  </button>
                ))}
              </div>

              {/* BANNER OF OPPORTUNITY (BIGGEST DISCOUNT OR NEWEST) */}
              {opportunityProduct && (
                <div className="px-6">
                  <div className="bg-[#EBFBF2] border border-green-200 rounded-[24px] p-5 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-sm group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[120px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#009B4E] text-white text-[9px] font-extrabold uppercase tracking-wider shadow-xs animate-pulse">
                          <Percent className="w-2.5 h-2.5" />
                          <span>Maior Desconto</span>
                        </span>
                        <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#009B4E] transition-colors line-clamp-1">{opportunityProduct.name}</h3>
                        <p className="text-[11px] font-bold text-[#64748B] flex items-center">
                          <Building2 className="w-3.5 h-3.5 text-[#009B4E] mr-1" />
                          <span>Fornecido por: <b>{opportunityProduct.supplier}</b></span>
                        </p>
                      </div>

                      {/* Product image */}
                      <div className="w-16 h-16 rounded-xl bg-white p-1.5 border border-green-100 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                        {opportunityProduct.image_url ? (
                          <img src={opportunityProduct.image_url} alt={opportunityProduct.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-green-500/10">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-base font-extrabold text-[#007A3D]">{formatBRL(opportunityProduct.price_brl)}</span>
                        {opportunityProduct.real_price_brl && opportunityProduct.real_price_brl > opportunityProduct.price_brl && (
                          <span className="text-xs text-slate-400 line-through font-medium">{formatBRL(opportunityProduct.real_price_brl)}</span>
                        )}
                      </div>

                      {getDiscountPercent(opportunityProduct) > 0 && (
                        <span className="text-xs font-black text-[#007A3D] bg-green-100 px-2 py-1 rounded-lg">
                          {getDiscountPercent(opportunityProduct)}% OFF
                        </span>
                      )}

                      <button 
                        onClick={() => setSelectedProduct(opportunityProduct)}
                        className="px-4 py-2 bg-[#009B4E] hover:bg-[#007A3D] text-white text-[11px] font-extrabold rounded-xl transition-all shadow-md shadow-green-500/10 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Ver oferta</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUPPLIERS DYNAMIC OFFERS SECTION */}
              <div className="space-y-4">
                <div className="px-6 flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                    <Sparkles className="w-4 h-4 text-[#009B4E] mr-1.5" />
                    Ofertas dos seus fornecedores
                  </h3>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase">{uniqueSuppliers.length} Fornecedores</span>
                </div>

                <div className="px-6 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
                  {uniqueSuppliers.map(supName => {
                    const sProducts = productsBySupplier[supName]?.slice(0, 3) || [];
                    if (sProducts.length === 0) return null;

                    return (
                      <div key={supName} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-3 hover:border-green-100 hover:shadow-md transition-all duration-300">
                        {/* Supplier Info header */}
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <div>
                            <h4 className="font-extrabold text-xs text-[#0F172A]">{supName}</h4>
                            <div className="flex items-center space-x-1.5 text-[10px] text-[#64748B] font-bold mt-0.5">
                              <span className="flex items-center text-[#007A3D]">
                                <Clock className="w-3 h-3 mr-0.5" />
                                Entrega • 24h
                              </span>
                              <span>•</span>
                              <span className="flex items-center text-amber-500">
                                <Star className="w-3 h-3 mr-0.5 fill-current" />
                                4.8
                              </span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                              setSelectedSupplier(supName);
                              setActiveTab('comparar');
                            }}
                            className="text-[10px] font-extrabold text-[#009B4E] hover:text-[#007A3D] transition-colors"
                          >
                            Ver todas as ofertas
                          </button>
                        </div>

                        {/* Products list (max 3) */}
                        <div className="space-y-2.5">
                          {sProducts.map(prod => (
                            <div 
                              key={prod.product_key} 
                              onClick={() => setSelectedProduct(prod)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-50 p-1 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {prod.image_url ? (
                                    <img src={prod.image_url} alt={prod.name} className="w-full h-full object-contain" />
                                  ) : (
                                    <ShoppingBag className="w-5 h-5 text-slate-400" />
                                  )}
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#009B4E] transition-colors">{prod.name}</span>
                                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">{prod.category_name} • {prod.unit_type || 'un'}</span>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0 pl-2">
                                <span className="text-[11px] font-black text-[#007A3D] block">{formatBRL(prod.price_brl)}</span>
                                {getDiscountPercent(prod) > 0 && (
                                  <span className="text-[9px] font-extrabold bg-green-50 text-[#007A3D] px-1 py-0.5 rounded border border-green-100 inline-block mt-0.5">
                                    {getDiscountPercent(prod)}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: FORNECEDORES QUE VOCÊ MAIS COMPRA */}
              <div className="space-y-3">
                <div className="px-6 flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-[#0F172A]">Fornecedores que você mais compra</h3>
                  <span className="text-[10px] font-bold text-[#009B4E] cursor-pointer" onClick={() => setActiveTab('fornecedores')}>Ver todos</span>
                </div>

                <div className="px-6 flex items-center space-x-3.5 overflow-x-auto scrollbar-none pb-2">
                  {uniqueSuppliers.map(sup => {
                    const count = productsBySupplier[sup]?.length || 0;
                    return (
                      <div 
                        key={sup} 
                        onClick={() => { setSelectedSupplier(sup); setActiveTab('comparar'); }}
                        className="bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-200 p-3.5 rounded-2xl flex items-center space-x-3 flex-shrink-0 cursor-pointer min-w-[210px] transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-100 text-[#007A3D] border border-green-200 flex items-center justify-center font-black text-xs shadow-xs group-hover:scale-105 transition-transform">
                          {getInitials(sup)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-xs text-[#0F172A] group-hover:text-[#007A3D] transition-colors">{sup}</h4>
                          <span className="text-[10px] font-bold text-[#64748B] block mt-0.5">{count} produtos disponíveis</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TIMELINE DE OPORTUNIDADES */}
              <div className="space-y-3 px-6">
                <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center">
                  <TrendingUp className="w-4 h-4 text-[#009B4E] mr-1.5" />
                  Timeline de Oportunidades
                </h3>

                <div className="space-y-3 border-l-2 border-[#E2E8F0] pl-4 ml-2.5 py-1">
                  {timelineEvents.map((evt, index) => (
                    <div key={index} className="relative space-y-1">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${evt.type === 'discount' ? 'bg-red-500 shadow-sm shadow-red-500/20' : 'bg-[#009B4E]'}`}></div>
                      
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-extrabold text-[#0F172A]">{evt.title}</span>
                        <span className="text-[9px] text-[#64748B] font-bold">{evt.date}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-relaxed font-medium">{evt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: COMPARAR */}
          {!loading && !error && products.length > 0 && activeTab === 'comparar' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center">
                  <TrendingUp className="w-5 h-5 text-[#009B4E] mr-1.5" />
                  Comparador de Fornecedores
                </h2>
                <p className="text-xs text-[#64748B] font-medium">Selecione filtros e compare preços de insumos em tempo real.</p>
              </div>

              {/* Dynamic Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar por nome de produto ou fornecedor..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-[#0F172A] font-semibold focus:border-[#009B4E]"
                />
              </div>

              {/* Products Table/List */}
              <div className="space-y-3.5">
                {filteredProducts.map(prod => {
                  const percent = getDiscountPercent(prod);
                  return (
                    <div key={prod.product_key} className="bg-white border border-[#E2E8F0] hover:border-green-100 hover:shadow-md rounded-2xl p-4 transition-all space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-block text-[9px] font-extrabold bg-[#EBFBF2] text-[#007A3D] px-2 py-0.5 rounded mb-1">{prod.category_name || 'Geral'}</span>
                          <h4 className="font-extrabold text-xs text-[#0F172A]">{prod.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{prod.unit_type || 'Unidade'} • {prod.supplier}</span>
                        </div>

                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {prod.image_url ? (
                            <img src={prod.image_url} alt={prod.name} className="w-full h-full object-contain" />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm font-black text-[#007A3D]">{formatBRL(prod.price_brl)}</span>
                          {prod.real_price_brl && prod.real_price_brl > prod.price_brl && (
                            <span className="text-xs text-slate-400 line-through font-medium">{formatBRL(prod.real_price_brl)}</span>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {percent > 0 && (
                            <span className="text-[10px] font-black text-[#007A3D] bg-green-100 px-2 py-1 rounded-lg">
                              {percent}% OFF
                            </span>
                          )}
                          <button
                            onClick={() => addToShoppingList(prod, 1)}
                            className="p-1.5 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-lg shadow-sm transition-colors cursor-pointer"
                            title="Adicionar à lista"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => setSelectedProduct(prod)}
                            className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-xs text-[#64748B] font-bold">Nenhum produto atende aos filtros de pesquisa.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: LISTA */}
          {!loading && !error && activeTab === 'lista' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center">
                  <ShoppingCart className="w-5 h-5 text-[#009B4E] mr-1.5" />
                  Minha Lista Inteligente
                </h2>
                <p className="text-xs text-[#64748B] font-medium">Organize e simule sua economia fechando pedidos consolidados.</p>
              </div>

              {shoppingList.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3 max-w-sm mx-auto">
                  <ShoppingCart className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[#0F172A]">Sua lista está vazia</h4>
                    <p className="text-[11px] text-[#64748B] leading-relaxed font-semibold">Consulte as ofertas dos fornecedores e adicione itens para começar a economizar.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inicio')}
                    className="mt-2 px-4 py-2 bg-[#009B4E] hover:bg-[#007A3D] text-white font-bold text-xs rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-green-500/10 cursor-pointer"
                  >
                    Explorar Ofertas
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Economics indicators */}
                  <div className="p-4 bg-[#EBFBF2] border border-green-200 rounded-2xl space-y-2.5 shadow-xs">
                    <span className="text-[10px] font-extrabold text-[#007A3D] uppercase tracking-wider block">Análise de Economia Real</span>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                      <div>
                        <span className="text-[10px] text-[#64748B] block font-semibold mb-0.5">Preço de Mercado:</span>
                        <span className="line-through text-slate-400 text-sm">{formatBRL(listOriginalTotal)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#007A3D] block font-semibold mb-0.5">Preço Inteligente:</span>
                        <span className="text-lg text-[#009B4E] font-black">{formatBRL(listTotal)}</span>
                      </div>
                    </div>

                    <div className="border-t border-green-500/10 pt-2.5 flex justify-between items-center text-xs font-black text-[#007A3D]">
                      <span>Economia Consolidada:</span>
                      <span className="bg-green-100 text-[#007A3D] px-2.5 py-0.5 rounded-lg border border-green-200">
                        -{formatBRL(listSavings)} ({Math.round((listSavings / listOriginalTotal) * 100)}% OFF)
                      </span>
                    </div>
                  </div>

                  {/* List of items */}
                  <div className="space-y-2.5">
                    {shoppingList.map(item => (
                      <div key={item.product.product_key} className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between hover:shadow-xs transition-shadow">
                        <div className="flex items-center space-x-3 max-w-[55%]">
                          <div className="w-8 h-8 bg-slate-50 p-1 rounded border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.product.image_url ? (
                              <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#0F172A] truncate block">{item.product.name}</h4>
                            <span className="text-[9px] text-[#64748B] font-bold block">{item.product.supplier} • {formatBRL(item.product.price_brl)}/un</span>
                          </div>
                        </div>

                        {/* Interactive Quantity controllers */}
                        <div className="flex items-center space-x-2.5">
                          <div className="flex items-center space-x-1 border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                            <button
                              onClick={() => updateListQty(item.product.product_key, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-extrabold px-1.5 text-[#0F172A]">{item.quantity}</span>
                            <button
                              onClick={() => updateListQty(item.product.product_key, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-500 hover:bg-slate-200 rounded font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromList(item.product.product_key)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout simulator buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        alert(`Compra concluída com sucesso! ${shoppingList.length} itens cotados de forma inteligente. Economia total enviada ao faturamento: R$ ${listSavings.toFixed(2)}.`);
                        setShoppingList([]);
                      }}
                      className="w-full bg-[#009B4E] hover:bg-[#007A3D] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-green-500/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Fechar Pedidos Consolidados</span>
                    </button>

                    <button
                      onClick={() => setShoppingList([])}
                      className="w-full text-center py-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      Limpar Lista Completa
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB: HISTORICO */}
          {!loading && !error && activeTab === 'historico' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center">
                  <History className="w-5 h-5 text-[#009B4E] mr-1.5" />
                  Histórico de Pedidos B2B
                </h2>
                <p className="text-xs text-[#64748B] font-medium">Veja o faturamento das suas cotações e economias registradas.</p>
              </div>

              <div className="space-y-3">
                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#009B4E] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Faturado</span>
                      <h4 className="font-extrabold text-xs text-[#0F172A] mt-1.5">Cotação #9384-2026</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">25 de Junho, 2026 • 8 itens</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#0F172A] block">{formatBRL(480.20)}</span>
                      <span className="text-[9px] font-bold text-[#007A3D] block mt-0.5">Economia: R$ 134,50</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#64748B] border-t border-slate-100 pt-2.5 font-bold">
                    <span>Fornecedores: Assai, Muffato</span>
                    <button className="text-[#009B4E] hover:underline" onClick={() => alert('PDF da cotação faturada exportado para o e-mail: ' + user.email)}>Reenviar PDF</button>
                  </div>
                </div>

                <div className="bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-xs space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#009B4E] bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Faturado</span>
                      <h4 className="font-extrabold text-xs text-[#0F172A] mt-1.5">Cotação #9172-2026</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">18 de Junho, 2026 • 5 itens</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-[#0F172A] block">{formatBRL(350.00)}</span>
                      <span className="text-[9px] font-bold text-[#007A3D] block mt-0.5">Economia: R$ 82,90</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#64748B] border-t border-slate-100 pt-2.5 font-bold">
                    <span>Fornecedores: Atacadão, Condor</span>
                    <button className="text-[#009B4E] hover:underline" onClick={() => alert('PDF da cotação faturada exportado para o e-mail: ' + user.email)}>Reenviar PDF</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FORNECEDORES DIRECTORY */}
          {!loading && !error && activeTab === 'fornecedores' && (
            <div className="p-6 space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center">
                  <Users className="w-5 h-5 text-[#009B4E] mr-1.5" />
                  Diretório de Fornecedores Ativos
                </h2>
                <p className="text-xs text-[#64748B] font-medium">Veja informações de contato e áreas de atuação de atacadistas.</p>
              </div>

              <div className="space-y-3">
                {uniqueSuppliers.map(sup => (
                  <div key={sup} className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-[#007A3D] border border-green-200 flex items-center justify-center font-black text-xs">
                        {getInitials(sup)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-[#0F172A]">{sup}</h4>
                        <span className="text-[10px] text-[#007A3D] font-bold flex items-center mt-0.5">
                          <MapPin className="w-3.5 h-3.5 mr-0.5" />
                          Entrega expressa ativa no seu CEP
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-[#64748B] border-t border-slate-100 pt-3">
                      <div>
                        <span>Tempo de Entrega:</span>
                        <span className="text-[#0F172A] block mt-0.5">24 horas úteis</span>
                      </div>
                      <div>
                        <span>Status de Integração:</span>
                        <span className="text-[#009B4E] block mt-0.5">● Conexão Online</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setSelectedSupplier(sup); setActiveTab('comparar'); }}
                      className="w-full py-2 bg-slate-50 hover:bg-green-50 hover:text-[#007A3D] border border-slate-200 rounded-xl text-[11px] font-extrabold text-slate-700 text-center transition-all cursor-pointer"
                    >
                      Filtrar Ofertas deste Fornecedor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION TAB BAR */}
        <div id="pwa_bottom_nav" className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] h-20 px-4 flex lg:hidden items-center justify-around z-30 shadow-2xl md:rounded-b-[32px]">
          
          <button 
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold transition-all cursor-pointer
              ${activeTab === 'inicio' ? 'text-[#009B4E]' : 'text-slate-400 hover:text-[#0F172A]'}`}
          >
            <Grid className="w-5 h-5" />
            <span>Início</span>
          </button>

          <button 
            onClick={() => setActiveTab('comparar')}
            className={`flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold transition-all cursor-pointer
              ${activeTab === 'comparar' ? 'text-[#009B4E]' : 'text-slate-400 hover:text-[#0F172A]'}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Comparar</span>
          </button>

          {/* HIGHLIGHTED CIRCULAR ADD BUTTON */}
          <button 
            onClick={() => setActiveTab('lista')}
            className="w-14 h-14 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transform -translate-y-4 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
            title="Minha Lista Inteligente"
          >
            <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
            {shoppingList.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5.5 h-5.5 bg-red-500 rounded-full text-[9px] font-black text-white border-2 border-white flex items-center justify-center animate-bounce">
                {shoppingList.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('historico')}
            className={`flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold transition-all cursor-pointer
              ${activeTab === 'historico' ? 'text-[#009B4E]' : 'text-slate-400 hover:text-[#0F172A]'}`}
          >
            <History className="w-5 h-5" />
            <span>Histórico</span>
          </button>

          <button 
            onClick={() => setActiveTab('fornecedores')}
            className={`flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold transition-all cursor-pointer
              ${activeTab === 'fornecedores' ? 'text-[#009B4E]' : 'text-slate-400 hover:text-[#0F172A]'}`}
          >
            <Users className="w-5 h-5" />
            <span>Empresas</span>
          </button>

        </div>

        {/* DETAILED MODAL: PRODUCT DETAILS */}
        {selectedProduct && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center p-4">
            <div className="w-full bg-white rounded-t-[32px] p-6 shadow-2xl relative space-y-4 animate-in slide-in-from-bottom duration-300 max-h-[85%] overflow-y-auto">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tag Category */}
              <span className="inline-block text-[10px] font-extrabold bg-[#EBFBF2] text-[#007A3D] px-2.5 py-1 rounded-full uppercase tracking-widest">
                {selectedProduct.category_name || 'Geral'}
              </span>

              {/* Product Big Image */}
              <div className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 overflow-hidden relative shadow-xs">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <ShoppingBag className="w-16 h-16 text-slate-300" />
                )}

                {getDiscountPercent(selectedProduct) > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                    {getDiscountPercent(selectedProduct)}% OFF
                  </span>
                )}
              </div>

              {/* Title & Supplier info */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-[#0F172A] leading-tight">{selectedProduct.name}</h3>
                <p className="text-xs text-[#64748B] font-semibold leading-relaxed">
                  {selectedProduct.description || 'Nenhuma descrição adicional foi fornecida pelo fornecedor para este produto.'}
                </p>
                <div className="flex items-center space-x-1 text-xs text-[#007A3D] font-bold pt-1">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span>Fornecedor: <b>{selectedProduct.supplier}</b></span>
                </div>
              </div>

              {/* Price & stock grid details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs font-bold text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Preço Unitário:</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-black text-[#007A3D]">{formatBRL(selectedProduct.price_brl)}</span>
                    {selectedProduct.real_price_brl && selectedProduct.real_price_brl > selectedProduct.price_brl && (
                      <span className="text-xs text-slate-400 line-through font-medium">{formatBRL(selectedProduct.real_price_brl)}</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold mb-0.5">Disponibilidade:</span>
                  <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${selectedProduct.in_stock !== false ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {selectedProduct.in_stock !== false ? `Em estoque (${selectedProduct.stock || 20})` : 'Esgotado'}
                  </span>
                </div>

                <div className="col-span-2 border-t border-slate-200 pt-2.5 flex justify-between items-center text-[10px] text-[#64748B] font-bold">
                  <span>Embalagem: {selectedProduct.unit_type || 'Unidade'}</span>
                  <span>Coleta: {selectedProduct.captured_at ? new Date(selectedProduct.captured_at).toLocaleDateString('pt-BR') : 'Recente'}</span>
                </div>
              </div>

              {/* Action add Button */}
              <button
                onClick={() => {
                  addToShoppingList(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
                className="w-full bg-[#009B4E] hover:bg-[#007A3D] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-green-500/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Adicionar à lista de compras</span>
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
