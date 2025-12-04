import React, { useState } from "react";
import { generateFakeCard, sampleFakeCards } from "../utils/fakeCard";
import "./fakeCardGenerator.css";

export default function FakeCardGenerator({ onUse }){
  const [cards, setCards] = useState([...sampleFakeCards]);

  function addCard(){
    const c = generateFakeCard();
    setCards(prev => [c, ...prev]);
  }

  function useCard(c){
    if(typeof onUse === "function") onUse(c);
    else navigator.clipboard.writeText(c.numero || c.number);
  }

  return (
    <div className="fakecard-wrap">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center", marginBottom:8}}>
        <h4>Cartões de Teste</h4>
        <button className="btn primary" onClick={addCard}>Gerar</button>
      </div>

      <div className="fakecard-grid">
        {cards.map((c, i)=>(
          <div key={i} className="fakecard-card">
            <div className="fakecard-top">
              <div className="fakecard-name">{c.nome || c.name}</div>
              <div className="fakecard-num">{c.numero || c.number}</div>
            </div>
            <div className="fakecard-meta">
              <div>Val: {c.validade || c.exp}</div>
              <div>CVV: {c.cvv}</div>
            </div>
            <div className="fakecard-actions">
              <button className="btn" onClick={()=>navigator.clipboard.writeText(c.numero || c.number)}>Copiar Número</button>
              <button className="btn success" onClick={()=>useCard(c)}>Usar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
