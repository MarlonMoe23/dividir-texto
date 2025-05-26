import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [parts, setParts] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
    };
    reader.readAsText(file);
  };

  const splitText = () => {
    if (!text.trim()) return;
    const words = text.trim().split(/\s+/);
    const chunkSize = 1450;
    const overlap = 50;
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const part = words.slice(i, i + chunkSize).join(" ");
      chunks.push(part);
    }

    setParts(chunks);
  };

  const downloadPart = (content, index) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parte_${index + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert("Texto copiado al portapapeles.");
    } catch (err) {
      alert("No se pudo copiar el texto.");
    }
  };

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Dividir texto en partes (con solapamiento)</h1>

      <textarea
        placeholder="Pega tu texto aquí..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", height: 200, marginBottom: 10, padding: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>

      <button
        onClick={splitText}
        style={{
          padding: "10px 20px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Dividir texto
      </button>

      {parts.length > 0 && (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>Acciones por parte:</h2>
          <ul style={{ paddingLeft: 20 }}>
            {parts.map((part, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => downloadPart(part, index)}
                  style={{
                    padding: "6px 12px",
                    background: "#008000",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginRight: 10,
                  }}
                >
                  Descargar parte {index + 1}
                </button>
                <button
                  onClick={() => copyToClipboard(part)}
                  style={{
                    padding: "6px 12px",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Copiar parte {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
