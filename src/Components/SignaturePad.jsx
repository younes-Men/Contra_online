import React from "react"
import { useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"

function SignaturePad({ onSave, onClear }) {
  const sigPad = useRef(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const handleEnd = () => {
    if (sigPad.current) {
      setIsEmpty(sigPad.current.isEmpty())
    }
  }

  const handleClear = () => {
    if (sigPad.current) {
      sigPad.current.clear()
      setIsEmpty(true)
      if (onClear) onClear()
    }
  }

  const handleSave = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const dataURL = sigPad.current.toDataURL()
      if (onSave) onSave(dataURL)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="border-2 border-gray-300 rounded-lg bg-white shadow-sm p-2">
        <SignatureCanvas
          ref={sigPad}
          canvasProps={{
            width: 400,
            height: 150,
            className: "signature-canvas border border-gray-200 rounded",
          }}
          backgroundColor="white"
          penColor="black"
          onEnd={handleEnd}
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors text-sm font-medium"
        >
          Effacer
        </button>
        <button
          onClick={handleSave}
          disabled={isEmpty}
          className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
            isEmpty ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Enregistrer
        </button>
      </div>
    </div>
  )
}

export default SignaturePad