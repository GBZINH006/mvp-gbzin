import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import FakeCardGenerator from "./FakeCardGenerator";

export default function Checkout(){
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  function handleUseCard(card){
    setName(card.name || card.nome);
    setNumber(card.number || card.numero);
    setExp(card.exp || card.validade);
    setCvv(card.cvv || card.cvv);
  }

  function pay(){
    alert("Pagamento simulado (apenas teste). Obrigado!");
  }

  return (
    <div style={{maxWidth:900, margin:"0 auto"}}>
      <h2>Checkout</h2>
      <div style={{display:"flex",gap:20}}>
        <Card style={{flex:1}}>
          <label>Nome no cartão</label>
          <InputText value={name} onChange={e=>setName(e.target.value)} />
          <label style={{marginTop:8}}>Número do cartão</label>
          <InputText value={number} onChange={e=>setNumber(e.target.value)} />
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <InputText placeholder="MM/AA" value={exp} onChange={e=>setExp(e.target.value)} style={{flex:1}} />
            <InputText placeholder="CVV" value={cvv} onChange={e=>setCvv(e.target.value)} style={{width:120}} />
          </div>

          <Button label="Pagar (simulado)" className="p-button-success" style={{marginTop:12}} onClick={pay} />
        </Card>

        <div style={{width:380}}>
          <FakeCardGenerator onUse={handleUseCard} />
        </div>
      </div>
    </div>
  );
}
