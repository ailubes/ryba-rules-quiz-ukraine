
import { useState, useEffect } from 'react';
import { getQuizStatistics } from '../services/mockQuizService';
import { QuizStatistics as StatisticsType } from '../types/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, PieChart, BarChart3, MapPin, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DIFFICULTY_INFO } from '../constants/quizConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type QuizStatisticsProps = {
  onBack: () => void;
};

const QuizStatistics = ({ onBack }: QuizStatisticsProps) => {
  const [statistics, setStatistics] = useState<StatisticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await getQuizStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const difficultyColors = {
    easy: '#047857',    // green
    medium: '#1E3A8A',  // blue
    hard: '#F59E0B',    // yellow
  };

  const prepareDifficultyData = () => {
    return [
      {
        name: DIFFICULTY_INFO.easy.label,
        value: statistics?.difficultyDistribution.easy || 0,
        color: difficultyColors.easy,
      },
      {
        name: DIFFICULTY_INFO.medium.label,
        value: statistics?.difficultyDistribution.medium || 0,
        color: difficultyColors.medium,
      },
      {
        name: DIFFICULTY_INFO.hard.label,
        value: statistics?.difficultyDistribution.hard || 0,
        color: difficultyColors.hard,
      },
    ];
  };

  const prepareRegionData = () => {
    return statistics?.regionPerformance
      .filter(region => region.testsTaken > 0)
      .map(region => ({
        name: region.regionName,
        averageScore: parseFloat(region.averageScore.toFixed(1)),
        testsTaken: region.testsTaken,
      })) || [];
  };

  if (loading) {
    return (
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Завантаження статистики...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-fishing-blue to-fishing-lightBlue text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Статистика тестів
          </CardTitle>
          <CardDescription className="text-white/80">
            Загальна анонімна статистика проходження тестів
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                  <Users className="h-6 w-6 text-fishing-blue" />
                </div>
                <div className="text-3xl font-bold">{statistics?.totalTestsTaken || 0}</div>
                <p className="text-gray-500">Всього пройдено тестів</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <PieChart className="h-6 w-6 text-fishing-green" />
                </div>
                <div className="text-3xl font-bold">
                  {statistics?.overallAverageScore ? `${statistics.overallAverageScore.toFixed(1)}%` : 'Н/Д'}
                </div>
                <p className="text-gray-500">Середній результат</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="difficulty" className="mt-8">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="difficulty" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Розподіл за складністю</span>
              </TabsTrigger>
              <TabsTrigger value="regions" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>Результати за областями</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="difficulty" className="p-1">
              {statistics && statistics.totalTestsTaken > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDifficultyData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Кількість тестів">
                        {prepareDifficultyData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Немає даних для відображення</p>
                  <p className="text-sm text-gray-400 mt-2">Статистика з'явиться після проходження тестів</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="regions" className="p-1">
              {statistics && statistics.regionPerformance.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareRegionData()} layout="vertical" margin={{ left: 150 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Bar dataKey="averageScore" name="Середній бал (%)" fill="#60A5FA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Немає даних для відображення</p>
                  <p className="text-sm text-gray-400 mt-2">Статистика з'явиться після проходження тестів</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-8">
            <Button onClick={onBack} variant="outline" className="min-w-[180px]">
              Повернутися на головну
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizStatistics;
