import { useState } from "react"
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left"
import Eye from "lucide-react/dist/esm/icons/eye"
import EyeOff from "lucide-react/dist/esm/icons/eye-off"
import Pencil from "lucide-react/dist/esm/icons/pencil"
import Plus from "lucide-react/dist/esm/icons/plus"
import Trash2 from "lucide-react/dist/esm/icons/trash-2"

export default function PaperInput({ papers, onAdd, onUpdate, onRemove, onStart, onBack }) {
  const [inputValue, setInputValue] = useState("")
  const [listVisible, setListVisible] = useState(true)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editValue, setEditValue] = useState("")

  const addPaper = () => {
    if (onAdd(inputValue)) setInputValue("")
  }

  const startEdit = (index) => {
    setEditingIndex(index)
    setEditValue(papers[index])
  }

  const saveEdit = () => {
    if (editingIndex === null) return
    if (onUpdate(editingIndex, editValue)) setEditingIndex(null)
  }

  const removePaper = (index) => {
    if (editingIndex === index) setEditingIndex(null)
    else if (editingIndex !== null && index < editingIndex) setEditingIndex(editingIndex - 1)
    onRemove(index)
  }

  return (
    <div className="screen">
      <header className="hero">
        <span className="emoji-bounce">📝</span>
        <h1 className="title-white">¡Agregá Papelitos!</h1>
      </header>

      <div className="actions">
        <button className="btn btn-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Volver a equipos
        </button>
      </div>

      <section className="card">
        <p className="hint hint-strong">🤫 Pasá el celular. ¡No dejes que vean lo que escribís!</p>
        <input
          className="field"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Batman, Pizza, Torre Eiffel..."
          onKeyDown={(event) => event.key === "Enter" && addPaper()}
        />
        <button className="btn btn-primary" type="button" onClick={addPaper}>
          <Plus size={18} />
          Agregar Papelito
        </button>

        <div className="score-card paper-count">
          <span className="score-emoji">🎫</span>
          <div className="score-number">{papers.length}</div>
          <div className="score-label">papelitos en el bowl</div>
        </div>

        <button className="btn btn-quiet" type="button" onClick={() => setListVisible((visible) => !visible)}>
          {listVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          {listVisible ? "Ocultar lista" : "Mostrar lista"}
        </button>

        {listVisible && (
          papers.length === 0 ? (
            <p className="hint">Todavía no hay papelitos.</p>
          ) : (
            <ul className="paper-list">
              {papers.map((paper, index) => (
                <li className="paper-item" key={`${paper}-${index}`}>
                  {editingIndex === index ? (
                    <>
                      <input
                        className="field field-inline"
                        value={editValue}
                        onChange={(event) => setEditValue(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && saveEdit()}
                        aria-label="Editar papelito"
                      />
                      <button className="btn btn-success btn-small" type="button" onClick={saveEdit}>
                        Guardar
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="paper-text">{paper}</span>
                      <button className="btn btn-primary btn-icon" type="button" aria-label={`Editar ${paper}`} onClick={() => startEdit(index)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-danger btn-icon" type="button" aria-label={`Borrar ${paper}`} onClick={() => removePaper(index)}>
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </section>

      {papers.length >= 4 && (
        <div className="actions">
          <button className="btn btn-success btn-xl pulse" type="button" onClick={onStart}>
            🎮 ¡EMPEZAR JUEGO!
          </button>
        </div>
      )}
    </div>
  )
}
