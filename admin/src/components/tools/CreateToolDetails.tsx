import { Controller } from 'react-hook-form';
import { RichTextEditor } from '@/components/shared';
import ReactSelect from 'react-select';
import { useRef, useState } from 'react';

interface CreateToolDetailsProps {
  control: any;
  errors: any;
  incomingTags: { label: string; value: number }[];
  selectedTags: { label: string; value: number }[];
  setSelectedTags: (tags: { label: string; value: number }[]) => void;
  roles: { label: string; value: string }[];
  industries: { label: string; value: string }[];
  selectedRoles: { label: string; value: string }[];
  selectedIndustries: { label: string; value: string }[];
  setSelectedRoles: (roles: { label: string; value: string }[]) => void;
  setSelectedIndustries: (industries: { label: string; value: string }[]) => void;
}

export const CreateToolDetails = ({
  control,
  errors,
  incomingTags,
  selectedTags,
  setSelectedTags,
  roles,
  industries,
  selectedRoles,
  selectedIndustries,
  setSelectedRoles,
  setSelectedIndustries,
}: CreateToolDetailsProps) => {
  const fileImageInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleScreenshotsDivClick = () => {
    fileImageInputRef.current?.click();
  };

  const handleRemoveTag = (tagToRemove: { label: string; value: number }) => {
    setSelectedTags(selectedTags.filter(tag => tag.value !== tagToRemove.value));
  };



  // Custom tag creator
  const createOption = (label: string) => ({
    label,
    value: Date.now() + Math.random(), // Unique ID for custom tags
  });

  const handleTagSelect = (newValues: readonly { label: string; value: number }[]) => {
    setSelectedTags([...newValues]);
  };

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  // Handle key down for enter key
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();

      // Check if tag already exists in selected tags
      const tagExists = selectedTags.some(tag =>
        tag.label.toLowerCase() === inputValue.trim().toLowerCase()
      );

      if (!tagExists) {
        // Check if tag exists in incoming tags
        const existingTag = incomingTags.find(tag =>
          tag.label.toLowerCase() === inputValue.trim().toLowerCase()
        );

        if (existingTag) {
          // Add existing tag if not already selected
          if (!selectedTags.some(tag => tag.value === existingTag.value)) {
            setSelectedTags([...selectedTags, existingTag]);
          }
        } else {
          // Create new custom tag
          const newTag = createOption(inputValue.trim());
          setSelectedTags([...selectedTags, newTag]);
        }
      }

      setInputValue('');
    }
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, field: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Filter only image files
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) return;

    const currentScreenshots = field.value || [];
    // Add files to the form state for preview (no upload yet)
    field.onChange([...currentScreenshots, ...imageFiles]);
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const currentScreenshots = field.value || [];

    // Add files to the form state for preview (no upload yet)
    field.onChange([...currentScreenshots, ...fileArray]);
  }

  return (
    <div className='flex flex-col gap-5 justify-center px-6 mt-[40px]'>
      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>FULL DESCRIPTION *</p>
        <Controller
          control={control}
          name='full_description'
          rules={{ required: 'Full description is required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder='Type your full description here...'
              height={200}
            />
          )}
        />
        {errors.full_description && (
          <p className='text-red-500 text-sm'>{errors.full_description.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>Key Features *</p>
        <Controller
          control={control}
          name='features'
          rules={{ required: 'Key features are required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder='List the key features of your tool...'
              height={200}
            />
          )}
        />
        {errors.features && (
          <p className='text-red-500 text-sm'>{errors.features.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>Use cases *</p>
        <Controller
          control={control}
          name='use_cases'
          rules={{ required: 'Use cases are required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder='Describe the use cases for your tool...'
              height={200}
            />
          )}
        />
        {errors.use_cases && (
          <p className='text-red-500 text-sm'>{errors.use_cases.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>Tags (Help others discover this tool)</p>
        <div className='space-y-3'>
          {/* Unified tag input with dropdown and custom creation */}
          <ReactSelect
            options={incomingTags}
            isMulti
            value={selectedTags}
            onChange={handleTagSelect}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            inputValue={inputValue}
            placeholder="Select tags or type and press Enter to create new ones"
            isClearable
            isSearchable
            noOptionsMessage={() => "Type to create a new tag"}
            loadingMessage={() => "Loading tags..."}
            styles={{
              indicatorSeparator: () => ({
                display: 'none',
              }),
            }}
          />

          {/* Display selected tags with remove buttons */}
          {selectedTags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {selectedTags.map((tag) => (
                <div
                  key={tag.value}
                  className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md'
                >
                  <span>{tag.label}</span>
                  <button
                    type='button'
                    onClick={() => handleRemoveTag(tag)}
                    className='text-blue-600 hover:text-blue-800'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>UPLOAD SCREENSHOTS (OPTIONAL)</p>
        <Controller
          control={control}
          name='screenshots'
          defaultValue={[]}
          render={({ field }) => (
            <>
              <input
                type='file'
                accept='image/*'
                multiple
                ref={fileImageInputRef}
                onChange={(e) => handleScreenshotsChange(e, field)}
                style={{ display: 'none' }}
              />
              <div

                className={`flex items-center justify-center gap-1 border border-dashed w-full h-[80px] rounded-md cursor-pointer transition-colors ${
                  isDragOver 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-[#F2F2F2] hover:border-gray-300'
                }`}

                onClick={handleScreenshotsDivClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, field)}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
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

                  <p className={`font-[inter] font-medium text-[12px] ${
                    isDragOver ? 'text-blue-600' : 'text-[#CCCCCC]'
                  }`}>
                    {isDragOver 
                      ? 'Drop your images here...' 
                      : 'Drag and drop files here or select from your computer'
                    }
                    
                  </p>
                </div>
              </div>
              <div className='flex gap-2 mt-4 flex-wrap'>
                {(field.value || []).map((screenshot: string | File, index: number) => {
                  const src = typeof screenshot === 'string' ? screenshot : URL.createObjectURL(screenshot);

                  return (
                    <div className='relative' key={index}>
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className='w-15 h-15 object-cover rounded'
                      />
                      <svg
                        width='8'
                        height='8'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='cursor-pointer absolute bottom-11 left-12'
                        onClick={() => {
                          const newScreenshots = [...field.value];
                          newScreenshots.splice(index, 1);
                          field.onChange(newScreenshots);
                        }}
                      >
                        <path
                          d='M0.322681 15.677C0.177061 15.5379 0.0810839 15.3723 0.0347502 15.1801C-0.0115834 14.988 -0.0115834 14.7959 0.0347502 14.6037C0.087703 14.4116 0.18368 14.2493 0.322681 14.1168L6.41886 7.99503L0.322681 1.88323C0.18368 1.75072 0.0910125 1.58841 0.0446789 1.39627C-0.00165477 1.20414 -0.00165477 1.01201 0.0446789 0.819876C0.0910125 0.627743 0.18368 0.462112 0.322681 0.322981C0.468301 0.177226 0.637088 0.0811594 0.829041 0.0347826C1.02099 -0.0115942 1.21295 -0.0115942 1.4049 0.0347826C1.59686 0.0811594 1.76233 0.173913 1.90133 0.313043L8.00745 6.42484L14.1036 0.313043C14.2426 0.167288 14.4081 0.0745342 14.6001 0.0347826C14.792 -0.0115942 14.9807 -0.0115942 15.166 0.0347826C15.3579 0.0811594 15.53 0.177226 15.6823 0.322981C15.8213 0.462112 15.914 0.627743 15.9603 0.819876C16.0132 1.01201 16.0132 1.20414 15.9603 1.39627C15.914 1.58178 15.8213 1.74741 15.6823 1.89317L9.5861 7.99503L15.6823 14.1068C15.8213 14.2526 15.914 14.4215 15.9603 14.6137C16.0066 14.7992 16.0066 14.988 15.9603 15.1801C15.914 15.3723 15.8213 15.5379 15.6823 15.677C15.5367 15.8228 15.3679 15.9188 15.1759 15.9652C14.984 16.0116 14.792 16.0116 14.6001 15.9652C14.4081 15.9188 14.2426 15.8261 14.1036 15.687L8.00745 9.57516L1.90133 15.687C1.76233 15.8261 1.59686 15.9188 1.4049 15.9652C1.21957 16.0116 1.02761 16.0116 0.829041 15.9652C0.637088 15.9188 0.468301 15.8228 0.322681 15.677Z'
                          fill='red'
                          fillOpacity='1'
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        />
      </div>

      {/* New dropdowns for roles and industry */}

      <div className='flex flex-col gap-4'>
        
        <div className='flex flex-col gap-1 w-full'>
          <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>INDUSTRY</p>

          <ReactSelect
            options={industries}
            isMulti
            value={selectedIndustries}
            onChange={(newValues) => setSelectedIndustries([...newValues])}
            placeholder="Select"
            styles={{
              indicatorSeparator: () => ({
                display: 'none',
              }),
            }}
          />
        </div>

        <div className='flex flex-col gap-1 w-ful'>
          <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>ROLES</p>

          <ReactSelect
            options={roles}
            isMulti
            value={selectedRoles}
            onChange={(newValues) => setSelectedRoles([...newValues])}
            placeholder="Select"
            styles={{
              indicatorSeparator: () => ({
                display: 'none',
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
}; 