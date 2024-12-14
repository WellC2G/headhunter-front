import React, {useRef, useEffect} from 'react';
import EditorJS, { ToolConstructable, OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';

interface EditorProps {
    updateDescription: (data: OutputData) => void;
    initialData: string | OutputData;
}

const Editor: React.FC<EditorProps> = ({ updateDescription, initialData}) => {
    const editorInstance = useRef<EditorJS | null>(null);

    useEffect(() => {

        const initEditor = async () => {

            if (!editorInstance.current) {

                let parsedData: OutputData = {blocks: []};

                if (typeof initialData === 'string' && initialData.trim() !== '') {
                    try {
                        parsedData = JSON.parse(initialData);

                        if (!parsedData.blocks || !Array.isArray(parsedData.blocks)) {
                            console.warn("Invalid 'blocks' in initialData. Using empty blocks.");
                            parsedData.blocks = [];
                        }
                    } catch (e) {
                        console.error("Error parsing initialData:", e);
                    }
                } else if (typeof initialData === 'object' && initialData !== null && 'blocks' in initialData) {
                    parsedData = initialData;
                }

                const editor = await new EditorJS({
                    holder: 'editorjs',
                    tools: {
                        header: (Header as unknown) as ToolConstructable,
                        list: (List as unknown) as ToolConstructable,
                    },
                    data: parsedData,
                    async onChange() {
                        try {
                            const outputData = await editorInstance.current?.save();
                            if (outputData) {
                                updateDescription(outputData);
                            }
                        } catch (error) {
                            console.error("Ошибка при создании Editor.js:", error);
                        }
                    }
                });
                editorInstance.current = editor;
            }
        }
        initEditor();

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        }
    }, [initialData]);

    return <div className={'modal-input-description'} id="editorjs" />;

};

export default Editor;