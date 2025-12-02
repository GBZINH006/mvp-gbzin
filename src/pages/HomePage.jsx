import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Estado para o erro
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Usando o URL da API que você confirmou
                const response = await fetch('https://fakestoreapi.com/');
                
                // Verifica se a resposta foi OK antes de processar o JSON
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
                }
                
                const json = await response.json();
                setProducts(json);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setError(err.message); // Define o erro para ser exibido na tela
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const itemTemplate = (product, layout) => {
        if (layout === 'grid') {
            return (
                <div key={product.id} className="col-12 md:col-4 p-3">
                    <Card title={product.title} style={{ height: '480px', overflow: 'hidden' }} className="p-card-shadow">
                        <div className="flex flex-column align-items-center">
                            <img src={product.image} alt={product.title} style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '1rem' }} />
                            <h3 className="text-xl mt-0 mb-3">${product.price.toFixed(2)}</h3>
                            <Rating value={product.rating.rate} readOnly cancel={false} />
                            <Link to={`/product/${product.id}`} className="mt-3">
                                <Button label="Ver Detalhes" icon="pi pi-search" className="p-button-outlined w-full mb-2" />
                            </Link>
                            <Button label="Add Carrinho" icon="pi pi-shopping-cart" className="p-button-success w-full" onClick={() => addToCart(product)} />
                        </div>
                    </Card>
                </div>
            );
        }
        return null;
    };

    // Se houver um erro de API (como o erro HTML/token inesperado), mostre-o na tela
    if (error) {
        return <p>Erro ao carregar produtos: {error}</p>;
    }
    
    if (loading) {
        return <p>Carregando produtos...</p>;
    }

    return (
        <div>
            <h1>Catálogo de Produtos</h1>
            <DataView 
                value={products} 
                layout={layout} 
                itemTemplate={itemTemplate} 
                paginator 
                rows={9}
                header={
                    <div style={{ textAlign: 'right' }}>
                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    </div>
                }
                emptyMessage="Nenhum produto disponível no momento."
            />
        </div>
    );
};

export default HomePage;
