import { create } from 'zustand';
import {JSONContent} from "@tiptap/react"

interface TipTapContent {
  type: string;
  content?: TipTapContent[];
  attrs?: { [key: string]: any };
  text?: string;
}

interface DocumentStoreProps {
  session_id: string | null;
  title: string;
  content: JSONContent;
  isEditable: boolean;

  setSessionId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: JSONContent) => void;
  setContentFromJson: (jsonContent: TipTapContent) => void;
  setIsEditable: (state:boolean) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentStoreProps>((set) => ({
  session_id: null,
  title: 'Untitled Document',
  content: {},
  isEditable: false,

  setSessionId: (id: string | null) => set({ session_id: id }),
  setTitle: (title: string) => set({ title }),
  setContent: (content: JSONContent) => set({ content }),

  setContentFromJson: (jsonContent: TipTapContent) => {
    const title = extractTitleFromContent(jsonContent) || 'Untitled Document';
    set({
      content: jsonContent,
      title,
    });
  },
  setIsEditable: (state:boolean)=> set({isEditable:state}),

  reset: () =>
    set({
      session_id: null,
      title: 'Untitled Document',
      content: {},
    }),
}));

export function extractTitleFromContent(json: TipTapContent): string | null {
  if (!json.content) return null;

  for (const node of json.content) {
    if (node.type === 'heading' && node.attrs?.level === 1 && node.content) {
      return node.content.map((c) => c.text || '').join('').trim() || null;
    }
  }

  return null;
}
