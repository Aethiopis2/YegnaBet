export default function TrustMeter({ score }: { score: number }) { 
    return ( 
        <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${score}%` }} />
            </div>
                
            <span className="text-xs text-gray-600">{score}%</span>
        </div>
    ); 
}