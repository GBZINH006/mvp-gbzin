import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext'; 

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(username, password);
        setLoading(false);

        if (!success) {
            alert("Falha no login. Use 'admin' para usuário e '12345' para senha.");
        }
    };

    return (
        <div className="flex justify-content-center mt-5">
            <Card title="Login Administrativo" style={{ width: '25rem' }}>
                <form onSubmit={handleLogin} className="p-fluid">
                    <div className="p-field mb-3">
                        <label htmlFor="username">Usuário</label>
                        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="p-field mb-4">
                        <label htmlFor="password">Senha</label>
                        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" label="Entrar" icon="pi pi-sign-in" loading={loading} />
                </form>
                <p className="mt-3 text-sm">Teste Local: U: `admin`, P: `12345`</p>
            </Card>
        </div>
    );
};

export default LoginPage;
