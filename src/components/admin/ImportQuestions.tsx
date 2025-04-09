
import { useState } from 'react';
import { importQuizQuestions } from '@/services/mockQuizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const ImportQuestions = () => {
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!jsonData.trim()) {
        setError('Будь ласка, введіть JSON-дані');
        return;
      }

      // Parse the JSON data to check validity
      let parsedData;
      try {
        parsedData = JSON.parse(jsonData);
      } catch (e) {
        setError('Невірний формат JSON. Перевірте правильність даних.');
        return;
      }

      // Perform the import
      const result = await importQuizQuestions(parsedData);
      
      if (result) {
        setSuccess(true);
        toast({
          title: "Питання імпортовано",
          description: "Питання успішно імпортовано до системи.",
        });
      } else {
        setError('Не вдалося імпортувати питання');
      }
    } catch (err) {
      console.error('Error importing questions:', err);
      setError('Сталася помилка під час імпорту питань');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container max-w-3xl px-4 py-8 mx-auto">
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-fishing-blue to-fishing-lightBlue text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Імпорт питань
          </CardTitle>
          <CardDescription className="text-white/80">
            Завантажте питання для тесту у форматі JSON
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-4">
                Завантажте JSON-файл з питаннями або вставте JSON-дані у поле нижче:
              </p>
              
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Натисніть для завантаження</span> або перетягніть файл
                    </p>
                    <p className="text-xs text-gray-500">JSON (*.json)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
            
            <Textarea
              placeholder="Введіть JSON-дані тут..."
              className="h-64 font-mono"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Помилка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Успіх</AlertTitle>
                <AlertDescription>
                  Питання успішно імпортовано до системи.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 p-6 rounded-b-lg">
          <Button
            onClick={handleImport}
            disabled={loading || !jsonData.trim()}
            className="w-full bg-fishing-blue hover:bg-fishing-blue/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Імпортуємо...
              </>
            ) : (
              'Імпортувати питання'
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Формат JSON</CardTitle>
            <CardDescription>
              Приклад правильного формату даних для імпорту питань:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
{`[
  {
    "id": "q1",
    "sectionId": "general",
    "text": "Текст питання",
    "options": [
      "Варіант відповіді 1",
      "Варіант відповіді 2",
      "Варіант відповіді 3",
      "Варіант відповіді 4"
    ],
    "correctAnswer": 0,
    "explanation": "Пояснення правильної відповіді"
  },
  ...
]`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportQuestions;
