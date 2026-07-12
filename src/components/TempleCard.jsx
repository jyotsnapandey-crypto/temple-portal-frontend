import { Link } from 'react-router-dom';

const TempleCard = ({ temple }) => {
  return (
    <Link to={`/temple/${temple.id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden shadow-md transition-all duration-400 hover:shadow-2xl hover:-translate-y-2"
        style={{
          border: '1.5px solid rgba(255,160,50,0.15)',
          background: '#fff',
        }}>

        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{ boxShadow: 'inset 0 0 0 2px rgba(255,140,0,0.6), 0 0 25px rgba(255,120,0,0.2)' }} />

        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {temple.image_url ? (
            <img
              src={temple.image_url}
              alt={temple.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl"
              style={{ background: 'linear-gradient(135deg, #FDE8D0, #FBBF7A)' }}>🛕</div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(60,10,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />

          {/* Deity badge top right */}
          <div className="absolute top-3 right-3 z-10">
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.92)', color: '#7B1F1F', backdropFilter: 'blur(8px)' }}>
              {temple.deity}
            </span>
          </div>

          {/* Temple name on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
              {temple.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-orange-300 text-xs">📍</span>
              <span className="text-orange-200 text-xs font-medium">{temple.city}, {temple.state}</span>
            </div>
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #fff9f5, #fff)' }}>
          <p className="text-stone-500 text-xs leading-relaxed line-clamp-1 flex-1 mr-3">
            {temple.description}
          </p>
          <span className="text-orange-600 text-xs font-semibold whitespace-nowrap flex items-center gap-1 group-hover:gap-2 transition-all">
            Explore <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TempleCard;