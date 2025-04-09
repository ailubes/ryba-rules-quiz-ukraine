
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Fish, BookOpen, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen water-bg flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fish className="h-8 w-8 text-fishing-blue" />
            <h1 className="text-2xl font-bold text-fishing-blue">
              ПРАВИЛА любительського рибальства
            </h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin')}
            className="flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            Адмін
          </Button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 inline-flex p-4 bg-blue-50 rounded-full">
              <BookOpen className="h-12 w-12 text-fishing-blue" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Тест на знання правил рибальства
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              Перевірте свої знання правил любительського рибальства України за допомогою нашого інтерактивного тесту
            </p>
            
            <div className="space-y-4 mb-12">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <span className="text-fishing-blue font-bold">1</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Виберіть рівень складності</h3>
                  <p className="text-gray-500">Легкий (30 питань), Середній (50 питань) або Складний (100 питань)</p>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <span className="text-fishing-blue font-bold">2</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Пройдіть тест</h3>
                  <p className="text-gray-500">Відповідайте на питання та слідкуйте за часом</p>
                </div>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <span className="text-fishing-blue font-bold">3</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Отримайте результати</h3>
                  <p className="text-gray-500">Дізнайтеся свій рівень знань правил рибальства</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/quiz')} 
              size="lg" 
              className="bg-fishing-blue hover:bg-fishing-blue/90"
            >
              Почати тест
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>© 2025 Тест на знання правил любительського рибальства України</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
