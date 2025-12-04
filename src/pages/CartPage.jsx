import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function CartPage(){
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalPrice = cartItems.reduce((s,i)=> s + (i.price * i.quantity), 0);

  const fetchAddress = async () => {
    setLoading(true); setError(null); setAddress(null);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      if(j.erro) throw new Error("CEP não encontrado");
      setAddress(j);
    } catch(e){
      setError(e.message);
    } finally { setLoading(false); }
  };

  const handleCheckout = () => {
    if(!address){ alert("Verifique o CEP antes"); return; }
    navigate("/checkout");
  };

  const imageBody = (row) => <img src={row.image} alt="" style={{width:50,height:50,objectFit:"contain"}} />;

  return (
    <div>
      <h1>Seu Carrinho</h1>
      {cartItems.length===0 ? <p>Seu carrinho está vazio.</p> : (
        <div className="p-grid">
          <div className="p-col-12 p-md-8">
            <DataTable value={cartItems}>
              <Column header="Imagem" body={imageBody} />
              <Column field="title" header="Produto" />
              <Column header="Preço" body={r => `R$ ${r.price.toFixed(2)}`} />
              <Column field="quantity" header="Qtd" />
              <Column header="Total" body={r => `R$ ${(r.price*r.quantity).toFixed(2)}`} />
              <Column header="Remover" body={r => <Button icon="pi pi-trash" className="p-button-danger" onClick={()=>removeFromCart(r.id)} />} />
            </DataTable>
          </div>

          <div className="p-col-12 p-md-4">
            <Card title="Resumo do Pedido">
              <p style={{fontSize:20}}>Total: <strong>R$ {totalPrice.toFixed(2)}</strong></p>

              <label>Consulta CEP</label>
              <div className="p-inputgroup" style={{marginTop:8}}>
                <InputText value={cep} onChange={e=>setCep(e.target.value.replace(/\D/g,''))} maxLength={8} placeholder="01001000" />
                <Button icon="pi pi-search" onClick={fetchAddress} disabled={loading || cep.length !== 8} />
              </div>

              {loading && <ProgressSpinner style={{width:36,height:36,marginTop:12}} />}
              {error && <small className="p-error">{error}</small>}
              {address && (
                <div style={{marginTop:12,background:"#f0fff4",padding:12,borderRadius:8}}>
                  <div>{address.logradouro}</div>
                  <div>{address.bairro} - {address.localidade}/{address.uf}</div>
                </div>
              )}

              <Button label="Finalizar" className="p-button-success" style={{width:"100%", marginTop:12}} onClick={handleCheckout} disabled={!address} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
