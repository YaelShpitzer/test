import { useEffect } from 'react'
import { useSelector } from 'react-redux';
// import { increment, decrement, incrementByAmount } from './counterSlice';
import DataGrid, { Editing } from 'devextreme-react/data-grid';
import './index.css';
import { useState } from 'react';
import FormProductPopup from '../FormProductPopup';
import { useDispatch } from 'react-redux';
import { removeProduct, fetchProducts } from '../../Service/productsSlice';

const columns = [
    {
        dataType: 'string',
        dataField: "name",
        caption: "שם מוצר",
        allowFiltering: true,
        filterOperations: ['contains'],
        allowHeaderFiltering: false,
    },
    {
        dataType: 'string',
        dataField: "category",
        caption: "קטגוריה",
        allowFiltering: false,
        allowHeaderFiltering: true,
    },
    {
        dataType: 'number',
        dataField: "price",
        caption: "מחיר",
        allowFiltering: false,
        sortOrder: 'asc',
    },
    {
        dataType: 'number',
        dataField: "stock",
        allowFiltering: false,
        caption: "כמות במלאי"
    },
]
const Dashboard = () => {
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [product, setProduct] = useState();
    const products = useSelector((state) => state.products?.items);
    const status = useSelector((state) => state.products.status); // לקבלת מצב הטעינה
    const error = useSelector((state) => state.products.error);
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <div>טוען...</div>; // מציג הודעה בזמן טעינה
    if (status === 'failed') return <div>שגיאה: {error}</div>; // מציג הודעת שגיאה

    return (<div className='dashboard'>
        <DataGrid
            dataSource={products}
            columns={columns}
            onRowDblClick={(e) => { setProduct(e.data); setIsShowPopup(true) }}
            style={{ margin: 'auto' }}
            filterRow={{ visible: true, applyFilter: 'auto' }}
             headerFilter={{ visible: true }} 
            onRowRemoving={(e) => { e.cancel = true; dispatch(removeProduct({ id: e.data.id })) }}
            width="95%" >
            <Editing
                allowDeleting={true}
                mode="row"
            />
        </DataGrid>
        <button onClick={() => { setProduct(); setIsShowPopup(true) }}>הוסף מוצר</button>
        {isShowPopup && <FormProductPopup product={product} onClose={() => { setProduct(); setIsShowPopup(false) }} />}
    </div>)
}

export default Dashboard