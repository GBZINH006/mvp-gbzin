import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { useCart } from "../context/CartContext";

export default function ProductDetailPage(){
  const { id } = useParams();
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(()=> {
    (async ()=>{
      try{
        const r = await fetch(`https://fakestoreapi.com/products/${id}`);
        if(!r.ok) throw new Error("Produto não encontrado");
        setProd(await r.json());
      }catch(e){
        console.error(e);
      }finally{ setLoading(false); }
    })();
  },[id]);

  if(loading) return <p>Carregando...</p>;
  if(!prod) return <p>Produto não encontrado</p>;

  return (
    <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
      <img src={prod.image} alt={prod.title} style={{width:360,height:360,objectFit:"contain",borderRadius:12,background:"#fff"}} />
      <div style={{flex:1}}>
        <h2>{prod.title}</h2>
        <div style={{color:"#10b981",fontSize:22,fontWeight:700}}>R$ {prod.price.toFixed(2)}</div>
        <Rating value={prod.rating?.rate||0} readOnly cancel={false} />
        <p style={{marginTop:12}}>{prod.description}</p>
        <div style={{marginTop:12,display:"flex",gap:12}}>
          <Button label="Adicionar ao Carrinho" className="p-button-success" onClick={()=>addToCart(prod)} />
          <Button label="Comprar Agora" className="p-button-help" onClick={()=>window.location.href="/checkout"} />
        </div>
      </div>
    </div>
  );
}
