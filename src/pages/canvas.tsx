import { useParams } from "react-router-dom";
import RootPageLayout from "@/layouts/root-page";
import { CanvasModeToggle } from "@/components/canvas-toggle";
import OverviewFlow from "@/components/canvas-ui/overview-flow";

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
      {sessionId ? <OverviewFlow/>:null}
      {sessionId ? <CanvasModeToggle/>:null}
    </RootPageLayout>
  );
}
