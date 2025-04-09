
import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { DifficultyLevel } from '../types/quiz';
import { REGIONS } from '../constants/regions';
import { DIFFICULTY_INFO } from '../constants/quizConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Fish, BookOpen, Trophy } from 'lucide-react';

const UserRegistrationForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const { startQuiz } = useQuiz();
  const [userName, setUserName] = useState('');
  const [regionId, setRegionId] = useState<string>('');
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>('easy');
  const [errors, setErrors] = useState({
    userName: '',
    regionId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      userName: userName.trim() ? '' : 'Будь ласка, введіть ваше ім\'я',
      regionId: regionId ? '' : 'Будь ласка, виберіть ваш регіон',
    };
    
    setErrors(newErrors);
    
    // If there are no errors, start the quiz
    if (!newErrors.userName && !newErrors.regionId) {
      startQuiz(userName, parseInt(regionId), difficultyLevel);
      onSubmit();
    }
  };

  const difficultyCards = [
    {
      level: 'easy' as DifficultyLevel,
      icon: <BookOpen className="h-10 w-10 text-fishing-green" />,
      title: DIFFICULTY_INFO.easy.label,
      description: DIFFICULTY_INFO.easy.description,
    },
    {
      level: 'medium' as DifficultyLevel,
      icon: <Fish className="h-10 w-10 text-fishing-blue" />,
      title: DIFFICULTY_INFO.medium.label,
      description: DIFFICULTY_INFO.medium.description,
    },
    {
      level: 'hard' as DifficultyLevel,
      icon: <Trophy className="h-10 w-10 text-fishing-yellow" />,
      title: DIFFICULTY_INFO.hard.label,
      description: DIFFICULTY_INFO.hard.description,
    },
  ];

  return (
    <div className="container max-w-2xl px-4 py-8 mx-auto">
      <Card className="bg-white shadow-md">
        <CardHeader className="text-center bg-gradient-to-r from-fishing-blue to-fishing-lightBlue text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Тест на знання правил рибальства України
          </CardTitle>
          <CardDescription className="text-white/80">
            Перевірте свої знання правил любительського рибальства
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="userName">Ваше ім'я</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Введіть ваше ім'я"
                className={errors.userName ? 'border-red-500' : ''}
              />
              {errors.userName && <p className="text-sm text-red-500">{errors.userName}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="regionId">Ваша область</Label>
              <Select
                value={regionId} 
                onValueChange={setRegionId}
              >
                <SelectTrigger id="regionId" className={errors.regionId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Виберіть область" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.regionId && <p className="text-sm text-red-500">{errors.regionId}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Рівень складності</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {difficultyCards.map((card) => (
                  <div
                    key={card.level}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      difficultyLevel === card.level
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => setDifficultyLevel(card.level)}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      {card.icon}
                      <h3 className="font-medium">{card.title}</h3>
                      <p className="text-sm text-gray-500">{card.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end bg-gray-50 p-6 rounded-b-lg">
            <Button type="submit" className="bg-fishing-blue hover:bg-fishing-blue/90">
              Почати тест
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserRegistrationForm;
