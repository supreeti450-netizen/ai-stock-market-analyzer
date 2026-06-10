import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import API from "../services/api";

function AIChat() {
    const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => { setLoading(true);
    try {
      const res = await API.post("/ai/chat", {
        question,
      });

      setAnswer(res.data.answer);
    } catch (err) {
      console.log(err);
      setAnswer("Failed to get AI response");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        🤖 AI Investment Assistant
      </h1>
      <>
  <Sidebar />

  <div
    style={{
      marginLeft: "250px",
      padding: "30px",
    }}
  >
    <Navbar />

    {/* existing AI page code */}
  </div>
</>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about stocks..."
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
        }}
      />

      <button onClick={askAI}>
  {loading ? "Thinking..." : "Ask AI"}
</button>

      {answer && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid gray",
            borderRadius: "10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

export default AIChat;