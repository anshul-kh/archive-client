import RootPageLayout from "@/layouts/root-page";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionNotes: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("session-")) {
        const value = localStorage.getItem(key);
        if (value) {
          sessionNotes[key] = value;
        }
      }
    }
    setNotes(sessionNotes);
  }, []);

  const filteredNotes = Object.entries(notes).filter(([_, content]) =>
    content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <RootPageLayout className=" flex flex-col justify-center  items-center overflow-scroll no-scrollbar">
      <div className="min-h-screen max-w-5xl bg-gradient-to-b mt-24 h-full  p-8">
        <h1 className="text-3xl font-bold text-center mb-6 uppercase">Search Your Documents</h1>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-xl px-4 py-2 border rounded-xl shadow-sm"
          />
        </div>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  max-w-6xl h-fit mx-auto">
            {filteredNotes.reverse().map(([sessionId, content]) => (
              <div
                key={sessionId}
                onClick={() => navigate(`/edit/${sessionId}`)}
                className="bg-white border-2 border-sky-300 rounded-xl p-4 shadow hover:shadow-md cursor-pointer transition relative w-64"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-600">Title</h2>
                  <div className="text-yellow-500 text-lg">🌓</div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {JSON.parse(content).title || "Untitled"}
                  </p>
                </div>

                <div className="mt-3 border-b pb-1">
                  <p className="text-xs text-gray-500">ID</p>
                  <p className="text-sm text-gray-700">{sessionId}</p>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">Action</p>
                  <p className="text-sm text-green-600 font-medium">Read more</p>
                </div>
              </div>


            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Start By Creating A New Note...
          </p>
        )}
      </div>
    </RootPageLayout>
  );
}
