import { useState } from "react"
import { IconCategory2 } from "@tabler/icons-react"
import SearchBox from "./SearchBox"
import DialougeBox from "./DialougeBox"

export default function Navbar({setSelectedSection }) {
  const [open, setOpen] = useState(false)
  const [logo, setLogo] = useState("/youtube-svgrepo-com.svg");

  const handleSelect = (type) => {
    setSelectedSection(type); 

    if (type === "youtube") setLogo("/youtube-svgrepo-com.svg");
    else if (type === "spotify") setLogo("/Spotify-Icon-Logo.wine.svg");

    setOpen(false);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-row justify-between items-center w-3/5 px-4">
        <div className="text-2xl">Room name</div>

        <div>
          <SearchBox logo={logo}/>
        </div>

        <button
          className="text-2xl"
          onClick={() => setOpen(true)} 
        >
          <IconCategory2 size={40} stroke={2} />
        </button>

        <DialougeBox open={open} setOpen={setOpen} onSelect={handleSelect}/>
      </div>
    </div>
  )
}
