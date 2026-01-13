import { Clock } from 'lucide-react';

export const HistoryTab = () => {
  const recentActivity = [
    { action: 'Processed 12 articles from TechCrunch AI', time: '2h ago' },
    { action: 'Generated 8 news articles successfully', time: '2h ago' },
    { action: 'VentureBeat AI feed timeout after 30 seconds', time: '2h ago' },
    { action: 'Processed 5 articles from OpenAI Blog', time: '2h ago' },
    { action: 'Auto-categorized 15 articles using keyword rules', time: '2h ago' },
    { action: 'Generated 6 news articles successfully', time: '2h ago' },
    { action: 'AI generation failed for article "Complex Technical Analysis"', time: '2h ago' },
    { action: 'Processed 9 articles from MIT Technology Review', time: '2h ago' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-6 w-6 text-gray-500 p-1 bg-gray-100 rounded-xs" />
          <h3 className="text-md font-normal text-[#CCCCCC]">RECENT ACTIVITY</h3>
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex justify-between items-start">
              <span className="text-sm flex-1">{activity.action}</span>
              <span className="text-sm text-gray-400 ml-4">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};