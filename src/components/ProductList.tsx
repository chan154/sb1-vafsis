import React from 'react';
import { Package, Shield, Users, AlertTriangle } from 'lucide-react';
import type { Product, Vulnerability } from '../types';

interface Props {
  products: Product[];
  vulnerabilities: Vulnerability[];
  onProductSelect: (product: Product) => void;
}

export function ProductList({ products, vulnerabilities, onProductSelect }: Props) {
  const getVulnerabilityStats = (productId: string) => {
    const productVulns = vulnerabilities.filter(v => 
      v.affectedProducts.some(p => p.id === productId)
    );

    return {
      total: productVulns.length,
      critical: productVulns.filter(v => v.severity === 'Critical').length,
      high: productVulns.filter(v => v.severity === 'High').length,
    };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Products</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map(product => {
          const stats = getVulnerabilityStats(product.id);
          
          return (
            <div
              key={product.id}
              onClick={() => onProductSelect(product)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="text-blue-500" size={20} />
                  <h4 className="font-medium">{product.name}</h4>
                </div>
                <span className="text-sm text-gray-500">v{product.version}</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-gray-600">{product.team.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  {stats.critical > 0 && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertTriangle size={16} />
                      <span>{stats.critical}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-500">
                    <Shield size={16} />
                    <span>{stats.total}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Package className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-gray-500">No products added yet</p>
        </div>
      )}
    </div>
  );
}