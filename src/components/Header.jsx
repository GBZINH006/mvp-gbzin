import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
    const navigate = useNavigate();
    const { totalItems } = useCart();

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => { navigate('/'); }
        },
        {
            label: 'Admin (Login)',
            icon: 'pi pi-user',
            command: () => { navigate('/login'); }
        }
    ];

    const end = (
        <Button 
            label={`Carrinho (${totalItems})`} 
            icon="pi pi-shopping-cart" 
            className="p-button-rounded p-button-info" 
            onClick={() => navigate('/cart')}
        />
    );

    return (
        <Menubar model={items} end={end} />
    );
};

export default Header;
