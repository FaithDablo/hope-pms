import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// KINAKAILANGANG IMPORTS PARA SA CHART REGISTRATION AT DEPENDENCIES
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title as ChartTitle, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// I-REGISTER ANG MGA ELEMENTO SA CHART ENGINE
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function TopSellingPage() {
  // Nag-save din tayo ng raw data array para magamit sa pag-render ng Ranked List
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        setLoading(true);
        
        // Hihigop ng live top-10 ranked products mula sa view na ginawa ni Eunice (REP_002)
        const { data, error } = await supabase
          .from('top_selling_products')
          .select('*');

        if (error) throw error;

        const dataRows = data || [];
        setRawData(dataRows);

        if (dataRows.length > 0) {
          // FORMATTING PARA SA CHART AXIS LABELS - Maikling pangalan lang para kasya sa chart handles
          const productLabels = dataRows.map((item, index) => `#${index + 1}: ${item.description.substring(0, 15)}${item.description.length > 15 ? '...' : ''}`);
          const quantitySold = dataRows.map(item => item.totalqty);

          setChartData({
            labels: productLabels,
            datasets: [
              {
                label: 'Total Quantity Sold',
                data: quantitySold,
                backgroundColor: 'rgba(79, 70, 229, 0.15)', // Serene Scholar Soft Indigo
                borderColor: 'rgb(79, 70, 229)',           // Solid Indigo accent lines
                borderWidth: 2,
                borderRadius: 8,                           // Malinis na curves sa dulo ng bars
                hoverBackgroundColor: 'rgba(79, 70, 229, 0.35)',
                hoverBorderColor: 'rgb(67, 56, 202)',
              },
            ],
          });
        }
      } catch (err) {
        console.error('Analytics Fetch Error:', err.message);
        setErrorMsg('Failed to load performance metrics from baseline directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopSelling();
  }, []);

  // CONFIGURATIONS NG CHART AXIS AT GRAPHICS
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12, weight: '600' },
          color: '#1e293b'
        }
      },
      tooltip: {
        titleFont: { family: 'Inter', size: 13, weight: '700' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        backgroundColor: '#0f172a',
        callbacks: {
          title: (context) => {
            // Ipakita ang buong description kapag itinapat ang mouse sa bar ng chart
            const index = context[0].dataIndex;
            return `Rank #${index + 1}: ${rawData[index]?.description}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' },
        title: {
          display: true,
          text: 'Quantity Sold (Units)',
          font: { family: 'Inter', size: 12, weight: 'bold' },
          color: '#0f172a'
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { family: 'Inter', size: 11, weight: '500' }, 
          color: '#64748b',
          maxRotation: 30,
          minRotation: 0
        },
        title: {
          display: true,
          text: 'Top 10 Ranked Products',
          font: { family: 'Inter', size: 12, weight: 'bold' },
          color: '#0f172a'
        }
      }
    }
  };

  return (
    <div className="font-['Inter'] p-1 transition-all duration-300">
      {/* Header Module Badge */}
      <div className="flex items-center gap-3 mb-2">
        <span className="px-3 py-1 text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 rounded-md tracking-wider">
          Analytics Root Module
        </span>
        <h1 className="text-3xl font-bold text-slate-950">Top Selling Products Matrix</h1>
      </div>
      
      <p className="text-slate-500 text-sm mb-8">
        Exclusive graphical performance overview mapped dynamically via sales ledger database logs (REP_002).
      </p>

      {/* Interface Conditional Rendering States */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <div className="text-xs font-semibold text-indigo-600 italic animate-pulse">Computing real-time velocity curves...</div>
        </div>
      ) : errorMsg ? (
        <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {errorMsg}
        </div>
      ) : rawData.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-sm shadow-sm italic font-medium">
          No operational data streams found inside sales directories. Waiting for remote cloud migration.
        </div>
      ) : (
        <div className="grid grid-col-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT/TOP: Ang malinis na Bar Chart Wrapper */}
          <div className="lg:col-span-2 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm h-[460px]">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* RIGHT: M2 Requirement Upgrade - Elegant Ranked Leaderboard List */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-sm">trending_up</span>
                Leaderboard Rankings
              </h2>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">Top 10</span>
            </div>
            
            <div className="divide-y divide-slate-100 max-h-[396px] overflow-y-auto">
              {rawData.map((item, index) => {
                // Pagandahin ang itsura ng Top 3 Medals
                const isTop3 = index < 3;
                const badgeColor = index === 0 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                   index === 1 ? 'bg-slate-200 text-slate-700 border-slate-300' :
                                   index === 2 ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                                   'bg-slate-50 text-slate-500 border-slate-100';

                return (
                  <div key={item.prodcode} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Number Badge */}
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${badgeColor}`}>
                        {index + 1}
                      </span>
                      {/* Product Metadata */}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate" title={item.description}>
                          {item.description}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{item.prodcode}</p>
                      </div>
                    </div>

                    {/* Quantity Value Tracker */}
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-black text-slate-900">{item.totalqty.toLocaleString()}</span>
                      <span className="block text-[9px] font-medium text-slate-400 uppercase tracking-tighter">Sold</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      <p className="text-xs text-slate-400 mt-10 italic text-center">
        Note: Chart and analytics matrices are dynamically generated based on total quantity sold within the current operational baseline.
      </p>
    </div>
  );
}