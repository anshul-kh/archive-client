import React from "react";
import { FilePlus, Search, Edit2, Folder, Save } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDocumentStore } from "@/stores/useContentStore";
import { storeContentForSession } from "@/utils/handler";
import { Player } from "@lottiefiles/react-lottie-player";
import miniLogoAnimation from "@/assets/animations/mini-logo.json";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const { content , setIsEditable,isEditable} = useDocumentStore();

  const handleSave = () => {
    if (!sessionId || !content) return;

    const title = extractTitleFromContent(content) || "Untitled Document";

    storeContentForSession(sessionId, {
      title,
      content,
      modifiedAt: new Date().toISOString(),
    });
  };

  function extractTitleFromContent(json: any): string | null {
    if (!json.content) return null;

    for (const node of json.content) {
      if (node.type === "heading" && node.attrs?.level === 1 && node.content) {
        return node.content.map((c: any) => c.text || "").join("").trim() || null;
      }
    }

    return null;
  }

  // Create new session and navigate to edit page
  const handleNewFile = () => {
    const newSessionId = generateSessionId();
    const defaultContent = {
      title: "Untitled Document",
      content: [], // You can define a default content structure here
    };

    // Store default content in localStorage
    localStorage.setItem(newSessionId, JSON.stringify(defaultContent));

    // Navigate to the edit page with the new session ID
    navigate(`/edit/${newSessionId}`);
  };

  // Function to generate a unique session ID (could use UUID or other method)
  const generateSessionId = (): string => {
    return 'session-' + Math.random().toString(36).substr(2, 9); // Simple unique ID generator
  };

  const handleEditToggle = () => setIsEditable(!isEditable);

  const menuItems = [
    { key: "new", icon: <FilePlus size={20} />, label: "New File", path: null, action: handleNewFile },
    { key: "search", icon: <Search size={20} />, label: "Search", path: "/" },
    { key: "edit", icon: <Edit2 size={20} />, label: "Edit", path: null,    disabled: true, title: sessionId ? "Edit Document" : "Open A Document First", action:handleEditToggle  },
    { key: "files", icon: <Folder size={20} />, label: "Files", path: "/files" },
    {
      key: "save",
      icon: <Save size={20} />,
      label: "Save",
      path: null,
      action: handleSave,
      disabled: !sessionId,
      title: sessionId ? "Save Document" : "Need a valid document",
    },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-16 flex flex-col items-center bg-[#f6f7f9] dark:bg-[#1e1e1e] py-6 border-r border-gray-300 dark:border-gray-700 z-50">
      {/* Logo */}
      <div className="w-15 h-15 mb-4">
      <Player
        autoplay
        loop
        src={miniLogoAnimation}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  
      {/* Divider Label */}
      <span className="text-[10px] text-gray-500 tracking-wide mb-4 pb-2 border-b">MAIN</span>
  
      {/* Menu Items */}
      <div className="flex flex-col gap-4 items-center border-b pb-2">
        {menuItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          const isDisabled = item.disabled;
  
          return (
            <div
              key={item.key}
              className={`
                w-10 h-10 flex items-center justify-center rounded-xl
                transition-all duration-200
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200 dark:hover:bg-gray-700"}
              `}
              onClick={() => {
                if (isDisabled) return;
                if (item.path) navigate(item.path);
                else if (item.action) item.action();
              }}
              title={item.title || item.label}
            >
              <div className="text-gray-700 dark:text-gray-200">{item.icon}</div>
            </div>
          );
        })}
      </div>

  
      {/* Spacer */}
      <div className="flex-1" />
    </div>
  );
  
};

export default Sidebar;
