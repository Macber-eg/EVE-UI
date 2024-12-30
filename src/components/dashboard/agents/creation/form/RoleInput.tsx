

interface RoleInputProps {
  value: string;
  onChange: (role: string) => void;
}

export function RoleInput({ value, onChange }: RoleInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">
        Role
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#72f68e]"
        placeholder="Enter EVE role"
        required
      />
    </div>
  );
}