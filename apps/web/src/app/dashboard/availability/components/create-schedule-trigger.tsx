'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ScheduleForm } from './schedule-form';

export function CreateScheduleTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border w-full max-w-2xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Nueva Agenda</h2>
            <ScheduleForm
              onSuccess={() => setIsOpen(false)}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
      <Plus className="mr-2 h-4 w-4" />
      Nueva Agenda
    </Button>
  );
}
