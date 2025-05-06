import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import EditPage from "@/pages/edit";
import NewPage from "@/pages/new";
import FilePage from "@/pages/files";
import ErrorPage from "@/pages/error";
import CanvasPage from "./pages/canvas";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<EditPage />} path="/edit/:id" />
      <Route element={<NewPage />} path="/new" />
      <Route element={<FilePage />} path="/files" />
      <Route element={<ErrorPage/>} path="/error" />
      <Route element={<CanvasPage/>} path="/canvas/:id" />
    </Routes>
  );
}

export default App;
