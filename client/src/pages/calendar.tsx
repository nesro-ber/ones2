import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useState } from "react";
import { useAuth } from "@/store/use-auth";
import { Badge } from "@/components/ui/badge";

// Fake data for calendar events
const calendarEvents = [
  { date: new Date(2026, 2, 7), type: 'mission', label: 'Mission à Hassi Messaoud' },
  { date: new Date(2026, 2, 8), type: 'mission', label: 'Mission à Hassi Messaoud' },
  { date: new Date(2026, 2, 9), type: 'mission', label: 'Mission à Hassi Messaoud' },
  { date: new Date(2026, 2, 14), type: 'conge', label: 'Congé annuel' },
  { date: new Date(2026, 2, 15), type: 'conge', label: 'Congé annuel' },
  { date: new Date(2026, 2, 16), type: 'conge', label: 'Congé annuel' },
  { date: new Date(2026, 2, 20), type: 'holiday', label: 'Jour Férié - Printemps' },
  { date: new Date(2026, 2, 25), type: 'work', label: 'Travail Normal' },
];

const getColorClass = (type: string) => {
  switch(type) {
    case 'conge': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'holiday': return 'bg-red-100 border-red-300 text-red-800';
    case 'mission': return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'work': return 'bg-green-100 border-green-300 text-green-800';
    default: return 'bg-slate-100 border-slate-300';
  }
};

export function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { role } = useAuth();

  const getEventsForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return [];
    return calendarEvents.filter(event => 
      event.date.toDateString() === selectedDate.toDateString()
    );
  };

  const eventsForSelectedDate = getEventsForDate(date);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Calendrier</h1>
        <p className="text-muted-foreground mt-1">
          {role === 'agent' ? "Votre planning personnel et jours de congés." : "Vue d'ensemble des plannings et absences."}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="enterprise-shadow border-none rounded-2xl md:col-span-1">
          <CardContent className="p-4 flex justify-center">
            <CalendarUI
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-xl"
              disabled={(d) => {
                // Disable past dates
                return d < new Date(new Date().setHours(0, 0, 0, 0));
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="enterprise-shadow border-none rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle>Événements du {date?.toLocaleDateString('fr-FR') || 'jour'}</CardTitle>
            <CardDescription>Absences, réunions et jours fériés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventsForSelectedDate.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Aucun événement programmé pour cette date.
              </div>
            ) : (
              <div className="space-y-3">
                {eventsForSelectedDate.map((event, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${getColorClass(event.type)}`}>
                    <p className="font-semibold">{event.label}</p>
                    <p className="text-sm opacity-75">
                      {event.date.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="enterprise-shadow rounded-2xl">
        <CardHeader>
          <CardTitle>Légende des Événements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="text-sm font-medium">Congé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm font-medium">Jour Férié</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-orange-100 border-2 border-orange-300 rounded"></div>
              <span className="text-sm font-medium">Mission</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm font-medium">Travail Normal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
