import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header(){
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const nav = useNavigate();

  function onSearch(){
    nav(`/?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/" className="logo">GBZINSTORE</Link>
      </div>

      <div className="header-center">
        <InputText placeholder="Buscar produtos..." value={q} onChange={(e)=>setQ(e.target.value)} />
        <Button icon="pi pi-search" onClick={onSearch} className="ml-2" />
      </div>

      <div className="header-right">
        {!user ? (
          <Link to="/login"><Button label="Entrar / Criar Conta" className="p-button-text" /></Link>
        ) : (
          <>
            <span className="username">Olá, {user.name}</span>
            <Button label="Sair" className="p-button-text" onClick={logout} />
          </>
        )}

        <Link to="/cart" className="cart-link" aria-label="Carrinho">
          <i className="pi pi-shopping-cart cart-icon" />
          {cartItems.length > 0 && <Badge value={cartItems.length} severity="danger" />}
        </Link>
      </div>
    </header>
  );
}
