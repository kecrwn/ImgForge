import React, { useState } from 'react';
import { compressToExactSize } from '../processors/exactSize';

const generateNoiseImage = async (width: number, height: number): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // Fill with noise to make it uncompressible
  const imgData = ctx.createImageData(width, height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = Math.random() * 255;
    imgData.data[i+1] = Math.random() * 255;
    imgData.data[i+2] = Math.random() * 255;
    imgData.data[i+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 1.0);
  });
};

const generateTransparentPNG = async (width: number, height: number): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.fillRect(50, 50, width - 100, height - 100);
  
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/png');
  });
};

export const SelfTest: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    setResults([]);

    const targets = [50, 100, 250, 500]; // KB
    
    // Create base blobs
    const noiseBlob = await generateNoiseImage(4000, 3000);
    const transBlob = await generateTransparentPNG(1000, 1000);

    const testCases = [
      { name: '4MB 4000x3000 Noise (JPEG)', blob: noiseBlob },
      { name: 'Transparent PNG', blob: transBlob },
    ];

    const newResults: any[] = [];

    for (const tc of testCases) {
      for (const target of targets) {
        try {
          const start = performance.now();
          const result = await compressToExactSize(tc.blob, target, { increaseMode: 'padding' });
          const time = performance.now() - start;
          const resultKB = result.size / 1024;
          
          const pass = resultKB <= target;

          newResults.push({
            case: tc.name,
            targetKB: target,
            resultKB: resultKB,
            pass: pass,
            timeMs: time,
          });
        } catch (err: any) {
          newResults.push({
            case: tc.name,
            targetKB: target,
            resultKB: 0,
            pass: false,
            timeMs: 0,
            error: err.message
          });
        }
        setResults([...newResults]);
      }
    }
    setRunning(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Self Test: Exact Size Compression</h1>
      <button 
        onClick={runTests} 
        disabled={running}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {running ? 'Running...' : 'Run Tests'}
      </button>
      
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Target (KB)</th>
            <th className="border p-2">Result (KB)</th>
            <th className="border p-2">Pass (&lt;= Target)</th>
            <th className="border p-2">Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2 text-left">{r.case}</td>
              <td className="border p-2">{r.targetKB}</td>
              <td className="border p-2">{r.resultKB.toFixed(2)}</td>
              <td className={`border p-2 ${r.pass ? 'text-green-600' : 'text-red-600 font-bold'}`}>
                {r.error ? r.error : (r.pass ? 'Pass' : 'Fail')}
              </td>
              <td className="border p-2">{r.timeMs.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelfTest;
