import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {useState} from "react"
import { useSearchParams} from "react-router-dom";

import "./common/style/common.style.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";

function App() {
  const [query] = useSearchParams();

  const [navSearchQuery, setNavSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //네이게이션 바 검색 조건들을 저장하는 객체

  return (
    <div>
      <AppLayout navSearchQuery={navSearchQuery} setNavSearchQuery={setNavSearchQuery} >
        <AppRouter navSearchQuery={navSearchQuery} setNavSearchQuery={setNavSearchQuery}   />
      </AppLayout>
    </div>
  );
}

export default App;
