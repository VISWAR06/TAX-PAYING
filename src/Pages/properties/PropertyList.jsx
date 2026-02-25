import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { propertyService } from '../../services/propertyService';
import { Building2, Plus, Search, MapPin, Ruler } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyList = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = () => {
    if (user.role === 'citizen') {
      setProperties(propertyService.getPropertiesByOwner(user.id));
    } else {
      setProperties(propertyService.getAllProperties());
    }
  };

  const filteredProperties = properties.filter(p =>
    p.address.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {user.role === 'citizen' ? 'My Properties' : 'Property Registry'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view property details and tax status.</p>
        </div>

        {/* Only citizens might register themselves or staff adds for them */}
        <button
          onClick={() => navigate('/properties/add')}
          className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Property</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by address or owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600">No properties found</p>
            <p className="text-sm mt-1">Try adjusting your search or add a new property.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredProperties.map(property => (
              <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                <div className="h-32 bg-gradient-to-r from-primary-100 to-primary-50 relative flex items-center justify-center border-b border-gray-100">
                  <Building2 className="w-12 h-12 text-primary-300 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-medium px-2.5 py-1 rounded-full text-gray-700 uppercase tracking-wide shadow-sm border border-gray-100">
                    {property.propertyType}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{property.ownerName}</h3>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-2">{property.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Ruler className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                      <span>{property.builtupArea} sq.ft</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">ID: {property.id.toUpperCase()}</span>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline">
                      View details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
