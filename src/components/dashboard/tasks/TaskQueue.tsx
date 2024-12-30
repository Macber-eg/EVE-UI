import React from 'react';
import { Clock, CheckCircle, AlertTriangle, Brain } from 'lucide-react';
import { useTaskQueue } from '../../../hooks/useTaskQueue';
import { Task } from '../../../types/task';

interface TaskQueueProps {
  className?: string;
}

export default function TaskQueue({ className = '' }: TaskQueueProps) {
  const { tasks, loading, error } = useTaskQueue('atlas'); // Default to Atlas EVE

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-[#72f68e]" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#72f68e]/20 border-t-[#72f68e] animate-spin"></div>
          <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#72f68e]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className={`bg-[#040707]/30 backdrop-blur-sm rounded-lg p-6 border border-white/10 ${className}`}>
      <h3 className="text-lg font-medium text-white mb-4">Task Queue</h3>
      
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">No tasks in queue</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white font-medium mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-400">{task.description}</p>
                  
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'urgent' ? 'bg-red-500/10 text-red-500' :
                      task.priority === 'high' ? 'bg-orange-500/10 text-orange-500' :
                      task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {task.priority}
                    </span>
                    
                    {task.deadline && (
                      <span className="text-xs text-gray-400">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                  <span className={`text-sm ${
                    task.status === 'completed' ? 'text-[#72f68e]' :
                    task.status === 'failed' ? 'text-red-500' :
                    task.status === 'in_progress' ? 'text-yellow-500' :
                    'text-gray-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}