import axios from 'axios'
const createVnPayPayment = async (total_amount) => {
    const res = await axios.get(`http://localhost:8080/api/payment/vn-pay?amount=${total_amount}&bankCode=NCB`);
    return res.data;
}
const verifyTransaction = async (transactionNo, hmac) => {
    const res = await axios.post(`http://localhost:8080/api/payment/verify-transaction`, {
        transactionNo, hmac
    })
    return res.data;
}
export {
    createVnPayPayment,
    verifyTransaction
}