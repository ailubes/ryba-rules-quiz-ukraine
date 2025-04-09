
import ImportQuestions from '../components/admin/ImportQuestions';
import { Button } from '@/components/ui/button';
import { Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen water-bg">
      <header className="bg-white shadow-sm mb-8">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-fishing-blue" />
            <h1 className="text-2xl font-bold text-fishing-blue">
              Адмін-панель
            </h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            На головну
          </Button>
        </div>
      </header>

      <ImportQuestions />

      <footer className="mt-12 py-6 bg-gray-100">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 Тест на знання правил любительського рибальства України</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;
