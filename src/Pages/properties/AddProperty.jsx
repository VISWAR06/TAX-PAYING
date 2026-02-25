import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { propertyService } from '../../services/propertyService';
import { db } from '../../mockData/db';
import { Building2, ArrowLeft, Save } from 'lucide-react';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerId: user.role === 'citizen' ? user.id : '',
    address: '',
    builtupArea: '',
    propertyType: 'residential'
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user.role !== 'citizen') {
      // Load possible owners (citizens)
      setUsers(db.data.users.filter(u => u.role === 'citizen'));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    propertyService.addProperty({
      ...formData,
      builtupArea: Number(formData.builtupArea),
      ownerId: formData.ownerId
    });
    navigate(user.role === 'citizen' ? '/my-properties' : '/properties');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4 border-b border-gray-200 pb-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Property</h2>
          <p className="text-sm text-gray-500 mt-1">Register a new property to the municipal system.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-primary-50/50 flex items-center">
          <Building2 className="w-6 h-6 text-primary-600 mr-3" />
          <h3 className="font-semibold text-gray-800">Property Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {user.role !== 'citizen' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Owner</label>
              <select
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              >
                <option value="">Select an owner...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
            <textarea
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 123 Main St, Block B, Floor 2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Built-up Area (sq. ft)</label>
              <input
                type="number"
                required
                min="100"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1500"
                value={formData.builtupArea}
                onChange={(e) => setFormData({ ...formData, builtupArea: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="vacant">Vacant Land</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
