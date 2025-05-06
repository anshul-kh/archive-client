// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { create } from 'zustand';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  Node,
  Edge,
  NodeProps,
  Connection,
  ReactFlowInstance
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'react-toastify';

// Type definitions
interface NodeData {
  label: string;
  color: string;
}

type CustomNodeProps = NodeProps<NodeData>;

// Zustand store with localStorage persistence
interface FlowState {
  saveSession: (sessionId: string, nodes: Node<NodeData>[], edges: Edge[]) => void;
  getSession: (sessionId: string) => { nodes: Node<NodeData>[]; edges: Edge[] } | null;
}

const useFlowStore = create<FlowState>()(() => ({
  saveSession: (sessionId, nodes, edges) => {
    if (nodes.length > 0) {
      const data = JSON.stringify({ nodes, edges });
      localStorage.setItem(`nodes_${sessionId}`, data);
      console.log(`Saved session ${sessionId} with ${nodes.length} nodes`);
    }
  },
  getSession: (sessionId) => {
    const data = localStorage.getItem(`nodes_${sessionId}`);
    return data ? JSON.parse(data) : null;
  }
}));

const CustomNode = ({ id, data, selected }: CustomNodeProps) => {
  const [label, setLabel] = useState(data.label);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`p-4 rounded-md shadow-md ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ 
        backgroundColor: data.color, 
        minWidth: '150px',
        border: '1px solid #ddd'
      }}
    >
      <Handle type="target" position={Position.Top} />
      
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
          autoFocus
          className="w-full bg-transparent border-b border-gray-700 outline-none text-center"
        />
      ) : (
        <div 
          className="text-center cursor-text" 
          onClick={() => setIsEditing(true)}
        >
          {label || 'Click to edit'}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function FlowEditor() {
  const { id: session_id } = useParams<{ id: string }>();
  const { saveSession, getSession } = useFlowStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [newNodeColor, setNewNodeColor] = useState('#E3F2FD');

  // Load session data on mount
  useEffect(() => {
    if (!session_id) return;
    
    const sessionData = getSession(session_id);
    if (sessionData?.nodes?.length > 0) {
      setNodes(sessionData.nodes);
      setEdges(sessionData.edges || []);
    } else {
      setNodes([{
        id: 'node-1',
        type: 'custom',
        position: { x: 100, y: 100 },
        data: { label: 'Start', color: newNodeColor }
      }]);
    }
  }, [session_id, getSession, newNodeColor]);

  // Save when nodes or edges change
  useEffect(() => {
    if (session_id && nodes.length > 0) {
      const timer = setTimeout(() => {
        saveSession(session_id, nodes, edges);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [session_id, nodes, edges, saveSession]);

  // Save on Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(
      { ...params, markerEnd: { type: MarkerType.ArrowClosed } }, 
      eds
    )),
    [setEdges]
  );

  const addNode = useCallback(() => {
    if (!reactFlowInstance) return;
    
    const viewport = reactFlowInstance.getViewport();
    const centerX = window.innerWidth / 2 - viewport.x;
    const centerY = window.innerHeight / 2 - viewport.y;
    
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: centerX, y: centerY },
      data: { 
        label: 'New Node',
        color: newNodeColor
      }
    };

    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, newNodeColor]);

  const handleSave = useCallback(() => {
    if (session_id && nodes.length > 0) {
      saveSession(session_id, nodes, edges);
      toast.success(`Saved ${nodes.length} nodes to session "${session_id}"`);
    }
  }, [session_id, nodes, edges, saveSession]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
      >
        <Background variant="dots" gap={12} size={0.5} />
        <Controls position="bottom-right" />
        <MiniMap zoomable pannable position="bottom-left" />
        
        <Panel position="top-center">
          <div className="flex gap-3 p-3 bg-white rounded-lg shadow-md items-center">
            <button 
              onClick={addNode}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              + Add Node
            </button>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Color:</label>
              <input
                type="color"
                value={newNodeColor}
                onChange={(e) => setNewNodeColor(e.target.value)}
                className="w-8 h-8 cursor-pointer border border-gray-300 rounded"
              />
            </div>

            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ml-4"
              disabled={nodes.length === 0}
            >
              Save (Ctrl+S)
            </button>

            <div className="ml-4 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {nodes.length} nodes | Session: {session_id}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}