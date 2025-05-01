import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import EditPage from "@/pages/edit";
import NewPage from "@/pages/new";
import FilePage from "@/pages/files";
import ErrorPage from "@/pages/error";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<EditPage />} path="/edit/:id" />
      <Route element={<NewPage />} path="/new" />
      <Route element={<FilePage />} path="/files" />
      <Route element={<ErrorPage/>} path="/error" />
    </Routes>
  );
}

export default App;
