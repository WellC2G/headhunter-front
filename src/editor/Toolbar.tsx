import '../styles/tiptap.css';
import {Editor} from "@tiptap/core";

interface ToolbarProps {
    editor: Editor | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const setFontSize = (fontSize: string) => {
        editor.chain().focus().setFontSize(fontSize).run();
    };

    return (
        <div className="toolbar">
            <select
                value={editor.getAttributes('textStyle').fontSize || ''}
                onChange={(e) => setFontSize(e.target.value)}
            >
                <option value="">Default</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
            </select>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                Жирный
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                Курсив
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                Зачеркнутый
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                Марк список
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
                Нум список
            </button>
        </div>
    );
};

export default Toolbar;