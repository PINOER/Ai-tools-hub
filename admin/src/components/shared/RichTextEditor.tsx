import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  toolbar?: string;
  plugins?: string;
  menubar?: boolean;
  branding?: boolean;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  height = 400,

  toolbar = 'bold italic underline | bullist numlist | link image table | code',
  plugins = 'autolink link lists image table code fullscreen',
  menubar = false,
  branding = true,
  className = '',
}) => {
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const handleEditorInit = (_evt: any, editor: any) => {
    editorRef.current = editor;
    setIsLoading(false);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {isLoading && (
        <div className="flex items-center justify-center h-32 bg-gray-50 border border-gray-200 rounded">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      )}
      <Editor
        apiKey="hdy4rbqocj9waslqod2j02kpu1009sk5ogex2os5zrt0wfhf" 
        onInit={handleEditorInit}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height,
          menubar,
          plugins,
          toolbar,
          branding,
          placeholder,
          cache_suffix: '?v=1.0',
          browser_spellcheck: false, 
          auto_focus: false,
          elementpath: false,
          resize: false,
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-size: 14px; 
              line-height: 1.6; 
              color: #333; 
            }
            p { margin: 0 0 1em 0; }
            h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.5em 0; }
            ul, ol { margin: 0 0 1em 0; padding-left: 2em; }
            blockquote { margin: 1em 0; padding-left: 1em; border-left: 3px solid #ccc; }
            code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
            pre { background: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; }
          `,
          setup: (editor: any) => {
            editor.on('keydown', (e: any) => {
              // Handle keyboard shortcuts
              if (e.keyCode === 9) { // Tab key
                e.preventDefault();
                editor.execCommand('mceInsertContent', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
              }
            });
          },
          // File picker callbacks
          file_picker_callback: (callback: any) => {
            // You can implement custom file picker here
            // For now, we'll use a simple input
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = () => {
              const file = input.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  callback(reader.result as string, { title: file.name });
                };
                reader.readAsDataURL(file);
              }
            };

            input.click();
          },
          // Image upload handler
          images_upload_handler: (blobInfo: any, success: any) => {
            // You can implement custom image upload here
            // For now, we'll convert to base64
            const reader = new FileReader();
            reader.onload = () => {
              success(reader.result as string);
            };
            reader.readAsDataURL(blobInfo.blob());
          },
          // Context menu
          contextmenu: 'link image imagetools table configurepermanentpen',
          // Paste settings
          paste_word_valid_elements: 'b,strong,i,em,h1,h2,h3,h4,h5,h6',
          paste_retain_style_properties: 'color,background-color,font-size,font-family',
          // Auto-resize
          autoresize_bottom_margin: 50,

          // Paste settings
          paste_as_text: false,
          paste_enable_default_filters: true,
          // Link settings
          link_title: false,
          link_assume_external_targets: true,
          link_default_target: '_blank',
          // Table settings
          table_default_styles: {
            width: '100%'
          },
          table_default_attributes: {
            border: '1'
          },
          // Code settings
          codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Ruby', value: 'ruby' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C++', value: 'cpp' },
            { text: 'C#', value: 'csharp' },
            { text: 'SQL', value: 'sql' },
            { text: 'JSON', value: 'json' },
            { text: 'TypeScript', value: 'typescript' },
            { text: 'JSX', value: 'jsx' },
            { text: 'TSX', value: 'tsx' }
          ]
        }}
      />
    </div>
  );
}; 