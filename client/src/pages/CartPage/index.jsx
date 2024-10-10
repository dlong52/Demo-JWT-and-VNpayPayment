import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { somi, vnpay } from '../../assets';
import { createVnPayPayment, verifyTransaction } from '../../services/VnpayServices';
const CartPage = () => {
  const user = useSelector((state) => state.user);
  const getQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    const transactionNo = queryParams.get('TransactionNo');
    const hmac = queryParams.get('Hmac');
    return { transactionNo, hmac };
  };
  const { transactionNo, hmac } = getQueryParams();
  const orders = [
    {
      product: "Áo sơ mi nam kẻ sọc",
      size: "L",
      price: 300000,
      quantity: 1
    }
  ]
  const totalPayment = orders.reduce((accumulator, order) => {
    return accumulator + (order.price * order.quantity);
  }, 0);
  const handleCreateVnPayPayment = async () => {
    if (user?.userId) {
      const res = await createVnPayPayment(totalPayment)
      if (res?.code === 200) 
        window.location.href = res?.data?.paymentUrl
    }else{
      alert("Bạn chưa đăng nhập")
    }
  }
  useEffect(() => {
    const verifyPayment = async () => {
      if (transactionNo && hmac) {
        const res = await verifyTransaction(transactionNo, hmac)
        if (res) {
          window.location.replace("http://localhost:5173/");
          alert("Thanh toán thành công!")
        }
      }
    }
    verifyPayment()
  }, [transactionNo, hmac])
  return (
    <div className='pb-[100px]'>
      <div className="container m-auto py-6">
        <div className="grid grid-cols-12 gap-x-8">
          <div className="col-span-6 flex flex-col gap-y-6">
            <span className="font-bold text-[25px]">Thông tin đặt hàng</span>
            <div className="grid grid-cols-12 gap-6">
              {user?.userId ? <>
                <div className="col-span-5 flex gap-3">
                  <label htmlFor="username" className='font-medium'>Họ tên:</label>
                  <span>{user?.userName}</span>
                </div>
                <div className="col-span-12 flex gap-3">
                  <span className='font-medium'>Email: </span>
                  <span>{user?.email}</span>
                </div>
              </> :
                <div className="flex gap-3 col-span-12">
                  <span>Bạn chưa đăng nhập!</span>
                  <a href="/signin" className='px-3 py-1 bg-blue-700 rounded-md text-white'>Đăng nhập</a>
                </div>
              }
            </div>
            <span className="font-bold text-[25px]">Hình thức thanh toán</span>
            <div className="flex flex-col gap-y-6">
              <div className="h-[67px] rounded-[15px] border flex items-center p-6 gap-6 cursor-pointer border-blue-500">
                <div className="size-[20px] rounded-full border flex items-center justify-center border-blue-500">
                  <div className="size-[10px] bg-blue-500 rounded-full"></div>
                </div>
                <img className="max-h-[30px] max-w-[60px]" src={vnpay} />
                <div className="flex flex-col font-medium text-gray-600">
                  <span>Ví điện tử VNPAY</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 flex flex-col gap-y-6">
            <span className="font-bold text-[25px]">Giỏ hàng</span>
            <div>
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 text-nowrap">Sản phẩm</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 text-nowrap">Số lượng</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 text-nowrap">Tổng</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr className="h-[100px] bg-white text-footer border-b last:border-none">
                      <td className="flex items-center w-[350px] p-5">
                        <img className="w-[80px] object-cover rounded-md" src={somi} alt="" />
                        <div className="flex flex-col gap-y-1 ml-4">
                          <h1 className="font-semibold text-[14px] w-[200px] truncate">{order.product}</h1>
                          <div className="flex items-center gap-x-2">
                            <label className='text-sm text-gray-500' htmlFor="">Size: {order.size}</label>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <span className="font-semibold text-lg">X {order.quantity}</span>
                        </div>
                      </td>
                      <td className="p-5 text-[16px] font-semibold text-center">{order.price * order.quantity}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <div className="flex flex-col text-[15px] font-medium text-gray-700 gap-y-3 py-6 border-y my-6">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{totalPayment}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>0đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng</span>
                    <span>Miễn phí</span>
                  </div>
                </div>
                <div className="flex justify-between text-[18px] font-medium text-gray-800">
                  <span>Tổng</span>
                  <span className='font-bold'>{totalPayment}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-white shadow-inner grid grid-cols-12">
        <div className="col-span-6 flex items-center bg-slate-100 px-6">
          <div className="font-semibold w-1/2 flex justify-center items-center p-6 gap-3 border-r-2">
            <img className='h-[40px] max-w-[100px]' src={vnpay} alt="" />
          </div>
          <span className="text-[14px] font-semibold text-blue-800 w-1/2 flex justify-center p-6 ">Chưa dùng voucher</span>
        </div>
        <div className="col-span-6 flex items-center justify-end gap-6 px-6">
          <div className="flex flex-col items-end">
            <span className="font-semibold">Thành tiền</span>
            <span className="font-bold text-blue-700 text-[25px]">{totalPayment}đ</span>
          </div>
          <button onClick={handleCreateVnPayPayment} className="w-[200px] py-3 bg-black text-white rounded-full">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
