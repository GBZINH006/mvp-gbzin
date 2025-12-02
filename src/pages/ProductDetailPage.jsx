import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/{id}`)
            .then(res => res.json())
            .then(json => {
                setProduct(json);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [id]);

    if (loading) return <p>Carregando detalhes do produto...</p>;
    if (!product) return <p>Produto não encontrado.</p>;

    return (
        <div className="p-grid p-nogutter p-justify-center">
            <div className="p-col-12 p-md-8">
                <Button label="Voltar" icon="pi pi-arrow-left" className="p-button-text" onClick={() => navigate(-1)} />
                <Card title={product.title} style={{ marginTop: '1rem' }}>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4 flex justify-content-center">
                            <img src={product.image} alt={product.title} style={{ width: '250px', height: '250px', objectFit: 'contain' }} />
                        </div>
                        <div className="p-col-12 p-md-8">
                            <h2 className="text-2xl">${product.price.toFixed(2)}</h2>
                            <div className="flex align-items-center mb-3">
                                <Rating value={product.rating.rate} readOnly cancel={false} />
                                <span className="ml-2">({product.rating.count} avaliações)</span>
                            </div>
                            <p className="mb-4">{product.description}</p>
                            <Button 
                                label="Adicionar ao Carrinho" 
                                icon="pi pi-shopping-cart" 
                                className="p-button-success" 
                                onClick={() => addToCart(product)}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetailPage;
