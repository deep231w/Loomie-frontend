import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBox({logo}) {
  return (
    <div className="flex w-80 items-center bg-gray-900 border border-gray-700 rounded">
      {logo && (
        <div className="px-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
        </div>
      )}
      <Input
        type="text"
        placeholder="Search..."
        className="flex-1 bg-gray-900 text-white border-none rounded-none focus:ring-0"
      />
      <Button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-r">
        <Search className="w-5 h-5" />
      </Button>
    </div>

  );
}
