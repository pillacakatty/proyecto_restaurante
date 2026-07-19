import "./App.css";

import Cocinero from "./pages/Cocinero";
import CocineroLogin from "./pages/CocineroLogin";
import Inicio from "./pages/Inicio";
import Mesero from "./pages/Mesero";
import MeseroLogin from "./pages/MeseroLogin";

import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login-mesero" element={<MeseroLogin />} />
            <Route path="/login-cocinero" element={<CocineroLogin />} />
            <Route path="/mesero" element={<Mesero />} />
            <Route path="/cocinero" element={<Cocinero />} />
        </Routes>
    );
}

export default App;