import React, {useRef, useEffect, useState} from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';

interface EditorProps {
    updateDescription: (data: OutputData) => void;
    initialData: string | OutputData;
    isLoading: boolean;
}

const Editor: React.FC<EditorProps> = ({ updateDescription, initialData, isLoading}) => {
    const editorInstance = useRef<EditorJS | null>(null);
    const [editorData, setEditorData] = useState<OutputData>({ blocks: [] });
    const prevLoadingRef = useRef<boolean>(isLoading);

    useEffect(() => {

        const initEditor = async () => {

            if (!editorInstance.current  && initialData !== undefined) {

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

                const [editor] = await Promise.all([new EditorJS({
                    holder: 'editorjs',
                    tools: {
                        header: Header,
                        paragraph: Paragraph,
                    },
                    data: parsedData,
                    async onChange() {
                        try {
                            await editorInstance.current?.isReady;

                            if (editorInstance.current) {
                                const outputData = await editorInstance.current.save();

                                if (outputData) {
                                    setEditorData(outputData);
                                }
                            }
                        } catch (error) {
                            console.error("Ошибка при создании Editor.js:", error);
                        }
                    }
                })]);
                await editor.isReady;

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

    useEffect(() => {

        const prevLoading = prevLoadingRef.current;
        prevLoadingRef.current = isLoading;

        if (!prevLoading && isLoading) {
            updateDescription(editorData);
        }
    }, [isLoading, editorData]);


    return <div className={'modal-input-description'} id="editorjs" />;

};

export default Editor;