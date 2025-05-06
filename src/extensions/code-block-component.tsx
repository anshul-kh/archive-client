import { useEffect, useRef, useState } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useAxios } from '@/hooks/use-axios'
import '@/styles/code-block.css'

const languages = ['golang', 'python', 'js']

const CodeBlockComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const [output, setOutput] = useState('')
  const {
    request: execCode,
    loading: isExecuting,
    error: execError,
  } = useAxios('/exec', 'POST')

  const {
    request: getJobResult,
    loading: isPolling,
    error: pollError,
  } = useAxios()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAttributes({ language: e.target.value })
    setOutput('')
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateAttributes({ code: e.target.value })
  }

  const runCode = async () => {
    setOutput('Running...')

    const execResponse = await execCode({
      data: {
        lang: node.attrs.language,
        code: node.attrs.code,
      },
    })

    if (!execResponse?.success) {
      setOutput('Failed to execute code.')
      return
    }

    const { job_id } = execResponse

    const poll = async () => {
      const resultResponse = await getJobResult(undefined, `/job_result/${job_id}`)

      if (!resultResponse?.success) {
        setOutput('Failed to retrieve result.')
        return
      }

      if (resultResponse.type === 'pending') {
        timeoutRef.current = setTimeout(poll, 1000)
      } else {
        setOutput(resultResponse.result)
      }
    }

    poll()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <NodeViewWrapper className="code-block-wrapper terminal-theme">
      <div className="code-header">
        <button onClick={runCode} disabled={isExecuting || isPolling} className="run-btn">
          ▶ RUN
        </button>
      </div>

      <div className="code-body">
        <textarea
          className="code-editor"
          value={node.attrs.code || ''}
          onChange={handleCodeChange}
          spellCheck={false}
          placeholder={`# Write your ${node.attrs.language} code here`}
        />
        <div className="code-output no-scrollbar">
          <span className="output-label">Output:</span>
          <pre className="output-content">
            {output
              .trim()
              .split('\n')
              .map((line, idx) => {
                if (line.startsWith('+')) {
                  return <div key={idx}>{line.slice(1)}</div>
                } else if (line.startsWith('-')) {
                  return (
                    <div key={idx} className="output-error">
                      {line.slice(1)}
                    </div>
                  )
                }
                return <div key={idx}>{line}</div>
              })}
          </pre>
          {(execError || pollError) && (
            <div className="error-text">{execError || pollError}</div>
          )}
        </div>

      </div>

      <div className="code-footer">
        <label>
          Language:
          <select value={node.attrs.language || 'js'} onChange={handleLangChange}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>
      </div>
    </NodeViewWrapper>
  )
}

export default CodeBlockComponent
