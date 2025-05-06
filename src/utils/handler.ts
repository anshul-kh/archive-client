// import { storage_variables } from "@/globals";

import { storage_variables } from "@/globals";
import {JSONContent} from "@tiptap/react"
import { toast } from "react-toastify";

interface contentType {
    title: string;
    content: JSONContent;
    modifiedAt: string
}

export function storeContentForSession(sessionId: string, newContent: contentType ) {
    const storageKey = storage_variables.DOC_LIST;

    const existingData = localStorage.getItem(storageKey);
    console.log(existingData)
    let sessionMap: Record<string, string> = existingData ? JSON.parse(existingData) : {};

      sessionMap[sessionId] = (newContent.title);
    

    localStorage.setItem(storageKey,JSON.stringify(sessionMap));
  
    localStorage.setItem(sessionId, JSON.stringify(newContent));

    toast.success("Document Saved Successfully")
}