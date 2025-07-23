import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      <header>
        <h1>Layout</h1>
        {/* Potentially put nvabar here */}
      </header>

      <main>
        <Outlet /> {/* Pages will be displayed here */}
      </main>

      <footer>
        <p>My footer</p>
      </footer>
    </div>
  );
}
