import { IMPORT_DIALOG_TABS } from '@/lib/contants';
import { useState, useRef } from 'react';
import DialogContainer from '@/components/DialogContainer';
import { useStartImport } from '@/hooks/queries/useImportExportQuery';
import type { EntityType } from '@/api/import-export';
import { showErrorToast } from '@/lib/toast';
import { ImportJobsStatus } from './ImportJobsStatus';

interface GenericImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  title: string;
}

export const GenericImportDialog = ({ 
  open, 
  onOpenChange, 
  entityType, 
  title 
}: GenericImportDialogProps) => {
  const [selectedTab, setSelectedTab] = useState(IMPORT_DIALOG_TABS.csv_file);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startImport = useStartImport();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showErrorToast('Please select a file to import');
      return;
    }

    try {
      await startImport.mutateAsync({
        file: selectedFile,
        entityType,
      });
      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div>
      <DialogContainer
        title={title}
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        <div className='p-6'>
          <p className='text-[14px] text-[#808080] font-[inter] font-medium'>IMPORT METHOD</p>
          <div className='flex items-center gap-4 text-sm'>
            <p
              className={`rounded-[9px] pt-[3px] pb-[5px] px-4 cursor-pointer ${
                selectedTab === IMPORT_DIALOG_TABS.csv_file
                  ? 'bg-[#4D4D4D] text-white font-Nunito font-semibold text-[15px]'
                  : 'bg-white border-2 border-[#F2F2F2] font-Nunito font-semibold text-[15px]'
              }`}
              onClick={() => setSelectedTab(IMPORT_DIALOG_TABS.csv_file)}
            >
              CSV File
            </p>
            <p
              className={`rounded-[9px] pt-[3px] pb-[5px] px-4 cursor-pointer ${
                selectedTab === IMPORT_DIALOG_TABS.json_file
                  ? 'bg-[#4D4D4D] text-white font-Nunito font-semibold text-[15px]'
                  : 'bg-white border-2 border-[#F2F2F2] font-Nunito font-semibold text-[15px]'
              }`}
              onClick={() => setSelectedTab(IMPORT_DIALOG_TABS.json_file)}
            >
              JSON File
            </p>
            <p
              className={`rounded-[9px] pt-[3px] pb-[5px]  px-4 cursor-pointer ${
                selectedTab === IMPORT_DIALOG_TABS.api_endpoint
                  ? 'bg-[#4D4D4D] text-white font-Nunito font-semibold text-[15px]'
                  : 'bg-white border-2 border-[#F2F2F2] font-Nunito font-semibold text-[15px]'
              }`}
              onClick={() => setSelectedTab(IMPORT_DIALOG_TABS.api_endpoint)}
            >
              API Endpoint
            </p>
          </div>

          <p className='mt-4 text-[14px] text-[#4D4D4D] font-[inter] font-medium'>UPLOAD FILE</p>
          <div
            className='flex items-center justify-center gap-1 border border-[#F2F2F2] border-dashed w-full h-[80px] mb-[40px] rounded-md cursor-pointer'
            onClick={handleUploadClick}
            onDrop={handleDragDrop}
            onDragOver={handleDragOver}
          >
            <div>
              <svg
                width='16'
                height='21'
                viewBox='0 0 16 21'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='w-full'
              >
                <path
                  d='M2.90265 20.5C1.9469 20.5 1.22419 20.2611 0.734513 19.7832C0.244838 19.3054 0 18.5973 0 17.6591V9.05769C0 8.12529 0.244838 7.42016 0.734513 6.94231C1.22419 6.45862 1.9469 6.21678 2.90265 6.21678H5.46903V7.93881H3.00885C2.59587 7.93881 2.28024 8.04662 2.06195 8.26224C1.84956 8.47203 1.74336 8.78963 1.74336 9.21504V17.5105C1.74336 17.9359 1.84956 18.2535 2.06195 18.4633C2.28024 18.6789 2.59587 18.7867 3.00885 18.7867H12.9823C13.3894 18.7867 13.7021 18.6789 13.9204 18.4633C14.1445 18.2535 14.2566 17.9359 14.2566 17.5105V9.21504C14.2566 8.78963 14.1445 8.47203 13.9204 8.26224C13.7021 8.04662 13.3894 7.93881 12.9823 7.93881H10.531V6.21678H13.0973C14.0531 6.21678 14.7758 6.45862 15.2655 6.94231C15.7552 7.42016 16 8.12529 16 9.05769V17.6591C16 18.5915 15.7552 19.2966 15.2655 19.7745C14.7758 20.2582 14.0531 20.5 13.0973 20.5H2.90265ZM8 13.5332C7.77581 13.5332 7.58112 13.4545 7.41593 13.2972C7.25664 13.1399 7.17699 12.9534 7.17699 12.7378V3.93531L7.24779 2.63287L6.69027 3.27098L5.45133 4.58217C5.30973 4.73951 5.12684 4.81818 4.90265 4.81818C4.69617 4.81818 4.52212 4.75408 4.38053 4.62587C4.24484 4.49184 4.17699 4.32284 4.17699 4.11888C4.17699 3.9324 4.25074 3.76049 4.39823 3.60315L7.37168 0.77972C7.48378 0.674825 7.58997 0.601981 7.69027 0.561189C7.79056 0.520396 7.89381 0.5 8 0.5C8.10619 0.5 8.20944 0.520396 8.30973 0.561189C8.41003 0.601981 8.51327 0.674825 8.61947 0.77972L11.5929 3.60315C11.7463 3.76049 11.823 3.9324 11.823 4.11888C11.823 4.32284 11.7493 4.49184 11.6018 4.62587C11.4602 4.75408 11.2891 4.81818 11.0885 4.81818C10.8702 4.81818 10.6873 4.73951 10.5398 4.58217L9.30089 3.27098L8.75221 2.63287L8.82301 3.93531V12.7378C8.82301 12.9534 8.74041 13.1399 8.57522 13.2972C8.41593 13.4545 8.22419 13.5332 8 13.5332Z'
                  fill='#CCCCCC'
                />
              </svg>
              <p className='text-[12px] text-[#CCCCCC] font-[inter] font-medium'>
                {selectedFile ? selectedFile.name : 'Drag and drop files here or select from your computer'}
              </p>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div className='flex justify-end gap-4 pb-6'>
            <button
              onClick={() => onOpenChange(false)}
              className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedFile || startImport.isPending}
              className='px-4 py-2 bg-[#4D4D4D] text-white rounded-md hover:bg-[#3D3D3D] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {startImport.isPending ? 'Importing...' : 'Import'}
            </button>
          </div>
          
          <ImportJobsStatus entityType={entityType} />
        </div>
      </DialogContainer>
    </div>
  );
};
