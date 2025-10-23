import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBox() {
  return (
    <div className="flex w-80">
      <Input
        type="text"
        placeholder="Search..."
        className="rounded-r-none bg-gray-900 text-white border-gray-700"
      />
      <Button className="rounded-l-none bg-gray-800 hover:bg-gray-700 border border-gray-700">
        <Search className="w-5 h-5" />
      </Button>
    </div>
  );
}
