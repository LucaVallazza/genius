import { auth } from "@clerk/nextjs"; 
import { NextResponse } from "next/server";
import prismadb  from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
    const {userId} = auth();

    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the user data using the userid
    const userApiLimit = await prismadb.userApiLimit.findUnique({
        where: {
            userID: userId
        }
    });

    if(userApiLimit){
        await prismadb.userApiLimit.update({
            where: {userID: userId},
            data: {count: userApiLimit.count + 1}
        })
    }
    //if the user has no apilimit registry
    else{
        await prismadb.userApiLimit.create({
            data:{ userID:userId, count: 1}
        })
    }
}

export const checkApiLimit = async () => {
    //Checks whether the user can use the app or not
    const {userId} = auth();

    if(!userId){
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({where: {userID: userId}})

    if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS){
        return true
    }
    else{
        false
    }
}

export const  getApiLimitCount = async ()=> {
    const {userId} = auth();
    
    if(!userId){
        return 0
        // Return 0 because the user could have neved used the app
    }

    const apiLimitCount = await prismadb.userApiLimit.findUnique({where: {userID: userId}})

    if(apiLimitCount){
        return apiLimitCount!.count

    }else{
        return 0
    }


}