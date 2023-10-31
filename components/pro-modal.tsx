"use client"

import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "./ui/badge";
import { routes } from "@/app/(dashboard)/(routes)/dashboard/page";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Check, Loader, Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";

const ProModal = () => {

    const proModal = useProModal();
    const [loading, setLoading] = useState(false)
    const onSuscribe = async () =>{
        try {
            setLoading(true)

            const response = await axios.get('/api/stripe')

            window.location.href = response.data.url;
        } catch (error) {
            console.log(error, "STRIPE_CLIENT_ERROR");
        }finally{
            setLoading(true)
        }
    }

    return (
      <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center flex-col items-center gap-y-4 pb-2">
              <div className="flex items-center gap-x-2 font-bold py-1">
                Upgrade to Genius
                <Badge variant={"premium"} className="uppercase text-sm py-1">
                  pro
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
              {routes.map((tool) => (
                <Card
                  className="p-3 border-black/5 flex items-center justify-between"
                  key={tool.label}
                >
                  <div className="flex items-center gap-x-4">
                    <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                      <tool.icon
                        className={cn("w-6 h-6", tool.color)}
                      ></tool.icon>
                    </div>
                    <div className="font-semibold text-sm">{tool.label}</div>
                  </div>
                  <Check className="text-primary w-5 h-5"></Check>
                </Card>
              ))}
            </DialogDescription>
            <DialogFooter>
              {loading && (
                <Button
                size={"lg"}
                variant={"outline"}
                className="w-full mt-4"
              >
                Upgrade
                <Loader className="w-4 h-4 ml-2 animate-spin"></Loader>
              </Button>
            )}

              {!loading && (
                <Button
                  size={"lg"}
                  variant={"premium"}
                  onClick={onSuscribe}
                  className="w-full mt-4"
                >
                  Upgrade
                  <Zap className="w-4 h-4 ml-2 fill-white"></Zap>
                </Button>
              )}
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
}
 
export default ProModal;
