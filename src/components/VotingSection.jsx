import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle } from 'lucide-react';

const VotingSection = ({ onVote }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scores, setScores] = useState({ home: '', away: '' });
  const [hasVoted, setHasVoted] = useState(false);

  const handleTeamClick = (team) => {
    if (hasVoted) return;
    setSelectedTeam(team);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeam || !scores.home || !scores.away) return;

    setHasVoted(true);
    onVote(selectedTeam, scores);

    // Trigger confetti
    const colors = selectedTeam === 'real' 
      ? ['#FFFFFF', '#FEBE10', '#00529F'] 
      : ['#6CABDD', '#1C2C5B', '#FFFFFF'];

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Real Madrid Card */}
            <TeamCard 
              team="real"
              name="Real Madrid"
              colors="from-real-blue/20 to-real-gold/20 border-real-gold/30 hover:border-real-gold"
              logoUrl="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png"
              isSelected={selectedTeam === 'real'}
              onClick={() => handleTeamClick('real')}
            />

            {/* Man City Card */}
            <TeamCard 
              team="city"
              name="Man City"
              colors="from-city-navy/20 to-city-sky/20 border-city-sky/30 hover:border-city-sky"
              logoUrl="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png"
              isSelected={selectedTeam === 'city'}
              onClick={() => handleTeamClick('city')}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 bg-dark-card border border-green-500/30 rounded-2xl backdrop-blur-xl"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Vote Registered!</h3>
            <p className="text-gray-400">Prediction: Real Madrid {scores.home} - {scores.away} Man City</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score Input Section - Only visible when a team is selected and not voted yet */}
      <AnimatePresence>
        {selectedTeam && !hasVoted && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mt-8 bg-dark-card border border-dark-border rounded-xl p-6 backdrop-blur-md overflow-hidden"
          >
            <h3 className="text-center text-gray-300 mb-6 font-medium">Predict the Score</h3>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Real Madrid</label>
                <input 
                  type="number" 
                  min="0"
                  max="20"
                  value={scores.home}
                  onChange={(e) => setScores({...scores, home: e.target.value})}
                  className="w-16 h-16 text-center text-2xl font-bold bg-black/30 border border-gray-700 rounded-lg focus:border-real-gold focus:ring-1 focus:ring-real-gold outline-none text-white transition-all"
                  required
                />
              </div>
              <span className="text-2xl text-gray-500 font-bold">-</span>
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Man City</label>
                <input 
                  type="number" 
                  min="0"
                  max="20"
                  value={scores.away}
                  onChange={(e) => setScores({...scores, away: e.target.value})}
                  className="w-16 h-16 text-center text-2xl font-bold bg-black/30 border border-gray-700 rounded-lg focus:border-city-sky focus:ring-1 focus:ring-city-sky outline-none text-white transition-all"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg
                ${selectedTeam === 'real' 
                  ? 'bg-gradient-to-r from-real-blue to-real-gold text-white hover:shadow-real-gold/20' 
                  : 'bg-gradient-to-r from-city-navy to-city-sky text-white hover:shadow-city-sky/20'
                }`}
            >
              Confirm Vote & Prediction
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

const TeamCard = ({ team, name, colors, logoUrl, isSelected, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative cursor-pointer group rounded-2xl p-6 border-2 transition-all duration-300 backdrop-blur-sm
      bg-gradient-to-br ${colors}
      ${isSelected ? 'border-opacity-100 ring-2 ring-offset-2 ring-offset-black ring-opacity-50' : 'border-opacity-0 bg-opacity-10'}
      ${isSelected && team === 'real' ? 'ring-real-gold' : ''}
      ${isSelected && team === 'city' ? 'ring-city-sky' : ''}
    `}
  >
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl filter transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        <img src={logoUrl} alt={name} className="w-full h-full object-contain" />
      </div>
      <h3 className="text-2xl font-bold text-white tracking-wide uppercase">{name}</h3>
      
      {isSelected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white text-black rounded-full p-1"
        >
          <CheckCircle size={20} />
        </motion.div>
      )}
    </div>
  </motion.div>
);

export default VotingSection;
