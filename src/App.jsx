import { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer';
import VotingSection from './components/VotingSection';
import ResultsCircle from './components/ResultsCircle';

function App() {
  const [votes, setVotes] = useState({ real: 0, city: 0 }); // Start from 0
  const [loading, setLoading] = useState(true);

  // Fetch initial votes
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await fetch('/api/votes');
        if (res.ok) {
          const data = await res.json();
          setVotes(data);
        }
      } catch (error) {
        console.error('Failed to fetch votes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (team, scores) => {
    // Optimistic update
    setVotes(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));
    
    localStorage.setItem('hasVoted', 'true');
    localStorage.setItem('votedTeam', team);

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team,
          homeScore: scores?.home,
          awayScore: scores?.away
        })
      });
    } catch (error) {
      console.error('Failed to submit vote:', error);
      // Revert optimistic update if needed (omitted for simplicity)
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-x-hidden relative selection:bg-real-gold selection:text-black">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-real-blue/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-city-sky/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 italic">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">MATCHDAY</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base tracking-widest uppercase">Champions League • Round 6</p>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-2xl flex flex-col items-center">
          <CountdownTimer />
          
          <div className="w-full my-8">
            <VotingSection onVote={handleVote} />
          </div>

          <ResultsCircle votes={votes} />
        </main>

        {/* Footer */}
        <footer className="mt-auto pt-12 pb-6 text-center text-gray-600 text-xs">
          <p>Built for the Fans By Haidar :)</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
