import type React from "react";
import { MoreHorizontal, Trash } from "lucide-react";
import { Collaborator, User, UserEmailAddress } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface CollaboratorsRowProps {
  data: (Collaborator & {
    user: User & { emailAddresses: UserEmailAddress[] };
  })[];
  onRemove: (id: string) => void;
}

export const CollaboratorsRow: React.FC<CollaboratorsRowProps> = ({
  data,
  onRemove,
}) => {
  return (
    <div className="my-8">
      <h3 className="text-md mb-4 font-medium leading-none">
        Active collaborators
      </h3>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((collaborator) => (
          <div key={collaborator.id} className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={
                  collaborator.user.profileImageUrl ??
                  collaborator.user.imageUrl
                }
                alt={collaborator.user.firstName}
              />
              <AvatarFallback>
                {collaborator.user.firstName.at(0)?.toUpperCase()}
                {collaborator.user.lastName?.at(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-md">
              {collaborator.user.firstName} {collaborator.user.lastName}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onRemove(collaborator.id)}>
                  <Trash className="mr-2 h-4 w-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
};
