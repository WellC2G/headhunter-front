import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import '../styles/tiptap.css';
import {Editor} from "@tiptap/core";
import {TextStyle} from "novel/extensions";
import {FontSize} from "./FontSize.tsx";

interface TiptapProps {
    initialContent: string | null | undefined;
    getEditorContent: (content: string) => void;
}

const Tiptap: React.FC<TiptapProps> = ({ initialContent, getEditorContent }) => {

    const editor: Editor | null = useEditor({
        extensions: [StarterKit,
            TextStyle,
            FontSize],
        content: initialContent,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            getEditorContent(html);
        },
    });


    return (
        <div className="tiptap-editor">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default Tiptap;