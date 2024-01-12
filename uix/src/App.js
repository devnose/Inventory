import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Laptops from "./scenes/laptops";
import Printers from "./scenes/printers";
import {SnackbarProvider} from 'notistack'
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Kiosk from "./scenes/kiosk";
import Scanners from "./scenes/scanners";
import Toner from "./scenes/toner";
import Extra from "./scenes/extra";
import Shows from "./scenes/shows";
import Invoice from "./scenes/invoice";
import InvoiceQue from "./scenes/invoiceQue";
import Que from "./scenes/invoiceQue/Que";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    
    <SnackbarProvider>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar className="side" isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/laptops" element={<Laptops />} />
              <Route path="/kiosk" element={<Kiosk />} />
              <Route path="/printers" element={<Printers />} />
              <Route path="/scanners" element={<Scanners />} />
              <Route path="/toner" element={<Toner />} />
              <Route path="/extra" element={<Extra />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/library" element={<Invoice />} />
              <Route path="/que" element={<Que />} />


            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </SnackbarProvider>
  );
}

export default App;
