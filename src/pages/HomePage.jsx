import React, { useEffect, useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./HomePage.css";

export default function HomePage(){
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await fetch("https://fakestoreapi.com/products");
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        setProducts(j);
      }catch(err){
        setError(err.message);
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  const itemTemplate = (product) => (
    <div className="product-card">
      <Card>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
          <img src={product.image} alt={product.title} style={{width:140,height:140,objectFit:"contain"}}/>
          <div style={{minHeight:48,marginTop:8,textAlign:"center",fontWeight:600}}>{product.title.length>60?product.title.slice(0,60)+"...":product.title}</div>
          <div style={{color:"#10b981",fontWeight:700, marginTop:6}}>R$ {product.price.toFixed(2)}</div>
          <Rating value={product.rating?.rate||0} readOnly cancel={false} style={{marginTop:6}} />
          <div style={{width:"100%",marginTop:10,display:"flex",gap:8}}>
            <Link to={`/product/${product.id}`} style={{flex:1}}><Button label="Ver" className="p-button-outlined" /></Link>
            <Button label="Carrinho" className="p-button-success" onClick={()=>addToCart(product)} />
          </div>
        </div>
      </Card>
    </div>
  );

  if(loading) return <h3>Carregando produtos...</h3>;
  if(error) return <h3>Erro ao carregar: {error}</h3>;

  return (
    <div>
      <h1 style={{textAlign:"center",marginBottom:12}}>Catálogo</h1>
      <DataView
        value={products}
        layout={layout}
        itemTemplate={(item) => itemTemplate(item)}
        paginator rows={9}
        header={<div style={{textAlign:"right"}}><DataViewLayoutOptions layout={layout} onChange={(e)=>setLayout(e.value)} /></div>}
      />
    </div>
  );
}
