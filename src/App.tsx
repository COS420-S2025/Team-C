import Navbar from "./components/Navbar/Navbar";
import { CollectionsProvider } from "./pages/CollectionContext";

function App() {
  return (
    <CollectionsProvider>
      <Navbar />
    </CollectionsProvider>
  );
}

export default App;
