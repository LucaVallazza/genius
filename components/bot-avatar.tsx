import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const BotAvatar = () => {
    // return the avatar component using ShadCN
    return(
        <Avatar className="h-8 w-8">
            {/* The logo needs a padding to render the image correctly */}
            <AvatarImage className="p-1" src="/logo.png" />
            {/* If the image couldn't be loaded */}
            <AvatarFallback> 
                G
            </AvatarFallback>
        </Avatar>
    )
}