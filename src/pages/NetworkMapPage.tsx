import { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Input, Button, Spin } from 'antd';
import { Search, X, AlertTriangle, ExternalLink, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data structure for Algorand Network
interface GraphNode {
  id: string;
  label: string;
  risk: number;
  isScam: boolean;
  val: number; // size
  txCount: number;
}
interface GraphLink {
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}
interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const mockFetchNetworkMap = async (wallet: string): Promise<GraphData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        nodes: [
          { id: wallet || 'ALGO1...', label: 'Target Wallet', risk: 0.85, isScam: true, val: 20, txCount: 142 },
          { id: 'ALGO2...', label: 'Intermediate 1', risk: 0.22, isScam: false, val: 10, txCount: 15 },
          { id: 'ALGO3...', label: 'Exchange Hot Wallet', risk: 0.05, isScam: false, val: 30, txCount: 8902 },
          { id: 'ALGO4...', label: 'Scam Network Hub', risk: 0.98, isScam: true, val: 25, txCount: 304 },
          { id: 'ALGO5...', label: 'User Wallet', risk: 0.1, isScam: false, val: 8, txCount: 4 }
        ],
        links: [
          { source: wallet || 'ALGO1...', target: 'ALGO2...', amount: 1500, timestamp: new Date().toISOString() },
          { source: wallet || 'ALGO1...', target: 'ALGO4...', amount: 80000, timestamp: new Date().toISOString() },
          { source: 'ALGO2...', target: 'ALGO3...', amount: 1400, timestamp: new Date().toISOString() },
          { source: 'ALGO4...', target: 'ALGO5...', amount: 200, timestamp: new Date().toISOString() }
        ]
      });
    }, 1200); // simulate API delay
  });
};

export const NetworkMapPage = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight - 200 });
  const graphRef = useRef<any>();

  // Resize listener
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight - 200 });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = async () => {
    if (!address) return;
    setLoading(true);
    // TODO: Replace with Real Algorand SDK / Backend Call
    const data = await mockFetchNetworkMap(address);
    setGraphData(data);
    setLoading(false);
  };

  const getNodeColor = (node: any) => {
    if (node.isScam) return '#EF4444'; // Danger
    if (node.risk > 0.5) return '#F59E0B'; // Warning
    return '#10B981'; // Safe Float
  };

  return (
    <div className="min-h-screen relative flex flex-col z-10 w-full overflow-hidden">
      
      {/* NetworkMapHeader */}
      <div className="p-6 md:p-12 mb-4 w-full max-w-7xl mx-auto flex flex-col items-center z-20">
        <h1 className="text-4xl text-white font-bold mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Scam Network Map</h1>
        <p className="text-white/60 mb-8 text-center max-w-2xl">
          Visualize on-chain Algorand transaction paths, smart contract calls, and discover connected malicious entities using our force-directed physics engine.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <Input 
            size="large"
            className="flex-1 bg-white/5 border-white/20 text-white hover:border-gravityAccent focus:border-gravityAccent placeholder:text-white/30 backdrop-blur-md"
            placeholder="Search Wallet Address (e.g. ALGO...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<Search className="text-white/40 mr-2" size={18} />}
          />
          <Button 
            size="large"
            type="primary"
            className="bg-gravityAccent border-none shadow-[0_0_20px_rgba(99,102,241,0.5)] font-bold hover:!bg-[#4F46E5]"
            onClick={handleSearch}
            loading={loading}
          >
            Load Network Map
          </Button>
        </div>
      </div>

      {/* InteractiveGraph Area */}
      <div className="relative flex-1 w-full border-t border-white/10 bg-black/40 backdrop-blur-sm">
        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <Spin size="large" />
          </div>
        )}
        
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="id"
            nodeColor={getNodeColor}
            nodeRelSize={6}
            linkColor={() => "rgba(255,255,255,0.2)"}
            linkWidth={(link: any) => Math.min(5, Math.max(1, link.amount / 1000))}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={d => (d as any).amount * 0.00001 + 0.005}
            onNodeClick={(node) => setSelectedNode(node as GraphNode)}
            backgroundColor="transparent"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <p>Enter an Algorand address and click load to visualize network.</p>
          </div>
        )}
      </div>

      {/* NodeDetailsPanel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-32 right-0 bottom-0 w-full md:w-96 bg-black/80 backdrop-blur-3xl border-l border-white/10 shadow-2xl z-40 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                Node Details
              </h2>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Wallet Info Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Wallet Address</div>
                <div className="text-white font-mono text-sm break-all flex items-center justify-between">
                  {selectedNode.id}
                  <ExternalLink size={14} className="text-white/40 cursor-pointer hover:text-gravityAccent" />
                </div>
              </div>

              {/* Risk Score */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Risk Score</div>
                  <div className={`text-4xl font-bold ${
                    selectedNode.isScam ? 'text-dangerCollapse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
                    selectedNode.risk > 0.5 ? 'text-warnWobble' : 'text-safeFloat'
                  }`}>
                    {Math.round(selectedNode.risk * 100)}
                  </div>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Tx Count</div>
                  <div className="text-2xl font-bold text-white">
                    {selectedNode.txCount}
                  </div>
                </div>
              </div>

              {/* Flags */}
              {selectedNode.isScam && (
                <div className="bg-dangerCollapse/10 border border-dangerCollapse/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="text-dangerCollapse shrink-0 mt-0.5" size={18} />
                  <div>
                    <div className="text-dangerCollapse font-bold text-sm mb-1">High Risk Detected</div>
                    <div className="text-dangerCollapse/80 text-xs">
                      Reported in Registry • Phishing Activity • High Outflow
                    </div>
                  </div>
                </div>
              )}

              {/* Top Txs Mock */}
              <div>
                <h3 className="text-white/80 font-bold mb-3 flex items-center gap-2">
                  <ArrowRightLeft size={16} /> Recent Transactions
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/5 rounded-lg p-3 text-sm">
                      <div className="flex justify-between text-white/60 mb-1">
                        <span>To: ALGO{Math.floor(Math.random() * 90) + 10}...</span>
                        <span className="text-white font-mono">{Math.floor(Math.random() * 5000)} ALGO</span>
                      </div>
                      <div className="text-white/30 text-xs text-right">
                        2 mins ago
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                danger 
                type="primary" 
                block 
                size="large"
                className="mt-4 shadow-[0_0_15px_rgba(239,68,68,0.4)] border-none bg-dangerCollapse"
              >
                Report as Scam
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
