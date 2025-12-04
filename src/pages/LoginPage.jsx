import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    await login({ email, password: pass });
    nav("/");
  }

  return (
    <div style={{maxWidth:520, margin:"40px auto"}}>
      <h2>Entrar</h2>
      <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:12}}>
        <InputText value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" />
        <InputText value={pass} onChange={e=>setPass(e.target.value)} placeholder="Senha" type="password" />
        <Button label="Entrar" type="submit" />
      </form>
    </div>
  );
}
