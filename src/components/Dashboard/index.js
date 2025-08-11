import { useEffect, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux';
// import { increment, decrement, incrementByAmount } from './counterSlice';
import DataGrid, { Editing } from 'devextreme-react/data-grid';
import './index.css';
import { useState } from 'react';
import FormProductPopup from '../FormProductPopup';
import { useDispatch } from 'react-redux';
import { removeProduct, fetchProducts } from '../../Service/productsSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dashboard = () => {
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [product, setProduct] = useState();
    const products = useSelector((state) => state.products?.items);
    const status = useSelector((state) => state.products.status); // לקבלת מצב הטעינה
    const error = useSelector((state) => state.products.error);
    const dispatch = useDispatch();
    const onSuccessMessage = (message) => toast.success(message);
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);
    const columns = useMemo(() => [
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
    ], [])

    const handleRowDblClick = useCallback((e) => {
        setProduct(e.data);
        setIsShowPopup(true);
    }, []); 

    const handleRowRemoving = useCallback((e) => {
        e.cancel = true;
        dispatch(removeProduct(e.data.id));
    }, [dispatch]);

    if (status === 'loading') return <div>טוען...</div>;
    if (status === 'failed') return <div>שגיאה: {error}</div>;
    
    return (<div className='dashboard'>
        <ToastContainer
            position="top-right"
            autoClose={3000}  // סגירה אוטומטית אחרי 3 שניות
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}  // תמיכה בכתיבה מימין לשמאל (עברית)
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
        <DataGrid
            dataSource={products}
            columns={columns}
            onRowDblClick={handleRowDblClick}
            style={{ margin: 'auto' }}
            filterRow={{ visible: true, applyFilter: 'auto' }}
            headerFilter={{ visible: true }}
            onRowRemoving={handleRowRemoving}
            width="95%" >
            <Editing
                allowDeleting={true}
                mode="row"
            />
        </DataGrid>
        <button onClick={() => { setProduct(); setIsShowPopup(true) }}>הוסף מוצר</button>
        {isShowPopup && <FormProductPopup onSuccessMessage={onSuccessMessage} product={product} onClose={() => { setProduct(); setIsShowPopup(false) }} />}
    </div>)
}

export default Dashboard