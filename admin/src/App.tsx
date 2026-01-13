import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Users from "@/pages/Users";
import AITools from "@/pages/AITools";
import News from "@/pages/News";
import Articles from "@/pages/Articles";
import Learning from "@/pages/Learning";
import Prompts from "@/pages/Prompts";
import Glossary from "@/pages/Glossary";
import Reviews from "@/pages/Reviews";
import Submissions from "@/pages/Submissions";
import Newsletters from "@/pages/Newsletters";
import Categories from "@/pages/Categories";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import Settings from "@/pages/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/components/Login";
import { NotificationProvider } from "@/contexts/NotificationContext";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <NotificationProvider>
            <Layout />
          </NotificationProvider>
        }
      >
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-tools"
          element={
            <ProtectedRoute>
              <AITools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <ProtectedRoute>
              <Learning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prompts"
          element={
            <ProtectedRoute>
              <Prompts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/glossary"
          element={
            <ProtectedRoute>
              <Glossary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newsletters"
          element={
            <ProtectedRoute>
              <Newsletters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
