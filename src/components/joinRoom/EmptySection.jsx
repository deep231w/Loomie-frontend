import { IconFolderCode, IconHomeExclamation } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"
import {Input} from '../ui/input';
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptySection() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconHomeExclamation />
        </EmptyMedia>
        <EmptyTitle>No Rooms Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any rooms and not joined any room yet. Get started by creating
          your first room or enter room code to join room.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2 flex-col">
          <Button>Create Room</Button>
            <h2 className="text-white">OR</h2>
          <div className="flex items-center space-x-2">
            <Input type="text" placeholder="Enter Room Code"/>
            <Button variant="outline">Join Room</Button>
          </div>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}
