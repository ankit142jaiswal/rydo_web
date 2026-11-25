// Razorpay payment integration utility
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (orderData, onSuccess, onFailure) => {
  const res = await loadRazorpay();
  
  if (!res) {
    onFailure('Razorpay SDK failed to load');
    return;
  }

  const options = {
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'RYDO',
    description: 'Payment for ride booking',
    order_id: orderData.id,
    handler: function (response) {
      onSuccess(response);
    },
    prefill: {
      name: orderData.customerName || '',
      email: orderData.customerEmail || '',
      contact: orderData.customerPhone || ''
    },
    theme: {
      color: '#FFC107'
    },
    modal: {
      ondismiss: function() {
        onFailure('Payment cancelled by user');
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};