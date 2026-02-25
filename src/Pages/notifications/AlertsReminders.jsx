import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { taxService } from '../../services/taxService';
import { Bell, AlertTriangle, Calendar, CheckCircle2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AlertsReminders = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateNotifications();
  }, [user]);

  const generateNotifications = () => {
    const notifs = [];
    let idCounter = 1;

    // Welcome notification
    notifs.push({
      id: `ntf_${idCounter++}`,
      type: 'info',
      title: 'Welcome to MuniTax Portal',
      message: 'Thank you for using the modern Municipal Tax Management System.',
      date: new Date().toISOString(),
      read: true
    });

    if (user.role === 'citizen') {
      const taxes = taxService.getTaxesByUser(user.id);

      taxes.forEach(tax => {
        if (tax.status === 'unpaid') {
          const isOverdue = new Date() > new Date(tax.dueDate);
          if (isOverdue) {
            notifs.push({
              id: `ntf_${idCounter++}`,
              type: 'danger',
              title: 'URGENT: Property Tax Overdue',
              message: `Your tax payment of ₹${tax.total.toLocaleString()} for ID ${tax.id.toUpperCase()} was due on ${tax.dueDate}. A 10% penalty has been applied.`,
              date: tax.dueDate, // use due date as reference
              action: { label: 'Pay Now', link: '/pay-tax' },
              read: false
            });
          } else {
            notifs.push({
              id: `ntf_${idCounter++}`,
              type: 'warning',
              title: 'Upcoming Tax Deadline',
              message: `Your property tax of ₹${tax.total.toLocaleString()} is due by ${tax.dueDate}. Please pay early to avoid penalties.`,
              date: new Date().toISOString(), // recent
              action: { label: 'Pay Now', link: '/pay-tax' },
              read: false
            });
          }
        } else {
          // Find the payment receipt in a real app, here we just show a success message
          notifs.push({
            id: `ntf_${idCounter++}`,
            type: 'success',
            title: 'Payment Received Successfully',
            message: `Thank you! We received your payment of ₹${tax.total.toLocaleString()} for ${tax.year} taxes.`,
            date: new Date().toISOString(),
            action: { label: 'View Receipt', link: '/my-receipts' },
            read: true
          });
        }
      });
    } else {
      // System wide notices for staff/admin
      notifs.push({
        id: `ntf_${idCounter++}`,
        type: 'warning',
        title: 'System Maintenance Scheduled',
        message: 'The grievance portal will be undergoing scheduled maintenance this Saturday from 2 AM to 4 AM.',
        date: new Date().toISOString(),
        read: false
      });
      notifs.push({
        id: `ntf_${idCounter++}`,
        type: 'info',
        title: 'New Policy Update',
        message: 'Commercial water tax base has been revised. Please check the new guidelines in the staff portal.',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true
      });
    }

    // Sort by unread first, then by date descending
    notifs.sort((a, b) => {
      if (a.read === b.read) {
        return new Date(b.date) - new Date(a.date);
      }
      return a.read ? 1 : -1;
    });

    setNotifications(notifs);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'info': default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgClass = (type, read) => {
    if (read) return 'bg-white hover:bg-gray-50';
    switch (type) {
      case 'danger': return 'bg-red-50 hover:bg-red-100/50';
      case 'warning': return 'bg-orange-50 hover:bg-orange-100/50';
      case 'success': return 'bg-green-50 hover:bg-green-100/50';
      case 'info': default: return 'bg-blue-50 hover:bg-blue-100/50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Bell className="w-6 h-6 mr-3 text-primary-600" />
            Notifications & Alerts
          </h2>
          <p className="text-sm text-gray-500 mt-1">Stay updated with tax deadlines, payment confirmations, and system alerts.</p>
        </div>

        <button
          onClick={markAllAsRead}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">No notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`p-5 flex gap-4 transition-colors ${getBgClass(notif.type, notif.read)}`}>
              <div className="mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {new Date(notif.date).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm ${!notif.read ? 'text-gray-800 font-medium' : 'text-gray-600'} mb-2`}>
                  {notif.message}
                </p>
                {notif.action && (
                  <button
                    onClick={() => navigate(notif.action.link)}
                    className={`mt-2 text-sm font-bold uppercase tracking-wider hover:underline
                      ${notif.type === 'danger' ? 'text-red-600' :
                        notif.type === 'warning' ? 'text-orange-600' :
                          notif.type === 'success' ? 'text-green-600' : 'text-primary-600'}`}
                  >
                    {notif.action.label} &rarr;
                  </button>
                )}
              </div>
              {!notif.read && (
                <div className="flex items-center">
                  <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsReminders;
