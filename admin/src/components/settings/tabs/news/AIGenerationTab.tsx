import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export const AIGenerationTab = () => {
  const [aiProcessing, setAiProcessing] = useState('enabled');
  const [aiProvider, setAiProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [processingMode, setProcessingMode] = useState('generate-unique-summary');
  const [targetLength, setTargetLength] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('');
  const [autoCategorization, setAutoCategorization] = useState('enabled');
  const [autoTagging, setAutoTagging] = useState('enabled');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-normal text-[#4D4D4D]">AI PROCESSING</Label>
          <div className="flex space-x-2 mt-2">
            <Badge 
              variant={aiProcessing === 'enabled' ? 'default' : 'outline'}
              className={aiProcessing === 'enabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setAiProcessing('enabled')}
            >
              Enabled
            </Badge>
            <Badge 
              variant={aiProcessing === 'disabled' ? 'default' : 'outline'}
              className={aiProcessing === 'disabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setAiProcessing('disabled')}
            >
              Disabled
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-provider" className='text-sm font-normal text-[#4D4D4D]'>AI PROVIDER</Label>
            <Select value={aiProvider} onValueChange={setAiProvider}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">Open AI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key" className='text-sm font-normal text-[#4D4D4D]'>API KEY</Label>
            <Input 
              id="api-key"
              type="password"
              placeholder="Type"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        <Button size="sm" className='py-1 h-auto text-xs'>
          Test API
        </Button>

        <div>
          <Label className="text-sm font-normal text-[#4D4D4D]">AI PROCESSING</Label>
          <div className="flex space-x-2 mt-2">
            <Badge 
              variant={processingMode === 'generate-unique-summary' ? 'default' : 'outline'}
              className={processingMode === 'generate-unique-summary' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setProcessingMode('generate-unique-summary')}
            >
              Generate unique summary
            </Badge>
            <Badge 
              variant={processingMode === 'rewrite-completely' ? 'default' : 'outline'}
              className={processingMode === 'rewrite-completely' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setProcessingMode('rewrite-completely')}
            >
              Rewrite completely
            </Badge>
            <Badge 
              variant={processingMode === 'extract-key-points' ? 'default' : 'outline'}
              className={processingMode === 'extract-key-points' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setProcessingMode('extract-key-points')}
            >
              Extract key points
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-length" className='text-sm font-normal text-[#4D4D4D]'>TARGET ARTICLE LENGTH</Label>
          <Input 
            id="target-length"
            placeholder="Type"
            value={targetLength}
            onChange={(e) => setTargetLength(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prompt-template" className='text-sm font-normal text-[#4D4D4D]'>AI PROMPT TEMPLATE</Label>
          <Textarea 
            id="prompt-template"
            placeholder="Type"
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label className="text-sm font-normal text-[#4D4D4D]">AUTO-CATEGORIZATION</Label>
          <div className="flex space-x-2 mt-2">
            <Badge 
              variant={autoCategorization === 'enabled' ? 'default' : 'outline'}
              className={autoCategorization === 'enabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setAutoCategorization('enabled')}
            >
              Enabled
            </Badge>
            <Badge 
              variant={autoCategorization === 'disabled' ? 'default' : 'outline'}
              className={autoCategorization === 'disabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setAutoCategorization('disabled')}
            >
              Disabled
            </Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-normal text-[#4D4D4D]">AUTO-TAGGING</Label>
          <div className="flex space-x-2 mt-2">
            <Badge 
              variant={autoTagging === 'enabled' ? 'default' : 'outline'}
              className={autoTagging === 'enabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setAutoTagging('enabled')}
            >
              Enabled
            </Badge>
            <Badge 
              variant={autoTagging === 'disabled' ? 'default' : 'outline'}
              className={autoTagging === 'disabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
              onClick={() => setAutoTagging('disabled')}
            >
              Disabled
            </Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-normal text-[#4D4D4D]">EXTRACT TAGS FROM</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="default" className="bg-[#4D4D4D] text-white py-1">
              ✓ Article title
            </Badge>
            <Badge variant="default" className="bg-[#4D4D4D] text-white py-1">
              ✓ Article content
            </Badge>
            <Badge variant="default" className="bg-[#4D4D4D] text-white py-1">
              ✓ Source name
            </Badge>
            <Badge variant="outline" className='py-1'>
              Author name
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-tags" className='text-sm font-normal text-[#4D4D4D]'>MAXIMUM TAGS PER ARTICLE</Label>
          <Input 
            id="max-tags"
            placeholder="Type"
          />
        </div>
      </div>
    </div>
  );
};
