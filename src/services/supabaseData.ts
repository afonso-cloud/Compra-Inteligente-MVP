/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Frontend uses only the public Supabase publishable key via REST. Never use service_role here.
import type { SupplierProduct } from '../components/MainDashboard';

// Shared high-fidelity fallback database for simulation
export const demoSupplierProducts: SupplierProduct[] = [
  // Farinha
  {
    product_key: 'p-1-assai',
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
    image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T14:30:00Z'
  },
  {
    product_key: 'p-1-atacadao',
    supplier: 'Atacadão',
    name: 'Farinha de Trigo Especial Tipo 1',
    description: 'Farinha de trigo premium ideal para panificação de longa fermentação.',
    category_name: 'Secos',
    unit_type: 'Saco 25kg',
    price_brl: 72.80,
    real_price_brl: 72.80,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T14:30:00Z'
  },
  {
    product_key: 'p-1-muffato',
    supplier: 'SuperMuffato',
    name: 'Farinha de Trigo Especial Tipo 1',
    description: 'Farinha de trigo premium ideal para panificação de longa fermentação.',
    category_name: 'Secos',
    unit_type: 'Saco 25kg',
    price_brl: 78.50,
    real_price_brl: 85.00,
    discount_fraction: 0.07,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T14:30:00Z'
  },
  {
    product_key: 'p-1-condor',
    supplier: 'Condor',
    name: 'Farinha de Trigo Especial Tipo 1',
    description: 'Farinha de trigo premium.',
    category_name: 'Secos',
    unit_type: 'Saco 25kg',
    price_brl: 75.90,
    real_price_brl: 75.90,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T14:30:00Z'
  },
  {
    product_key: 'p-1-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Farinha de Trigo Especial Tipo 1',
    description: 'Farinha de trigo premium para massas.',
    category_name: 'Secos',
    unit_type: 'Saco 25kg',
    price_brl: 71.50,
    real_price_brl: 79.90,
    discount_fraction: 0.1,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1574484284002-982594e29263?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T14:30:00Z'
  },

  // Óleo de Soja
  {
    product_key: 'p-2-assai',
    supplier: 'Assai Atacadista',
    name: 'Óleo de Soja Especial Cocamar',
    description: 'Óleo refinado de soja de alta qualidade para frituras.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 20 un',
    price_brl: 132.00,
    real_price_brl: 132.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T15:45:00Z'
  },
  {
    product_key: 'p-2-atacadao',
    supplier: 'Atacadão',
    name: 'Óleo de Soja Especial Cocamar',
    description: 'Óleo refinado de soja de alta qualidade.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 20 un',
    price_brl: 125.50,
    real_price_brl: 135.00,
    discount_fraction: 0.07,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T15:45:00Z'
  },
  {
    product_key: 'p-2-muffato',
    supplier: 'SuperMuffato',
    name: 'Óleo de Soja Especial Cocamar',
    description: 'Óleo refinado de soja de alta qualidade.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 20 un',
    price_brl: 128.40,
    real_price_brl: 145.00,
    discount_fraction: 0.11,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T15:45:00Z'
  },
  {
    product_key: 'p-2-condor',
    supplier: 'Condor',
    name: 'Óleo de Soja Especial Cocamar',
    description: 'Óleo de soja de qualidade.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 20 un',
    price_brl: 134.00,
    real_price_brl: 134.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T15:45:00Z'
  },
  {
    product_key: 'p-2-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Óleo de Soja Especial Cocamar',
    description: 'Óleo de soja Cocamar.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 20 un',
    price_brl: 122.90,
    real_price_brl: 139.90,
    discount_fraction: 0.12,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T15:45:00Z'
  },

  // Queijo Mussarela
  {
    product_key: 'p-3-assai',
    supplier: 'Assai Atacadista',
    name: 'Queijo Mussarela Fatiado Lactis',
    description: 'Mussarela pasteurizada com excelente derretimento.',
    category_name: 'Laticínios',
    unit_type: 'Peça ~3.5kg',
    price_brl: 112.50,
    real_price_brl: 125.00,
    discount_fraction: 0.1,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-28T09:15:00Z'
  },
  {
    product_key: 'p-3-atacadao',
    supplier: 'Atacadão',
    name: 'Queijo Mussarela Fatiado Lactis',
    description: 'Mussarela pasteurizada com excelente derretimento.',
    category_name: 'Laticínios',
    unit_type: 'Peça ~3.5kg',
    price_brl: 108.50,
    real_price_brl: 139.90,
    discount_fraction: 0.22,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-28T09:15:00Z'
  },
  {
    product_key: 'p-3-muffato',
    supplier: 'SuperMuffato',
    name: 'Queijo Mussarela Fatiado Lactis',
    description: 'Mussarela de excelente qualidade.',
    category_name: 'Laticínios',
    unit_type: 'Peça ~3.5kg',
    price_brl: 115.00,
    real_price_brl: 115.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-28T09:15:00Z'
  },
  {
    product_key: 'p-3-condor',
    supplier: 'Condor',
    name: 'Queijo Mussarela Fatiado Lactis',
    description: 'Queijo mussarela em peça.',
    category_name: 'Laticínios',
    unit_type: 'Peça ~3.5kg',
    price_brl: 119.90,
    real_price_brl: 129.90,
    discount_fraction: 0.07,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-28T09:15:00Z'
  },
  {
    product_key: 'p-3-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Queijo Mussarela Fatiado Lactis',
    description: 'Mussarela fatiada Lactis.',
    category_name: 'Laticínios',
    unit_type: 'Peça ~3.5kg',
    price_brl: 104.90,
    real_price_brl: 119.90,
    discount_fraction: 0.12,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-28T09:15:00Z'
  },

  // Açúcar
  {
    product_key: 'p-4-assai',
    supplier: 'Assai Atacadista',
    name: 'Açúcar Refinado Alto Alegre',
    description: 'Açúcar refinado especial de rápida diluição.',
    category_name: 'Secos',
    unit_type: 'Fardo 10x1kg',
    price_brl: 41.50,
    real_price_brl: 41.50,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T11:00:00Z'
  },
  {
    product_key: 'p-4-atacadao',
    supplier: 'Atacadão',
    name: 'Açúcar Refinado Alto Alegre',
    description: 'Açúcar refinado de alta qualidade.',
    category_name: 'Secos',
    unit_type: 'Fardo 10x1kg',
    price_brl: 38.50,
    real_price_brl: 45.00,
    discount_fraction: 0.14,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T11:00:00Z'
  },
  {
    product_key: 'p-4-muffato',
    supplier: 'SuperMuffato',
    name: 'Açúcar Refinado Alto Alegre',
    description: 'Açúcar refinado.',
    category_name: 'Secos',
    unit_type: 'Fardo 10x1kg',
    price_brl: 42.00,
    real_price_brl: 42.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T11:00:00Z'
  },
  {
    product_key: 'p-4-condor',
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
    image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T11:00:00Z'
  },
  {
    product_key: 'p-4-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Açúcar Refinado Alto Alegre',
    description: 'Açúcar Alto Alegre.',
    category_name: 'Secos',
    unit_type: 'Fardo 10x1kg',
    price_brl: 37.90,
    real_price_brl: 42.00,
    discount_fraction: 0.09,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1581781898135-dc460773bf7c?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T11:00:00Z'
  },

  // Café
  {
    product_key: 'p-5-assai',
    supplier: 'Assai Atacadista',
    name: 'Café Tradicional Vácuo Melitta',
    description: 'Café torrado e moído extra forte.',
    category_name: 'Bebidas',
    unit_type: 'Fardo 10x500g',
    price_brl: 185.00,
    real_price_brl: 195.00,
    discount_fraction: 0.05,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T10:20:00Z'
  },
  {
    product_key: 'p-5-atacadao',
    supplier: 'Atacadão',
    name: 'Café Tradicional Vácuo Melitta',
    description: 'Café torrado e moído.',
    category_name: 'Bebidas',
    unit_type: 'Fardo 10x500g',
    price_brl: 179.90,
    real_price_brl: 179.90,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T10:20:00Z'
  },
  {
    product_key: 'p-5-muffato',
    supplier: 'SuperMuffato',
    name: 'Café Tradicional Vácuo Melitta',
    description: 'Café Melitta.',
    category_name: 'Bebidas',
    unit_type: 'Fardo 10x500g',
    price_brl: 188.00,
    real_price_brl: 188.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T10:20:00Z'
  },
  {
    product_key: 'p-5-condor',
    supplier: 'Condor',
    name: 'Café Tradicional Vácuo Melitta',
    description: 'Café torrado e moído extra forte vácuo embalado.',
    category_name: 'Bebidas',
    unit_type: 'Fardo 10x500g',
    price_brl: 182.50,
    real_price_brl: 182.50,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T10:20:00Z'
  },
  {
    product_key: 'p-5-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Café Tradicional Vácuo Melitta',
    description: 'Café a vácuo Melitta.',
    category_name: 'Bebidas',
    unit_type: 'Fardo 10x500g',
    price_brl: 174.90,
    real_price_brl: 199.90,
    discount_fraction: 0.12,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T10:20:00Z'
  },

  // Leite Condensado
  {
    product_key: 'p-6-assai',
    supplier: 'Assai Atacadista',
    name: 'Leite Condensado Piracanjuba Moça',
    description: 'Leite condensado de consistência perfeita.',
    category_name: 'Laticínios',
    unit_type: 'Caixa c/ 27 un',
    price_brl: 142.00,
    real_price_brl: 185.00,
    discount_fraction: 0.23,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T12:00:00Z'
  },
  {
    product_key: 'p-6-atacadao',
    supplier: 'Atacadão',
    name: 'Leite Condensado Piracanjuba Moça',
    description: 'Leite condensado.',
    category_name: 'Laticínios',
    unit_type: 'Caixa c/ 27 un',
    price_brl: 139.00,
    real_price_brl: 139.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T12:00:00Z'
  },
  {
    product_key: 'p-6-muffato',
    supplier: 'SuperMuffato',
    name: 'Leite Condensado Piracanjuba Moça',
    description: 'Leite condensado.',
    category_name: 'Laticínios',
    unit_type: 'Caixa c/ 27 un',
    price_brl: 146.50,
    real_price_brl: 155.00,
    discount_fraction: 0.05,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T12:00:00Z'
  },
  {
    product_key: 'p-6-condor',
    supplier: 'Condor',
    name: 'Leite Condensado Piracanjuba Moça',
    description: 'Leite condensado.',
    category_name: 'Laticínios',
    unit_type: 'Caixa c/ 27 un',
    price_brl: 145.00,
    real_price_brl: 145.00,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T12:00:00Z'
  },
  {
    product_key: 'p-6-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Leite Condensado Piracanjuba Moça',
    description: 'Leite condensado Piracanjuba.',
    category_name: 'Laticínios',
    unit_type: 'Caixa c/ 27 un',
    price_brl: 136.80,
    real_price_brl: 159.00,
    discount_fraction: 0.13,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T12:00:00Z'
  },

  // Molho de Tomate
  {
    product_key: 'p-7-assai',
    supplier: 'Assai Atacadista',
    name: 'Molho de Tomate Sachê Val',
    description: 'Molho de tomate temperado.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 24 un',
    price_brl: 48.00,
    real_price_brl: 55.00,
    discount_fraction: 0.12,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T09:00:00Z'
  },
  {
    product_key: 'p-7-atacadao',
    supplier: 'Atacadão',
    name: 'Molho de Tomate Sachê Val',
    description: 'Molho de tomate.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 24 un',
    price_brl: 45.50,
    real_price_brl: 45.50,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T09:00:00Z'
  },
  {
    product_key: 'p-7-muffato',
    supplier: 'SuperMuffato',
    name: 'Molho de Tomate Sachê Val',
    description: 'Molho de tomate Val.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 24 un',
    price_brl: 49.90,
    real_price_brl: 49.90,
    discount_fraction: 0,
    have_discount: false,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T09:00:00Z'
  },
  {
    product_key: 'p-7-condor',
    supplier: 'Condor',
    name: 'Molho de Tomate Sachê Val',
    description: 'Molho de tomate.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 24 un',
    price_brl: 46.80,
    real_price_brl: 52.00,
    discount_fraction: 0.1,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T09:00:00Z'
  },
  {
    product_key: 'p-7-lejon',
    supplier: 'Lejon Atacarejo',
    name: 'Molho de Tomate Sachê Val',
    description: 'Molho Val.',
    category_name: 'Secos',
    unit_type: 'Caixa c/ 24 un',
    price_brl: 44.20,
    real_price_brl: 49.90,
    discount_fraction: 0.11,
    have_discount: true,
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=200',
    captured_at: '2026-06-29T09:00:00Z'
  }
];

const normalizeSupplierProduct = (row: any, index = 0): SupplierProduct => {
  const price = Number(row.price_brl ?? row.preco_brl ?? row['preço_brl'] ?? row.price ?? row.current_price ?? row.preco_real_brl ?? row['preço_real_brl'] ?? 0);
  const regularPrice = Number(row.regular_price_brl ?? row.real_price_brl ?? row.preco_real_brl ?? row['preço_real_brl'] ?? row.list_price ?? price);
  return {
    ...row,
    product_key: String(row.product_key ?? row.id ?? row.product_id ?? row.id_do_produto ?? 'produto-' + index),
    product_id: row.product_id ?? row.id_do_produto,
    master_product_id: row.master_product_id ?? row.id_do_produto_mestre,
    supplier: String(row.supplier ?? row.fornecedor ?? row.source ?? 'Fornecedor'),
    name: String(row.name ?? row.nome ?? row.product_name ?? 'Produto sem nome'),
    description: row.description ?? row.descricao ?? row['descrição'],
    category_name: row.category_name ?? row.nome_da_categoria ?? row.category,
    unit_type: row.unit_type ?? row.tipo_de_unidade ?? row.unit,
    price_brl: price,
    real_price_brl: regularPrice,
    discount_fraction: Number(row.discount_fraction ?? row.fracao_de_desconto ?? row['fração_de_desconto'] ?? (regularPrice > price && regularPrice ? (regularPrice - price) / regularPrice : 0)),
    have_discount: Boolean(row.have_discount ?? row.ter_desconto ?? (regularPrice > price)),
    in_stock: row.in_stock ?? row.em_estoque ?? true,
    is_available: row.is_available ?? row.in_stock ?? row.em_estoque ?? true,
    image_url: row.image_url ?? row.imagem ?? row.image ?? row.thumbnail,
    product_url: row.product_url ?? row.url ?? row.link,
    captured_at: row.captured_at ?? row.updated_at
  };
};

const getRuntimeSupabaseConfig = () => {
  const env = ((import.meta as any).env || {}) as Record<string, string | undefined>;
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string | undefined>;
  return {
    supabaseUrl: env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || processEnv.VITE_SUPABASE_URL || processEnv.NEXT_PUBLIC_SUPABASE_URL || 'https://rozxrrchsgjkhygncyte.supabase.co',
    supabaseKey: env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || processEnv.VITE_SUPABASE_PUBLISHABLE_KEY || processEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_2N3Wbe56Jn6rWq7e9GT9-A_C4Ii_JL2'
  };
};

export const fetchProducts = async (): Promise<SupplierProduct[]> => {
  const { supabaseUrl, supabaseKey } = getRuntimeSupabaseConfig();

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase public config missing. Falling back to demo database.');
    return demoSupplierProducts;
  }

  try {
    const pageSize = 1000;
    const maxPages = 20;
    const allRows: any[] = [];
    const baseUrl = supabaseUrl.replace(/\/$/, '');

    for (let page = 0; page < maxPages; page++) {
      const offset = page * pageSize;
      const endpoint = baseUrl + '/rest/v1/supplier_products?select=*&limit=' + pageSize + '&offset=' + offset;
      const response = await fetch(endpoint, {
        headers: {
          apikey: supabaseKey,
          Authorization: 'Bearer ' + supabaseKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error('Supabase REST ' + response.status + ': ' + detail.slice(0, 180));
      }

      const rows = await response.json();
      if (!Array.isArray(rows) || rows.length === 0) break;
      allRows.push(...rows);
      if (rows.length < pageSize) break;
    }

    if (allRows.length === 0) {
      console.info('Table supplier_products is empty, falling back to demo database.');
      return demoSupplierProducts;
    }

    return allRows.map(normalizeSupplierProduct);
  } catch (err) {
    console.error('Exception fetching supplier_products from Supabase REST, fallback to demo:', err);
    return demoSupplierProducts;
  }
};

export const searchProducts = async (query: string): Promise<SupplierProduct[]> => {
  const allProducts = await fetchProducts();
  if (!query) return allProducts;

  const normalizedQuery = query.toLowerCase();
  return allProducts.filter(p => 
    p.name.toLowerCase().includes(normalizedQuery) ||
    (p.category_name && p.category_name.toLowerCase().includes(normalizedQuery)) ||
    p.supplier.toLowerCase().includes(normalizedQuery)
  );
};

export const groupProductsBySupplier = (products: SupplierProduct[]): Record<string, SupplierProduct[]> => {
  return products.reduce<Record<string, SupplierProduct[]>>((acc, p) => {
    if (!acc[p.supplier]) {
      acc[p.supplier] = [];
    }
    acc[p.supplier].push(p);
    return acc;
  }, {});
};

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit_type: string;
  product_key?: string; // matched real product
  image_url?: string;
  isManual?: boolean;
}

export interface ComparisonResult {
  supplierName: string;
  totalCost: number;
  availableCount: number;
  missingCount: number;
  items: {
    listItemId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    found: boolean;
  }[];
}

export const compareShoppingList = (
  listItems: ShoppingListItem[],
  allProducts: SupplierProduct[]
): ComparisonResult[] => {
  // Get all unique suppliers
  const suppliers = Array.from(new Set(allProducts.map(p => p.supplier)));

  return suppliers.map(supplierName => {
    const supplierProducts = allProducts.filter(p => p.supplier === supplierName);
    
    let totalCost = 0;
    let availableCount = 0;
    let missingCount = 0;

    const items = listItems.map(listItem => {
      // Find matching product in this supplier by name similarity (exact or start matching)
      const matchingProduct = supplierProducts.find(sp => 
        sp.name.toLowerCase().trim() === listItem.name.toLowerCase().trim()
      );

      if (matchingProduct) {
        availableCount++;
        const unitPrice = matchingProduct.price_brl;
        const totalPrice = unitPrice * listItem.quantity;
        totalCost += totalPrice;

        return {
          listItemId: listItem.id,
          productName: listItem.name,
          quantity: listItem.quantity,
          unitPrice,
          totalPrice,
          found: true
        };
      } else {
        missingCount++;
        return {
          listItemId: listItem.id,
          productName: listItem.name,
          quantity: listItem.quantity,
          unitPrice: 0,
          totalPrice: 0,
          found: false
        };
      }
    });

    return {
      supplierName,
      totalCost,
      availableCount,
      missingCount,
      items
    };
  });
};
