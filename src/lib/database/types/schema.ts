import { CompanyTable, EVETable, TaskTable, SubscriptionTable } from './tables';

export interface Database {
  public: {
    Tables: {
      companies: CompanyTable;
      eves: EVETable;
      tasks: TaskTable;
      subscriptions: SubscriptionTable;
      // Add other tables as needed...
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}