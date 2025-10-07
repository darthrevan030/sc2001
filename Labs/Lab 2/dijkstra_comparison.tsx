import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Info } from 'lucide-react';

const DijkstraComparison = () => {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  // Implementation (a): Adjacency Matrix + Array-based Priority Queue
  class DijkstraMatrixArray {
    constructor(adjMatrix) {
      this.adjMatrix = adjMatrix;
      this.V = adjMatrix.length;
    }

    findMinDistance(dist, visited) {
      let min = Infinity;
      let minIndex = -1;
      
      for (let v = 0; v < this.V; v++) {
        if (!visited[v] && dist[v] < min) {
          min = dist[v];
          minIndex = v;
        }
      }
      return minIndex;
    }

    dijkstra(src) {
      const dist = new Array(this.V).fill(Infinity);
      const visited = new Array(this.V).fill(false);
      const parent = new Array(this.V).fill(-1);
      
      dist[src] = 0;
      let operations = 0;

      for (let count = 0; count < this.V - 1; count++) {
        // Find minimum distance vertex - O(V)
        const u = this.findMinDistance(dist, visited);
        operations += this.V;
        
        if (u === -1) break;
        visited[u] = true;

        // Update distances of adjacent vertices - O(V)
        for (let v = 0; v < this.V; v++) {
          operations++;
          if (!visited[v] && 
              this.adjMatrix[u][v] !== 0 && 
              dist[u] !== Infinity &&
              dist[u] + this.adjMatrix[u][v] < dist[v]) {
            dist[v] = dist[u] + this.adjMatrix[u][v];
            parent[v] = u;
          }
        }
      }

      return { dist, parent, operations };
    }
  }

  // Implementation (b): Adjacency List + Min-Heap Priority Queue
  class MinHeap {
    constructor() {
      this.heap = [];
      this.positions = new Map();
    }

    insert(node, dist) {
      this.heap.push({ node, dist });
      this.positions.set(node, this.heap.length - 1);
      this.bubbleUp(this.heap.length - 1);
    }

    bubbleUp(idx) {
      while (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        if (this.heap[idx].dist >= this.heap[parentIdx].dist) break;
        
        this.swap(idx, parentIdx);
        idx = parentIdx;
      }
    }

    extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) {
        const min = this.heap.pop();
        this.positions.delete(min.node);
        return min;
      }

      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.positions.set(this.heap[0].node, 0);
      this.positions.delete(min.node);
      this.bubbleDown(0);
      return min;
    }

    bubbleDown(idx) {
      while (true) {
        let smallest = idx;
        const left = 2 * idx + 1;
        const right = 2 * idx + 2;

        if (left < this.heap.length && this.heap[left].dist < this.heap[smallest].dist) {
          smallest = left;
        }
        if (right < this.heap.length && this.heap[right].dist < this.heap[smallest].dist) {
          smallest = right;
        }
        if (smallest === idx) break;

        this.swap(idx, smallest);
        idx = smallest;
      }
    }

    decreaseKey(node, newDist) {
      const idx = this.positions.get(node);
      if (idx === undefined) return;
      
      this.heap[idx].dist = newDist;
      this.bubbleUp(idx);
    }

    swap(i, j) {
      this.positions.set(this.heap[i].node, j);
      this.positions.set(this.heap[j].node, i);
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    isEmpty() {
      return this.heap.length === 0;
    }

    contains(node) {
      return this.positions.has(node);
    }
  }

  class DijkstraListHeap {
    constructor(adjList, V) {
      this.adjList = adjList;
      this.V = V;
    }

    dijkstra(src) {
      const dist = new Array(this.V).fill(Infinity);
      const parent = new Array(this.V).fill(-1);
      const heap = new MinHeap();
      
      dist[src] = 0;
      heap.insert(src, 0);
      let operations = 0;

      while (!heap.isEmpty()) {
        const { node: u } = heap.extractMin();
        operations += Math.log2(this.V); // Heap extract operation

        for (const { node: v, weight } of this.adjList[u]) {
          operations++; // Edge relaxation check
          
          if (dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight;
            parent[v] = u;
            
            if (heap.contains(v)) {
              heap.decreaseKey(v, dist[v]);
              operations += Math.log2(this.V); // Heap decrease-key
            } else {
              heap.insert(v, dist[v]);
              operations += Math.log2(this.V); // Heap insert
            }
          }
        }
      }

      return { dist, parent, operations };
    }
  }

  // Graph generation utilities
  const generateRandomGraph = (V, density) => {
    const adjMatrix = Array(V).fill(0).map(() => Array(V).fill(0));
    const adjList = Array(V).fill(0).map(() => []);
    let E = 0;

    for (let i = 0; i < V; i++) {
      for (let j = i + 1; j < V; j++) {
        if (Math.random() < density) {
          const weight = Math.floor(Math.random() * 20) + 1;
          adjMatrix[i][j] = weight;
          adjMatrix[j][i] = weight;
          adjList[i].push({ node: j, weight });
          adjList[j].push({ node: i, weight });
          E++;
        }
      }
    }

    return { adjMatrix, adjList, E };
  };

  const runBenchmark = () => {
    setRunning(true);
    
    setTimeout(() => {
      const benchmarkData = [];
      const sizes = [10, 20, 30, 40, 50, 75, 100, 150];
      const density = 0.3;

      for (const V of sizes) {
        const { adjMatrix, adjList, E } = generateRandomGraph(V, density);
        
        // Test implementation (a)
        const startA = performance.now();
        const dijkstraA = new DijkstraMatrixArray(adjMatrix);
        const resultA = dijkstraA.dijkstra(0);
        const timeA = performance.now() - startA;

        // Test implementation (b)
        const startB = performance.now();
        const dijkstraB = new DijkstraListHeap(adjList, V);
        const resultB = dijkstraB.dijkstra(0);
        const timeB = performance.now() - startB;

        benchmarkData.push({
          V,
          E,
          timeMatrixArray: timeA,
          timeListHeap: timeB,
          opsMatrixArray: resultA.operations,
          opsListHeap: resultB.operations
        });
      }

      setResults(benchmarkData);
      setRunning(false);
    }, 100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dijkstra's Algorithm: Implementation Comparison
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-2 text-blue-700">
            (a) Adjacency Matrix + Array PQ
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Time Complexity:</strong> O(V²)
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Finding min: O(V) for each of V iterations</li>
            <li>Checking neighbors: O(V) for each vertex</li>
            <li>Total: O(V²)</li>
            <li><strong>Space:</strong> O(V²) for adjacency matrix</li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="font-bold text-lg mb-2 text-green-700">
            (b) Adjacency List + Min-Heap PQ
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Time Complexity:</strong> O((V + E) log V)
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Extract-min: O(log V) for V vertices</li>
            <li>Decrease-key: O(log V) for E edges</li>
            <li>Total: O((V + E) log V)</li>
            <li><strong>Space:</strong> O(V + E) for adjacency list</li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <strong className="text-amber-800">Comparison Summary:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside ml-2">
              <li><strong>Dense graphs (E ≈ V²):</strong> Both are O(V²), but matrix is simpler</li>
              <li><strong>Sparse graphs (E ≪ V²):</strong> Heap version is O(E log V), much faster</li>
              <li><strong>Memory:</strong> List + Heap uses less space for sparse graphs</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={runBenchmark}
        disabled={running}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mb-6"
      >
        <Play className="w-5 h-5" />
        {running ? 'Running Benchmark...' : 'Run Performance Benchmark'}
      </button>

      {results && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Execution Time Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="V" 
                  label={{ value: 'Number of Vertices (V)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="timeMatrixArray" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Matrix + Array" 
                />
                <Line 
                  type="monotone" 
                  dataKey="timeListHeap" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="List + Heap" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Benchmark Results Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">V</th>
                    <th className="px-4 py-2 text-left">E</th>
                    <th className="px-4 py-2 text-left">Matrix+Array (ms)</th>
                    <th className="px-4 py-2 text-left">List+Heap (ms)</th>
                    <th className="px-4 py-2 text-left">Speedup</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{row.V}</td>
                      <td className="px-4 py-2">{row.E}</td>
                      <td className="px-4 py-2">{row.timeMatrixArray.toFixed(3)}</td>
                      <td className="px-4 py-2">{row.timeListHeap.toFixed(3)}</td>
                      <td className="px-4 py-2 font-semibold">
                        {(row.timeMatrixArray / row.timeListHeap).toFixed(2)}×
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Why These Complexities? (Detailed Explanation)
            </h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                <strong className="text-blue-800 text-base">Why is Matrix + Array O(V²)?</strong>
                <div className="mt-2 space-y-2">
                  <p><strong>Step 1 - Finding Minimum (happens V times):</strong></p>
                  <p className="ml-4">• Must scan ALL V vertices to find unvisited vertex with min distance</p>
                  <p className="ml-4">• Cannot do better than O(V) without a better data structure</p>
                  <p className="ml-4">• Total: V iterations × O(V) scan = <strong>O(V²)</strong></p>
                  
                  <p className="mt-2"><strong>Step 2 - Checking Neighbors (happens V times):</strong></p>
                  <p className="ml-4">• After extracting vertex u, must check ALL V positions in matrix row</p>
                  <p className="ml-4">• Even if only k edges exist, we check all V slots: matrix[u][0], matrix[u][1], ..., matrix[u][V-1]</p>
                  <p className="ml-4">• Total: V vertices × O(V) checks = <strong>O(V²)</strong></p>
                  
                  <p className="mt-2 font-semibold text-blue-900">Key insight: Work is proportional to V², NOT to E!</p>
                  <p className="ml-4">Even in a sparse graph with few edges, we still do O(V²) work checking empty matrix cells.</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <strong className="text-green-800 text-base">Why is List + Heap O((V + E) log V)?</strong>
                <div className="mt-2 space-y-2">
                  <p><strong>Part 1 - Extract-Min Operations:</strong></p>
                  <p className="ml-4">• Heap extract-min is O(log V) because heap has at most V elements</p>
                  <p className="ml-4">• We extract each vertex exactly once</p>
                  <p className="ml-4">• Total: V extractions × O(log V) = <strong>O(V log V)</strong></p>
                  
                  <p className="mt-2"><strong>Part 2 - Edge Relaxations:</strong></p>
                  <p className="ml-4">• For vertex u, we only examine its actual neighbors (stored in adjList[u])</p>
                  <p className="ml-4">• Each edge (u,v) is examined at most twice (once from each endpoint)</p>
                  <p className="ml-4">• Each examination may trigger decrease-key: O(log V)</p>
                  <p className="ml-4">• Total: E edges × O(log V) = <strong>O(E log V)</strong></p>
                  
                  <p className="mt-2"><strong>Combined: O(V log V) + O(E log V) = O((V + E) log V)</strong></p>
                  
                  <p className="mt-2 font-semibold text-green-900">Key insight: Work is proportional to actual edges!</p>
                  <p className="ml-4">In sparse graphs, E is much smaller than V², so we do much less work.</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
                <strong className="text-purple-800 text-base">Why Does Graph Density Matter?</strong>
                <div className="mt-2 space-y-2">
                  <p><strong>Dense Graph (E ≈ V²):</strong></p>
                  <p className="ml-4">• Matrix + Array: O(V²) ✓ matches graph density</p>
                  <p className="ml-4">• List + Heap: O((V + V²) log V) = O(V² log V) — WORSE!</p>
                  <p className="ml-4 font-semibold text-purple-900">Matrix wins because it avoids log V overhead when checking many edges</p>
                  
                  <p className="mt-2"><strong>Sparse Graph (E = O(V)):</strong></p>
                  <p className="ml-4">• Matrix + Array: O(V²) — still checks all empty cells!</p>
                  <p className="ml-4">• List + Heap: O((V + V) log V) = O(V log V) ✓ much better!</p>
                  <p className="ml-4 font-semibold text-green-900">Heap wins: V log V grows much slower than V²</p>
                  
                  <p className="mt-2"><strong>Example with V = 1000:</strong></p>
                  <p className="ml-4">• Sparse (E = 3000): Matrix does ~1,000,000 ops vs Heap does ~30,000 ops</p>
                  <p className="ml-4">• Dense (E = 500,000): Matrix does ~1,000,000 ops vs Heap does ~5,000,000 ops</p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-500">
                <strong className="text-amber-800 text-base">Why Does Implementation Choice Matter in Practice?</strong>
                <div className="mt-2 space-y-2">
                  <p><strong>1. Real-World Graphs Are Sparse:</strong></p>
                  <p className="ml-4">• Social networks: avg degree ~100-1000, but millions of users (E ≪ V²)</p>
                  <p className="ml-4">• Road networks: each intersection connects to ~3-4 roads (E ≈ 3V)</p>
                  <p className="ml-4">• Web graph: most pages link to ~10-20 others (E ≈ 15V)</p>
                  <p className="ml-4 font-semibold">→ Heap version is typically 10-100× faster</p>
                  
                  <p className="mt-2"><strong>2. Memory Constraints:</strong></p>
                  <p className="ml-4">• Matrix for 1M vertices: 1M × 1M × 4 bytes = 4 TB (impossible!)</p>
                  <p className="ml-4">• List for 1M vertices, 10M edges: ~80 MB (feasible!)</p>
                  <p className="ml-4 font-semibold">→ Only list representation scales to large graphs</p>
                  
                  <p className="mt-2"><strong>3. Cache Performance:</strong></p>
                  <p className="ml-4">• Matrix: Poor cache locality when checking row (scattered memory)</p>
                  <p className="ml-4">• List: Good cache locality (neighbors stored contiguously)</p>
                  <p className="ml-4 font-semibold">→ Heap version has better practical performance</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-500">
                <strong className="text-gray-800 text-base">Summary: When to Use Each</strong>
                <div className="mt-2 space-y-2">
                  <p><strong>Use Matrix + Array if:</strong></p>
                  <p className="ml-4">✓ Graph is dense (E close to V²)</p>
                  <p className="ml-4">✓ V is very small (&lt; 50)</p>
                  <p className="ml-4">✓ Simplicity matters more than performance</p>
                  <p className="ml-4">✓ Need O(1) edge weight lookups</p>
                  
                  <p className="mt-2"><strong>Use List + Heap if:</strong></p>
                  <p className="ml-4">✓ Graph is sparse (E ≪ V²) — most common case!</p>
                  <p className="ml-4">✓ V is large (&gt; 100)</p>
                  <p className="ml-4">✓ Memory is limited</p>
                  <p className="ml-4">✓ Working with real-world networks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DijkstraComparison;