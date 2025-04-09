
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen water-bg flex flex-col items-center justify-center">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-fishing-blue mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Сторінку не знайдено</p>
        <p className="text-gray-500 mb-8">
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Button 
          className="bg-fishing-blue hover:bg-fishing-blue/90"
          onClick={() => navigate('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          На головну
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
