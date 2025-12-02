import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const { logout } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch('fakestoreapi.com')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    };

    const openNew = () => {
        setProduct({});
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    
    const saveProduct = () => {
        setSubmitted(true);

        if (product.title && product.price && product.category) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                // U (Update)
                const index = findIndexById(product.id);
                _products[index] = _product;
                fetch(`fakestoreapi.com{product.id}`, { method: "PUT", body: JSON.stringify(_product) });
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto Atualizado!', life: 3000 });
            } else {
                // C (Create)
                _product.id = Math.floor(Math.random() * 10000); 
                _product.image = 'https://i.pravatar.cc'; 
                _products.push(_product);
                fetch('fakestoreapi.com', { method: "POST", body: JSON.stringify(_product) });
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto Criado!', life: 3000 });
            }

            setProducts(_products);
            setProductDialog(false);
            setProduct({});
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        // D (Delete)
        let _products = products.filter(val => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        fetch(`fakestoreapi.com{product.id}`, { method: "DELETE" });
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Produto Deletado!', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    };

    const updateFormField = (name, value) => {
        let _product = {...product};
        _product[`${name}`] = value;
        setProduct(_product);
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.title} style={{ width: '64px', objectFit: 'contain' }} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button icon="pi pi-pencil" rounded severity="success" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </>
    );

    return (
        <div className="p-grid mt-5">
            <Toast ref={toast} />
            <div className="p-col-12">
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-4">
                        <h1 className="m-0">Gestão de Produtos</h1>
                        <div className="flex gap-2">
                            <Button label="Novo Produto" icon="pi pi-plus" severity="primary" onClick={openNew} />
                            <Button label="Sair (Logout)" icon="pi pi-sign-out" severity="secondary" onClick={logout} />
                        </div>
                    </div>

                    <DataTable value={products} loading={loading} paginator rows={10} 
                        emptyMessage="Nenhum produto encontrado.">
                        <Column field="id" header="ID"></Column>
                        <Column field="title" header="Nome"></Column>
                        <Column header="Imagem" body={imageBodyTemplate}></Column>
                        <Column field="category" header="Categoria"></Column>
                        <Column field="price" header="Preço" body={(rowData) => `$${rowData.price.toFixed(2)}`}></Column>
                        <Column body={actionBodyTemplate} header="Ações" style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
            </div>

            <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalhes do Produto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={product.image} alt="Imagem" className="block m-auto pb-3" style={{ width: '150px' }} />}
                
                <div className="field mb-3">
                    <label htmlFor="title" className="font-bold">Nome</label>
                    <InputText id="title" value={product.title || ''} onChange={(e) => updateFormField('title', e.target.value)} required autoFocus className={classNames({ 'p-invalid': submitted && !product.title })} />
                    {submitted && !product.title && <small className="p-error">Nome é obrigatório.</small>}
                </div>

                <div className="field mb-3">
                    <label htmlFor="price" className="font-bold">Preço</label>
                    <InputNumber id="price" value={product.price || 0} onValueChange={(e) => updateFormField('price', e.value)} mode="currency" currency="USD" locale="en-US" required className={classNames({ 'p-invalid': submitted && !product.price })} />
                    {submitted && !product.price && <small className="p-error">Preço é obrigatório.</small>}
                </div>
                
                <div className="field mb-3">
                    <label htmlFor="category" className="font-bold">Categoria</label>
                    <InputText id="category" value={product.category || ''} onChange={(e) => updateFormField('category', e.target.value)} required className={classNames({ 'p-invalid': submitted && !product.category })} />
                    {submitted && !product.category && <small className="p-error">Categoria é obrigatória.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar Exclusão" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Tem certeza que deseja deletar o produto **{product.title}**?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
