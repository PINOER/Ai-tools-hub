import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export const NewsletterTab = () => {
  const [newsletterStatus, setNewsletterStatus] = useState('enabled');
  const [sendingFrequency, setSendingFrequency] = useState('weekly');
  const [sendDay, setSendDay] = useState('monday');
  const [sendTime, setSendTime] = useState('10:10am');
  
  const [autoIncludeContent, setAutoIncludeContent] = useState({
    latest5Tools: true,
    top3Articles: true,
    featuredLearning: true,
    aiNewsSummary: false
  });

  const [fallbackContent, setFallbackContent] = useState({
    showPopularTools: true,
    includeTrending: true,
    showPromotions: true
  });

  const handleSave = () => {
    console.log('Saving newsletter data');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-normal text-[#4D4D4D]">NEWSLETTER STATUS</Label>
          <div className="flex space-x-2 mt-2">
            <Badge 
              variant={newsletterStatus === 'enabled' ? 'default' : 'outline'}
              className={newsletterStatus === 'enabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setNewsletterStatus('enabled')}
            >
              Enabled
            </Badge>
            <Badge 
              variant={newsletterStatus === 'disabled' ? 'default' : 'outline'}
              className={newsletterStatus === 'disabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setNewsletterStatus('disabled')}
            >
              Disabled
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sending-frequency" className='text-sm font-normal text-[#4D4D4D]'>SENDING FREQUENCY</Label>
            <Select value={sendingFrequency} onValueChange={setSendingFrequency}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-day" className='text-sm font-normal text-[#4D4D4D]'>SEND DAY</Label>
            <Select value={sendDay} onValueChange={setSendDay}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="send-time" className='text-sm font-normal text-[#4D4D4D]'>SEND TIME</Label>
            <Select value={sendTime} onValueChange={setSendTime}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8:00am">8:00 AM</SelectItem>
                <SelectItem value="9:00am">9:00 AM</SelectItem>
                <SelectItem value="10:00am">10:00 AM</SelectItem>
                <SelectItem value="10:10am">10:10 AM</SelectItem>
                <SelectItem value="11:00am">11:00 AM</SelectItem>
                <SelectItem value="12:00pm">12:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-normal text-[#4D4D4D] mb-3 block">AUTO-INCLUDE CONTENT</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="latest-tools"
                checked={autoIncludeContent.latest5Tools}
                onCheckedChange={(checked) => 
                  setAutoIncludeContent(prev => ({ ...prev, latest5Tools: checked as boolean }))
                }
              />
              <Badge 
                variant={autoIncludeContent.latest5Tools ? 'default' : 'outline'}
                className={autoIncludeContent.latest5Tools ? 'bg-gray-800 text-white' : ''}
              >
                ✓ Latest 5 tools added
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="top-articles"
                checked={autoIncludeContent.top3Articles}
                onCheckedChange={(checked) => 
                  setAutoIncludeContent(prev => ({ ...prev, top3Articles: checked as boolean }))
                }
              />
              <Badge 
                variant={autoIncludeContent.top3Articles ? 'default' : 'outline'}
                className={autoIncludeContent.top3Articles ? 'bg-gray-800 text-white' : ''}
              >
                ✓ Top 3 articles from the week
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured-learning"
                checked={autoIncludeContent.featuredLearning}
                onCheckedChange={(checked) => 
                  setAutoIncludeContent(prev => ({ ...prev, featuredLearning: checked as boolean }))
                }
              />
              <Badge 
                variant={autoIncludeContent.featuredLearning ? 'default' : 'outline'}
                className={autoIncludeContent.featuredLearning ? 'bg-gray-800 text-white' : ''}
              >
                ✓ Featured learning content
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ai-summary"
                checked={autoIncludeContent.aiNewsSummary}
                onCheckedChange={(checked) => 
                  setAutoIncludeContent(prev => ({ ...prev, aiNewsSummary: checked as boolean }))
                }
              />
              <Badge 
                variant={autoIncludeContent.aiNewsSummary ? 'outline' : 'outline'}
                className={autoIncludeContent.aiNewsSummary ? 'bg-gray-800 text-white' : ''}
              >
                AI news summary
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-normal text-[#4D4D4D] mb-3 block">FALLBACK CONTENT</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="popular-tools"
                checked={fallbackContent.showPopularTools}
                onCheckedChange={(checked) => 
                  setFallbackContent(prev => ({ ...prev, showPopularTools: checked as boolean }))
                }
              />
              <Badge 
                variant={fallbackContent.showPopularTools ? 'default' : 'outline'}
                className={fallbackContent.showPopularTools ? 'bg-gray-800 text-white' : ''}
              >
                ✓ Show popular tools if no new tools
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="trending-content"
                checked={fallbackContent.includeTrending}
                onCheckedChange={(checked) => 
                  setFallbackContent(prev => ({ ...prev, includeTrending: checked as boolean }))
                }
              />
              <Badge 
                variant={fallbackContent.includeTrending ? 'default' : 'outline'}
                className={fallbackContent.includeTrending ? 'bg-gray-800 text-white' : ''}
              >
                ✓ Include trending content
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="promotions"
                checked={fallbackContent.showPromotions}
                onCheckedChange={(checked) => 
                  setFallbackContent(prev => ({ ...prev, showPromotions: checked as boolean }))
                }
              />
              <Badge 
                variant={fallbackContent.showPromotions ? 'default' : 'outline'}
                className={fallbackContent.showPromotions ? 'bg-gray-800 text-white' : ''}
              >
                ✓ Show featured promotions
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button className='cursor-pointer'>Preview Template</Button>
          <Button className='cursor-pointer'>Edit Template</Button>
        </div>
      </div>

      <div className="flex space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button onClick={handleSave} className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer">
          Save
        </Button>
      </div>
    </div>
  );
};