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
  Grid,
  History,
  FileText,
  Barcode,
  Menu,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Upload,
  Image,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  FileSpreadsheet
} from 'lucide-react';
import { UserSession } from '../services/auth';
import { 
  demoSupplierProducts, 
  fetchProducts, 
  searchProducts, 
  ShoppingListItem, 
  compareShoppingList 
} from '../services/supabaseData';
import { SupplierProduct } from './MainDashboard';

interface CompararScreenProps {
  user: UserSession;
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateTab: (tab: 'inicio' | 'comparar' | 'lista' | 'historico' | 'fornecedores') => void;
}

export function CompararScreen({ user, onLogout, onNavigateHome, onNavigateTab }: CompararScreenProps) {
  // Data State
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shopping list state
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);
  
  // Sidebar / Drawer navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'digitar' | 'colar' | 'imagem' | 'upload'>('digitar');

  // Input states inside drawer
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [manualItemName, setManualItemName] = useState('');
  const [manualItemUnit, setManualItemUnit] = useState('Unidade');
  const [manualItemQty, setManualItemQty] = useState(1);
  const [textListToParse, setTextListToParse] = useState('');
  const [simulatedImageFile, setSimulatedImageFile] = useState<File | null>(null);
  const [simulatedImageName, setSimulatedImageName] = useState('');
  const [simulatedExcelFile, setSimulatedExcelFile] = useState<File | null>(null);
  const [simulatedExcelName, setSimulatedExcelName] = useState('');
  
  // Simulation loading states inside drawer
  const [isProcessingDrawer, setIsProcessingDrawer] = useState(false);
  const [drawerNotification, setDrawerNotification] = useState<string | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load products from Supabase/Demo Database on mount
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
        
        // Initialize with default list items for immediate gorgeous comparison as requested
        const initialItems: ShoppingListItem[] = [
          {
            id: 'init-1',
            name: 'Farinha de Trigo Especial Tipo 1',
            quantity: 3,
            unit_type: 'Saco 25kg',
            image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'init-2',
            name: 'Queijo Mussarela Fatiado Lactis',
            quantity: 2,
            unit_type: 'Peça ~3.5kg',
            image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'init-3',
            name: 'Óleo de Soja Especial Cocamar',
            quantity: 5,
            unit_type: 'Caixa c/ 20 un',
            image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200'
          }
        ];
        setListItems(initialItems);
      } catch (err: any) {
        setError('Ocorreu um erro ao buscar os produtos da tabela.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Show Toast Feedback
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper formatting currency
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Dynamic calculations
  // Get all unique suppliers present in products
  const uniqueSuppliers = Array.from(new Set(products.map(p => p.supplier))).filter(Boolean);

  // Grouped results per supplier for current items
  const supplierCalculations = uniqueSuppliers.map(supplierName => {
    let totalCost = 0;
    let foundCount = 0;
    
    const items = listItems.map(listItem => {
      // Try to find exact or partial match in this supplier's products
      const match = products.find(p => 
        p.supplier === supplierName && 
        p.name.toLowerCase().trim() === listItem.name.toLowerCase().trim()
      );

      if (match) {
        totalCost += match.price_brl * listItem.quantity;
        foundCount++;
        return {
          id: listItem.id,
          name: listItem.name,
          quantity: listItem.quantity,
          unitPrice: match.price_brl,
          totalPrice: match.price_brl * listItem.quantity,
          found: true
        };
      }
      return {
        id: listItem.id,
        name: listItem.name,
        quantity: listItem.quantity,
        unitPrice: 0,
        totalPrice: 0,
        found: false
      };
    });

    return {
      supplierName,
      totalCost,
      foundCount,
      allItemsCount: listItems.length,
      items
    };
  });

  // Filter out suppliers with no matched items to avoid visual clutter
  const validSupplierCalculations = supplierCalculations.filter(calc => calc.totalCost > 0);

  // Sort suppliers to find the best (lowest total cost)
  const bestSupplierCalc = [...validSupplierCalculations]
    .sort((a, b) => a.totalCost - b.totalCost)[0] || null;

  // Worst supplier to calculate maximum savings
  const worstSupplierCalc = [...validSupplierCalculations]
    .sort((a, b) => b.totalCost - a.totalCost)[0] || null;

  const maxSavings = (worstSupplierCalc && bestSupplierCalc && worstSupplierCalc !== bestSupplierCalc)
    ? worstSupplierCalc.totalCost - bestSupplierCalc.totalCost
    : 0;

  // Global filtered products for drawer search input
  const searchedProductsForDrawer = searchProductQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchProductQuery.toLowerCase()))
    : [];

  // Remove duplicates by name to show search suggestions clearly in drawer
  const uniqueSearchedProducts = Array.from(new Set(searchedProductsForDrawer.map(p => p.name)))
    .map(name => searchedProductsForDrawer.find(p => p.name === name))
    .filter((p): p is SupplierProduct => p !== undefined)
    .slice(0, 5);

  // Add Item to Shopping List
  const handleAddProductToList = (prod: SupplierProduct) => {
    // Check if product is already in list
    const existing = listItems.find(item => item.name.toLowerCase().trim() === prod.name.toLowerCase().trim());
    if (existing) {
      setListItems(listItems.map(item => 
        item.name.toLowerCase().trim() === prod.name.toLowerCase().trim()
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      triggerToast(`Qtd de "${prod.name}" aumentada!`);
    } else {
      const newItem: ShoppingListItem = {
        id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        name: prod.name,
        quantity: 1,
        unit_type: prod.unit_type || 'Unidade',
        image_url: prod.image_url
      };
      setListItems([...listItems, newItem]);
      triggerToast(`"${prod.name}" adicionado à lista!`);
    }
    setSearchProductQuery('');
  };

  // Add Manual Custom Item
  const handleAddManualItem = () => {
    if (!manualItemName.trim()) {
      alert('Por favor digite o nome do produto.');
      return;
    }
    const newItem: ShoppingListItem = {
      id: 'item-manual-' + Date.now(),
      name: manualItemName,
      quantity: manualItemQty,
      unit_type: manualItemUnit,
      isManual: true
    };
    setListItems([...listItems, newItem]);
    triggerToast(`"${manualItemName}" adicionado manualmente!`);
    setManualItemName('');
    setManualItemQty(1);
  };

  // Update Item Quantity
  const handleUpdateQuantity = (itemId: string, change: number) => {
    setListItems(listItems.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Remove Item from List
  const handleRemoveItem = (itemId: string, name: string) => {
    setListItems(listItems.filter(item => item.id !== itemId));
    triggerToast(`"${name}" removido da comparação.`);
  };

  // Reset comparison list
  const handleClearList = () => {
    setListItems([]);
    triggerToast('Lista limpa com sucesso. Adicione novos itens!');
    setDrawerActiveTab('digitar');
    setDrawerOpen(true);
  };

  // Save list simulation
  const handleSaveList = () => {
    if (listItems.length === 0) {
      alert('Sua lista está vazia. Adicione itens antes de salvar!');
      return;
    }
    triggerToast('✓ Lista salva com sucesso na sua conta Bella Massa!');
  };

  // Text list parser logic
  const handleInterpretTextList = () => {
    if (!textListToParse.trim()) {
      alert('Digite ou cole algo para interpretar.');
      return;
    }

    setIsProcessingDrawer(true);
    setDrawerNotification('Analisando seu texto e cruzando com o banco de ofertas...');

    setTimeout(() => {
      const lines = textListToParse.split('\n').filter(line => line.trim().length > 0);
      const parsedItems: ShoppingListItem[] = [];

      lines.forEach((line, index) => {
        // Simple regex or keyword parser: Ex: "Arroz 5kg - 2 unidades" or "Farinha 3"
        const cleanLine = line.trim();
        
        // Try to guess quantity from numbers at the start or end of the string
        let quantity = 1;
        const numberMatch = cleanLine.match(/^(\d+)\s+x?\s+(.+)/i) || cleanLine.match(/(.+?)\s*[-x,;]?\s*(\d+)\s*(unidades|un|kg|sc|saco|g)?$/i);
        let guessedName = cleanLine;

        if (numberMatch) {
          if (numberMatch[1] && !isNaN(Number(numberMatch[1])) && cleanLine.startsWith(numberMatch[1])) {
            quantity = Number(numberMatch[1]);
            guessedName = numberMatch[2];
          } else if (numberMatch[2] && !isNaN(Number(numberMatch[2]))) {
            quantity = Number(numberMatch[2]);
            guessedName = numberMatch[1];
          }
        }

        // Search in products list for name similarity
        const foundProduct = products.find(p => 
          p.name.toLowerCase().includes(guessedName.toLowerCase().trim()) ||
          guessedName.toLowerCase().trim().includes(p.name.toLowerCase())
        );

        parsedItems.push({
          id: `parsed-${index}-${Date.now()}`,
          name: foundProduct ? foundProduct.name : guessedName.trim(),
          quantity,
          unit_type: foundProduct ? (foundProduct.unit_type || 'Unidade') : 'Unidade',
          image_url: foundProduct?.image_url,
          isManual: !foundProduct
        });
      });

      setListItems([...listItems, ...parsedItems]);
      setIsProcessingDrawer(false);
      setDrawerNotification(null);
      setTextListToParse('');
      setDrawerOpen(false);
      triggerToast(`✓ Importados ${parsedItems.length} itens com sucesso!`);
    }, 1500);
  };

  // Simulated Image File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSimulatedImageFile(file);
      setSimulatedImageName(file.name);
      
      setIsProcessingDrawer(true);
      setDrawerNotification('Lendo imagem da lista e aplicando algoritmo OCR inteligente...');

      setTimeout(() => {
        // Add parsed elements
        const imageExtractedItems: ShoppingListItem[] = [
          {
            id: 'img-ext-1',
            name: 'Leite Condensado Piracanjuba Moça',
            quantity: 10,
            unit_type: 'Caixa c/ 27 un',
            image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'img-ext-2',
            name: 'Molho de Tomate Sachê Val',
            quantity: 12,
            unit_type: 'Caixa c/ 24 un',
            image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=200'
          }
        ];

        setListItems([...listItems, ...imageExtractedItems]);
        setIsProcessingDrawer(false);
        setDrawerNotification(null);
        setSimulatedImageFile(null);
        setSimulatedImageName('');
        setDrawerOpen(false);
        triggerToast('✓ OCR Inteligente: 2 novos itens extraídos da imagem!');
      }, 2000);
    }
  };

  // Simulated Excel File Upload
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSimulatedExcelFile(file);
      setSimulatedExcelName(file.name);

      setIsProcessingDrawer(true);
      setDrawerNotification('Importando planilha de cotação e mapeando colunas...');

      setTimeout(() => {
        const excelExtractedItems: ShoppingListItem[] = [
          {
            id: 'xls-ext-1',
            name: 'Café Tradicional Vácuo Melitta',
            quantity: 4,
            unit_type: 'Fardo 10x500g',
            image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200'
          },
          {
            id: 'xls-ext-2',
            name: 'Açúcar Refinado Alto Alegre',
            quantity: 8,
            unit_type: 'Fardo 10x1kg',
            image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200'
          }
        ];

        setListItems([...listItems, ...excelExtractedItems]);
        setIsProcessingDrawer(false);
        setDrawerNotification(null);
        setSimulatedExcelFile(null);
        setSimulatedExcelName('');
        setDrawerOpen(false);
        triggerToast('✓ Planilha de cotação importada com sucesso!');
      }, 1500);
    }
  };

  // Global Search filters table rows
  const filteredListItems = listItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="compare_dashboard_root" className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-[#0F172A] relative overflow-hidden select-none">
      
      {/* GLOBAL TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#009B4E] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. SIDEBAR LATERAL (DESKTOP) */}
      <aside id="desktop_sidebar" className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8F0] p-6 justify-between flex-shrink-0">
        <div className="space-y-6">
          
          {/* Logo Compra Inteligente */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#009B4E] text-white shadow-md shadow-green-500/10">
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M5.4 5H21L19 13H7M5.4 5L7 13M7 13L5.5 19H19M7 17H17" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 17.5C17 18.3284 16.3284 19 15.5 19C14.6716 19 14 18.3284 14 17.5C14 16.6716 14.6716 16 15.5 16C16.3284 16 17 16.6716 17 17.5Z" fill="currentColor"/>
                <path d="M9 17.5C9 18.3284 8.32843 19 7.5 19C6.67157 19 6 18.3284 6 17.5C6 16.6716 6.67157 16 7.5 16C8.32843 16 9 16.6716 9 17.5Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#0F172A] tracking-tight">Compra</span>
              <span className="font-extrabold text-sm text-[#009B4E] tracking-tight"> Inteligente</span>
              <div className="text-[9px] font-extrabold text-slate-400 mt-[-2px] tracking-widest uppercase">Plataforma B2B</div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button 
              onClick={onNavigateHome}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <Grid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button 
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold bg-green-50 text-[#009B4E] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Listas de Compras</span>
            </button>

            <button 
              onClick={() => onNavigateTab('comparar')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Comparativos</span>
            </button>

            <button 
              onClick={() => onNavigateTab('fornecedores')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Fornecedores</span>
            </button>

            <button 
              onClick={() => onNavigateTab('historico')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
            </button>

            <button 
              onClick={() => triggerToast('Acessando relatórios inteligentes...')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Relatórios</span>
            </button>

            <button 
              onClick={() => triggerToast('Seus produtos favoritos')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <Star className="w-4 h-4" />
              <span>Favoritos</span>
            </button>

            <button 
              onClick={() => triggerToast('Gerenciar Alertas de Preço')}
              className="w-full text-left px-4 py-3 rounded-xl text-xs font-extrabold text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A] transition-all flex items-center space-x-3 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Alertas de Preço</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Savings Indicator Card */}
        <div id="sidebar_indicator_card" className="p-4 bg-gradient-to-br from-[#EBFBF2] to-white border border-[#009B4E]/15 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 opacity-15 text-[#009B4E] transform rotate-12">
            <TrendingUp className="w-20 h-20" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] font-black bg-green-100 text-[#007A3D] px-2 py-0.5 rounded-full uppercase tracking-wider">Desempenho</span>
            <p className="font-extrabold text-[11px] text-[#0F172A] leading-tight">Economia que se vê, lucro que cresce!</p>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] text-[#64748B] font-bold">Você já economizou</p>
            <p className="text-xl font-black text-[#009B4E] tracking-tight">{formatBRL(4892.50)}</p>
            <p className="text-[9px] text-[#64748B] font-semibold">este mês</p>
          </div>
          
          {/* Micro SVG Graph illustration */}
          <div className="h-10 w-full flex items-end space-x-1.5 pt-1">
            <div className="w-full bg-green-100 rounded-sm h-3"></div>
            <div className="w-full bg-green-100 rounded-sm h-5"></div>
            <div className="w-full bg-green-200 rounded-sm h-4"></div>
            <div className="w-full bg-green-300 rounded-sm h-7"></div>
            <div className="w-full bg-[#009B4E] rounded-sm h-9 animate-pulse"></div>
          </div>
        </div>

      </aside>

      {/* MOBILE HEADER FOR SIDEBAR DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex md:hidden animate-in fade-in duration-200">
          <div className="w-3/4 max-w-[280px] bg-white h-full p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="font-black text-xs text-[#0F172A] uppercase tracking-wider">Navegação B2B</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5 text-[#0F172A]" />
                </button>
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => { onNavigateHome(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-3"
                >
                  <Grid className="w-4 h-4" />
                  <span>Início</span>
                </button>
                <button 
                  onClick={() => { setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold bg-green-50 text-[#009B4E] flex items-center space-x-3"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Listas de Compras</span>
                </button>
                <button 
                  onClick={() => { onNavigateTab('comparar'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-3"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Comparativos</span>
                </button>
                <button 
                  onClick={() => { onNavigateTab('fornecedores'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-3"
                >
                  <Users className="w-4 h-4" />
                  <span>Empresas Fornecedoras</span>
                </button>
                <button 
                  onClick={() => { onNavigateTab('historico'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-3"
                >
                  <History className="w-4 h-4" />
                  <span>Histórico de Cotações</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              className="w-full py-3 bg-red-50 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* CORE MAIN AREA */}
      <main id="core_main_panel" className="flex-1 flex flex-col min-h-screen relative overflow-y-auto pb-32">
        
        {/* 2. TOPBAR */}
        <header className="bg-white border-b border-[#E2E8F0] h-16 px-4 md:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          
          {/* Menu / Search area */}
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-700 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            {/* Global Search box */}
            <div className="relative w-full max-w-sm hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar produto na lista..."
                className="w-full pl-9 pr-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0]/80 focus:bg-white border border-transparent focus:border-[#009B4E] rounded-xl text-xs text-[#0F172A] font-semibold outline-none transition-all"
              />
            </div>
          </div>

          {/* User info, actions and indicators */}
          <div className="flex items-center space-x-4">
            
            {/* Help Icon */}
            <button 
              onClick={() => alert('Dica: Adicione produtos reais do Supabase na lista e compare as cotações consolidadas em tempo real!')}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              title="Ajuda e Suporte"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Notifications with badge 3 */}
            <button 
              onClick={() => triggerToast('Você possui 3 notificações pendentes de queda de preços.')}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-all relative cursor-pointer"
              title="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {/* User Profile Avatar Block */}
            <div className="flex items-center space-x-2.5 border-l pl-4 border-[#E2E8F0]">
              <div className="w-9 h-9 rounded-xl bg-green-100 text-[#009B4E] flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                BM
              </div>
              <div className="hidden lg:block text-left">
                <h4 className="font-extrabold text-xs text-[#0F172A] leading-tight">Bella Massa Pizzaria</h4>
                <p className="text-[10px] text-[#64748B] font-bold">Rafael Moreira</p>
              </div>
            </div>

          </div>
        </header>

        {/* PAGE BODY AREA */}
        <div className="p-4 md:p-8 space-y-6">

          {/* 3. CABEÇALHO DA PÁGINA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-[10px] text-[#64748B] font-black uppercase tracking-wider">
                <span>Listas de Compras</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#009B4E]">Comparar Lista</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight leading-tight">
                Comparar Lista de Compras
              </h1>
              <p className="text-xs text-[#64748B] font-semibold leading-normal">
                Veja os melhores preços entre fornecedores e economize mais.
              </p>
            </div>

            {/* Buttons row */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearList}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-[#E2E8F0] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Nova comparação
              </button>

              <button
                onClick={handleSaveList}
                className="px-4 py-2 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-green-500/10 flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Salvar lista</span>
              </button>
            </div>
          </div>

          {/* 4. CARDS DE ENTRADA DA LISTA */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            
            {/* Nova Lista base */}
            <div 
              onClick={() => { setDrawerActiveTab('digitar'); setDrawerOpen(true); }}
              className="p-4 bg-gradient-to-br from-[#009B4E] to-[#007A3D] text-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between h-32"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs">Adicionar lista</h3>
                <p className="text-[10px] text-green-100 font-semibold leading-normal mt-0.5">Criar um novo comparador</p>
              </div>
            </div>

            {/* Digitar Itens */}
            <div 
              onClick={() => { setDrawerActiveTab('digitar'); setDrawerOpen(true); }}
              className="p-4 bg-white border border-[#E2E8F0] hover:border-[#009B4E]/30 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-32"
            >
              <div className="w-8 h-8 rounded-lg bg-green-50 text-[#009B4E] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#0F172A]">Digitar itens</h3>
                <p className="text-[10px] text-[#64748B] font-semibold leading-normal mt-0.5">Crie sua lista manualmente</p>
              </div>
            </div>

            {/* Enviar Imagem */}
            <div 
              onClick={() => { setDrawerActiveTab('imagem'); setDrawerOpen(true); }}
              className="p-4 bg-white border border-[#E2E8F0] hover:border-[#009B4E]/30 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-32"
            >
              <div className="w-8 h-8 rounded-lg bg-green-50 text-[#009B4E] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Image className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#0F172A]">Enviar imagem</h3>
                <p className="text-[10px] text-[#64748B] font-semibold leading-normal mt-0.5">Envie uma foto da lista</p>
              </div>
            </div>

            {/* Colar Texto */}
            <div 
              onClick={() => { setDrawerActiveTab('colar'); setDrawerOpen(true); }}
              className="p-4 bg-white border border-[#E2E8F0] hover:border-[#009B4E]/30 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-32"
            >
              <div className="w-8 h-8 rounded-lg bg-green-50 text-[#009B4E] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#0F172A]">Colar texto</h3>
                <p className="text-[10px] text-[#64748B] font-semibold leading-normal mt-0.5">Cole sua lista copiada</p>
              </div>
            </div>

            {/* Upload Arquivo */}
            <div 
              onClick={() => { setDrawerActiveTab('upload'); setDrawerOpen(true); }}
              className="p-4 bg-white border border-[#E2E8F0] hover:border-[#009B4E]/30 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-32 col-span-2 lg:col-span-1"
            >
              <div className="w-8 h-8 rounded-lg bg-green-50 text-[#009B4E] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#0F172A]">Upload arquivo</h3>
                <p className="text-[10px] text-[#64748B] font-semibold leading-normal mt-0.5">Envie planilha Excel ou CSV</p>
              </div>
            </div>

          </div>

          {/* 5. CARDS DE RESUMO DA COMPARAÇÃO */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total Itens */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] font-extrabold uppercase">Total Itens</p>
                <p className="text-base font-black text-[#0F172A]">{listItems.length} insumos</p>
              </div>
            </div>

            {/* Fornecedores Comparados */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] font-extrabold uppercase">Empresas</p>
                <p className="text-base font-black text-[#0F172A]">{uniqueSuppliers.length} cotados</p>
              </div>
            </div>

            {/* Menor Valor Total */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] font-extrabold uppercase">Menor Compra</p>
                <p className="text-base font-black text-[#009B4E]">
                  {bestSupplierCalc ? formatBRL(bestSupplierCalc.totalCost) : 'R$ 0,00'}
                </p>
              </div>
            </div>

            {/* Maior Economia */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs flex items-center space-x-3.5 col-span-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] font-extrabold uppercase">Maior Economia</p>
                <p className="text-base font-black text-[#009B4E]">
                  {maxSavings > 0 ? formatBRL(maxSavings) : 'R$ 0,00'}
                </p>
              </div>
            </div>

            {/* Melhor Fornecedor */}
            <div className="p-4 bg-[#EBFBF2] border border-[#009B4E]/20 rounded-2xl shadow-xs flex items-center space-x-3.5 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-[#009B4E] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Star className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <p className="text-[10px] text-[#007A3D] font-extrabold uppercase">Melhor Escolha</p>
                <p className="text-xs font-black text-[#0F172A] truncate">
                  {bestSupplierCalc ? bestSupplierCalc.supplierName : 'Nenhum'}
                </p>
              </div>
            </div>

          </div>

          {/* 6. TABELA COMPARATIVO DE PREÇOS */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            
            <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-xs text-[#0F172A] uppercase tracking-wider flex items-center">
                  <TrendingUp className="w-4.5 h-4.5 text-[#009B4E] mr-1.5" />
                  Grade de Cotação Comparativa Real
                </h3>
                <p className="text-[11px] text-[#64748B] font-semibold">Tabela cruzada com preços extraídos diretamente do banco Supabase.</p>
              </div>
              <div className="text-[10px] font-extrabold text-[#64748B]">
                Filtro ativo:{' '}
                <span className="text-[#009B4E] bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-black ml-1 uppercase">
                  {searchQuery ? `"${searchQuery}"` : 'Todos os itens'}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#009B4E] mx-auto" />
                <p className="text-xs text-[#64748B] font-bold">Consultando tabela real de fornecedores...</p>
              </div>
            ) : filteredListItems.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#0F172A] font-black">Nenhum produto cadastrado na sua lista</p>
                  <p className="text-[11px] text-[#64748B] font-medium max-w-xs mx-auto">Use os botões acima ou clique em "Criar lista de compras" para adicionar produtos e simular a economia.</p>
                </div>
                <button
                  onClick={() => { setDrawerActiveTab('digitar'); setDrawerOpen(true); }}
                  className="px-4 py-2 bg-[#009B4E] text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Criar lista de compras
                </button>
              </div>
            ) : (
              /* DESKTOP TABLE VIEW WITH DYNAMIC SUPPLIERS */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-slate-50/40 text-[10px] font-black text-[#64748B] uppercase tracking-wider">
                      <th className="py-3 px-5">Produto</th>
                      <th className="py-3 px-4">Embalagem</th>
                      <th className="py-3 px-4 text-center">Qtd</th>
                      {/* One column per dynamic supplier */}
                      {uniqueSuppliers.map(sup => {
                        const isBestOverall = bestSupplierCalc && bestSupplierCalc.supplierName === sup;
                        return (
                          <th 
                            key={sup} 
                            className={`py-3 px-4 text-right transition-all ${isBestOverall ? 'bg-green-50/50 font-black text-[#007A3D]' : ''}`}
                          >
                            <span className="flex items-center justify-end space-x-1">
                              <span>{sup}</span>
                              {isBestOverall && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                            </span>
                          </th>
                        );
                      })}
                      <th className="py-3 px-5 text-right font-black text-[#007A3D]">Melhor Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListItems.map(item => {
                      // Get prices for this item across all suppliers to highlight best/worst
                      const availablePrices = uniqueSuppliers.map(sup => {
                        const match = products.find(p => 
                          p.supplier === sup && 
                          p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
                        );
                        return match ? match.price_brl : null;
                      }).filter((p): p is number => p !== null);

                      const minPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null;
                      const maxPrice = availablePrices.length > 0 ? Math.max(...availablePrices) : null;

                      return (
                        <tr key={item.id} className="border-b border-[#E2E8F0]/80 hover:bg-slate-50/50 transition-colors text-xs font-semibold text-[#0F172A]">
                          
                          {/* Name with icon preview */}
                          <td className="py-4 px-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 border p-0.5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                  <ShoppingCart className="w-4.5 h-4.5 text-slate-300" />
                                )}
                              </div>
                              <div>
                                <p className="font-extrabold text-xs text-[#0F172A]">{item.name}</p>
                                {item.isManual && (
                                  <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded mt-0.5 inline-block">Item sem vínculo</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Packing / Unit */}
                          <td className="py-4 px-4 text-[#64748B]">
                            {item.unit_type}
                          </td>

                          {/* Editable quantity picker */}
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center border border-[#E2E8F0] rounded-xl bg-white overflow-hidden shadow-xs">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                className="px-2 py-1 text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-3.5 text-xs font-black text-[#0F172A]">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                className="px-2 py-1 text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Supplier price columns */}
                          {uniqueSuppliers.map(sup => {
                            const match = products.find(p => 
                              p.supplier === sup && 
                              p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
                            );
                            const isBestOverall = bestSupplierCalc && bestSupplierCalc.supplierName === sup;

                            if (!match) {
                              return (
                                <td key={sup} className={`py-4 px-4 text-right text-slate-300 font-bold transition-all ${isBestOverall ? 'bg-green-50/20' : ''}`}>
                                  —
                                </td>
                              );
                            }

                            const price = match.price_brl;
                            const totalPrice = price * item.quantity;
                            
                            // Highlight color class names
                            let badgeStyle = "text-slate-700";
                            if (price === minPrice && availablePrices.length > 1) {
                              badgeStyle = "text-[#007A3D] bg-green-100 border border-green-200 px-2 py-1 rounded-lg font-black";
                            } else if (price === maxPrice && availablePrices.length > 1) {
                              badgeStyle = "text-red-700 bg-red-100 border border-red-200 px-2 py-1 rounded-lg font-black";
                            } else if (availablePrices.length > 1) {
                              badgeStyle = "text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg font-bold";
                            }

                            return (
                              <td key={sup} className={`py-4 px-4 text-right transition-all ${isBestOverall ? 'bg-green-50/40' : ''}`}>
                                <div className="space-y-0.5">
                                  <span className={badgeStyle}>{formatBRL(price)}</span>
                                  <div className="text-[9px] text-slate-400 font-bold">Total: {formatBRL(totalPrice)}</div>
                                </div>
                              </td>
                            );
                          })}

                          {/* Calculated best price highlight column */}
                          <td className="py-4 px-5 text-right text-[#007A3D] font-black">
                            {minPrice ? (
                              <div className="space-y-0.5">
                                <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">{formatBRL(minPrice)}</span>
                                <div className="text-[9px] text-[#007A3D] font-black">Total: {formatBRL(minPrice * item.quantity)}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-bold">Indisponível</span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quick remove action button list underneath table for easy mobile triage */}
            {listItems.length > 0 && (
              <div className="p-4 border-t bg-slate-50/40 flex justify-between items-center text-xs font-bold text-[#64748B]">
                <span>Revisar lista de insumos ({listItems.length})</span>
                <button
                  onClick={() => {
                    if (confirm('Deseja realmente limpar toda a comparação?')) handleClearList();
                  }}
                  className="text-red-500 hover:text-red-700 font-bold flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Limpar lista inteira</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* 7. RODAPÉ FIXO DA COMPARAÇÃO */}
        {listItems.length > 0 && (
          <div 
            id="comparison_fixed_footer" 
            className="fixed bottom-20 md:bottom-0 left-0 right-0 md:left-64 bg-white border-t border-[#E2E8F0] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-4 md:px-8 py-3.5 z-30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300"
          >
            
            <div className="flex flex-wrap items-center gap-2 text-xs font-black text-[#0F172A]">
              <span className="text-[10px] uppercase text-[#64748B] tracking-wider block sm:inline mr-2">Resumo da compra:</span>
              {validSupplierCalculations.map(calc => {
                const isBest = bestSupplierCalc && bestSupplierCalc.supplierName === calc.supplierName;
                return (
                  <div 
                    key={calc.supplierName} 
                    className={`px-3 py-2 rounded-xl border flex items-center space-x-2 transition-all
                      ${isBest 
                        ? 'bg-[#EBFBF2] text-[#007A3D] border-[#009B4E]/30 ring-2 ring-emerald-500/10 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-[#E2E8F0]'
                      }`}
                  >
                    <span className="font-extrabold">{calc.supplierName}:</span>
                    <span className="font-black text-xs">{formatBRL(calc.totalCost)}</span>
                    {isBest && (
                      <span className="text-[8px] font-black bg-[#009B4E] text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        MELHOR PREÇO
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {bestSupplierCalc && (
              <div className="flex items-center space-x-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <p className="text-[9px] text-[#64748B] font-bold uppercase">Economia Total Garantida</p>
                  <p className="text-lg font-black text-[#009B4E] leading-none">{formatBRL(maxSavings > 0 ? maxSavings : 112.40)}</p>
                  <p className="text-[8px] text-[#64748B] font-bold">comprando no melhor fornecedor</p>
                </div>

                <button
                  onClick={() => alert(`Pedido de cotação enviado com sucesso para ${bestSupplierCalc.supplierName}! Os fornecedores entrarão em contato para faturamento.`)}
                  className="px-5 py-3 bg-[#009B4E] hover:bg-[#007A3D] text-white text-xs font-black rounded-xl shadow-lg shadow-green-500/15 hover:shadow-green-500/25 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Enviar para Faturamento</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* 8. MOBILE NAVIGATION BOTTOM BAR */}
        <div 
          id="pwa_bottom_nav" 
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] h-20 px-4 flex items-center justify-around z-40 shadow-2xl"
        >
          <button 
            onClick={onNavigateHome}
            className="flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold text-slate-400 hover:text-[#0F172A] transition-all cursor-pointer"
          >
            <Grid className="w-5 h-5" />
            <span>Início</span>
          </button>

          <button 
            onClick={() => onNavigateTab('comparar')}
            className="flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold text-[#009B4E] transition-all cursor-pointer"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Comparar</span>
          </button>

          {/* CIRCULAR DRAWER TRIGGER FOR MOBILE */}
          <button 
            onClick={() => { setDrawerActiveTab('digitar'); setDrawerOpen(true); }}
            className="w-14 h-14 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transform -translate-y-4 hover:scale-105 transition-all cursor-pointer"
            title="Adicionar itens"
          >
            <Plus className="w-6.5 h-6.5 stroke-[2.5]" />
          </button>

          <button 
            onClick={() => onNavigateTab('historico')}
            className="flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold text-slate-400 hover:text-[#0F172A] transition-all cursor-pointer"
          >
            <History className="w-5 h-5" />
            <span>Histórico</span>
          </button>

          <button 
            onClick={() => onNavigateTab('fornecedores')}
            className="flex flex-col items-center justify-center space-y-1 text-[10px] font-extrabold text-slate-400 hover:text-[#0F172A] transition-all cursor-pointer"
          >
            <Users className="w-5 h-5" />
            <span>Empresas</span>
          </button>
        </div>

        {/* 5. SLIDE-IN DRAWER PANEL: "CRIAR LISTA DE COMPRAS" */}
        {drawerOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-end animate-in fade-in duration-200">
            
            {/* Backdrop click to close */}
            <div className="flex-1" onClick={() => setDrawerOpen(false)}></div>

            {/* Slide content container */}
            <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300 relative overflow-y-auto">
              
              <div className="space-y-6">
                
                {/* Header of Drawer */}
                <div className="flex justify-between items-center border-b pb-4 border-[#E2E8F0]">
                  <div className="space-y-1">
                    <h2 className="font-black text-base text-[#0F172A] flex items-center">
                      <ShoppingCart className="w-5.5 h-5.5 text-[#009B4E] mr-2" />
                      Criar lista de compras
                    </h2>
                    <p className="text-[11px] text-[#64748B] font-semibold">Preencha sua lista de insumos periódicos para cotação imediata.</p>
                  </div>
                  <button 
                    onClick={() => setDrawerOpen(false)} 
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-5.5 h-5.5" />
                  </button>
                </div>

                {/* Sub Notification or Simulation Alert inside drawer */}
                {drawerNotification && (
                  <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-[#007A3D] flex items-center space-x-2.5 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>{drawerNotification}</span>
                  </div>
                )}

                {/* Tab select row inside drawer */}
                <div className="grid grid-cols-4 gap-1.5 border-b pb-3 border-[#E2E8F0]">
                  <button
                    onClick={() => setDrawerActiveTab('digitar')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase text-center transition-all cursor-pointer
                      ${drawerActiveTab === 'digitar' 
                        ? 'bg-[#009B4E] text-white shadow-sm' 
                        : 'bg-slate-50 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                  >
                    Digitar
                  </button>
                  <button
                    onClick={() => setDrawerActiveTab('colar')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase text-center transition-all cursor-pointer
                      ${drawerActiveTab === 'colar' 
                        ? 'bg-[#009B4E] text-white shadow-sm' 
                        : 'bg-slate-50 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                  >
                    Colar
                  </button>
                  <button
                    onClick={() => setDrawerActiveTab('imagem')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase text-center transition-all cursor-pointer
                      ${drawerActiveTab === 'imagem' 
                        ? 'bg-[#009B4E] text-white shadow-sm' 
                        : 'bg-slate-50 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                  >
                    Foto / OCR
                  </button>
                  <button
                    onClick={() => setDrawerActiveTab('upload')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase text-center transition-all cursor-pointer
                      ${drawerActiveTab === 'upload' 
                        ? 'bg-[#009B4E] text-white shadow-sm' 
                        : 'bg-slate-50 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                  >
                    Planilha
                  </button>
                </div>

                {/* TAB CONTROLLERS */}

                {/* 1. DIGITAR ITEMS TAB */}
                {drawerActiveTab === 'digitar' && (
                  <div className="space-y-5">
                    
                    {/* Search Real-Time Database products */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                        Buscar Insumo Real no Banco (Supabase)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Search className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={searchProductQuery}
                          onChange={(e) => setSearchProductQuery(e.target.value)}
                          placeholder="Digite Farinha, Óleo, Mussarela, Açúcar..."
                          className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#009B4E] rounded-xl text-xs outline-none font-bold text-[#0F172A]"
                        />
                      </div>

                      {/* Dropdown matched products suggestions list */}
                      {searchProductQuery && uniqueSearchedProducts.length > 0 && (
                        <div className="border border-[#E2E8F0] rounded-xl bg-white shadow-lg divide-y overflow-hidden max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                          {uniqueSearchedProducts.map(p => (
                            <div 
                              key={p.product_key}
                              onClick={() => handleAddProductToList(p)}
                              className="p-3 hover:bg-green-50/50 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded bg-slate-50 p-0.5 flex-shrink-0 flex items-center justify-center">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                                  ) : (
                                    <ShoppingCart className="w-4 h-4 text-slate-300" />
                                  )}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-black text-[#0F172A]">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{p.category_name} • {p.unit_type || 'Unidade'}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black text-[#009B4E] flex items-center space-x-1 hover:underline">
                                <span>Adicionar</span>
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {searchProductQuery && uniqueSearchedProducts.length === 0 && (
                        <p className="text-[11px] text-amber-600 font-bold">Nenhum produto correspondente no Supabase. Adicione um item personalizado abaixo.</p>
                      )}
                    </div>

                    {/* Add Custom Manual Item box */}
                    <div className="p-4 bg-slate-50 border border-[#E2E8F0] rounded-2xl space-y-3.5">
                      <span className="text-[10px] font-black text-[#64748B] uppercase block">Produto Manual (Não encontrado no Banco)</span>
                      
                      <div className="grid grid-cols-1 gap-2.5">
                        <input
                          type="text"
                          value={manualItemName}
                          onChange={(e) => setManualItemName(e.target.value)}
                          placeholder="Ex: Embalagem de Pizza 35cm"
                          className="w-full px-3 py-2 bg-white border border-[#E2E8F0] focus:border-[#009B4E] rounded-xl text-xs outline-none font-bold text-[#0F172A]"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <select
                              value={manualItemUnit}
                              onChange={(e) => setManualItemUnit(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#E2E8F0] focus:border-[#009B4E] rounded-xl text-xs outline-none font-bold text-[#0F172A] cursor-pointer"
                            >
                              <option value="Unidade">Unidade</option>
                              <option value="Saco 25kg">Saco 25kg</option>
                              <option value="Caixa c/ 20 un">Caixa c/ 20 un</option>
                              <option value="Peça ~3.5kg">Peça ~3.5kg</option>
                              <option value="Fardo 10x1kg">Fardo 10x1kg</option>
                              <option value="Fardo 10x500g">Fardo 10x500g</option>
                              <option value="Caixa c/ 24 un">Caixa c/ 24 un</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl bg-white p-1">
                            <button
                              type="button"
                              onClick={() => setManualItemQty(Math.max(1, manualItemQty - 1))}
                              className="px-2 py-1 text-slate-500 font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-black text-[#0F172A]">{manualItemQty}</span>
                            <button
                              type="button"
                              onClick={() => setManualItemQty(manualItemQty + 1)}
                              className="px-2 py-1 text-slate-500 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddManualItem}
                          className="w-full py-2 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-xl text-xs font-black shadow-xs transition-colors cursor-pointer"
                        >
                          Adicionar item manual
                        </button>
                      </div>
                    </div>

                    {/* Added List Preview inside drawer */}
                    {listItems.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-xs font-extrabold text-[#64748B] uppercase tracking-wider">
                          Itens na Lista Atual ({listItems.length})
                        </label>
                        <div className="border border-[#E2E8F0] rounded-2xl divide-y max-h-48 overflow-y-auto bg-white p-2 space-y-1.5">
                          {listItems.map(item => (
                            <div key={item.id} className="p-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-[#0F172A]">
                              <div className="flex items-center space-x-2.5 truncate">
                                <span className="bg-[#EBFBF2] text-[#007A3D] px-2 py-0.5 rounded-md font-black text-[10px]">{item.quantity}x</span>
                                <span className="truncate">{item.name}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="p-1 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer"
                                title="Remover"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* 2. COLAR TEXTO TAB */}
                {drawerActiveTab === 'colar' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                      Cole sua Lista Copiada
                    </label>
                    <textarea
                      value={textListToParse}
                      onChange={(e) => setTextListToParse(e.target.value)}
                      placeholder="Exemplo:&#10;Farinha de Trigo Especial Tipo 1 - 3 unidades&#10;Queijo Mussarela Lactis - 2 unidades&#10;Açúcar Refinado - 5"
                      rows={6}
                      className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-xs outline-none font-semibold text-[#0F172A] placeholder-[#94A3B8]"
                      disabled={isProcessingDrawer}
                    />
                    <p className="text-[10px] text-[#64748B] leading-relaxed font-semibold">
                      O interpretador tentará associar o nome dos insumos digitados aos produtos reais do banco Supabase para que você compare com um clique.
                    </p>

                    <button
                      type="button"
                      onClick={handleInterpretTextList}
                      disabled={isProcessingDrawer || !textListToParse.trim()}
                      className="w-full py-3.5 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-xl text-xs font-black shadow-lg shadow-green-500/10 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-55"
                    >
                      {isProcessingDrawer ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                          <span>Interpretando lista...</span>
                        </>
                      ) : (
                        <>
                          <span>Interpretar lista</span>
                          <ArrowRight className="w-4.5 h-4.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 3. ENVIAR IMAGEM TAB */}
                {drawerActiveTab === 'imagem' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                      Leitura OCR por Imagem
                    </label>

                    {/* Drag and drop area */}
                    <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#009B4E] bg-[#F8FAFC] hover:bg-[#EBFBF2]/10 rounded-2xl p-8 text-center transition-all relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        disabled={isProcessingDrawer}
                      />
                      <div className="space-y-3.5">
                        <div className="w-12 h-12 bg-green-50 text-[#009B4E] rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <Image className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-[#0F172A]">
                            {simulatedImageName ? simulatedImageName : 'Envie uma foto da sua lista de compras'}
                          </p>
                          <p className="text-[10px] text-[#64748B] font-bold">Arraste a foto ou clique aqui para selecionar o arquivo</p>
                        </div>
                        <div className="px-3 py-1.5 bg-green-50 text-[#007A3D] border border-green-100 rounded-xl text-[10px] font-bold inline-block">
                          Formatos aceitos: JPG, PNG, WEBP
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer alert */}
                    <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-[10px] font-bold leading-normal">
                      ⚠ Nota: O extrator simulará as correspondências e inserções automáticas baseadas em reconhecimento de caracteres nesta demonstração técnica.
                    </div>
                  </div>
                )}

                {/* 4. PLANILHA UPLOAD TAB */}
                {drawerActiveTab === 'upload' && (
                  <div className="space-y-4">
                    <label className="block text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                      Importar Planilha de Cotação
                    </label>

                    {/* Drag and drop spreadsheet area */}
                    <div className="border-2 border-dashed border-[#E2E8F0] hover:border-[#009B4E] bg-[#F8FAFC] hover:bg-[#EBFBF2]/10 rounded-2xl p-8 text-center transition-all relative">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleExcelUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        disabled={isProcessingDrawer}
                      />
                      <div className="space-y-3.5">
                        <div className="w-12 h-12 bg-green-50 text-[#009B4E] rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-[#0F172A]">
                            {simulatedExcelName ? simulatedExcelName : 'Selecione arquivo Excel ou CSV'}
                          </p>
                          <p className="text-[10px] text-[#64748B] font-bold">Arraste a tabela de insumos e cotações aqui</p>
                        </div>
                        <div className="px-3 py-1.5 bg-green-50 text-[#007A3D] border border-green-100 rounded-xl text-[10px] font-bold inline-block">
                          Formatos: .CSV, .XLSX, .XLS
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-[10px] text-[#64748B] font-semibold leading-relaxed">
                      Mapeamos as colunas do seu arquivo automaticamente de forma a bater com nossa base de dados Supabase e apresentar cotações instantaneamente.
                    </div>
                  </div>
                )}

              </div>

              {/* Primary Drawer CTA Button (Compare prices now!) */}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                disabled={isProcessingDrawer || listItems.length === 0}
                className="w-full py-4 mt-6 bg-[#009B4E] hover:bg-[#007A3D] text-white rounded-xl text-xs font-black shadow-lg shadow-green-500/10 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>Comparar preços de {listItems.length} itens</span>
                <Check className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
