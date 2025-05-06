import { useEffect } from "react";
import { useParams } from "react-router-dom";
import RootPageLayout from "@/layouts/root-page";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useDocumentStore } from "@/stores/useContentStore";
import { CanvasModeToggle } from "@/components/canvas-toggle";

export default function CanvasPage() {
  const { id: sessionId } = useParams();
//   const {setContent,content} = useDocumentStore();

//   useEffect(() => {
//     if (sessionId) {
//       const raw = localStorage.getItem(`${sessionId}`);
//       if (raw) {
//         try {
//           const parsed = JSON.parse(raw);
//           if (parsed.content) {
//             setContent(parsed.content ?? {});
//           }
//         } catch (err) {
//           console.error("Failed to parse session content:", err);
//         }
//       }
//     }
//   }, [sessionId, setContent]);


//   useEffect(()=>{
//     console.log(content)
//   },[content])


  return (
    <RootPageLayout>
      {sessionId ? <CanvasModeToggle/>:null}
    </RootPageLayout>
  );
}
