import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const TempleDetail = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/temples/${id}`)
      .then(res => setTemple(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20 text-gray-500">Loading...</p>;
  if (!temple) return <p className="text-center py-20 text-gray-500">Temple not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/browse" className="text-orange-600 hover:underline text-sm">← Back to Browse</Link>

      {/* Header */}
      <div className="rounded-xl overflow-hidden mt-4 mb-8 relative">
  {temple.image_url ? (
    <img src={temple.image_url} alt={temple.name}
      className="w-full h-72 object-cover" />
  ) : (
    <div className="bg-orange-100 h-72 flex items-center justify-center text-6xl">🛕</div>
  )}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
    <h1 className="text-3xl font-bold text-white">{temple.name}</h1>
    <p className="text-orange-300 mt-1">{temple.city}, {temple.state}</p>
    <p className="text-gray-300 mt-1">Deity: <span className="font-medium text-white">{temple.deity}</span></p>
  </div>
</div>

      {/* History */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-orange-800 mb-2">History</h2>
        <p className="text-gray-700 leading-relaxed">{temple.history}</p>
      </div>

      {/* Deity Significance */}
      {temple.deity_significance && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-orange-800 mb-2">About {temple.deity}</h2>
          <p className="text-gray-700 leading-relaxed">{temple.deity_significance}</p>
        </div>
      )}

      {/* Darshan Timings */}
      {temple.darshan_timings?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-orange-800 mb-3">Darshan Timings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-orange-200 rounded-lg overflow-hidden">
              <thead className="bg-orange-100">
                <tr>
                  <th className="text-left px-4 py-2 text-orange-900">Day</th>
                  <th className="text-left px-4 py-2 text-orange-900">Opens</th>
                  <th className="text-left px-4 py-2 text-orange-900">Closes</th>
                  <th className="text-left px-4 py-2 text-orange-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                {temple.darshan_timings.map((t, i) => (
                  <tr key={i} className="border-t border-orange-100">
                    <td className="px-4 py-2">{t.day_type}</td>
                    <td className="px-4 py-2">{t.open_time}</td>
                    <td className="px-4 py-2">{t.close_time}</td>
                    <td className="px-4 py-2 text-gray-500">{t.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Festivals */}
      {temple.festivals?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-orange-800 mb-3">Festivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {temple.festivals.map((f, i) => (
              <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900">{f.name}</h3>
                {f.festival_date && (
                  <p className="text-sm text-orange-600 mt-1">
                    {new Date(f.festival_date).toDateString()}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

     {temple.visitor_info && (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-orange-800 mb-3">Visitor Information</h2>
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-3">
      {temple.visitor_info.official_website && (
        <div>
          <span className="font-semibold text-orange-900">Official Website: </span>
          <a href={temple.visitor_info.official_website} target="_blank" rel="noreferrer"
            className="text-orange-600 hover:underline">
            {temple.visitor_info.official_website}
          </a>
        </div>
      )}
      {temple.visitor_info.dress_code && (
        <div>
          <span className="font-semibold text-orange-900">Dress Code: </span>
          <span className="text-gray-700">{temple.visitor_info.dress_code}</span>
        </div>
      )}
      {temple.visitor_info.rules && (
        <div>
          <span className="font-semibold text-orange-900">Rules: </span>
          <span className="text-gray-700">{temple.visitor_info.rules}</span>
        </div>
      )}
      {temple.visitor_info.nearby_accommodation && (
        <div>
          <span className="font-semibold text-orange-900">Accommodation: </span>
          <span className="text-gray-700">{temple.visitor_info.nearby_accommodation}</span>
        </div>
      )}
      {temple.visitor_info.transport_options && (
        <div>
          <span className="font-semibold text-orange-900">Transport: </span>
          <span className="text-gray-700">{temple.visitor_info.transport_options}</span>
        </div>
      )}
      {temple.visitor_info.places_to_visit && (
        <div>
          <span className="font-semibold text-orange-900">Places to Visit Nearby: </span>
          <span className="text-gray-700">{temple.visitor_info.places_to_visit}</span>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default TempleDetail;