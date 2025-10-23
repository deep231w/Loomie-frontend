import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
export default function DialougeBox({ open, setOpen, onSelect }) {

  return (
    <Dialog open={open} onOpenChange={setOpen}> 
      <DialogContent className="sm:max-w-md bg-gray-700 text-white border border-neutral-800">
        <DialogHeader>
          <DialogTitle>Contents</DialogTitle>
        </DialogHeader>

        {/* <div className="mt-4 space-y-2">
          <button
            className="bg-white text-black px-3 py-1 rounded"
            onClick={() => setOpen(false)} 
          >
            Close
          </button>
        </div> */}
        <div className="flex flex-row">
            <div className="flex mt-4 ">
                <button
                    onClick={() => onSelect("youtube")}
                >
                    <img src="/youtube-svgrepo-com.svg" alt="YouTube" width={40} height={40} />
                </button>
            </div>

            <div className="flex mt-4 ">
                <button
                    onClick={() => onSelect("spotify")}
                >
                    <img src="/Spotify-Icon-Logo.wine.svg" alt="spotify" width={60} height={60} />
                </button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
