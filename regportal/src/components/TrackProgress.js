import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";
import { useNavigate } from "react-router-dom";

export default function TrackProgress() {
  const [announcement, setAnnouncement] = useState("");
  const [quizSlot, setQuizSlot] = useState(null);
  const [piSlot, setPiSlot] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

//   const API_BASE = 
    const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:2117";

  const checkRegistered = async () => {
    try {
      const res = await fetch(`${API_BASE}/checkRegistered`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to check registration status");
      }

      const data = await res.json(); 
      return data;
    } catch (error) {
      console.error("Error checking registration:", error);
      return null;
    }
  };

    useEffect(() => {
    const verifyRegistration = async () => {
      const result = await checkRegistered();

      if (!result?.registered) {
        navigate("/ended");
      }
    };

    verifyRegistration();
  }, [navigate]);


  useEffect(() => {
    // Fetch latest announcement from backend
    fetchWithAuth("/latestAnnouncement")
      .then((res) => res.json())
      .then((data) => {
        if (data?.note) setAnnouncement(data.note);
        else setAnnouncement("No new announcements at the moment.");
      })
      .catch(() => setAnnouncement("Failed to fetch announcement."));
  }, []);

  const handleLogout = () => {
    fetchWithAuth("/logout").then(() => {
      window.location.href = "/";
    });
  };

  const fetchQuizSlot = async () => {
    setError("");
    setQuizSlot(null);
    try {
      const res = await fetchWithAuth("/myQuizSlot");
      const data = await res.json();
      if (res.ok && data?.slot) {
        setQuizSlot(data.slot);
      } else {
        setError("Could not fetch your quiz slot.");
      }
    } catch {
      setError("Error fetching quiz slot.");
    }
  };

  const fetchPISlot = async () => {
    setError("");
    setPiSlot(null);
    try {
      const res = await fetchWithAuth("/myPISlot");
      const data = await res.json();
      if (res.ok && data?.slot) {
        setPiSlot(data.slot);
      } else {
        setError("Could not fetch your PI slot.");
      }
    } catch {
      setError("Error fetching PI slot.");
    }
  };

  const fetchFinalResult = async () => {
    setError("");
    setFinalResult(null);
    try {
      const res = await fetchWithAuth("/myFinalResult");
      const data = await res.json();
      if (res.ok && data?.result) {
        setFinalResult(data.result);
      } else {
        setError("Could not fetch your result.");
      }
    } catch {
      setError("Error fetching final result.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col relative bg-gray-900">
      <img
        src="/3.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="bg-gray-800 rounded-3xl w-[80%] md:w-[50%] lg:w-[35%] p-8 text-white relative z-10">
        {/* top window-like header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex space-x-2">
            <div className="lg:w-4 w-3 h-3 lg:h-4 bg-red-500 rounded-full"></div>
            <div className="lg:w-4 w-3 h-3 lg:h-4 bg-yellow-500 rounded-full"></div>
            <div className="lg:w-4 w-3 h-3 lg:h-4 bg-green-500 rounded-full"></div>
          </div>
          <div className="font-mono text-sm">progress.txt</div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-5">
          <img src="/year.png" alt="Logo" className="mx-auto w-32 lg:w-36" />
          <h1 className="text-white text-[11px] lg:text-sm font-mono">
            {`{Track My Progress — Batch of 2029}`}
          </h1>
        </div>

        {/* Scrolling Announcement */}
<div className="mb-6 text-center overflow-hidden">
  <marquee
    behavior="scroll"
    direction="left"
    scrollamount="10"
    className="text-yellow-400 font-mono text-sm"
  >
    {announcement}
  </marquee>
</div>
        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={fetchQuizSlot}
            className="w-full px-5 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white border-2 border-gray-700 transition-all"
          >
            Find My Slot – Quiz
          </button>

          {quizSlot && (
            <div className="mt-3 p-3 bg-gray-700 rounded-lg text-center">
              <p className="text-white font-mono text-sm">
                Date : 28 October, 2025 <br/>
                Your Quiz Slot: <span className="font-semibold">{quizSlot}</span>
              </p>
              <p className="text-gray-300 text-md mt-2 italic">
                If the quiz is missed, the system will automatically reschedule
                your quiz for another makeup slot on the same or next day.
                VISIT THE SITE REGULARLY TO CHECK.
              </p>
            </div>
          )}

          <button
            onClick={fetchPISlot}
            className="w-full px-5 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white border-2 border-gray-700 transition-all"
          >
            Find My Slot – PI
          </button>

          {piSlot && (
            <div className="mt-3 p-3 bg-gray-700 rounded-lg text-center">
              <p className="text-white font-mono text-sm">
                🎤 Your PI Slot: <span className="font-semibold">{piSlot}</span>
              </p>
            </div>
          )}

          <button
            onClick={fetchFinalResult}
            className="w-full px-5 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white border-2 border-gray-700 transition-all"
          >
            Fetch My Final Result
          </button>

          {finalResult && (
            <div className="mt-3 p-3 bg-gray-700 rounded-lg text-center">
              <p className="text-white font-mono text-sm">
                🏁 Your Result: <span className="font-semibold">{finalResult}</span>
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-400 text-sm mt-4 text-center">{error}</div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-10 mb-2">
          <span className="text-xs lg:text-md">#CCS #Batchof2029</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
