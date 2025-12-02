import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable'; 
import { Column } from 'primereact/column'; 


const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const fetchAddress = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`viacep.com.br{cep}/json/`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro de rede: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            if (data.erro) throw new Error('CEP não encontrado na base de dados.');
            setAddress(data);
        } catch (err) {
            setError(err.message);
            setAddress(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = () => {
        if (!address) {
            alert("Por favor, verifique o CEP antes de finalizar a compra.");
            return;
        }
        alert(`Compra finalizada! Entregaremos em ${address.logradouro}, ${address.bairro}.`);
        clearCart();
        navigate('/');
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />;
    };

    const actionBodyTemplate = (rowData) => (
        <Button icon="pi pi-trash" className="p-button-danger p-button-rounded" onClick={() => removeFromCart(rowData.id)} />
    );

    return (
        <div>
            <h1>Seu Carrinho de Compras</h1>
            {cartItems.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <DataTable value={cartItems} tableStyle={{ minWidth: '50rem' }}>
                            <Column header="Imagem" body={imageBodyTemplate}></Column>
                            <Column field="title" header="Produto"></Column>
                            <Column field="price" header="Preço Unitário" body={(rowData) => `$${rowData.price.toFixed(2)}`}></Column>
                            <Column field="quantity" header="Qtd"></Column>
                            <Column header="Total" body={(rowData) => `$${(rowData.price * rowData.quantity).toFixed(2)}`}></Column>
                            <Column body={actionBodyTemplate} header="Remover"></Column>
                        </DataTable>
                    </div>

                    <div className="col-12 md:col-4">
                        <Card title="Resumo do Pedido">
                            <p className="text-2xl">Total: **${totalPrice.toFixed(2)}**</p>
                            
                            <div className="mt-4">
                                <label htmlFor="cep" className="block mb-2">Consultar CEP para Entrega</label>
                                <div className="p-inputgroup">
                                    <InputText id="cep" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Digite o CEP (apenas números)" maxLength={8} />
                                    <Button icon="pi pi-search" onClick={fetchAddress} disabled={loading || cep.length !== 8} />
                                </div>
                                {loading && <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />}
                                {error && <small className="p-error">{error}</small>}
                                {address && (
                                    <div className="mt-3 p-3 bg-green-100 border-round">
                                        <p>Endereço: {address.logradouro}, {address.bairro}</p>
                                        <p>{address.localidade} - {address.uf}</p>
                                    </div>
                                )}
                            </div>

                            <Button 
                                label="Finalizar Compra" 
                                icon="pi pi-check" 
                                className="p-button-success w-full mt-3" 
                                onClick={handleCheckout}
                                disabled={!address}
                            />
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
