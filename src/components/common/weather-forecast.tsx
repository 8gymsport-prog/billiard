"use client";

import { useState, useEffect } from 'react';
import { getWeatherForecast } from '@/ai/flows/get-weather-forecast';
import { type WeatherForecastOutput } from '@/ai/schemas/weather-schema';
import { Badge } from '@/components/ui/badge';
import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';

const LOCATION = "Taman Kopo Indah 3, Kabupaten Bandung, Jawa Barat 40218";

const weatherIcons: { [key: string]: React.ElementType } = {
  cerah: Sun,
  berawan: Cloud,
  hujan: CloudRain,
  badai: CloudLightning,
  salju: Snowflake,
  kabut: CloudFog,
};

export function WeatherForecast() {
  const [weather, setWeather] = useState<WeatherForecastOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getWeatherForecast({ location: LOCATION });
        setWeather(result);
      } catch (e) {
        console.error("Gagal mengambil data cuaca:", e);
        setError("Gagal memuat cuaca");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000); 

    return () => clearInterval(interval);
  }, []);

  const WeatherIcon = weather ? (weatherIcons[weather.condition.toLowerCase()] || Sun) : Sun;

  const getContent = () => {
    if (isLoading) {
      return <Badge variant="secondary">Memuat cuaca...</Badge>;
    }
    if (error) {
      return <Badge variant="destructive">{error}</Badge>;
    }
    if (weather) {
      return (
        <Badge variant="secondary" className="flex items-center gap-2">
            <WeatherIcon className="h-4 w-4 text-yellow-500" />
            <span>{weather.temperature}°C, {weather.condition}</span>
        </Badge>
      );
    }
    return null;
  };

  return <div className="text-sm">{getContent()}</div>;
}
