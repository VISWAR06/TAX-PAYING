import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { taxService } from '../../services/taxService';
import { paymentService } from '../../services/paymentService';
import { CreditCard, CheckCircle2, ChevronRight, AlertCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentGateway = () => {
  const { user } = useAuth();
  const [unpaidTaxes, setUnpaidTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('card');
  const navigate = useNavigate();

  useEffect(() => {
    const taxes = taxService.getTaxesByUser(user.id);
    setUnpaidTaxes(taxes.filter(t => t.status === 'unpaid'));
  }, [user.id]);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const receipt = paymentService.processPayment(selectedTax.id, method);
      setProcessing(false);
      if (receipt) {
        navigate(`/my-receipts?id=${receipt.id}`);
      }
    }, 1500); // simulate network delay
  };

  if (unpaidTaxes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">You're All Caught Up!</h2>
        <p className="text-gray-500">No pending tax payments for your registered properties.</p>
        <button
          onClick={() => navigate('/my-receipts')}
          className="mt-6 text-primary-600 font-medium hover:underline flex items-center"
        >
          View past receipts <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Pay Taxes Online</h2>
        <p className="text-sm text-gray-500 mt-1">Select an assessed property tax to proceed with the secure payment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Select Tax */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <AlertCircle className="w-4 h-4 text-orange-500 mr-2" />
            Pending Dues
          </h3>
          {unpaidTaxes.map(tax => (
            <div
              key={tax.id}
              onClick={() => setSelectedTax(tax)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedTax?.id === tax.id
                  ? 'border-primary-500 bg-primary-50 shadow-sm transform scale-[1.01]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${selectedTax?.id === tax.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{tax.address}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Tax Year: {tax.year} | ID: {tax.id.toUpperCase()}</p>
                    <div className="mt-2 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded inline-block">
                      Due: {tax.dueDate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">₹{(tax.total).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">Includes ₹{tax.penalty} penalty</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout Box */}
        {selectedTax && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-6 animate-in slide-in-from-right-4">
              <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <h3 className="text-lg font-medium opacity-90">Payment Summary</h3>
                <div className="text-3xl font-bold mt-2">₹{selectedTax.total.toLocaleString()}</div>
                <p className="text-sm opacity-75 mt-1">{selectedTax.id.toUpperCase()}</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Payment Method</h4>
                  <div className="space-y-3">
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${method === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="method" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="text-primary-600 focus:ring-primary-500" />
                      <CreditCard className="w-5 h-5 ml-3 text-gray-600" />
                      <span className="ml-2 font-medium text-gray-700">Credit/Debit Card</span>
                    </label>
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${method === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="method" value="upi" checked={method === 'upi'} onChange={() => setMethod('upi')} className="text-primary-600 focus:ring-primary-500" />
                      <span className="font-bold text-gray-600 italic ml-3">UPI</span>
                      <span className="ml-2 font-medium text-gray-700">UPI / QR</span>
                    </label>
                    <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${method === 'bank' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="method" value="bank" checked={method === 'bank'} onChange={() => setMethod('bank')} className="text-primary-600 focus:ring-primary-500" />
                      <Building2 className="w-5 h-5 ml-3 text-gray-600" />
                      <span className="ml-2 font-medium text-gray-700">Net Banking</span>
                    </label>
                  </div>
                </div>

                {/* Mock Card Input just for show */}
                {method === 'card' && (
                  <div className="space-y-3 animate-in fade-in">
                    <input type="text" placeholder="Card Number" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                    <div className="flex gap-3">
                      <input type="text" placeholder="MM/YY" className="w-1/2 border border-gray-300 rounded-lg p-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                      <input type="text" placeholder="CVV" className="w-1/2 border border-gray-300 rounded-lg p-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3.5 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span> Processing...</>
                  ) : (
                    <>Pay ₹{selectedTax.total.toLocaleString()}</>
                  )}
                </button>
                <div className="text-center text-xs text-gray-500 flex items-center justify-center">
                  <Lock className="w-3 h-3 mr-1" /> Secured by MuniTax Gateway
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Import Lock icon for gateway
import { Lock } from 'lucide-react';

export default PaymentGateway;
