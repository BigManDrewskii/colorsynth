import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// ... other imports

export function ColorHarmonies({ harmonies }: ColorHarmoniesProps) {
  return (
    <div className="space-y-4">
      {harmonies.map((harmony, index) => (
        <Collapsible key={index}>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: harmony.baseColor }}
              />
              <span className="font-medium">{harmony.name}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 px-4 pb-2 pt-0">
            {/* ... rest of the component remains unchanged ... */}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}