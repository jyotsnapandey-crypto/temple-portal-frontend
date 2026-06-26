import { Link } from 'react-router-dom';

const TempleCard = ({ temple }) => {
  return (
    <Link to={`/temple/${temple.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-100 hover:-translate-y-1">
        <div className="h-52 overflow-hidden relative">
          {temple.image_url ? (
            <img
              src={temple.image_url}
              alt={temple.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl"
              style={{ background: 'linear-gradient(135deg, #FDE8D0, #FBBF7A)' }}>🛕</div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
              {temple.deity}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-stone-800 group-hover:text-orange-700 transition-colors leading-snug">
            {temple.name}
          </h3>
          <div className="flex items-center gap-1 mt-1.5 text-sm text-stone-500">
            <span>📍</span>
            <span>{temple.city}, {temple.state}</span>
          </div>
          <p className="text-sm text-stone-600 mt-3 line-clamp-2 leading-relaxed">{temple.description}</p>
          <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
            <span>View details</span>
            <span className="ml-1 group-hover:ml-2 transition-all">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TempleCard;