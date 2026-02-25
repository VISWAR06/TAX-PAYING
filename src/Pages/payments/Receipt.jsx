import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';
import { Receipt as ReceiptIcon, Download, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Receipt = () => {
  const [searchParams] = useSearchParams();
  const receiptId = searchParams.get('id');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [activeReceipt, setActiveReceipt] = useState(null);

  useEffect(() => {
    // Load all user payments
    const userPayments = paymentService.getPaymentsByUser(user.id);
    setPayments(userPayments);

    // Load active receipt if specified
    if (receiptId) {
      const receipt = paymentService.getReceiptById(receiptId);
      if (receipt && receipt.taxDetails.propertyId.includes('p')) { // Ensure authorization loosely
        setActiveReceipt(receipt);
      }
    } else if (userPayments.length > 0) {
      // Default to most recent
      setActiveReceipt(paymentService.getReceiptById(userPayments[0].id));
    }
  }, [receiptId, user]);

  const handlePrint = () => {
    window.print();
  };

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <ReceiptIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Receipts Found</h2>
        <p className="text-gray-500">You haven't made any tax payments yet.</p>
        <button
          onClick={() => navigate('/pay-tax')}
          className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Pay Taxes Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Receipts</h2>
          <p className="text-sm text-gray-500 mt-1">Download and print your official municipal tax receipts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of receipts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hide-on-print h-fit">
          <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700">
            Past Transactions ({payments.length})
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
            {payments.map(payment => (
              <div
                key={payment.id}
                onClick={() => {
                  navigate(`/my-receipts?id=${payment.id}`, { replace: true });
                  setActiveReceipt(paymentService.getReceiptById(payment.id));
                }}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeReceipt?.id === payment.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-700 font-medium capitalize">Paid via {payment.method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Receipt View */}
        <div className="lg:col-span-2">
          {activeReceipt && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden print-receipt relative">

              {/* Receipt Action Bar */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-end space-x-3 hide-on-print">
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 text-primary-600 hover:text-white hover:bg-primary-600 border border-primary-200 bg-primary-50 px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Receipt Content */}
              <div className="p-10" id="receipt-content">
                <div className="text-center pb-6 border-b-2 border-dashed border-gray-200">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">MuniTax</h1>
                  <p className="text-gray-500 mt-1 uppercase tracking-widest text-sm">Official Tax Receipt</p>
                </div>

                <div className="py-6 border-b border-gray-100 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Receipt No.</p>
                    <p className="font-mono font-medium text-gray-900">{activeReceipt.id.toUpperCase()}</p>

                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 mt-4">Payment Date</p>
                    <p className="font-medium text-gray-900">{new Date(activeReceipt.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</p>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase mt-1">
                      Successful
                    </div>

                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 mt-4">Payment Method</p>
                    <p className="font-medium text-gray-900 capitalize">{activeReceipt.method}</p>
                  </div>
                </div>

                <div className="py-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{activeReceipt.ownerName}</p>
                    <p className="text-gray-600 text-sm mt-1">{activeReceipt.propertyAddress}</p>
                    <p className="text-xs text-gray-500 mt-3 font-mono">Tax ID: {activeReceipt.taxId.toUpperCase()} • Prop ID: {activeReceipt.propertyId.toUpperCase()}</p>
                  </div>
                </div>

                <div className="py-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-800">
                        <th className="text-left py-3 text-sm font-semibold text-gray-800">Description</th>
                        <th className="text-right py-3 text-sm font-semibold text-gray-800">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      <tr>
                        <td className="py-4 text-gray-700">Property Tax (Year {activeReceipt.taxDetails?.year})</td>
                        <td className="py-4 text-right font-medium text-gray-900">₹{activeReceipt.taxDetails?.propertyTax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-gray-700">Water Tax & Sanitation</td>
                        <td className="py-4 text-right font-medium text-gray-900">₹{activeReceipt.taxDetails?.waterTax.toLocaleString()}</td>
                      </tr>
                      {activeReceipt.taxDetails?.penalty > 0 && (
                        <tr>
                          <td className="py-4 text-gray-700">Late Penalty</td>
                          <td className="py-4 text-right font-medium text-gray-900">₹{activeReceipt.taxDetails?.penalty.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-800 text-lg">
                        <td className="py-4 font-bold text-gray-900 uppercase">Total Paid</td>
                        <td className="py-4 text-right font-black text-primary-600">₹{activeReceipt.amount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400">
                  This is a computer generated receipt and does not require a physical signature.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hide elements on print using global CSS or inline styles approach via a simple style block */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * { visibility: hidden; }
          .print-receipt, .print-receipt * { visibility: visible; }
          .print-receipt { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
          .hide-on-print { display: none !important; }
        }
      `}} />
    </div>
  );
};

export default Receipt;
