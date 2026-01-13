import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './Toolbar';
import Underline from '@tiptap/extension-underline';

const Tiptap = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'h-full min-h-[400px] w-full rounded-md rounded-br-md rounded-bl-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
  });

  return (
    <div className='flex min-h-[20rem] w-full flex-col relative'>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap; 