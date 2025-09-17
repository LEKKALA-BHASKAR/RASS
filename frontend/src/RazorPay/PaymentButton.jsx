import React from "react";
import axios from "axios";

function PaymentButton() {
  const handlePayment = async () => {
    try {
      // Create order on backend
      const { data } = await axios.post("http://localhost:5000/order", {
        amount: 500, // Rs. 500
      });

      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Replace with your Key ID
        amount: data.amount,
        currency: data.currency,
        name: "My App",
        description: "Test Transaction",
        order_id: data.id,
        handler: function (response) {
          alert("Payment Successful!");
          console.log(response);
          // Optionally verify payment on backend
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handlePayment} className="p-2 bg-blue-600 text-white rounded">
      Pay ₹500
    </button>
  );
}

export default PaymentButton;
