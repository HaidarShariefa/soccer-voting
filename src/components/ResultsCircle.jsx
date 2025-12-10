import { motion } from 'framer-motion';

const ResultsCircle = ({ votes }) => {
  // Calculate percentages
  const total = votes.real + votes.city;
  const realPercent = total === 0 ? 50 : Math.round((votes.real / total) * 100);
  const cityPercent = total === 0 ? 50 : 100 - realPercent;

  // Circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (realPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center mt-16 mb-12">
      <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-8">Live Fan Votes</h3>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Circle (City) */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="#6CABDD" // City Sky Blue
            strokeWidth="24"
            fill="transparent"
            className="opacity-20"
          />
          <circle
            cx="128"
            cy="128"
            r={radius}
            stroke="#6CABDD"
            strokeWidth="24"
            fill="transparent"
          />
          {/* Foreground Circle (Real) */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="128"
            cy="128"
            r={radius}
            stroke="#FEBE10" // Real Gold
            strokeWidth="24"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <span className="block text-3xl font-bold text-real-gold">{realPercent}%</span>
            <span className="text-xs text-gray-500 uppercase">Real Madrid</span>
          </div>
          <div className="w-12 h-[1px] bg-gray-700 my-2"></div>
          <div className="text-center">
            <span className="block text-3xl font-bold text-city-sky">{cityPercent}%</span>
            <span className="text-xs text-gray-500 uppercase">Man City</span>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm mt-6">
        Based on {total.toLocaleString()} fan votes
      </p>
    </div>
  );
};

export default ResultsCircle;
