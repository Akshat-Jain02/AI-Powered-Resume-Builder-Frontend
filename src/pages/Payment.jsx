import { useState, useEffect } from 'react';
import { paymentService } from '../api/payment.service';
import './Payment.css';

function Payment() {
  const [plans, setPlans] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPlans();
    loadCredits();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await paymentService.getPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadCredits = async () => {
    try {
      const data = await paymentService.getCredits();
      setCredits(data);
    } catch (error) {
      console.error('Error loading credits:', error);
    }
  };

  const handlePurchase = async (planType) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Step 1: Create order
      const orderData = await paymentService.createOrder(planType);

      // Step 2: Initialize Razorpay
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.companyName,
        description: `Purchase ${orderData.credits} AI Credits`,
        image: orderData.companyLogo,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          // Step 3: Verify payment
          try {
            const verifyData = await paymentService.verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyData.success) {
              setMessage({
                type: 'success',
                text: `Payment successful! ${verifyData.creditsGranted} credits added to your account.`
              });
              loadCredits(); // Reload credits
            } else {
              setMessage({
                type: 'error',
                text: verifyData.message || 'Payment verification failed'
              });
            }
          } catch (error) {
            setMessage({
              type: 'error',
              text: 'Payment verification failed. Please contact support.'
            });
          }
          setLoading(false);
        },
        prefill: {
          name: orderData.userName,
          email: orderData.userEmail
        },
        theme: {
          color: '#1a3a5c'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setMessage({
              type: 'info',
              text: 'Payment cancelled'
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error creating order:', error);
      setMessage({
        type: 'error',
        text: 'Failed to create order. Please try again.'
      });
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Buy AI Credits</h1>
        <p>Purchase credits to unlock AI-powered resume analysis and ATS scoring</p>
      </div>

      {credits && (
        <div className="credits-display">
          <div className="credits-card">
            <h3>Your Credits</h3>
            <div className="credits-stats">
              <div className="stat">
                <span className="stat-value">{credits.remainingCredits}</span>
                <span className="stat-label">Available</span>
              </div>
              <div className="stat">
                <span className="stat-value">{credits.usedCredits}</span>
                <span className="stat-label">Used</span>
              </div>
              <div className="stat">
                <span className="stat-value">{credits.totalCredits}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {message.text && (
        <div className={`payment-message payment-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.type} className={`plan-card ${plan.type === 'PRO' ? 'plan-card--popular' : ''}`}>
            {plan.type === 'PRO' && <div className="plan-badge">Most Popular</div>}
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="currency">₹</span>
                <span className="amount">{plan.price}</span>
              </div>
            </div>
            <div className="plan-credits">
              <strong>{plan.credits}</strong> AI Credits
            </div>
            <p className="plan-description">{plan.description}</p>
            <ul className="plan-features">
              <li>✓ AI Resume Analysis</li>
              <li>✓ ATS Score Checker</li>
              <li>✓ Job Match Score</li>
              {plan.type === 'PRO' && <li>✓ Priority Support</li>}
              {plan.type === 'PREMIUM' && (
                <>
                  <li>✓ Priority Support</li>
                  <li>✓ Premium Features</li>
                </>
              )}
            </ul>
            <button
              className="btn-purchase"
              onClick={() => handlePurchase(plan.type)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Purchase Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="payment-info">
        <h3>How it works</h3>
        <div className="info-steps">
          <div className="step">
            <span className="step-number">1</span>
            <h4>Choose a Plan</h4>
            <p>Select the credit package that suits your needs</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h4>Secure Payment</h4>
            <p>Complete payment via Razorpay - India's most trusted payment gateway</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h4>Use Credits</h4>
            <p>Credits are instantly added and ready to use for AI features</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
