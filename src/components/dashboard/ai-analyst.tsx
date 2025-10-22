"use client";

import { useState } from "react";
import { useCueKeeper } from "@/hooks/use-cue-keeper";
import { analyzeBilliardData } from "@/ai/flows/analyze-billiard-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, Send, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAnalyst() {
  const { finishedSessions } = useCueKeeper();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setQuery("");

    const historicalData = finishedSessions
      .map(s => `Meja: ${s.tableName}, Mulai: ${new Date(s.startTime).toLocaleString()}, Selesai: ${s.endTime ? new Date(s.endTime).toLocaleString() : 'N/A'}, Biaya: ${s.cost || 0}`)
      .join('\n');

    if (finishedSessions.length < 1) {
      setError("Tidak ada data historis yang cukup untuk dianalisis. Selesaikan setidaknya satu sesi.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await analyzeBilliardData({ historicalData, query });
      const assistantMessage: Message = { role: "assistant", content: result.analysis };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
      setError("Gagal mendapatkan analisis dari AI. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline font-semibold">
          <Bot className="text-accent" />
          Asisten Analisis AI
        </CardTitle>
        <CardDescription>Ajukan pertanyaan tentang data sesi historis Anda.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow space-y-4">
        <ScrollArea className="h-64 flex-grow border rounded-lg p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="mx-auto h-8 w-8 mb-2" />
                <p className="font-semibold">Mulai percakapan!</p>
                <p className="text-sm">Contoh: "Meja mana yang paling populer?"</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg px-3 py-2 max-w-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 bg-secondary animate-pulse">
                     <p className="text-sm text-transparent">Menganalisis...</p>
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleQuery} className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tanya sesuatu..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || !query.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
         <p className="text-xs text-muted-foreground text-center">
            Tekan <CornerDownLeft className="inline-block h-3 w-3" /> untuk mengirim.
          </p>
      </CardContent>
    </Card>
  );
}
