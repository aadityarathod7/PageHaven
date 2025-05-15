import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import { colors, typography, borderRadius, shadows } from '../styles/theme';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaQrcode, FaCreditCard } from 'react-icons/fa';

const PaymentContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: ${colors.background.primary};
  border-radius: ${borderRadius.xl};
  box-shadow: ${shadows.lg};
`;

const PaymentTitle = styled.h2`
  color: ${colors.text.primary};
  font-family: ${typography.fonts.heading};
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PaymentAmount = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeights.semibold};
`;

const PaymentButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  font-weight: ${typography.fontWeights.medium};
  margin-top: 1rem;
  background: ${colors.primary};
  border: none;
  
  &:hover {
    background: ${colors.secondary};
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentMethod = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.$selected ? colors.primary : colors.background.accent};
  border-radius: ${borderRadius.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$selected ? `${colors.primary}10` : 'transparent'};

  &:hover {
    border-color: ${colors.primary};
    background: ${props => props.$selected ? `${colors.primary}10` : `${colors.primary}05`};
  }

  svg {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${props => props.$selected ? colors.primary : colors.text.secondary};
  }

  div {
    color: ${props => props.$selected ? colors.primary : colors.text.primary};
    font-weight: ${typography.fontWeights.medium};
  }
`;

const ErrorText = styled.p`
  color: ${colors.danger};
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const PaymentForm = ({ amount, onSuccess, bookTitle, bookId }) => {
  const { authAxios } = useContext(AuthContext);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [error, setError] = useState('');

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        toast.error('Failed to load Razorpay SDK');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createOrder = async (paymentDetails) => {
    try {
      console.log('Creating order with bookId:', bookId);
      const response = await authAxios.post('/api/orders', {
        bookId: bookId,
        paymentId: paymentDetails.razorpay_payment_id,
        orderId: paymentDetails.razorpay_order_id,
        amount,
        paymentMethod: selectedMethod
      });
      console.log('Order created successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error);
      toast.error('Payment successful but failed to create order');
      return false;
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }
    setError('');

    try {
      const res = await initializeRazorpay();

      if (!res) {
        toast.error('Razorpay SDK failed to load. Please try again.');
        return;
      }

      // Create order on your backend
      const { data } = await authAxios.post('/api/payments/create-order', {
        amount,
        paymentMethod: selectedMethod
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "Book Platform",
        description: `Purchase ${bookTitle}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const { data } = await authAxios.post('/api/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentMethod: selectedMethod
            });

            if (data.success) {
              // Create order in database
              const orderCreated = await createOrder(response);
              
              if (orderCreated) {
                toast.success('Payment successful!');
                onSuccess({
                  id: response.razorpay_payment_id,
                  amount: amount
                });
              } else {
                toast.error('Payment was successful but order creation failed. Please contact support.');
              }
            }
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', err);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: colors.primary
        }
      };

      // Add method-specific options
      if (selectedMethod === 'upi') {
        options.method = 'upi';
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error('Failed to create payment order. Please try again.');
      console.error('Payment error:', err);
    }
  };

  return (
    <PaymentContainer>
      <PaymentTitle>Payment Details</PaymentTitle>
      
      <PaymentAmount>
        Amount to Pay: ₹{(amount / 100).toFixed(2)}
      </PaymentAmount>

      <PaymentMethods>
        <PaymentMethod 
          onClick={() => setSelectedMethod('upi')}
          $selected={selectedMethod === 'upi'}
        >
          <FaQrcode />
          <div>UPI</div>
        </PaymentMethod>
        <PaymentMethod 
          onClick={() => setSelectedMethod('card')}
          $selected={selectedMethod === 'card'}
        >
          <FaCreditCard />
          <div>Card</div>
        </PaymentMethod>
      </PaymentMethods>

      {error && <ErrorText>{error}</ErrorText>}

      <PaymentButton onClick={handlePayment}>
        Pay Now
      </PaymentButton>
    </PaymentContainer>
  );
};

export default PaymentForm; 