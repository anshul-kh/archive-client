import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RootPageLayout from "@/layouts/root-page";
import { storage_variables } from "@/globals";

interface LocalFile {
  sessionId: string;
  title: string;
  updatedAt: string;
}

const statCards = [
  {
    label: "Documents",
    value: (() => {
      try {
        const docList = JSON.parse(localStorage.getItem(storage_variables.DOC_LIST) || "{}");
        return `${Object.keys(docList).length} file${Object.keys(docList).length !== 1 ? "s" : ""}`;
      } catch {
        return "0 files";
      }
    })(),
  },
];


export default function FilesPage() {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fileList: LocalFile[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        if (parsed?.content) {
          fileList.push({
            sessionId: key,
            title: parsed.title || "Untitled",
            updatedAt: parsed.updatedAt || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`Skipping invalid entry for ${key}`, err);
      }
    }

    setFiles(fileList);
  }, []);

  const handleTitleChange = (id: string, newTitle: string) => {
    const raw = localStorage.getItem(id);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      parsed.title = newTitle;
      localStorage.setItem(id, JSON.stringify(parsed));
      setFiles((prev) =>
        prev.map((f) => (f.sessionId === id ? { ...f, title: newTitle } : f))
      );
    } catch (err) {
      console.error("Failed to update title:", err);
    }
  };

  const handleDelete = (id: string) => {
    localStorage.removeItem(id);
    setFiles((prev) => prev.filter((f) => f.sessionId !== id));
  };

  return (
    <RootPageLayout className="w-full px-4 py-6">
      <div className="max-w-3xl mx-auto mt-14 space-y-8">
        <h1 className="text-3xl font-bold">My Drive</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-gradient-to-r from-[#1f1f47] to-[#181835] text-white p-4 rounded-2xl shadow flex flex-col"
            >
              <p className="text-sm text-gray-300">{card.label}</p>
              <p className="text-xl font-semibold">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Files */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Files</h2>
          {files.length === 0 ? (
            <p className="text-gray-500">No saved files found.</p>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.sessionId}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 flex justify-between items-center"
                >
                  <div className="flex flex-col w-full">
                    <input
                      className="text-lg font-medium bg-transparent border-none outline-none w-full"
                      value={file.title}
                      onChange={(e) =>
                        handleTitleChange(file.sessionId, e.target.value)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Updated: {new Date(file.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex gap-3 ml-4">
                    <button
                      onClick={() => navigate(`/edit/${file.sessionId}`)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(file.sessionId)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RootPageLayout>
  );
}
