
import { Search } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="flex-1 min-w-0 flex items-center">
      <div className="w-full max-w-lg">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm"
            placeholder="Search..."
            type="search"
          />
        </div>
      </div>
    </div>
  );
}