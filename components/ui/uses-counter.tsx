"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { getApiLimitCount } from "@/lib/api-limit";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./progress";
import { Button } from "./button";
import { Zap } from "lucide-react";
import { useProModal } from "@/hooks/use-pro-modal";

interface UsesCounterProps {
  count: number;
  isPro: boolean;
}

const UsesCounter = ({ count, isPro }: UsesCounterProps) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal()
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if(isPro){
    return null
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {count} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress className="h-3" value={(count / MAX_FREE_COUNTS) * 100} />
          </div>
          <Button onClick={proModal.onOpen} variant={"premium"}  className="w-full">
            Upgrade <Zap className="h-4 w-4 ml-2 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsesCounter;
