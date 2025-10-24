import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { IconSend2 } from '@tabler/icons-react';

export default function ChatSection() {
  return (
    <div className="flex flex-col flex-1 p-2">

      <div className="flex items-center gap-2 mt-auto">
        <Input type="text" placeholder="Type message" />
        <Button type="submit" variant="outline">
          <IconSend2 size={40} stroke={2} />
        </Button>
      </div>

    </div>
  );
}
