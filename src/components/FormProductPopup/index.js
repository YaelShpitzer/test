import { useState, useEffect } from 'react';
import Popup from 'devextreme-react/popup';
import SelectBox from 'devextreme-react/select-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import { useDispatch } from 'react-redux';
import { addProduct, editProduct } from '../../Service/productsSlice';
import './index.css';

const FormProductPopup = ({ product, onClose, onSuccessMessage }) => {
    const [visible, setVisible] = useState(true);
    const [name, setName] = useState(product?.name);
    const [selectCategory, setSelectCategory] = useState();
    const [price, setPrice] = useState(product?.price);
    const [stock, setStock] = useState(product?.stock);
    const dispatch = useDispatch();
    const categories = [
        { key: 1, text: "כלי בית" },
        { key: 2, text: "מכשירי כתיבה" },
        { key: 3, text: "בגדים" },
        { key: 4, text: "מכשירי חשמל" }
    ];

    useEffect(() => {
        if (!selectCategory && product && product?.category) {
            setSelectCategory(categories?.find(item => item.text === product?.category)?.key)
        }

    }, [product, categories])

    const handleSubmit = () => {
        if (!name || price <= 0 || stock < 0) {
            alert('אנא מלא/י את כל השדות כראוי');
            return;
        }

        const body = {
            ...product,
            name,
            price,
            stock,
            category: categories.find(c => c.key === selectCategory)?.text
        }
        product ? dispatch(editProduct(body)) : dispatch(addProduct(body))
        onSuccessMessage(product ? 'המוצר עודכן בהצלחה' : 'המוצר התווסף בהצלחה')
        onClose();
    }
    return (<Popup
        visible={visible}
        onClose={onClose}
        onHiding={() => { setVisible(false); onClose() }}
        // closeOnOutsideClick={false}
        showTitle={true}
        title={product ? 'עדכן מוצר' : 'הוסף מוצר'}
        width={500}
        height={400}
    >
        <div className='d-flex'>
            <label >שם מוצר</label>
            <TextBox
                width={200}
                value={name}
                onValueChanged={e => setName(e.value)}
            />
        </div>
        <div className='d-flex'>
            <label>קטגוריה</label>
            <SelectBox
                width={200}
                dataSource={categories}
                valueExpr="key"
                displayExpr="text"
                value={selectCategory}
                onValueChanged={e => setSelectCategory(e.value)}
                placeholder="בחר קטגוריה"
            />
        </div>
        <div className='d-flex'>
            <label>מחיר</label>
            <NumberBox
                width={200}
                value={price}
                
                onValueChanged={e => setPrice(e.value)}
            />
        </div>
        <div className='d-flex'>
            <label>כמות</label>
            <NumberBox
                width={200}
                value={stock}
                onValueChanged={e => setStock(e.value)}
            />
        </div>
        <button onClick={handleSubmit}>שמור</button>
    </Popup>)
}

export default FormProductPopup;