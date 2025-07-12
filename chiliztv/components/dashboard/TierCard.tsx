import { TokenWithBalance } from "@/utils/FanTokens";
import TokenCard from "../tokens/TokenCard";
import { Card, CardContent } from "../ui/card";

export default function TierCard({
    name,
    icon,
    color,
    tokens,
    totalTokens,
    totalValue,
  }: Readonly<{
    name: string;
    icon: React.ReactNode;
    color: string;
    tokens: TokenWithBalance[];
    totalTokens: number;
    totalValue: number;
  }>) {
    return (
      <Card className="bg-[#121212] border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`text-xl font-bold ${color}`}>{icon} {name} Tier</div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm">Total Tokens: <span className="font-bold">{totalTokens}</span></p>
              <p className="text-white text-sm">Value: <span className="font-bold">${totalValue.toLocaleString()}</span></p>
            </div>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tokens.map((token: TokenWithBalance) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  