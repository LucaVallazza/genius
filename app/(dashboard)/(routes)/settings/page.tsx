import Heading from "@/components/heading";
import { checkSubscription } from "@/lib/subscription";
import { Settings } from "lucide-react";
import { SubscriptionButton } from './../../../../components/subscription-button';

const SettingsPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings"
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          <p>
            {isPro
              ? "You are currently in a pro plan."
              : "You are currently in a free plan."}
          </p>
          <SubscriptionButton isPro={isPro}></SubscriptionButton>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
