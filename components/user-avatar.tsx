import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
    // Get the user using CLARK to get the userImage or the capital letters from the name
    const {user} = useUser();

    // return the avatar component using ShadCN
    return(
        <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} />
            {/* If the image couldn't be loaded */}
            <AvatarFallback> 
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
            </AvatarFallback>
        </Avatar>
    )
}