import type { Editor } from '@tiptap/core';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }
  return (
    <div
      className='z-10 absolute bottom-5 left-5 w-3/5 flex flex-wrap items-start justify-between gap-5
    rounded-md border border-input bg-[#F5F5F5]'
    >
      <div className='flex w-full flex-wrap items-center justify-between'>
        <div className='flex items-center justify-between gap-4 border-r border-r-[#E6E6E6] p-4'>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive('bold')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Bold'
        >
          <Bold className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive('italic')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Italic'
        >
          <Italic className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive('underline')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Underline'
        >
          <Underline className='h-4 w-4' />
        </button>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive('strike')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Strike'
        >
          <Strikethrough className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive('heading', { level: 2 })
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Heading 2'
        >
          <Heading2 className='h-4 w-4' />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive('bulletList')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Bullet List'
        >
          <List className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive('orderedList')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Ordered List'
        >
          <ListOrdered className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive('blockquote')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Quote'
        >
          <Quote className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setCode().run();
          }}
          className={
            editor.isActive('code')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Code'
        >
          <Code className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive('undo')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Undo'
        >
          <Undo className='h-4 w-4' />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive('redo')
              ? 'rounded-lg bg-primary p-1 text-white'
              : 'p-1'
          }
          title='Redo'
        >
          <Redo className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
} 